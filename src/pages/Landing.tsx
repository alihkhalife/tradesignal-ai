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
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Claude AI analyzes MACD, RSI, EMAs, and volume across multiple timeframes to generate actionable trade signals.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Automatic position sizing, stop-loss placement, and risk:reward calculations based on your capital.',
    color: 'text-bullish',
    bg: 'bg-bullish/10',
  },
  {
    icon: LineChart,
    title: 'Multi-Timeframe',
    description: 'Analyze from weekly down to 15-minute charts. Find confluence across timeframes for higher-probability setups.',
    color: 'text-neutral',
    bg: 'bg-neutral/10',
  },
  {
    icon: BarChart3,
    title: 'Live Charts',
    description: 'Professional TradingView charts with real-time data from Binance for crypto, stocks, and commodities.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: BookOpen,
    title: 'Trade Journal',
    description: 'Log every trade, track your P&L, win rate, and export reports to PDF or CSV.',
    color: 'text-bearish',
    bg: 'bg-bearish/10',
  },
  {
    icon: Zap,
    title: 'Macro Context',
    description: 'AI considers Fed decisions, geopolitical events, and market sentiment in every analysis.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
]

const stats = [
  { value: '6+', label: 'Indicators' },
  { value: '5', label: 'Timeframes' },
  { value: 'Real-time', label: 'Data Feed' },
  { value: 'AI', label: 'Powered' },
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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between py-4" style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 40px' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <span className="text-lg font-bold">TradeSignal AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute left-1/4 top-20 h-[300px] w-[400px] rounded-full bg-bullish/3 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-[300px] w-[400px] rounded-full bg-neutral/3 blur-3xl" />
        </div>

        <div className="relative text-center" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px 96px' }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            Powered by Claude AI
            <ChevronRight className="h-3.5 w-3.5" />
          </div>

          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Trade Smarter with{' '}
            <span className="bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Analysis
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Professional-grade technical analysis across multiple timeframes.
            Get actionable signals, risk management, and trade journaling — all in one platform.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-accent/40"
            >
              Start Trading Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface/50 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all hover:border-text-muted hover:bg-surface"
            >
              View Live Demo
            </button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 flex max-w-2xl items-center justify-center divide-x divide-border rounded-2xl border border-border bg-surface/50 py-5 backdrop-blur-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-6 text-center">
                <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                <div className="mt-0.5 text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-border/50">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 40px' }}>
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-accent">
            Features
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Everything you need to trade
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            From real-time charts to AI analysis, risk management, and trade journaling — all the tools a trader needs in one place.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-text-muted/20 bg-surface/50 p-7 transition-all hover:border-text-muted/40 hover:bg-surface"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2.5 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border/50">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 40px' }} className="text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to trade smarter?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-text-secondary">
            Join traders using AI to analyze markets, manage risk, and track performance.
            Free to get started.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-accent/40"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-surface/30">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 40px' }} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-text-secondary">TradeSignal AI</span>
          </div>
          <p className="text-xs text-text-muted">
            Not financial advice. For educational purposes only. Trading involves risk.
          </p>
        </div>
      </div>
    </div>
  )
}
