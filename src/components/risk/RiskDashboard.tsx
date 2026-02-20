import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3 } from 'lucide-react'
import { useTradeStore } from '@/stores/tradeStore'
import { calculateTradeStats } from '@/lib/exportUtils'
import { cn } from '@/lib/cn'

export function RiskDashboard() {
  const { trades } = useTradeStore()

  const stats = useMemo(() => calculateTradeStats(trades), [trades])

  const openTrades = trades.filter((t) => t.status === 'open')
  const totalExposure = openTrades.reduce((sum, t) => sum + (t.position_size ?? 0), 0)

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="Total Trades"
          value={stats.totalTrades.toString()}
          color="text-accent"
        />
        <StatCard
          icon={Target}
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          color={stats.winRate >= 50 ? 'text-bullish' : 'text-bearish'}
        />
        <StatCard
          icon={stats.totalPnL >= 0 ? TrendingUp : TrendingDown}
          label="Total P&L"
          value={`$${stats.totalPnL.toFixed(2)}`}
          color={stats.totalPnL >= 0 ? 'text-bullish' : 'text-bearish'}
        />
        <StatCard
          icon={AlertTriangle}
          label="Max Drawdown"
          value={`$${stats.maxDrawdown.toFixed(2)}`}
          color="text-warning"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold text-text-muted">PERFORMANCE</h4>
          <div className="space-y-2 text-sm">
            <StatRow label="Avg Win" value={`$${stats.avgWin.toFixed(2)}`} color="text-bullish" />
            <StatRow label="Avg Loss" value={`$${stats.avgLoss.toFixed(2)}`} color="text-bearish" />
            <StatRow label="Profit Factor" value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)} />
            <StatRow label="Long Win Rate" value={`${stats.longWinRate.toFixed(1)}%`} />
            <StatRow label="Short Win Rate" value={`${stats.shortWinRate.toFixed(1)}%`} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold text-text-muted">OPEN POSITIONS</h4>
          {openTrades.length === 0 ? (
            <p className="text-sm text-text-muted">No open positions</p>
          ) : (
            <div className="space-y-2">
              {openTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-bold', trade.direction === 'long' ? 'text-bullish' : 'text-bearish')}>
                      {trade.direction.toUpperCase()}
                    </span>
                    <span className="font-medium">{trade.symbol}</span>
                  </div>
                  <span className="text-text-secondary">
                    ${(trade.position_size ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-muted">Total Exposure:</span>
                  <span>${totalExposure.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className={cn('h-3.5 w-3.5', color)} />
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <span className={cn('text-lg font-bold', color)}>{value}</span>
    </div>
  )
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted">{label}</span>
      <span className={cn('font-medium', color)}>{value}</span>
    </div>
  )
}
