import { useChartStore } from '@/stores/chartStore'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { TrendingUp, TrendingDown, BarChart3, Shield, Eye } from 'lucide-react'

export function QuickActions() {
  const { symbol } = useChartStore()
  const { requestAnalysis, aiLoading } = useAIAnalysis()

  const actions = [
    {
      icon: BarChart3,
      label: `Analyze ${symbol}`,
      prompt: `Give me a full multi-timeframe analysis of ${symbol}. Include MACD, RSI, volume, and EMA analysis with entry, stop loss, and take profit levels.`,
    },
    {
      icon: TrendingUp,
      label: 'Long Setup?',
      prompt: `Is there a good long setup on ${symbol} right now? Analyze the current chart and tell me if the bullish case is strong.`,
    },
    {
      icon: TrendingDown,
      label: 'Short Setup?',
      prompt: `Is there a good short setup on ${symbol} right now? Analyze the current chart and tell me if the bearish case is strong.`,
    },
    {
      icon: Shield,
      label: 'Risk Check',
      prompt: `What's the current risk assessment for ${symbol}? Evaluate volatility, key levels, and potential risks.`,
    },
    {
      icon: Eye,
      label: 'Pattern?',
      prompt: `Do you see any chart patterns forming on ${symbol}? Check for head and shoulders, double top/bottom, triangles, flags, or any other significant patterns.`,
    },
  ]

  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => requestAnalysis(action.prompt)}
          disabled={aiLoading}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-50"
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
