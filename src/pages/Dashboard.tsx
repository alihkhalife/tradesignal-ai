import { TradingChart } from '@/components/chart/TradingChart'
import { IndicatorToolbar } from '@/components/chart/IndicatorToolbar'
import { TimeframeSelector } from '@/components/chart/TimeframeSelector'
import { SymbolSearch } from '@/components/chart/SymbolSearch'
import { AIChatPanel } from '@/components/ai/AIChatPanel'
import { RiskCalculator } from '@/components/risk/RiskCalculator'
import { useSettingsStore } from '@/stores/settingsStore'

export function Dashboard() {
  const { aiPanelVisible } = useSettingsStore()

  return (
    <div className="flex h-full">
      {/* Chart Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chart Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2">
          <div className="flex items-center gap-3">
            <SymbolSearch />
            <TimeframeSelector />
          </div>
        </div>

        {/* Indicator Toolbar */}
        <div className="border-b border-border bg-surface">
          <IndicatorToolbar />
        </div>

        {/* Chart */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1">
            <TradingChart />
          </div>

          {/* Risk Calculator - Below chart on the right */}
          <div className="hidden w-72 shrink-0 overflow-y-auto border-l border-border xl:block">
            <RiskCalculator />
          </div>
        </div>
      </div>

      {/* AI Panel */}
      {aiPanelVisible && (
        <div className="w-96 shrink-0">
          <AIChatPanel />
        </div>
      )}
    </div>
  )
}
