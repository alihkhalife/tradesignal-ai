import { MACD, RSI, EMA, SMA, ATR } from 'technicalindicators'
import type { OHLCV } from '@/types/market'
import type { IndicatorValues } from '@/types/market'

export function calculateIndicators(candles: OHLCV[]): IndicatorValues {
  const closes = candles.map((c) => c.close)
  const highs = candles.map((c) => c.high)
  const lows = candles.map((c) => c.low)
  const volumes = candles.map((c) => c.volume)

  const macdResult = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  })

  const rsiResult = RSI.calculate({ values: closes, period: 14 })

  const ema9 = EMA.calculate({ values: closes, period: 9 })
  const ema23 = EMA.calculate({ values: closes, period: 23 })
  const ema50 = EMA.calculate({ values: closes, period: 50 })
  const ema200 = EMA.calculate({ values: closes, period: 200 })

  const atrResult = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 })

  const volumeSMA10 = SMA.calculate({ values: volumes, period: 10 })
  const volumeSMA30 = SMA.calculate({ values: volumes, period: 30 })

  return {
    macd: {
      macd: macdResult.map((r) => r.MACD ?? 0),
      signal: macdResult.map((r) => r.signal ?? 0),
      histogram: macdResult.map((r) => r.histogram ?? 0),
    },
    rsi: rsiResult,
    ema9,
    ema23,
    ema50,
    ema200,
    atr: atrResult,
    volume: volumes,
    volumeSMA10,
    volumeSMA30,
  }
}

export function getLatestIndicatorValues(indicators: IndicatorValues) {
  const last = (arr: number[]) => arr[arr.length - 1] ?? 0
  const prev = (arr: number[]) => arr[arr.length - 2] ?? 0

  return {
    macd: {
      value: last(indicators.macd.macd),
      signal: last(indicators.macd.signal),
      histogram: last(indicators.macd.histogram),
      prevHistogram: prev(indicators.macd.histogram),
      crossover: prev(indicators.macd.macd) < prev(indicators.macd.signal) &&
        last(indicators.macd.macd) > last(indicators.macd.signal),
      crossunder: prev(indicators.macd.macd) > prev(indicators.macd.signal) &&
        last(indicators.macd.macd) < last(indicators.macd.signal),
    },
    rsi: {
      value: last(indicators.rsi),
      overbought: last(indicators.rsi) > 70,
      oversold: last(indicators.rsi) < 30,
    },
    ema: {
      ema9: last(indicators.ema9),
      ema23: last(indicators.ema23),
      ema50: last(indicators.ema50),
      ema200: last(indicators.ema200),
      bullishStack: last(indicators.ema9) > last(indicators.ema23) &&
        last(indicators.ema23) > last(indicators.ema50) &&
        last(indicators.ema50) > last(indicators.ema200),
      bearishStack: last(indicators.ema9) < last(indicators.ema23) &&
        last(indicators.ema23) < last(indicators.ema50) &&
        last(indicators.ema50) < last(indicators.ema200),
    },
    atr: last(indicators.atr),
    volume: {
      current: last(indicators.volume),
      sma10: last(indicators.volumeSMA10),
      sma30: last(indicators.volumeSMA30),
      aboveAverage: last(indicators.volume) > last(indicators.volumeSMA10) * 1.5,
    },
  }
}

export function formatIndicatorSummary(indicators: IndicatorValues): string {
  const latest = getLatestIndicatorValues(indicators)

  const lines: string[] = []

  // MACD
  lines.push(`MACD: ${latest.macd.value.toFixed(2)} | Signal: ${latest.macd.signal.toFixed(2)} | Histogram: ${latest.macd.histogram.toFixed(2)}`)
  if (latest.macd.crossover) lines.push('  -> MACD bullish crossover detected')
  if (latest.macd.crossunder) lines.push('  -> MACD bearish crossunder detected')

  // RSI
  lines.push(`RSI(14): ${latest.rsi.value.toFixed(2)}${latest.rsi.overbought ? ' [OVERBOUGHT]' : ''}${latest.rsi.oversold ? ' [OVERSOLD]' : ''}`)

  // EMAs
  lines.push(`EMA 9: ${latest.ema.ema9.toFixed(2)} | EMA 23: ${latest.ema.ema23.toFixed(2)} | EMA 50: ${latest.ema.ema50.toFixed(2)} | EMA 200: ${latest.ema.ema200.toFixed(2)}`)
  if (latest.ema.bullishStack) lines.push('  -> Bullish EMA stack (9 > 23 > 50 > 200)')
  if (latest.ema.bearishStack) lines.push('  -> Bearish EMA stack (9 < 23 < 50 < 200)')

  // ATR
  lines.push(`ATR(14): ${latest.atr.toFixed(2)}`)

  // Volume
  lines.push(`Volume: ${latest.volume.current.toFixed(0)} | SMA(10): ${latest.volume.sma10.toFixed(0)}${latest.volume.aboveAverage ? ' [HIGH VOLUME]' : ''}`)

  return lines.join('\n')
}
