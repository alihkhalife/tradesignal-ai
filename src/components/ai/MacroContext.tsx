import { useEffect } from 'react'
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useNews, type NewsItem } from '@/hooks/useNews'
import { useChartStore } from '@/stores/chartStore'
import { formatDistanceToNow } from 'date-fns'

export function MacroContext() {
  const { symbol } = useChartStore()
  const { news, loading, fetchNews } = useNews()

  useEffect(() => {
    // Extract base currency for news search
    const query = symbol.replace('USDT', '').replace('USD', '').toLowerCase()
    fetchNews(query)
  }, [symbol, fetchNews])

  const sentimentIcon = {
    positive: <TrendingUp className="h-3 w-3 text-bullish" />,
    negative: <TrendingDown className="h-3 w-3 text-bearish" />,
    neutral: <Minus className="h-3 w-3 text-text-muted" />,
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-xs text-text-muted">Loading news...</div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-text-muted">
        No recent news found for {symbol}
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3">
      <h3 className="text-xs font-semibold text-text-muted">MACRO & NEWS</h3>
      {news.slice(0, 8).map((item: NewsItem) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 rounded-md p-2 text-xs transition-colors hover:bg-surface-hover"
        >
          {sentimentIcon[item.sentiment ?? 'neutral']}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-medium text-text-primary">{item.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-text-muted">
              <span>{item.source}</span>
              <span>
                {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-text-muted" />
        </a>
      ))}
    </div>
  )
}
