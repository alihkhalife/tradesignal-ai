import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import type { Trade } from '@/types/trading'
import { format } from 'date-fns'

export function exportTradesToCSV(trades: Trade[]): void {
  const data = trades.map((t) => ({
    Symbol: t.symbol,
    Direction: t.direction,
    Status: t.status,
    'Entry Price': t.entry_price ?? '',
    'Exit Price': t.exit_price ?? '',
    'Stop Loss': t.stop_loss ?? '',
    'Take Profit': t.take_profit ?? '',
    'Position Size': t.position_size ?? '',
    'P&L': t.pnl ?? '',
    'P&L %': t.pnl_percentage ?? '',
    Timeframe: t.timeframe ?? '',
    Notes: t.notes ?? '',
    Tags: (t.tags ?? []).join(', '),
    'Opened At': t.opened_at ? format(new Date(t.opened_at), 'yyyy-MM-dd HH:mm') : '',
    'Closed At': t.closed_at ? format(new Date(t.closed_at), 'yyyy-MM-dd HH:mm') : '',
  }))

  const csv = Papa.unparse(data)
  downloadFile(csv, 'trade-journal.csv', 'text/csv')
}

export function exportTradesToPDF(trades: Trade[], stats: TradeStats): void {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor(59, 130, 246)
  doc.text('TradeSignal AI - Trade Journal', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 30)

  // Stats summary
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text('Performance Summary', 14, 42)

  autoTable(doc, {
    startY: 46,
    head: [['Total Trades', 'Win Rate', 'Total P&L', 'Avg P&L', 'Best Trade', 'Worst Trade']],
    body: [[
      stats.totalTrades.toString(),
      `${stats.winRate.toFixed(1)}%`,
      `$${stats.totalPnL.toFixed(2)}`,
      `$${stats.avgPnL.toFixed(2)}`,
      `$${stats.bestTrade.toFixed(2)}`,
      `$${stats.worstTrade.toFixed(2)}`,
    ]],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  })

  // Trades table
  const tableY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 70
  doc.text('Trade History', 14, tableY + 12)

  autoTable(doc, {
    startY: tableY + 16,
    head: [['Symbol', 'Dir', 'Entry', 'Exit', 'SL', 'P&L', 'P&L %', 'Status', 'Date']],
    body: trades.map((t) => [
      t.symbol,
      t.direction.toUpperCase(),
      t.entry_price?.toString() ?? '-',
      t.exit_price?.toString() ?? '-',
      t.stop_loss?.toString() ?? '-',
      t.pnl != null ? `$${t.pnl.toFixed(2)}` : '-',
      t.pnl_percentage != null ? `${t.pnl_percentage.toFixed(2)}%` : '-',
      t.status,
      t.opened_at ? format(new Date(t.opened_at), 'MM/dd/yy') : '-',
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
  })

  doc.save('trade-journal.pdf')
}

export interface TradeStats {
  totalTrades: number
  winRate: number
  totalPnL: number
  avgPnL: number
  bestTrade: number
  worstTrade: number
  longWinRate: number
  shortWinRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  maxDrawdown: number
}

export function calculateTradeStats(trades: Trade[]): TradeStats {
  const closedTrades = trades.filter((t) => t.status === 'closed' && t.pnl != null)

  if (closedTrades.length === 0) {
    return {
      totalTrades: trades.length,
      winRate: 0,
      totalPnL: 0,
      avgPnL: 0,
      bestTrade: 0,
      worstTrade: 0,
      longWinRate: 0,
      shortWinRate: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      maxDrawdown: 0,
    }
  }

  const pnls = closedTrades.map((t) => t.pnl!)
  const wins = pnls.filter((p) => p > 0)
  const losses = pnls.filter((p) => p < 0)

  const longTrades = closedTrades.filter((t) => t.direction === 'long')
  const shortTrades = closedTrades.filter((t) => t.direction === 'short')
  const longWins = longTrades.filter((t) => t.pnl! > 0)
  const shortWins = shortTrades.filter((t) => t.pnl! > 0)

  const totalWins = wins.reduce((sum, p) => sum + p, 0)
  const totalLosses = Math.abs(losses.reduce((sum, p) => sum + p, 0))

  // Calculate max drawdown
  let peak = 0
  let maxDrawdown = 0
  let runningPnL = 0
  for (const pnl of pnls) {
    runningPnL += pnl
    if (runningPnL > peak) peak = runningPnL
    const drawdown = peak - runningPnL
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }

  return {
    totalTrades: trades.length,
    winRate: (wins.length / closedTrades.length) * 100,
    totalPnL: pnls.reduce((sum, p) => sum + p, 0),
    avgPnL: pnls.reduce((sum, p) => sum + p, 0) / closedTrades.length,
    bestTrade: Math.max(...pnls),
    worstTrade: Math.min(...pnls),
    longWinRate: longTrades.length > 0 ? (longWins.length / longTrades.length) * 100 : 0,
    shortWinRate: shortTrades.length > 0 ? (shortWins.length / shortTrades.length) * 100 : 0,
    avgWin: wins.length > 0 ? totalWins / wins.length : 0,
    avgLoss: losses.length > 0 ? totalLosses / losses.length : 0,
    profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
    maxDrawdown,
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
