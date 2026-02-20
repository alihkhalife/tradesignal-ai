import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  TrendingUp,
  Brain,
  Shield,
  BarChart3,
  Zap,
  LineChart,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Claude AI analyzes MACD, RSI, EMAs, and volume across multiple timeframes to generate actionable trade signals.',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Automatic position sizing, stop-loss placement, and risk:reward calculations based on your capital.',
  },
  {
    icon: LineChart,
    title: 'Multi-Timeframe',
    description: 'Analyze from weekly down to 15-minute charts. Find confluence across timeframes for higher-probability setups.',
  },
  {
    icon: BarChart3,
    title: 'Live Charts',
    description: 'Professional TradingView charts with real-time data from Binance for crypto, stocks, and commodities.',
  },
  {
    icon: BookOpen,
    title: 'Trade Journal',
    description: 'Log every trade, track your P&L, win rate, and export reports to PDF or CSV.',
  },
  {
    icon: Zap,
    title: 'Macro Context',
    description: 'AI considers Fed decisions, geopolitical events, and market sentiment in every analysis.',
  },
]

export function Landing() {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
            <TrendingUp className="h-4 w-4" />
            AI-Powered Trading Assistant
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Trade Smarter with
            <br />
            <span className="text-accent">TradeSignal AI</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-text-secondary">
            Professional-grade technical analysis powered by Claude AI. Get multi-timeframe
            analysis, risk management, and trade journaling in one platform.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
            >
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center text-2xl font-bold">Everything you need to trade</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center">
          <p className="text-xs text-text-muted">
            TradeSignal AI is not financial advice. All analysis is for educational purposes only.
            Trading involves significant risk of loss. Always do your own research.
          </p>
        </div>
      </div>
    </div>
  )
}
