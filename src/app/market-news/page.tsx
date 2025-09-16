'use client'

import { useState, useEffect } from 'react'
import { MarketNewsItem, MarketNewsResponse } from '@/app/api/market-news/route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Filter, Search, TrendingUp, Globe, DollarSign, BarChart3, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const impactColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200'
}

const sentimentIcons = {
  positive: '📈',
  negative: '📉',
  neutral: '➡️'
}

const categoryIcons = {
  'Forex News': Globe,
  'Economic Calendar': Calendar,
  'Market Analysis': BarChart3,
  'Central Bank Announcements': DollarSign
}

export default function MarketNewsPage() {
  const [news, setNews] = useState<MarketNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    impact: '',
    currencyPair: '',
    search: ''
  })
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/market-news?${params}`)
      const data: MarketNewsResponse = await response.json()

      if (data.success) {
        setNews(data.data)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch news')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchNews, 30000)
    return () => clearInterval(interval)
  }, [filters])

  const filteredNews = news.filter(item => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market News</h1>
              <p className="text-gray-600 mt-1">Real-time forex market news and analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                onClick={fetchNews}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search news..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Forex News">Forex News</SelectItem>
                <SelectItem value="Economic Calendar">Economic Calendar</SelectItem>
                <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                <SelectItem value="Central Bank Announcements">Central Bank Announcements</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.impact} onValueChange={(value) => setFilters(prev => ({ ...prev, impact: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Impact Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Impact Levels</SelectItem>
                <SelectItem value="High">High Impact</SelectItem>
                <SelectItem value="Medium">Medium Impact</SelectItem>
                <SelectItem value="Low">Low Impact</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.currencyPair} onValueChange={(value) => setFilters(prev => ({ ...prev, currencyPair: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Currency Pairs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Currency Pairs</SelectItem>
                <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                <SelectItem value="USD/CAD">USD/CAD</SelectItem>
                <SelectItem value="NZD/USD">NZD/USD</SelectItem>
                <SelectItem value="USD/CHF">USD/CHF</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({ category: '', impact: '', currencyPair: '', search: '' })}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Clear Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Tabs defaultValue="latest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="latest" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Latest News</span>
            </TabsTrigger>
            <TabsTrigger value="high-impact">High Impact</TabsTrigger>
            <TabsTrigger value="forex">Forex Focus</TabsTrigger>
            <TabsTrigger value="economic">Economic Data</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading market news...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredNews.map((item) => {
                  const CategoryIcon = categoryIcons[item.category]
                  return (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <CategoryIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                                {item.title}
                              </CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{timeAgo(item.publishedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">{item.source}</span>
                                </div>
                                <span>•</span>
                                <span>{item.author}</span>
                                <span>•</span>
                                <span>{item.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={impactColors[item.impact]}>
                              {item.impact} Impact
                            </Badge>
                            <span className="text-lg">{sentimentIcons[item.sentiment]}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{item.summary}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.currencyPairs.map((pair) => (
                            <Badge key={pair} variant="outline" className="text-xs">
                              {pair}
                            </Badge>
                          ))}
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Save for Later
                            </Button>
                            {item.url && (
                              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm">Read Full Article</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="high-impact">
            <div className="grid gap-6">
              {filteredNews
                .filter(item => item.impact === 'High')
                .map((item) => {
                  const CategoryIcon = categoryIcons[item.category]
                  return (
                    <Card key={item.id} className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <CategoryIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                                {item.title}
                              </CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{timeAgo(item.publishedAt)}</span>
                                </div>
                                <span>{item.source}</span>
                                <span>•</span>
                                <span>{item.author}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            HIGH IMPACT
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{item.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {item.currencyPairs.map((pair) => (
                              <Badge key={pair} variant="outline" className="text-xs bg-white">
                                {pair}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{sentimentIcons[item.sentiment]}</span>
                            {item.url && (
                              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm">Read More</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="forex">
            <div className="grid gap-6">
              {filteredNews
                .filter(item => item.category === 'Forex News')
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{item.summary}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="economic">
            <div className="grid gap-6">
              {filteredNews
                .filter(item => item.category === 'Economic Calendar')
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{item.summary}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}