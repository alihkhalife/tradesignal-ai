import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Trade, TradeDirection, TradeStatus } from '@/types/trading'
import { useChartStore } from '@/stores/chartStore'

interface TradeFormProps {
  trade?: Trade | null
  onSubmit: (data: Omit<Trade, 'id' | 'created_at' | 'user_id'>) => void
  onClose: () => void
}

export function TradeForm({ trade, onSubmit, onClose }: TradeFormProps) {
  const { symbol: currentSymbol } = useChartStore()

  const [symbol, setSymbol] = useState(trade?.symbol ?? currentSymbol)
  const [direction, setDirection] = useState<TradeDirection>(trade?.direction ?? 'long')
  const [status, setStatus] = useState<TradeStatus>(trade?.status ?? 'planned')
  const [entryPrice, setEntryPrice] = useState(trade?.entry_price?.toString() ?? '')
  const [exitPrice, setExitPrice] = useState(trade?.exit_price?.toString() ?? '')
  const [stopLoss, setStopLoss] = useState(trade?.stop_loss?.toString() ?? '')
  const [takeProfit, setTakeProfit] = useState(trade?.take_profit?.toString() ?? '')
  const [positionSize, setPositionSize] = useState(trade?.position_size?.toString() ?? '')
  const [notes, setNotes] = useState(trade?.notes ?? '')
  const [tags, setTags] = useState(trade?.tags?.join(', ') ?? '')
  const [timeframe, setTimeframe] = useState(trade?.timeframe ?? '1h')

  // Calculate P&L when exit price changes
  const [pnl, setPnl] = useState(trade?.pnl ?? null)
  const [pnlPct, setPnlPct] = useState(trade?.pnl_percentage ?? null)

  useEffect(() => {
    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)
    const size = parseFloat(positionSize)

    if (entry && exit && size) {
      const units = size / entry
      const pl = direction === 'long' ? (exit - entry) * units : (entry - exit) * units
      setPnl(Math.round(pl * 100) / 100)
      setPnlPct(Math.round((pl / size) * 10000) / 100)
    } else {
      setPnl(null)
      setPnlPct(null)
    }
  }, [entryPrice, exitPrice, positionSize, direction])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      symbol,
      direction,
      status,
      entry_price: parseFloat(entryPrice) || null,
      exit_price: parseFloat(exitPrice) || null,
      stop_loss: parseFloat(stopLoss) || null,
      take_profit: parseFloat(takeProfit) || null,
      position_size: parseFloat(positionSize) || null,
      pnl,
      pnl_percentage: pnlPct,
      timeframe,
      notes: notes || null,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      ai_analysis_id: trade?.ai_analysis_id ?? null,
      screenshot_url: null,
      opened_at: status === 'open' || status === 'closed' ? new Date().toISOString() : null,
      closed_at: status === 'closed' ? new Date().toISOString() : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">{trade ? 'Edit Trade' : 'New Trade'}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Symbol</label>
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="15m">15M</option>
                <option value="1h">1H</option>
                <option value="4h">4H</option>
                <option value="1d">1D</option>
                <option value="1w">1W</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Direction</label>
              <div className="flex gap-1 rounded-md bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setDirection('long')}
                  className={`flex-1 rounded py-1.5 text-xs font-medium ${direction === 'long' ? 'bg-bullish/10 text-bullish' : 'text-text-muted'}`}
                >
                  LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('short')}
                  className={`flex-1 rounded py-1.5 text-xs font-medium ${direction === 'short' ? 'bg-bearish/10 text-bearish' : 'text-text-muted'}`}
                >
                  SHORT
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TradeStatus)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="planned">Planned</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Entry Price</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Exit Price</label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Stop Loss</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Take Profit</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Position Size ($)</label>
              <input
                type="number"
                step="any"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">P&L</label>
              <div className="flex h-[38px] items-center rounded-md border border-border bg-background px-3 text-sm">
                {pnl != null ? (
                  <span className={pnl >= 0 ? 'text-bullish' : 'text-bearish'}>
                    ${pnl} ({pnlPct}%)
                  </span>
                ) : (
                  <span className="text-text-muted">-</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs text-text-muted">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="breakout, swing, scalp"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs text-text-muted">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              {trade ? 'Update' : 'Create'} Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
