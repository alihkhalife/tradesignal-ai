import type { SymbolInfo } from '@/types/market'
import type { Timeframe } from '@/types/trading'

export const TIMEFRAMES: { value: Timeframe; label: string; binanceInterval: string }[] = [
  { value: '15m', label: '15M', binanceInterval: '15m' },
  { value: '1h', label: '1H', binanceInterval: '1h' },
  { value: '4h', label: '4H', binanceInterval: '4h' },
  { value: '1d', label: '1D', binanceInterval: '1d' },
  { value: '1w', label: '1W', binanceInterval: '1w' },
]

export const CRYPTO_SYMBOLS: SymbolInfo[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'crypto', exchange: 'Binance' },
  { symbol: 'ETHUSDT', name: 'Ethereum', type: 'crypto', exchange: 'Binance' },
  { symbol: 'SOLUSDT', name: 'Solana', type: 'crypto', exchange: 'Binance' },
  { symbol: 'BNBUSDT', name: 'BNB', type: 'crypto', exchange: 'Binance' },
  { symbol: 'XRPUSDT', name: 'XRP', type: 'crypto', exchange: 'Binance' },
  { symbol: 'ADAUSDT', name: 'Cardano', type: 'crypto', exchange: 'Binance' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', type: 'crypto', exchange: 'Binance' },
  { symbol: 'AVAXUSDT', name: 'Avalanche', type: 'crypto', exchange: 'Binance' },
  { symbol: 'DOTUSDT', name: 'Polkadot', type: 'crypto', exchange: 'Binance' },
  { symbol: 'LINKUSDT', name: 'Chainlink', type: 'crypto', exchange: 'Binance' },
  { symbol: 'MATICUSDT', name: 'Polygon', type: 'crypto', exchange: 'Binance' },
  { symbol: 'ATOMUSDT', name: 'Cosmos', type: 'crypto', exchange: 'Binance' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol', type: 'crypto', exchange: 'Binance' },
  { symbol: 'ARUSDT', name: 'Arweave', type: 'crypto', exchange: 'Binance' },
  { symbol: 'OPUSDT', name: 'Optimism', type: 'crypto', exchange: 'Binance' },
  { symbol: 'ARBUSDT', name: 'Arbitrum', type: 'crypto', exchange: 'Binance' },
]

export const STOCK_SYMBOLS: SymbolInfo[] = [
  { symbol: 'AAPL', name: 'Apple', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'SPY', name: 'S&P 500 ETF', type: 'stock', exchange: 'NYSE' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', type: 'stock', exchange: 'NASDAQ' },
]

export const COMMODITY_SYMBOLS: SymbolInfo[] = [
  { symbol: 'XAUUSD', name: 'Gold', type: 'commodity', exchange: 'FOREX' },
  { symbol: 'XAGUSD', name: 'Silver', type: 'commodity', exchange: 'FOREX' },
]

export const ALL_SYMBOLS: SymbolInfo[] = [
  ...CRYPTO_SYMBOLS,
  ...STOCK_SYMBOLS,
  ...COMMODITY_SYMBOLS,
]

export const DEFAULT_INDICATORS = ['macd', 'rsi', 'volume', 'ema9', 'ema23', 'ema50', 'ema200'] as const

export type IndicatorId = (typeof DEFAULT_INDICATORS)[number]

export const INDICATOR_CONFIG: Record<IndicatorId, { label: string; color: string; pane: 'main' | 'separate' }> = {
  macd: { label: 'MACD', color: '#3b82f6', pane: 'separate' },
  rsi: { label: 'RSI', color: '#f59e0b', pane: 'separate' },
  volume: { label: 'Volume', color: '#6b7280', pane: 'separate' },
  ema9: { label: 'EMA 9', color: '#22c55e', pane: 'main' },
  ema23: { label: 'EMA 23', color: '#3b82f6', pane: 'main' },
  ema50: { label: 'EMA 50', color: '#f59e0b', pane: 'main' },
  ema200: { label: 'EMA 200', color: '#ef4444', pane: 'main' },
}

export const DISCLAIMER = 'This is not financial advice. AI analysis is for educational purposes only. Always do your own research and never risk more than you can afford to lose.'
