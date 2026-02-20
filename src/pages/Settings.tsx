import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CapitalSettings } from '@/components/risk/CapitalSettings'
import { Save, User, Globe, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export function Settings() {
  const { profile, updateProfile, user } = useAuth()
  const [username, setUsername] = useState(profile?.username ?? '')
  const [markets, setMarkets] = useState<string[]>(profile?.preferred_markets ?? ['crypto'])
  const [timeframes, setTimeframes] = useState<string[]>(profile?.preferred_timeframes ?? ['1h', '4h', '1d'])
  const [saving, setSaving] = useState(false)

  const allMarkets = ['crypto', 'stocks', 'forex', 'commodities']
  const allTimeframes = ['15m', '1h', '4h', '1d', '1w']

  function toggleItem(arr: string[], item: string, setter: (arr: string[]) => void) {
    if (arr.includes(item)) {
      setter(arr.filter((a) => a !== item))
    } else {
      setter([...arr, item])
    }
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({
      username,
      preferred_markets: markets,
      preferred_timeframes: timeframes,
    })
    setSaving(false)
    if (error) toast.error('Failed to save')
    else toast.success('Settings saved')
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold">Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Email</label>
              <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary">
                {user?.email ?? 'Not set'}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Capital & Risk */}
        <CapitalSettings />

        {/* Preferred Markets */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold">Preferred Markets</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allMarkets.map((market) => (
              <button
                key={market}
                onClick={() => toggleItem(markets, market, setMarkets)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  markets.includes(market)
                    ? 'bg-accent/10 text-accent border border-accent/30'
                    : 'border border-border text-text-muted hover:text-text-secondary'
                }`}
              >
                {market.charAt(0).toUpperCase() + market.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Timeframes */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold">Preferred Timeframes</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTimeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => toggleItem(timeframes, tf, setTimeframes)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeframes.includes(tf)
                    ? 'bg-accent/10 text-accent border border-accent/30'
                    : 'border border-border text-text-muted hover:text-text-secondary'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
