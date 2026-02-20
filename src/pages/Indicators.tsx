import { useState } from 'react'
import { SlidersHorizontal, Plus, Code, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { CustomIndicator } from '@/types/trading'

export function Indicators() {
  const [indicators, setIndicators] = useState<CustomIndicator[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [pineScript, setPineScript] = useState('')
  const [indicatorType, setIndicatorType] = useState<'overlay' | 'oscillator' | 'strategy'>('overlay')

  function handleAdd() {
    if (!name.trim() || !pineScript.trim()) return

    const newIndicator: CustomIndicator = {
      id: crypto.randomUUID(),
      user_id: '',
      name,
      description: description || null,
      pine_script: pineScript,
      indicator_type: indicatorType,
      parameters: {},
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setIndicators([...indicators, newIndicator])
    setShowForm(false)
    setName('')
    setDescription('')
    setPineScript('')
  }

  function toggleActive(id: string) {
    setIndicators(
      indicators.map((i) => (i.id === id ? { ...i, is_active: !i.is_active } : i))
    )
  }

  function deleteIndicator(id: string) {
    setIndicators(indicators.filter((i) => i.id !== id))
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold">Custom Indicators</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Add Indicator
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">New Custom Indicator</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Custom RSI"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Type</label>
                <select
                  value={indicatorType}
                  onChange={(e) => setIndicatorType(e.target.value as 'overlay' | 'oscillator' | 'strategy')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="overlay">Overlay</option>
                  <option value="oscillator">Oscillator</option>
                  <option value="strategy">Strategy</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the indicator"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">PineScript Code</label>
              <textarea
                value={pineScript}
                onChange={(e) => setPineScript(e.target.value)}
                rows={10}
                placeholder={`//@version=5\nindicator("My Indicator")\nplot(close)`}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-accent"
                spellCheck={false}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim() || !pineScript.trim()}
                className="flex-1 rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
              >
                Add Indicator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicators List */}
      {indicators.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-surface text-center">
          <Code className="mb-3 h-10 w-10 text-text-muted" />
          <p className="text-sm text-text-secondary">No custom indicators yet</p>
          <p className="mt-1 text-xs text-text-muted">
            Add PineScript indicators to include in AI analysis
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {indicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="text-sm font-medium">{indicator.name}</h3>
                  <p className="text-xs text-text-muted">
                    {indicator.indicator_type} {indicator.description && `· ${indicator.description}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(indicator.id)}
                  className="text-text-muted hover:text-accent"
                >
                  {indicator.is_active ? (
                    <ToggleRight className="h-6 w-6 text-bullish" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={() => deleteIndicator(indicator.id)}
                  className="text-text-muted hover:text-bearish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
