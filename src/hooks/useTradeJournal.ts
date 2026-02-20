import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useTradeStore } from '@/stores/tradeStore'
import { useAuthStore } from '@/stores/authStore'
import type { Trade } from '@/types/trading'

export function useTradeJournal() {
  const { trades, setTrades, addTrade, updateTrade, removeTrade } = useTradeStore()
  const { user } = useAuthStore()

  const fetchTrades = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTrades(data as unknown as Trade[])
    }
  }, [user, setTrades])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  const createTrade = useCallback(
    async (trade: Omit<Trade, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) return { error: new Error('Not authenticated') }

      const { data, error } = await supabase
        .from('trades')
        .insert({ ...trade, user_id: user.id } as never)
        .select()
        .single()

      if (!error && data) {
        addTrade(data as unknown as Trade)
      }

      return { error }
    },
    [user, addTrade]
  )

  const editTrade = useCallback(
    async (id: string, updates: Partial<Trade>) => {
      const { error } = await supabase.from('trades').update(updates as never).eq('id', id)

      if (!error) {
        updateTrade(id, updates)
      }

      return { error }
    },
    [updateTrade]
  )

  const deleteTrade = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('trades').delete().eq('id', id)

      if (!error) {
        removeTrade(id)
      }

      return { error }
    },
    [removeTrade]
  )

  return { trades, fetchTrades, createTrade, editTrade, deleteTrade }
}
