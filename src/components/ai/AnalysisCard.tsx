import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  AlertTriangle,
  Target,
  Activity,
} from 'lucide-react'
import type { AnalysisResponse } from '@/types/trading'
import { cn } from '@/lib/cn'

interface AnalysisCardProps {
  analysis: AnalysisResponse
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const directionConfig = {
    long: { icon: TrendingUp, label: 'LONG', color: 'text-bullish', bg: 'bg-bullish-bg', border: 'border-bullish/20' },
    short: { icon: TrendingDown, label: 'SHORT', color: 'text-bearish', bg: 'bg-bearish-bg', border: 'border-bearish/20' },
    neutral: { icon: Minus, label: 'NEUTRAL', color: 'text-neutral', bg: 'bg-neutral-bg', border: 'border-neutral/20' },
  }

  const dir = directionConfig[analysis.direction]
  const DirIcon = dir.icon

  return (
    <div className={cn('rounded-lg border p-3', dir.border, dir.bg)}>
      {/* Direction & Confidence */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DirIcon className={cn('h-5 w-5', dir.color)} />
          <span className={cn('text-sm font-bold', dir.color)}>{dir.label}</span>
          <span className="text-xs text-text-muted">{analysis.symbol}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
            <div
              className={cn('h-full rounded-full', analysis.confidence > 70 ? 'bg-bullish' : analysis.confidence > 40 ? 'bg-warning' : 'bg-bearish')}
              style={{ width: `${analysis.confidence}%` }}
            />
          </div>
          <span className="text-xs font-medium text-text-secondary">{analysis.confidence}%</span>
        </div>
      </div>

      {/* Summary */}
      <p className="mb-3 text-sm leading-relaxed text-text-secondary">{analysis.summary}</p>

      {/* Indicators Grid */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-background/50 px-2.5 py-1.5">
          <div className="mb-0.5 text-[10px] font-medium text-text-muted">MACD</div>
          <div className={cn('text-xs font-medium', analysis.indicators.macd.signal === 'bullish' ? 'text-bullish' : analysis.indicators.macd.signal === 'bearish' ? 'text-bearish' : 'text-text-secondary')}>
            {analysis.indicators.macd.signal.toUpperCase()}
          </div>
        </div>
        <div className="rounded-md bg-background/50 px-2.5 py-1.5">
          <div className="mb-0.5 text-[10px] font-medium text-text-muted">RSI</div>
          <div className="text-xs font-medium text-text-secondary">
            {analysis.indicators.rsi.value.toFixed(1)} - {analysis.indicators.rsi.signal}
          </div>
        </div>
        <div className="rounded-md bg-background/50 px-2.5 py-1.5">
          <div className="mb-0.5 text-[10px] font-medium text-text-muted">Volume</div>
          <div className="text-xs font-medium text-text-secondary">
            {analysis.indicators.volume.vs_average}
          </div>
        </div>
        <div className="rounded-md bg-background/50 px-2.5 py-1.5">
          <div className="mb-0.5 text-[10px] font-medium text-text-muted">EMA Stack</div>
          <div className={cn('text-xs font-medium', analysis.indicators.ema_stack.structure === 'bullish' ? 'text-bullish' : analysis.indicators.ema_stack.structure === 'bearish' ? 'text-bearish' : 'text-text-secondary')}>
            {analysis.indicators.ema_stack.structure.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="mb-3 rounded-md border border-border bg-background/30 p-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold">Risk Management</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Entry:</span>
            <span className="font-medium">{analysis.risk_management.entry_zone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Stop Loss:</span>
            <span className="font-medium text-bearish">{analysis.risk_management.stop_loss}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">TP1:</span>
            <span className="font-medium text-bullish">{analysis.risk_management.take_profit_1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">TP2:</span>
            <span className="font-medium text-bullish">{analysis.risk_management.take_profit_2}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Size:</span>
            <span className="font-medium">{analysis.risk_management.position_size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">R:R:</span>
            <span className="font-medium">{analysis.risk_management.risk_reward}</span>
          </div>
        </div>
      </div>

      {/* Key Levels */}
      {(analysis.key_levels.support.length > 0 || analysis.key_levels.resistance.length > 0) && (
        <div className="mb-3 flex gap-3 text-xs">
          <div>
            <Target className="mb-1 inline h-3 w-3 text-bullish" />
            <span className="ml-1 text-text-muted">Support:</span>{' '}
            <span className="font-medium">{analysis.key_levels.support.join(', ')}</span>
          </div>
          <div>
            <Target className="mb-1 inline h-3 w-3 text-bearish" />
            <span className="ml-1 text-text-muted">Resistance:</span>{' '}
            <span className="font-medium">{analysis.key_levels.resistance.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Volatility */}
      <div className="mb-2 flex items-center gap-2 text-xs">
        <Activity className="h-3 w-3 text-text-muted" />
        <span className="text-text-muted">Volatility:</span>
        <span className={cn(
          'font-medium',
          analysis.volatility_assessment === 'high' ? 'text-bearish' : analysis.volatility_assessment === 'medium' ? 'text-warning' : 'text-bullish'
        )}>
          {analysis.volatility_assessment.toUpperCase()}
        </span>
      </div>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="mt-2 space-y-1">
          {analysis.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-warning">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
