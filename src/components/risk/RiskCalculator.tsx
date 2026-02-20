import { useState, useEffect } from 'react'
import { Calculator, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useChartStore } from '@/stores/chartStore'
import { calculatePositionSize, calculateRiskReward, suggestStopLoss, suggestTakeProfits } from '@/lib/riskManagement'
import { calculateIndicators, getLatestIndicatorValues } from '@/lib/indicators'

export function RiskCalculator() {
  const { profile } = useAuthStore()
  const { candles } = useChartStore()

  const [entry, setEntry] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [direction, setDirection] = useState<'long' | 'short'>('long')

  const capital = profile?.trading_capital ?? 10000
  const riskPercent = profile?.risk_per_trade ?? 2

  // Auto-fill current price
  useEffect(() => {
    if (candles.length > 0) {
      const currentPrice = candles[candles.length - 1].close
      setEntry(currentPrice.toString())

      // Auto-suggest SL based on ATR
      const indicators = calculateIndicators(candles)
      const latest = getLatestIndicatorValues(indicators)
      if (latest.atr > 0) {
        const sl = suggestStopLoss(direction, currentPrice, latest.atr)
        setStopLoss(sl.toString())

        const tps = suggestTakeProfits(direction, currentPrice, sl)
        setTakeProfit(tps[0].toString())
      }
    }
  }, [candles, direction])

  const entryNum = parseFloat(entry) || 0
  const slNum = parseFloat(stopLoss) || 0
  const tpNum = parseFloat(takeProfit) || 0

  const posSize = entryNum && slNum
    ? calculatePositionSize(capital, riskPercent, entryNum, slNum)
    : null

  const rr = entryNum && slNum && tpNum
    ? calculateRiskReward(entryNum, slNum, tpNum)
    : 0

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold">Position Calculator</h3>
      </div>

      {/* Direction toggle */}
      <div className="mb-3 flex gap-1 rounded-md bg-background p-0.5">
        <button
          onClick={() => setDirection('long')}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            direction === 'long' ? 'bg-bullish/10 text-bullish' : 'text-text-muted'
          }`}
        >
          LONG
        </button>
        <button
          onClick={() => setDirection('short')}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            direction === 'short' ? 'bg-bearish/10 text-bearish' : 'text-text-muted'
          }`}
        >
          SHORT
        </button>
      </div>

      {/* Inputs */}
      <div className="mb-3 space-y-2">
        <div>
          <label className="mb-1 block text-xs text-text-muted">Entry Price</label>
          <input
            type="number"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-bearish"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Take Profit</label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-bullish"
          />
        </div>
      </div>

      {/* Results */}
      {posSize && (
        <div className="space-y-2 rounded-md border border-border bg-background p-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Shield className="h-3 w-3 text-accent" />
            <span className="font-medium">Risk Parameters</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-muted">Capital: </span>
              <span className="font-medium">${capital.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-text-muted">Risk: </span>
              <span className="font-medium">{riskPercent}% (${posSize.riskAmount})</span>
            </div>
            <div>
              <span className="text-text-muted">Position: </span>
              <span className="font-medium">${posSize.positionSize.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-text-muted">Units: </span>
              <span className="font-medium">{posSize.units}</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-muted">Risk:Reward: </span>
              <span className={`font-bold ${rr >= 2 ? 'text-bullish' : rr >= 1 ? 'text-warning' : 'text-bearish'}`}>
                1:{rr}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
