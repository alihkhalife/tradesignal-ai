export type TradeDirection = 'long' | 'short'
export type TradeStatus = 'planned' | 'open' | 'closed' | 'cancelled'
export type IndicatorSignal = 'bullish' | 'bearish' | 'neutral'
export type VolatilityLevel = 'low' | 'medium' | 'high'
export type Timeframe = '15m' | '1h' | '4h' | '1d' | '1w'

export interface Trade {
  id: string
  user_id: string
  symbol: string
  direction: TradeDirection
  entry_price: number | null
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  position_size: number | null
  status: TradeStatus
  pnl: number | null
  pnl_percentage: number | null
  timeframe: string | null
  ai_analysis_id: string | null
  notes: string | null
  tags: string[]
  screenshot_url: string | null
  opened_at: string | null
  closed_at: string | null
  created_at: string
}

export interface AIAnalysis {
  id: string
  user_id: string
  symbol: string
  timeframes: string[]
  direction_suggestion: TradeDirection | 'neutral'
  confidence: number
  analysis_text: string
  indicators_snapshot: IndicatorsSnapshot
  macro_context: MacroContext
  risk_params: RiskParams
  created_at: string
}

export interface IndicatorsSnapshot {
  macd: { signal: IndicatorSignal; details: string; value?: number; histogram?: number }
  rsi: { value: number; signal: IndicatorSignal; divergence: 'none' | 'bullish' | 'bearish' }
  volume: { signal: IndicatorSignal; vs_average: 'above' | 'below' | 'normal' }
  ema_stack: { structure: IndicatorSignal; details: string }
}

export interface MacroContext {
  factors: string[]
  sentiment: IndicatorSignal
}

export interface RiskParams {
  entry_zone: string
  stop_loss: string
  take_profit_1: string
  take_profit_2: string
  take_profit_3: string
  position_size: string
  risk_reward: string
}

export interface AnalysisResponse {
  symbol: string
  direction: TradeDirection | 'neutral'
  confidence: number
  timeframe_analysis: Record<string, string>
  indicators: IndicatorsSnapshot
  risk_management: RiskParams
  macro_factors: string[]
  volatility_assessment: VolatilityLevel
  key_levels: { support: number[]; resistance: number[] }
  summary: string
  warnings: string[]
}

export interface CustomIndicator {
  id: string
  user_id: string
  name: string
  description: string | null
  pine_script: string
  indicator_type: 'overlay' | 'oscillator' | 'strategy'
  parameters: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export interface Backtest {
  id: string
  user_id: string
  symbol: string
  strategy_description: string
  timeframe: string
  start_date: string
  end_date: string
  total_trades: number
  win_rate: number
  avg_pnl: number
  max_drawdown: number
  sharpe_ratio: number
  results_json: BacktestResults
  created_at: string
}

export interface BacktestResults {
  trades: BacktestTrade[]
  equity_curve: { date: string; equity: number }[]
  monthly_returns: { month: string; return_pct: number }[]
}

export interface BacktestTrade {
  entry_date: string
  exit_date: string
  direction: TradeDirection
  entry_price: number
  exit_price: number
  pnl: number
  pnl_pct: number
}

export interface Watchlist {
  id: string
  user_id: string
  name: string
  symbols: string[]
  created_at: string
}

export interface UserProfile {
  id: string
  username: string | null
  trading_capital: number
  risk_per_trade: number
  preferred_markets: string[]
  preferred_timeframes: string[]
  created_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  analysis?: AnalysisResponse
  timestamp: Date
}
