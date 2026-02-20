import { useChartStore } from '@/stores/chartStore'
import { INDICATOR_CONFIG, type IndicatorId } from '@/lib/constants'
import { cn } from '@/lib/cn'

export function IndicatorToolbar() {
  const { activeIndicators, toggleIndicator } = useChartStore()

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-3 py-2">
      <span className="mr-2 shrink-0 text-xs font-medium text-text-muted">Indicators:</span>
      {(Object.entries(INDICATOR_CONFIG) as [IndicatorId, (typeof INDICATOR_CONFIG)[IndicatorId]][]).map(
        ([id, config]) => {
          const isActive = activeIndicators.has(id)
          return (
            <button
              key={id}
              onClick={() => toggleIndicator(id)}
              className={cn(
                'shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border border-transparent text-white'
                  : 'border border-border text-text-muted hover:border-text-muted hover:text-text-secondary'
              )}
              style={isActive ? { backgroundColor: config.color + '20', color: config.color, borderColor: config.color + '40' } : undefined}
            >
              {config.label}
            </button>
          )
        }
      )}
    </div>
  )
}
