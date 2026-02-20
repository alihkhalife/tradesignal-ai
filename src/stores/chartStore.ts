import { create } from 'zustand'
import type { Timeframe } from '@/types/trading'
import type { IndicatorId } from '@/lib/constants'
import type { OHLCV } from '@/types/market'

interface ChartState {
  symbol: string
  timeframe: Timeframe
  activeIndicators: Set<IndicatorId>
  candles: OHLCV[]
  loading: boolean
  setSymbol: (symbol: string) => void
  setTimeframe: (timeframe: Timeframe) => void
  toggleIndicator: (indicator: IndicatorId) => void
  setCandles: (candles: OHLCV[]) => void
  setLoading: (loading: boolean) => void
}

export const useChartStore = create<ChartState>((set) => ({
  symbol: 'BTCUSDT',
  timeframe: '1h',
  activeIndicators: new Set<IndicatorId>(['ema9', 'ema23', 'ema50', 'ema200', 'volume', 'rsi', 'macd']),
  candles: [],
  loading: false,
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  toggleIndicator: (indicator) =>
    set((state) => {
      const next = new Set(state.activeIndicators)
      if (next.has(indicator)) {
        next.delete(indicator)
      } else {
        next.add(indicator)
      }
      return { activeIndicators: next }
    }),
  setCandles: (candles) => set({ candles }),
  setLoading: (loading) => set({ loading }),
}))
