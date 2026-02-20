import { useState, useCallback } from 'react'

export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNews = useCallback(async (query: string) => {
    setLoading(true)
    try {
      // Try CryptoPanic API (free, no key needed for basic usage)
      const response = await fetch(
        `https://cryptopanic.com/api/free/v1/posts/?auth_token=&public=true&filter=hot&currencies=${query}`
      )

      if (response.ok) {
        const data = await response.json()
        const items: NewsItem[] = (data.results ?? []).slice(0, 20).map(
          (item: { id: number; title: string; url: string; source: { title: string }; published_at: string; votes: { positive: number; negative: number } }) => ({
            id: String(item.id),
            title: item.title,
            description: '',
            url: item.url,
            source: item.source?.title ?? 'Unknown',
            publishedAt: item.published_at,
            sentiment:
              item.votes?.positive > item.votes?.negative
                ? 'positive'
                : item.votes?.negative > item.votes?.positive
                  ? 'negative'
                  : 'neutral',
          })
        )
        setNews(items)
      }
    } catch (error) {
      console.error('News fetch error:', error)
      // Fallback: return empty array
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { news, loading, fetchNews }
}
