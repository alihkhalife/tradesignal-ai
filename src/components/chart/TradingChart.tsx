import { useEffect, useRef } from 'react'
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts'
import { useChartStore } from '@/stores/chartStore'
import { useMarketData } from '@/hooks/useMarketData'
import { calculateIndicators } from '@/lib/indicators'
import type { CandlestickData, HistogramData, LineData, Time } from 'lightweight-charts'

export function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRefs = useRef<Map<string, ISeriesApi<SeriesType>>>(new Map())

  const { candles, activeIndicators, loading } = useChartStore()
  useMarketData()

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0d1117' },
        textColor: '#8b949e',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: '#21262d' },
        horzLines: { color: '#21262d' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#30363d', labelBackgroundColor: '#30363d' },
        horzLine: { color: '#30363d', labelBackgroundColor: '#30363d' },
      },
      rightPriceScale: {
        borderColor: '#30363d',
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    })

    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(chartContainerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRefs.current.clear()
    }
  }, [])

  // Update chart data when candles or indicators change
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || candles.length === 0) return

    // Clear all existing series
    seriesRefs.current.forEach((series) => {
      try { chart.removeSeries(series) } catch { /* ignore */ }
    })
    seriesRefs.current.clear()

    // Candlestick series (v5 API)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    const candleData: CandlestickData[] = candles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    candleSeries.setData(candleData)
    seriesRefs.current.set('candles', candleSeries)

    // Calculate indicators
    const indicators = calculateIndicators(candles)

    // EMA overlays on main chart
    const emaConfigs: { id: string; data: number[]; color: string }[] = [
      { id: 'ema9', data: indicators.ema9, color: '#22c55e' },
      { id: 'ema23', data: indicators.ema23, color: '#3b82f6' },
      { id: 'ema50', data: indicators.ema50, color: '#f59e0b' },
      { id: 'ema200', data: indicators.ema200, color: '#ef4444' },
    ]

    for (const ema of emaConfigs) {
      if (!activeIndicators.has(ema.id as 'ema9' | 'ema23' | 'ema50' | 'ema200')) continue
      if (ema.data.length === 0) continue

      const series = chart.addSeries(LineSeries, {
        color: ema.color,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      })

      const offset = candles.length - ema.data.length
      const lineData: LineData[] = ema.data.map((value, i) => ({
        time: candles[i + offset].time as Time,
        value,
      }))
      series.setData(lineData)
      seriesRefs.current.set(ema.id, series)
    }

    // Volume as histogram
    if (activeIndicators.has('volume')) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      })

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      })

      const volumeData: HistogramData[] = candles.map((c) => ({
        time: c.time as Time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
      }))
      volumeSeries.setData(volumeData)
      seriesRefs.current.set('volume', volumeSeries)
    }

    // Fit content
    chart.timeScale().fitContent()
  }, [candles, activeIndicators])

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  )
}
