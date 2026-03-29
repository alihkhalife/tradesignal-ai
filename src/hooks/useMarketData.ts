import { useEffect, useCallback, useRef } from 'react'
import { useChartStore } from '@/stores/chartStore'
import type { OHLCV } from '@/types/market'
import { TIMEFRAMES } from '@/lib/constants'

const BINANCE_APIS = [
  'https://api.binance.com/api/v3',
  'https://api.binance.us/api/v3',
]

async function fetchWithFallback(path: string, signal?: AbortSignal): Promise<Response> {
  for (const base of BINANCE_APIS) {
    try {
      const response = await fetch(`${base}${path}`, { signal })
      if (response.ok) return response
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err
    }
  }
  throw new Error('Failed to fetch market data from all endpoints')
}

export function useMarketData() {
  const { symbol, timeframe, setCandles, setLoading } = useChartStore()
  const abortRef = useRef<AbortController | null>(null)

  const fetchCandles = useCallback(async (sym?: string, tf?: string): Promise<OHLCV[]> => {
    const s = sym ?? symbol
    const t = tf ?? timeframe
    const interval = TIMEFRAMES.find((tf) => tf.value === t)?.binanceInterval ?? '1h'

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const response = await fetchWithFallback(
        `/klines?symbol=${s}&interval=${interval}&limit=500`,
        abortRef.current.signal
      )

      if (!response.ok) throw new Error('Failed to fetch market data')

      const data = await response.json()
      const candles: OHLCV[] = data.map((k: (string | number)[]) => ({
        time: Math.floor(Number(k[0]) / 1000),
        open: parseFloat(k[1] as string),
        high: parseFloat(k[2] as string),
        low: parseFloat(k[3] as string),
        close: parseFloat(k[4] as string),
        volume: parseFloat(k[5] as string),
      }))

      setCandles(candles)
      setLoading(false)
      return candles
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Market data fetch error:', error)
        setLoading(false)
      }
      return []
    }
  }, [symbol, timeframe, setCandles, setLoading])

  useEffect(() => {
    fetchCandles()
    return () => abortRef.current?.abort()
  }, [symbol, timeframe])

  return { fetchCandles }
}

export async function fetchMultiTimeframeData(symbol: string): Promise<Record<string, OHLCV[]>> {
  const timeframes = ['15m', '1h', '4h', '1d', '1w']
  const results: Record<string, OHLCV[]> = {}

  await Promise.all(
    timeframes.map(async (interval) => {
      try {
        const response = await fetchWithFallback(
          `/klines?symbol=${symbol}&interval=${interval}&limit=200`
        )
        const data = await response.json()
        results[interval] = data.map((k: (string | number)[]) => ({
          time: Math.floor(Number(k[0]) / 1000),
          open: parseFloat(k[1] as string),
          high: parseFloat(k[2] as string),
          low: parseFloat(k[3] as string),
          close: parseFloat(k[4] as string),
          volume: parseFloat(k[5] as string),
        }))
      } catch {
        results[interval] = []
      }
    })
  )

  return results
}

export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetchWithFallback(`/ticker/price?symbol=${symbol}`)
    const data = await response.json()
    return parseFloat(data.price)
  } catch {
    return null
  }
}
