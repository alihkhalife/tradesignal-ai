import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTradeJournal } from '@/hooks/useTradeJournal'
import { TradeTable } from '@/components/journal/TradeTable'
import { TradeForm } from '@/components/journal/TradeForm'
import { TradeStats } from '@/components/journal/TradeStats'
import { ExportOptions } from '@/components/journal/ExportOptions'
import type { Trade } from '@/types/trading'
import toast from 'react-hot-toast'

export function Journal() {
  const { trades, createTrade, editTrade, deleteTrade } = useTradeJournal()
  const [showForm, setShowForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)

  async function handleSubmit(data: Omit<Trade, 'id' | 'created_at' | 'user_id'>) {
    if (editingTrade) {
      const { error } = await editTrade(editingTrade.id, data)
      if (error) toast.error('Failed to update trade')
      else toast.success('Trade updated')
    } else {
      const { error } = await createTrade(data)
      if (error) toast.error('Failed to create trade')
      else toast.success('Trade created')
    }
    setShowForm(false)
    setEditingTrade(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trade?')) return
    const { error } = await deleteTrade(id)
    if (error) toast.error('Failed to delete trade')
    else toast.success('Trade deleted')
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trade Journal</h1>
        <div className="flex items-center gap-3">
          <ExportOptions trades={trades} />
          <button
            onClick={() => { setEditingTrade(null); setShowForm(true) }}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            New Trade
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <TradeStats trades={trades} />
      </div>

      {/* Table */}
      <TradeTable
        trades={trades}
        onEdit={(trade) => { setEditingTrade(trade); setShowForm(true) }}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      {showForm && (
        <TradeForm
          trade={editingTrade}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingTrade(null) }}
        />
      )}
    </div>
  )
}
