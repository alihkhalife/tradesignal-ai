import { useCallback } from 'react'
import { useChartStore } from '@/stores/chartStore'
import { useTradeStore } from '@/stores/tradeStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { calculateIndicators, formatIndicatorSummary } from '@/lib/indicators'
import { fetchMultiTimeframeData } from '@/hooks/useMarketData'
import type { AnalysisResponse, ChatMessage } from '@/types/trading'

export function useAIAnalysis() {
  const { symbol, timeframe, candles } = useChartStore()
  const { addChatMessage, setAiLoading, aiLoading } = useTradeStore()
  const { profile } = useAuthStore()

  const requestAnalysis = useCallback(
    async (userMessage: string) => {
      if (aiLoading) return

      // Add user message to chat
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      }
      addChatMessage(userMsg)
      setAiLoading(true)

      try {
        // Fetch multi-timeframe data
        const multiTfData = await fetchMultiTimeframeData(symbol)

        // Calculate indicators for each timeframe
        const indicatorsByTf: Record<string, string> = {}
        for (const [tf, tfCandles] of Object.entries(multiTfData)) {
          if (tfCandles.length > 0) {
            const indicators = calculateIndicators(tfCandles)
            indicatorsByTf[tf] = formatIndicatorSummary(indicators)
          }
        }

        // Current timeframe indicators
        let currentIndicators = ''
        if (candles.length > 0) {
          const indicators = calculateIndicators(candles)
          currentIndicators = formatIndicatorSummary(indicators)
        }

        // Call the Supabase edge function
        const { data, error } = await supabase.functions.invoke('analyze', {
          body: {
            symbol,
            timeframe,
            userMessage,
            currentIndicators,
            indicatorsByTf,
            userProfile: {
              capital: profile?.trading_capital ?? 10000,
              riskPerTrade: profile?.risk_per_trade ?? 2,
            },
            currentPrice: candles.length > 0 ? candles[candles.length - 1].close : null,
          },
        })

        if (error) throw error

        const analysis: AnalysisResponse = data

        // Add AI response to chat
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: analysis.summary,
          analysis,
          timestamp: new Date(),
        }
        addChatMessage(aiMsg)

        // Store analysis in database
        if (profile) {
          await supabase.from('ai_analyses').insert({
            user_id: profile.id,
            symbol,
            timeframes: Object.keys(indicatorsByTf),
            direction_suggestion: analysis.direction,
            confidence: analysis.confidence,
            analysis_text: analysis.summary,
            indicators_snapshot: analysis.indicators as unknown as Record<string, unknown>,
            macro_context: { factors: analysis.macro_factors, sentiment: 'neutral' },
            risk_params: analysis.risk_management as unknown as Record<string, unknown>,
          } as never)
        }
      } catch (error) {
        console.error('AI Analysis error:', error)
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Sorry, I encountered an error while analyzing. Please check that your Supabase edge function is configured with the Anthropic API key, or try again later.',
          timestamp: new Date(),
        }
        addChatMessage(errorMsg)
      } finally {
        setAiLoading(false)
      }
    },
    [symbol, timeframe, candles, profile, addChatMessage, setAiLoading, aiLoading]
  )

  return { requestAnalysis, aiLoading }
}
