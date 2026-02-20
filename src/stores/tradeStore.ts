import { create } from 'zustand'
import type { Trade, ChatMessage } from '@/types/trading'

interface TradeState {
  trades: Trade[]
  chatMessages: ChatMessage[]
  aiLoading: boolean
  setTrades: (trades: Trade[]) => void
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, updates: Partial<Trade>) => void
  removeTrade: (id: string) => void
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  setAiLoading: (loading: boolean) => void
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: [],
  chatMessages: [],
  aiLoading: false,
  setTrades: (trades) => set({ trades }),
  addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
  updateTrade: (id, updates) =>
    set((state) => ({
      trades: state.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTrade: (id) => set((state) => ({ trades: state.trades.filter((t) => t.id !== id) })),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
  setAiLoading: (loading) => set({ aiLoading: loading }),
}))
