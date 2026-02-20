import { useState } from 'react'
import { format } from 'date-fns'
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Trade } from '@/types/trading'
import { cn } from '@/lib/cn'

interface TradeTableProps {
  trades: Trade[]
  onEdit: (trade: Trade) => void
  onDelete: (id: string) => void
}

type SortField = 'created_at' | 'symbol' | 'pnl' | 'status'

export function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterSymbol, setFilterSymbol] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = trades
    .filter((t) => (!filterSymbol || t.symbol.includes(filterSymbol.toUpperCase())))
    .filter((t) => (!filterStatus || t.status === filterStatus))
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'created_at') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      else if (sortField === 'symbol') cmp = a.symbol.localeCompare(b.symbol)
      else if (sortField === 'pnl') cmp = (a.pnl ?? 0) - (b.pnl ?? 0)
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
    ) : null

  return (
    <div>
      {/* Filters */}
      <div className="mb-3 flex gap-2">
        <input
          placeholder="Filter symbol..."
          value={filterSymbol}
          onChange={(e) => setFilterSymbol(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none placeholder:text-text-muted focus:border-accent"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
        >
          <option value="">All Status</option>
          <option value="planned">Planned</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="cursor-pointer px-3 py-2 text-left text-xs font-medium text-text-muted" onClick={() => toggleSort('symbol')}>
                <div className="flex items-center gap-1">Symbol <SortIcon field="symbol" /></div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Dir</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Entry</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Exit</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">SL</th>
              <th className="cursor-pointer px-3 py-2 text-left text-xs font-medium text-text-muted" onClick={() => toggleSort('pnl')}>
                <div className="flex items-center gap-1">P&L <SortIcon field="pnl" /></div>
              </th>
              <th className="cursor-pointer px-3 py-2 text-left text-xs font-medium text-text-muted" onClick={() => toggleSort('status')}>
                <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
              </th>
              <th className="cursor-pointer px-3 py-2 text-left text-xs font-medium text-text-muted" onClick={() => toggleSort('created_at')}>
                <div className="flex items-center gap-1">Date <SortIcon field="created_at" /></div>
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-text-muted">
                  No trades found
                </td>
              </tr>
            ) : (
              filtered.map((trade) => (
                <tr key={trade.id} className="border-b border-border-light hover:bg-surface-hover">
                  <td className="px-3 py-2 font-medium">{trade.symbol}</td>
                  <td className="px-3 py-2">
                    <span className={cn('text-xs font-bold', trade.direction === 'long' ? 'text-bullish' : 'text-bearish')}>
                      {trade.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-text-secondary">{trade.entry_price ?? '-'}</td>
                  <td className="px-3 py-2 text-text-secondary">{trade.exit_price ?? '-'}</td>
                  <td className="px-3 py-2 text-text-secondary">{trade.stop_loss ?? '-'}</td>
                  <td className="px-3 py-2">
                    {trade.pnl != null ? (
                      <span className={cn('font-medium', trade.pnl >= 0 ? 'text-bullish' : 'text-bearish')}>
                        ${trade.pnl.toFixed(2)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      trade.status === 'open' ? 'bg-accent/10 text-accent' :
                      trade.status === 'closed' ? 'bg-bullish/10 text-bullish' :
                      trade.status === 'cancelled' ? 'bg-bearish/10 text-bearish' :
                      'bg-neutral/10 text-neutral'
                    )}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-text-muted">
                    {format(new Date(trade.created_at), 'MM/dd/yy')}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(trade)} className="rounded p-1 text-text-muted hover:text-accent">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDelete(trade.id)} className="rounded p-1 text-text-muted hover:text-bearish">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
