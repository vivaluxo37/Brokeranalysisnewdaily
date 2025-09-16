'use client'

import { TrendingUp, TrendingDown, Clock, Globe, BarChart3, ExternalLink, Bookmark, Filter, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { MarketNewsItem, MarketNewsResponse } from '@/app/api/market-news/route'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

type NewsCategory = 'Forex News' | 'Economic Calendar' | 'Market Analysis' | 'Central Bank Announcements'
type ImpactLevel = 'High' | 'Medium' | 'Low'
type SentimentType = 'positive' | 'negative' | 'neutral'

const marketData: MarketData[] = [
  { symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 1.0845, change: 0.0023, changePercent: 0.21 },
  { symbol: 'GBP/USD', name: 'British Pound/US Dollar', price: 1.2734, change: -0.0015, changePercent: -0.12 },
  { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', price: 149.85, change: 0.35, changePercent: 0.23 },
  { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', price: 0.6789, change: 0.0012, changePercent: 0.18 },
  { symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', price: 1.3645, change: -0.0021, changePercent: -0.15 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar/US Dollar', price: 0.6123, change: 0.0008, changePercent: 0.13 },
]

const categories: NewsCategory[] = ['Forex News', 'Economic Calendar', 'Market Analysis', 'Central Bank Announcements']
const impactLevels: ImpactLevel[] = ['High', 'Medium', 'Low']
const currencyPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/CHF']

export default function MarketNews() {
  const [activeTab, setActiveTab] = useState('news')
  const [news, setNews] = useState<MarketNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null)
  const [selectedImpact, setSelectedImpact] = useState<ImpactLevel | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch market news
  const fetchMarketNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: '20',
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedImpact && { impact: selectedImpact }),
        ...(selectedCurrency && { currencyPair: selectedCurrency })
      })

      const response = await fetch(`/api/market-news?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch market news')
      }

      const data: MarketNewsResponse = await response.json()

      if (data.success) {
        setNews(data.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.error || 'Failed to fetch market news')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching market news:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedImpact, selectedCurrency])

  // Initial fetch
  useEffect(() => {
    fetchMarketNews()
  }, [fetchMarketNews])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      fetchMarketNews()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchMarketNews, isAutoRefresh])

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedImpact(null)
    setSelectedCurrency(null)
  }

  // Get sentiment color
  const getSentimentColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Get impact color
  const getImpactColor = (impact: ImpactLevel) => {
    switch (impact) {
      case 'High':
        return 'text-red-600 bg-red-100'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'Low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Market News & Analysis
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stay informed with real-time market data, breaking news, and expert analysis that impact your trading decisions.
          </p>

          {/* Auto-refresh and status indicator */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>Auto-refresh {isAutoRefresh ? 'ON' : 'OFF'}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: <span suppressHydrationWarning>{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'news'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'data'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Market Data
            </button>
          </div>
        </div>

        {/* Filters */}
        {activeTab === 'news' && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                    <span>{isAutoRefresh ? 'Stop' : 'Start'} Auto-refresh</span>
                  </Button>
                  <Button
                    onClick={fetchMarketNews}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                  {(selectedCategory || selectedImpact || selectedCurrency) && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <span>Clear Filters</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value as NewsCategory || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact Level
                  </label>
                  <select
                    value={selectedImpact || ''}
                    onChange={(e) => setSelectedImpact(e.target.value as ImpactLevel || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Impact Levels</option>
                    {impactLevels.map((impact) => (
                      <option key={impact} value={impact}>
                        {impact} Impact
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Pair
                  </label>
                  <select
                    value={selectedCurrency || ''}
                    onChange={(e) => setSelectedCurrency(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Currencies</option>
                    {currencyPairs.map((pair) => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'news' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main News Column */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-gray-600">Loading market news...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 text-red-600 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Error loading news</span>
                  </div>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button onClick={fetchMarketNews} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              ) : news.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No news articles found matching your filters.</p>
                  <Button onClick={clearFilters} variant="outline" size="sm" className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                news.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Article Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                          {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(article.impact)}`}>
                          {article.impact} Impact
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Article Title */}
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{article.title}</h3>

                    {/* Summary */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{article.summary}</p>

                    {/* Currency Pairs */}
                    {article.currencyPairs.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Relevant Pairs:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.currencyPairs.map((pair) => (
                            <span key={pair} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {pair}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{article.category}</span>
                        </span>
                        <span>{article.readTime} min read</span>
                        <span>By {article.author}</span>
                        <span className="flex items-center space-x-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>{article.source}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {article.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              Read More
                            </a>
                          </Button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Market Watch */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Market Watch</span>
                </h3>
                <div className="space-y-3">
                  {marketData.slice(0, 4).map((data) => (
                    <div key={data.symbol} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{data.symbol}</div>
                        <div className="text-sm text-gray-500">{data.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{data.price.toFixed(4)}</div>
                        <div className={`flex items-center space-x-1 text-sm ${
                          data.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{data.change.toFixed(4)} ({data.changePercent.toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Link href="/market-data">View All Markets</Link>
                </Button>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Trending Topics</h3>
                <div className="space-y-2">
                  {['Federal Reserve', 'ECB Policy', 'Inflation Data', 'Bank of Japan', 'Oil Prices', 'Bitcoin'].map((topic, index) => (
                    <Link
                      key={index}
                      href={`/news/topics/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-2 px-3 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">Get daily market analysis and breaking news delivered to your inbox.</p>
                <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Market Data View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {marketData.map((data) => (
                    <tr key={data.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{data.symbol}</div>
                        <div className="text-sm text-gray-500">{data.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {data.price.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 ${
                          data.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{data.change.toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.changePercent >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {data.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button size="sm" variant="outline">
                          <Link href={`/brokers?symbol=${data.symbol}`}>Trade</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Link href="/news" className="flex items-center space-x-2">
              <span>View All News & Analysis</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}