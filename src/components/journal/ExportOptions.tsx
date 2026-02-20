import { FileText, FileSpreadsheet, Copy } from 'lucide-react'
import type { Trade } from '@/types/trading'
import { exportTradesToCSV, exportTradesToPDF, calculateTradeStats } from '@/lib/exportUtils'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface ExportOptionsProps {
  trades: Trade[]
}

export function ExportOptions({ trades }: ExportOptionsProps) {
  const stats = calculateTradeStats(trades)

  function handlePDF() {
    exportTradesToPDF(trades, stats)
    toast.success('PDF exported')
  }

  function handleCSV() {
    exportTradesToCSV(trades)
    toast.success('CSV exported')
  }

  function handleCopyText() {
    const lines = trades.map(
      (t) =>
        `${t.symbol} | ${t.direction.toUpperCase()} | Entry: ${t.entry_price ?? '-'} | Exit: ${t.exit_price ?? '-'} | P&L: ${t.pnl != null ? `$${t.pnl}` : '-'} | ${t.status} | ${format(new Date(t.created_at), 'MM/dd/yy')}`
    )

    const text = `TradeSignal AI - Trade Journal\n${'='.repeat(40)}\nTotal: ${stats.totalTrades} | Win Rate: ${stats.winRate.toFixed(1)}% | P&L: $${stats.totalPnL.toFixed(2)}\n${'='.repeat(40)}\n\n${lines.join('\n')}`

    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePDF}
        className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/30 hover:text-accent"
      >
        <FileText className="h-3.5 w-3.5" />
        Export PDF
      </button>
      <button
        onClick={handleCSV}
        className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/30 hover:text-accent"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        Export CSV
      </button>
      <button
        onClick={handleCopyText}
        className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/30 hover:text-accent"
      >
        <Copy className="h-3.5 w-3.5" />
        Copy Text
      </button>
    </div>
  )
}
