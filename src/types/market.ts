export interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CandleData {
  time: number
  open: number
  high: number
  close: number
  low: number
}

export interface VolumeData {
  time: number
  value: number
  color: string
}

export interface LineData {
  time: number
  value: number
}

export interface IndicatorValues {
  macd: {
    macd: number[]
    signal: number[]
    histogram: number[]
  }
  rsi: number[]
  ema9: number[]
  ema23: number[]
  ema50: number[]
  ema200: number[]
  atr: number[]
  volume: number[]
  volumeSMA10: number[]
  volumeSMA30: number[]
}

export interface SymbolInfo {
  symbol: string
  name: string
  type: 'crypto' | 'stock' | 'forex' | 'commodity'
  exchange: string
}

export interface MarketDataRequest {
  symbol: string
  interval: string
  limit?: number
}
