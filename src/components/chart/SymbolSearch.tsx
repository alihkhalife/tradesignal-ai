import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useChartStore } from '@/stores/chartStore'
import { ALL_SYMBOLS } from '@/lib/constants'
import { cn } from '@/lib/cn'

export function SymbolSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { symbol, setSymbol } = useChartStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = query
    ? ALL_SYMBOLS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_SYMBOLS

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:border-text-muted"
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
      >
        <Search className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-sm font-medium">{symbol}</span>
        <span className="text-xs text-text-muted">
          {ALL_SYMBOLS.find((s) => s.symbol === symbol)?.name ?? ''}
        </span>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-surface shadow-lg">
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbols..."
              className="w-full rounded-md bg-background px-3 py-2 text-sm outline-none placeholder:text-text-muted"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {filtered.map((s) => (
              <button
                key={s.symbol}
                onClick={() => {
                  setSymbol(s.symbol)
                  setIsOpen(false)
                  setQuery('')
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover',
                  symbol === s.symbol && 'bg-accent/10 text-accent'
                )}
              >
                <span className="font-medium">{s.symbol}</span>
                <span className="text-xs text-text-muted">{s.name}</span>
                <span className="ml-auto rounded bg-background px-1.5 py-0.5 text-[10px] text-text-muted">
                  {s.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
