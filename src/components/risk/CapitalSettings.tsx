import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DollarSign, Percent, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export function CapitalSettings() {
  const { profile, updateProfile } = useAuth()
  const [capital, setCapital] = useState(profile?.trading_capital?.toString() ?? '10000')
  const [risk, setRisk] = useState(profile?.risk_per_trade?.toString() ?? '2')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({
      trading_capital: parseFloat(capital) || 10000,
      risk_per_trade: parseFloat(risk) || 2,
    })
    setSaving(false)

    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings saved')
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-4 text-sm font-semibold">Capital & Risk</h3>
      <div className="space-y-3">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <DollarSign className="h-3 w-3" />
            Trading Capital (USD)
          </label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <Percent className="h-3 w-3" />
            Risk Per Trade (%)
          </label>
          <input
            type="number"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            step="0.5"
            min="0.1"
            max="10"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
