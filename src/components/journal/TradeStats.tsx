import { useMemo } from 'react'
import type { Trade } from '@/types/trading'
import { calculateTradeStats } from '@/lib/exportUtils'
import { cn } from '@/lib/cn'
import { TrendingUp, TrendingDown, Target, BarChart3, Activity, Award } from 'lucide-react'

interface TradeStatsProps {
  trades: Trade[]
}

export function TradeStats({ trades }: TradeStatsProps) {
  const stats = useMemo(() => calculateTradeStats(trades), [trades])

  // Equity curve data
  const equityCurve = useMemo(() => {
    const closed = trades
      .filter((t) => t.status === 'closed' && t.pnl != null)
      .sort((a, b) => new Date(a.closed_at ?? a.created_at).getTime() - new Date(b.closed_at ?? b.created_at).getTime())

    let equity = 0
    return closed.map((t) => {
      equity += t.pnl!
      return equity
    })
  }, [trades])

  const maxEquity = Math.max(...equityCurve, 0)
  const minEquity = Math.min(...equityCurve, 0)
  const range = maxEquity - minEquity || 1

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat icon={BarChart3} label="Trades" value={stats.totalTrades.toString()} color="text-accent" />
        <Stat icon={Target} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} color={stats.winRate >= 50 ? 'text-bullish' : 'text-bearish'} />
        <Stat icon={stats.totalPnL >= 0 ? TrendingUp : TrendingDown} label="Total P&L" value={`$${stats.totalPnL.toFixed(2)}`} color={stats.totalPnL >= 0 ? 'text-bullish' : 'text-bearish'} />
        <Stat icon={Award} label="Best" value={`$${stats.bestTrade.toFixed(2)}`} color="text-bullish" />
        <Stat icon={Activity} label="Avg P&L" value={`$${stats.avgPnL.toFixed(2)}`} color={stats.avgPnL >= 0 ? 'text-bullish' : 'text-bearish'} />
        <Stat icon={TrendingDown} label="Worst" value={`$${stats.worstTrade.toFixed(2)}`} color="text-bearish" />
      </div>

      {/* Equity Curve */}
      {equityCurve.length > 1 && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold text-text-muted">EQUITY CURVE</h4>
          <div className="h-32">
            <svg viewBox={`0 0 ${equityCurve.length * 20} 100`} className="h-full w-full" preserveAspectRatio="none">
              {/* Zero line */}
              <line
                x1="0"
                y1={((maxEquity - 0) / range) * 100}
                x2={equityCurve.length * 20}
                y2={((maxEquity - 0) / range) * 100}
                stroke="#30363d"
                strokeDasharray="4"
              />
              {/* Curve */}
              <polyline
                fill="none"
                stroke={equityCurve[equityCurve.length - 1] >= 0 ? '#22c55e' : '#ef4444'}
                strokeWidth="2"
                points={equityCurve.map((val, i) => `${i * 20},${((maxEquity - val) / range) * 100}`).join(' ')}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-1 flex items-center gap-1">
        <Icon className={cn('h-3 w-3', color)} />
        <span className="text-[10px] text-text-muted">{label}</span>
      </div>
      <span className={cn('text-sm font-bold', color)}>{value}</span>
    </div>
  )
}
