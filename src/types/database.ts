export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          trading_capital: number
          risk_per_trade: number
          preferred_markets: string[]
          preferred_timeframes: string[]
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          trading_capital?: number
          risk_per_trade?: number
          preferred_markets?: string[]
          preferred_timeframes?: string[]
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          direction: string
          entry_price: number | null
          exit_price: number | null
          stop_loss: number | null
          take_profit: number | null
          position_size: number | null
          status: string
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
        Insert: Omit<Database['public']['Tables']['trades']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trades']['Insert']>
      }
      ai_analyses: {
        Row: {
          id: string
          user_id: string
          symbol: string
          timeframes: string[]
          direction_suggestion: string
          confidence: number
          analysis_text: string
          indicators_snapshot: Json
          macro_context: Json
          risk_params: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_analyses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_analyses']['Insert']>
      }
      custom_indicators: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          pine_script: string
          indicator_type: string
          parameters: Json
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['custom_indicators']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['custom_indicators']['Insert']>
      }
      backtests: {
        Row: {
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
          results_json: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['backtests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['backtests']['Insert']>
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          symbols: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['watchlists']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['watchlists']['Insert']>
      }
    }
  }
}
