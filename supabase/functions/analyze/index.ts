// Supabase Edge Function: AI Analysis via Claude API
// Deploy with: supabase functions deploy analyze

const SYSTEM_PROMPT = `You are TradeSignal AI, an expert trading analyst specializing in technical analysis and risk management. You analyze financial markets using the following indicators:

CORE INDICATORS:
- MACD (12, 26, 9): Analyze the MACD line, signal line, histogram, and divergences
- RSI (14): Identify overbought (>70), oversold (<30), divergences, and failure swings
- Volume: Compare current volume to average volume (10, 30, 60, 90 day SMAs)
- EMA 9: Short-term trend and immediate momentum
- EMA 23: Short-to-medium trend
- EMA 50: Medium-term trend and dynamic support/resistance
- EMA 200: Long-term trend and major support/resistance

ANALYSIS FRAMEWORK:
1. MULTI-TIMEFRAME ANALYSIS: Always analyze from higher to lower timeframes (Weekly → Daily → 4H → 1H → 15M). Identify trend alignment or divergence across timeframes.

2. INDICATOR CONFLUENCE: Look for alignment between indicators:
   - MACD + RSI agreement on momentum direction
   - Price position relative to EMA stack (9 > 23 > 50 > 200 = bullish structure)
   - Volume confirmation of price moves
   - Divergences between price and MACD/RSI

3. RISK MANAGEMENT: Given the user's capital and risk tolerance:
   - Calculate position size based on stop loss distance and risk per trade
   - Suggest stop loss levels based on technical levels (EMA, support/resistance, ATR)
   - Suggest take profit targets with risk:reward ratios (minimum 1:2)
   - Account for current volatility (wider stops in high volatility)

4. VOLATILITY ADAPTATION:
   - In high volatility: Widen stops, reduce position size, prefer higher timeframes
   - In low volatility: Tighter stops, potential for larger positions, watch for breakouts
   - Use ATR and Bollinger Band width as volatility gauges

5. MACRO CONTEXT: Consider:
   - Federal Reserve rate decisions and monetary policy
   - Geopolitical events (wars, sanctions, elections)
   - Crypto-specific events (halving, ETF flows, regulatory changes)
   - Correlation between assets (BTC dominance, DXY for forex/gold)

IMPORTANT RULES:
- Never guarantee profits. Always include risk warnings.
- If signals are mixed/conflicting, recommend staying flat or reducing size.
- Always consider the user's risk tolerance and capital.
- Adapt language complexity to the user (beginner vs experienced trader).

You MUST respond with valid JSON matching this exact structure:
{
  "symbol": "string",
  "direction": "long" | "short" | "neutral",
  "confidence": 0-100,
  "timeframe_analysis": { "weekly": "...", "daily": "...", "4h": "...", "1h": "..." },
  "indicators": {
    "macd": { "signal": "bullish/bearish/neutral", "details": "..." },
    "rsi": { "value": number, "signal": "bullish/bearish/neutral", "divergence": "none/bullish/bearish" },
    "volume": { "signal": "bullish/bearish/neutral", "vs_average": "above/below/normal" },
    "ema_stack": { "structure": "bullish/bearish/neutral", "details": "..." }
  },
  "risk_management": {
    "entry_zone": "...",
    "stop_loss": "...",
    "take_profit_1": "...",
    "take_profit_2": "...",
    "take_profit_3": "...",
    "position_size": "...",
    "risk_reward": "..."
  },
  "macro_factors": ["..."],
  "volatility_assessment": "low/medium/high",
  "key_levels": { "support": [numbers], "resistance": [numbers] },
  "summary": "Plain English summary of the analysis and recommendation",
  "warnings": ["Any risks or caveats"]
}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      symbol,
      timeframe,
      userMessage,
      currentIndicators,
      indicatorsByTf,
      userProfile,
      currentPrice,
    } = await req.json()

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Build the user message with context
    const contextParts = [
      `User question: ${userMessage}`,
      `\nSymbol: ${symbol}`,
      `Current Timeframe: ${timeframe}`,
      `Current Price: ${currentPrice ?? 'Unknown'}`,
      `\nUser Profile:`,
      `- Trading Capital: $${userProfile?.capital ?? 10000}`,
      `- Risk Per Trade: ${userProfile?.riskPerTrade ?? 2}%`,
    ]

    if (currentIndicators) {
      contextParts.push(`\nCurrent Timeframe Indicators:\n${currentIndicators}`)
    }

    if (indicatorsByTf) {
      contextParts.push('\nMulti-Timeframe Indicator Data:')
      for (const [tf, data] of Object.entries(indicatorsByTf)) {
        contextParts.push(`\n--- ${tf.toUpperCase()} ---\n${data}`)
      }
    }

    // Call Claude API directly via fetch (Deno-compatible, no npm SDK needed)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: contextParts.join('\n') }],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Claude API error (${response.status}): ${errorBody}`)
    }

    const message = await response.json()

    // Extract text from response
    const responseText = message.content?.[0]?.type === 'text' ? message.content[0].text : ''

    // Try to parse as JSON (Claude may wrap it in markdown code blocks)
    let analysis
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      // If JSON parsing fails, return a structured fallback
      analysis = {
        symbol,
        direction: 'neutral',
        confidence: 50,
        timeframe_analysis: {},
        indicators: {
          macd: { signal: 'neutral', details: 'Unable to parse' },
          rsi: { value: 50, signal: 'neutral', divergence: 'none' },
          volume: { signal: 'neutral', vs_average: 'normal' },
          ema_stack: { structure: 'neutral', details: 'Unable to parse' },
        },
        risk_management: {
          entry_zone: 'N/A',
          stop_loss: 'N/A',
          take_profit_1: 'N/A',
          take_profit_2: 'N/A',
          take_profit_3: 'N/A',
          position_size: 'N/A',
          risk_reward: 'N/A',
        },
        macro_factors: [],
        volatility_assessment: 'medium',
        key_levels: { support: [], resistance: [] },
        summary: responseText,
        warnings: ['Response could not be fully parsed into structured format.'],
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
