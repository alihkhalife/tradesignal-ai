import { useState } from 'react'
import { FlaskConical, Play, BarChart3 } from 'lucide-react'
import { useChartStore } from '@/stores/chartStore'

export function Backtest() {
  const { symbol } = useChartStore()
  const [strategy, setStrategy] = useState('')
  const [timeframe, setTimeframe] = useState('1h')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [running, setRunning] = useState(false)

  async function handleRun() {
    if (!strategy.trim()) return
    setRunning(true)
    // Backtest logic would go through Supabase Edge Function
    setTimeout(() => setRunning(false), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-accent" />
        <h1 className="text-xl font-bold">Backtesting</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Setup */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Setup</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Symbol</label>
              <input
                value={symbol}
                readOnly
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Strategy Description</label>
              <textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                rows={4}
                placeholder="Describe your strategy rules... e.g., 'Buy when MACD crosses above signal line and RSI is below 70. Sell when RSI goes above 80 or MACD crosses below signal.'"
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-text-muted"
              />
            </div>
            <button
              onClick={handleRun}
              disabled={running || !strategy.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {running ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Backtest
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results placeholder */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Results</h2>
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <BarChart3 className="mb-3 h-10 w-10 text-text-muted" />
            <p className="text-sm text-text-secondary">Configure and run a backtest to see results</p>
            <p className="mt-1 text-xs text-text-muted">
              Results will show win rate, P&L, drawdown, and equity curve
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
