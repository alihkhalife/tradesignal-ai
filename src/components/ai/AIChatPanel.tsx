import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, Bot, User } from 'lucide-react'
import { useTradeStore } from '@/stores/tradeStore'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { useChartStore } from '@/stores/chartStore'
import { AnalysisCard } from './AnalysisCard'
import { QuickActions } from './QuickActions'
import { DISCLAIMER } from '@/lib/constants'

export function AIChatPanel() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { chatMessages, clearChat, aiLoading } = useTradeStore()
  const { requestAnalysis } = useAIAnalysis()
  const { symbol } = useChartStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function handleSend() {
    if (!input.trim() || aiLoading) return
    requestAnalysis(input.trim())
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold">AI Analysis</span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            {symbol}
          </span>
        </div>
        <button
          onClick={clearChat}
          className="rounded-md p-1.5 text-text-muted hover:text-text-primary"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {chatMessages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-3 h-10 w-10 text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">Ask me about any trade setup</p>
            <p className="mt-1 text-xs text-text-muted">
              "Should I long or short {symbol}?"
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className="mb-4 animate-fade-in">
            <div className="mb-1 flex items-center gap-2">
              {msg.role === 'user' ? (
                <User className="h-4 w-4 text-text-muted" />
              ) : (
                <Bot className="h-4 w-4 text-accent" />
              )}
              <span className="text-xs font-medium text-text-muted">
                {msg.role === 'user' ? 'You' : 'TradeSignal AI'}
              </span>
            </div>

            {msg.analysis ? (
              <AnalysisCard analysis={msg.analysis} />
            ) : (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-accent/10 text-text-primary'
                    : 'bg-background text-text-secondary'
                }`}
              >
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {aiLoading && (
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-4 w-4 text-accent" />
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-text-muted">Analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-1">
        <p className="text-[10px] text-text-muted">{DISCLAIMER}</p>
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${symbol}...`}
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || aiLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
