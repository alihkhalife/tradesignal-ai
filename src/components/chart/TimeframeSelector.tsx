import { useChartStore } from '@/stores/chartStore'
import { TIMEFRAMES } from '@/lib/constants'
import { cn } from '@/lib/cn'

export function TimeframeSelector() {
  const { timeframe, setTimeframe } = useChartStore()

  return (
    <div className="flex items-center gap-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setTimeframe(tf.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            timeframe === tf.value
              ? 'bg-accent/10 text-accent'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  )
}
