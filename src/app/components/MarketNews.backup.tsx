'use client'

import { TrendingUp, TrendingDown, Clock, Globe, BarChart3, ExternalLink, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface NewsArticle {
  id: number
  title: string
  summary: string
  category: string
  publishedAt: string
  author: string
  sentiment: 'positive' | 'negative' | 'neutral'
  impact: 'high' | 'medium' | 'low'
  readTime: string
}

const marketData: MarketData[] = [
  { symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 1.0845, change: 0.0023, changePercent: 0.21 },
  { symbol: 'GBP/USD', name: 'British Pound/US Dollar', price: 1.2734, change: -0.0015, changePercent: -0.12 },
  { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', price: 149.85, change: 0.35, changePercent: 0.23 },
  { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', price: 0.6789, change: 0.0012, changePercent: 0.18 },
  { symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', price: 1.3645, change: -0.0021, changePercent: -0.15 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar/US Dollar', price: 0.6123, change: 0.0008, changePercent: 0.13 },
]

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Fed Holds Rates Steady, Signals Possible Cuts Later This Year",
    summary: "The Federal Reserve maintained current interest rates but hinted at potential rate cuts in the coming months, citing improving inflation data.",
    category: "Central Banks",
    publishedAt: "2 hours ago",
    author: "Michael Thompson",
    sentiment: "positive",
    impact: "high",
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Euro Zone Inflation Shows Signs of Cooling, EUR/USD Reacts",
    summary: "Latest inflation data from the Eurozone suggests price pressures are easing, leading to speculation about ECB policy changes.",
    category: "Economic Data",
    publishedAt: "4 hours ago",
    author: "Sarah Johnson",
    sentiment: "neutral",
    impact: "medium",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Bank of Japan Maintains Ultra-Low Rate Policy",
    summary: "BOJ keeps interest rates unchanged despite global trend of monetary tightening, citing need to support economic recovery.",
    category: "Central Banks",
    publishedAt: "6 hours ago",
    author: "David Chen",
    sentiment: "negative",
    impact: "high",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "Oil Prices Surge Amid Middle East Tensions",
    summary: "Crude oil prices jump 3% as geopolitical tensions in the Middle East raise concerns about supply disruptions.",
    category: "Commodities",
    publishedAt: "8 hours ago",
    author: "Emma Rodriguez",
    sentiment: "negative",
    impact: "high",
    readTime: "3 min read"
  },
  {
    id: 5,
    title: "UK GDP Growth Exceeds Expectations, GBP Strengthens",
    summary: "British economy shows stronger than expected growth in Q2, boosting confidence in the Bank of England's policies.",
    category: "Economic Data",
    publishedAt: "10 hours ago",
    author: "James Wilson",
    sentiment: "positive",
    impact: "medium",
    readTime: "4 min read"
  },
  {
    id: 6,
    title: "Cryptocurrency Market Volatility Increases Amid Regulatory Concerns",
    summary: "Bitcoin and major altcoins experience increased volatility as regulatory scrutiny intensifies in key markets.",
    category: "Cryptocurrency",
    publishedAt: "12 hours ago",
    author: "Lisa Park",
    sentiment: "neutral",
    impact: "medium",
    readTime: "6 min read"
  }
]

export default function MarketNews() {
  const [activeTab, setActiveTab] = useState('news')

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
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

        {/* Content based on active tab */}
        {activeTab === 'news' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main News Column */}
            <div className="lg:col-span-2 space-y-6">
              {newsArticles.slice(0, 4).map((article) => (
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
                        {article.impact.charAt(0).toUpperCase() + article.impact.slice(1)} Impact
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{article.title}</h3>

                  {/* Summary */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{article.summary}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{article.category}</span>
                      </span>
                      <span>{article.readTime}</span>
                      <span>By {article.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Link href={`/news/${article.id}`}>Read More</Link>
                      </Button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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