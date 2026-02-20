import { useAuth } from '@/hooks/useAuth'
import { LogOut, User, MessageSquare } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function Header() {
  const { user, signOut } = useAuth()
  const { toggleAiPanel, aiPanelVisible } = useSettingsStore()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-text-secondary">
          AI-Powered Trading Analysis
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleAiPanel}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
            aiPanelVisible
              ? 'bg-accent/10 text-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">AI Panel</span>
        </button>

        <div className="mx-2 h-6 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.email ?? 'Guest'}</span>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-text-muted hover:text-bearish"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
