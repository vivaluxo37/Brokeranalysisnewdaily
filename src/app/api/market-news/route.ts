import { NextRequest, NextResponse } from 'next/server'

// TypeScript interfaces for market news data
export interface MarketNewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: 'Forex News' | 'Economic Calendar' | 'Market Analysis' | 'Central Bank Announcements'
  impact: 'High' | 'Medium' | 'Low'
  publishedAt: string
  updatedAt: string
  source: string
  author: string
  url?: string
  currencyPairs: string[]
  tags: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  readTime: number
}

export interface MarketNewsResponse {
  success: boolean
  data: MarketNewsItem[]
  total: number
  page: number
  limit: number
  filters?: {
    category?: string
    impact?: string
    currencyPair?: string
  }
}

// Simulated market news data
const generateMarketNews = (): MarketNewsItem[] => {
  const categories: MarketNewsItem['category'][] = [
    'Forex News', 'Economic Calendar', 'Market Analysis', 'Central Bank Announcements'
  ]

  const impacts: MarketNewsItem['impact'][] = ['High', 'Medium', 'Low']
  const sentiments: MarketNewsItem['sentiment'][] = ['positive', 'negative', 'neutral']
  const sources = ['Reuters', 'Bloomberg', 'Financial Times', 'CNBC', 'MarketWatch', 'ForexLive']
  const authors = ['Michael Thompson', 'Sarah Johnson', 'David Chen', 'Emma Rodriguez', 'James Wilson', 'Lisa Park']

  const currencyPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/CHF']

  const newsTemplates = [
    {
      category: 'Central Bank Announcements',
      templates: [
        "Federal Reserve signals {policy_change} stance amid {economic_condition}",
        "European Central Bank maintains rates at {rate_level}%, cites {concern}",
        "Bank of Japan announces {surprise_decision} on monetary policy",
        "Bank of England holds rates steady, hints at {future_action}",
        "Reserve Bank of Australia {action} rates in response to {economic_factor}"
      ]
    },
    {
      category: 'Economic Calendar',
      templates: [
        "US {data_type} beats expectations, comes in at {value}",
        "Eurozone {indicator} shows {trend}, impacting {currency} outlook",
        "UK {economic_metric} {performance}, market reacts {reaction}",
        "Japanese {data_point} {result}, affecting {market_sentiment}",
        "Australian {economic_indicator} {outcome}, influences {currency_pair}"
      ]
    },
    {
      category: 'Forex News',
      templates: [
        "{currency_pair} {movement} as {factor} drives market sentiment",
        "Dollar {direction} against {counter_currency} on {news_driver}",
        "{base_currency} weakens amid {economic_conditions}",
        "{currency_pair} volatility increases due to {market_event}",
        "Safe-haven demand boosts {currency} as {risk_factor} emerges"
      ]
    },
    {
      category: 'Market Analysis',
      templates: [
        "Technical analysis suggests {currency_pair} could {direction} to {level}",
        "Market analysts predict {currency} {movement} in {timeframe}",
        "{currency_pair} key levels to watch: {support} and {resistance}",
        "Fed policy divergence creates opportunities in {currency_pair}",
        "Carry trade strategies favor {currency_pair} amid {market_conditions}"
      ]
    }
  ]

  const news: MarketNewsItem[] = []

  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const categoryTemplates = newsTemplates.find(t => t.category === category)
    const template = categoryTemplates?.templates[Math.floor(Math.random() * categoryTemplates.templates.length)] || ''

    // Replace template placeholders
    let title = template
      .replace('{policy_change}', ['dovish', 'hawkish', 'neutral'][Math.floor(Math.random() * 3)])
      .replace('{economic_condition}', ['inflation concerns', 'growth slowdown', 'market stability'][Math.floor(Math.random() * 3)])
      .replace('{rate_level}', (4.5 + Math.random() * 2).toFixed(1))
      .replace('{concern}', ['inflation pressures', 'growth risks', 'market volatility'][Math.floor(Math.random() * 3)])
      .replace('{surprise_decision}', ['unexpected cut', 'status quo', 'gradual tightening'][Math.floor(Math.random() * 3)])
      .replace('{future_action}', ['future cuts', 'rate hikes', 'extended pause'][Math.floor(Math.random() * 3)])
      .replace('{action}', ['cuts', 'raises', 'maintains'][Math.floor(Math.random() * 3)])
      .replace('{economic_factor}', ['inflation data', 'employment figures', 'GDP growth'][Math.floor(Math.random() * 3)])
      .replace('{data_type}', ['GDP', 'CPI', 'NFP', 'Retail Sales'][Math.floor(Math.random() * 4)])
      .replace('{value}', `${(Math.random() * 10).toFixed(1)}%`)
      .replace('{indicator}', ['inflation', 'GDP growth', 'employment'][Math.floor(Math.random() * 3)])
      .replace('{trend}', ['improvement', 'decline', 'stability'][Math.floor(Math.random() * 3)])
      .replace('{currency}', ['Euro', 'Pound', 'Yen'][Math.floor(Math.random() * 3)])
      .replace('{economic_metric}', ['manufacturing PMI', 'services PMI', 'consumer confidence'][Math.floor(Math.random() * 3)])
      .replace('{performance}', ['expands', 'contracts', 'stabilizes'][Math.floor(Math.random() * 3)])
      .replace('{reaction}', ['positively', 'negatively', 'cautiously'][Math.floor(Math.random() * 3)])
      .replace('{data_point}', ['CPI', 'trade balance', 'industrial production'][Math.floor(Math.random() * 3)])
      .replace('{result}', ['rises', 'falls', 'meets expectations'][Math.floor(Math.random() * 3)])
      .replace('{market_sentiment}', ['risk appetite', 'risk aversion', 'market uncertainty'][Math.floor(Math.random() * 3)])
      .replace('{economic_indicator}', ['employment', 'inflation', 'retail sales'][Math.floor(Math.random() * 3)])
      .replace('{outcome}', ['increases', 'decreases', 'remains stable'][Math.floor(Math.random() * 3)])
      .replace('{currency_pair}', currencyPairs[Math.floor(Math.random() * currencyPairs.length)])
      .replace('{movement}', ['surges', 'plunges', 'fluctuates'][Math.floor(Math.random() * 3)])
      .replace('{factor}', ['economic data', 'central bank comments', 'geopolitical events'][Math.floor(Math.random() * 3)])
      .replace('{direction}', ['strengthens', 'weakens', 'stabilizes'][Math.floor(Math.random() * 3)])
      .replace('{counter_currency}', ['Euro', 'Yen', 'Pound'][Math.floor(Math.random() * 3)])
      .replace('{news_driver}', ['Fed policy', 'economic data', 'market sentiment'][Math.floor(Math.random() * 3)])
      .replace('{base_currency}', ['Dollar', 'Euro', 'Pound'][Math.floor(Math.random() * 3)])
      .replace('{economic_conditions}', ['growth concerns', 'inflation fears', 'policy uncertainty'][Math.floor(Math.random() * 3)])
      .replace('{market_event}', ['central bank meeting', 'data release', 'geopolitical tension'][Math.floor(Math.random() * 3)])
      .replace('{direction}', ['rise', 'fall', 'consolidate'][Math.floor(Math.random() * 3)])
      .replace('{level}', `${(1.05 + Math.random() * 0.2).toFixed(4)}`)
      .replace('{currency}', ['Dollar', 'Euro', 'Yen'][Math.floor(Math.random() * 3)])
      .replace('{movement}', ['strengthen', 'weaken', 'stabilize'][Math.floor(Math.random() * 3)])
      .replace('{timeframe}', ['short term', 'medium term', 'long term'][Math.floor(Math.random() * 3)])
      .replace('{support}', `${(1.05 + Math.random() * 0.1).toFixed(4)}`)
      .replace('{resistance}', `${(1.15 + Math.random() * 0.1).toFixed(4)}`)
      .replace('{currency_pair}', currencyPairs[Math.floor(Math.random() * currencyPairs.length)])
      .replace('{market_conditions}', ['low volatility', 'risk-on sentiment', 'safe-haven demand'][Math.floor(Math.random() * 3)])

    const publishedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    const updatedAt = new Date(publishedAt.getTime() + Math.random() * 60 * 60 * 1000) // Within 1 hour

    const relevantCurrencyPairs = currencyPairs
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1)

    news.push({
      id: `news-${i + 1}`,
      title: title,
      summary: generateSummary(title, category),
      content: generateContent(title, category),
      category,
      impact: impacts[Math.floor(Math.random() * impacts.length)],
      publishedAt: publishedAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      url: `https://example.com/news/${i + 1}`,
      currencyPairs: relevantCurrencyPairs,
      tags: generateTags(title, category),
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      readTime: Math.floor(Math.random() * 5) + 2 // 2-7 minutes
    })
  }

  return news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

const generateSummary = (title: string, category: string): string => {
  const summaries = {
    'Central Bank Announcements': [
      "Central bank officials emphasize data-dependent approach while balancing inflation risks with economic growth concerns.",
      "Monetary policy decision reflects current economic conditions and future outlook, with market participants closely monitoring forward guidance.",
      "Policy makers maintain cautious stance as they assess the impact of previous decisions on the broader economy."
    ],
    'Economic Calendar': [
      "Economic indicators provide crucial insights into the health of the economy and influence monetary policy expectations.",
      "Market participants analyze the data releases for clues about future central bank actions and economic trajectory.",
      "The economic figures reflect current conditions and help shape market sentiment and trading strategies."
    ],
    'Forex News': [
      "Currency movements reflect changing market dynamics as investors react to economic developments and policy shifts.",
      "Foreign exchange markets adjust to new information as traders reassess positions based on changing fundamentals.",
      "Currency pairs respond to market forces as participants digest economic data and policy announcements."
    ],
    'Market Analysis': [
      "Technical and fundamental analysis suggests potential trading opportunities as markets navigate current conditions.",
      "Market analysts identify key levels and patterns that could influence future price movements across asset classes.",
      "Comprehensive market assessment considers multiple factors including technical indicators and economic fundamentals."
    ]
  }

  const categorySummaries = summaries[category] || summaries['Market Analysis']
  return categorySummaries[Math.floor(Math.random() * categorySummaries.length)]
}

const generateContent = (title: string, category: string): string => {
  return `This comprehensive analysis of "${title}" provides detailed insights into the current market conditions.

${category === 'Central Bank Announcements' ?
  'Central bank decisions are crucial market-moving events that can significantly impact currency valuations. Policy makers carefully consider various economic indicators including inflation rates, employment figures, and GDP growth when making monetary policy decisions. Market participants closely analyze not only the actual decisions but also the accompanying statements and press conferences for forward guidance.' :
  category === 'Economic Calendar' ?
  'Economic data releases are fundamental drivers of currency movements as they provide insights into the health and direction of economies. Key indicators such as GDP, inflation rates, employment figures, and manufacturing data help market participants assess economic conditions and make informed trading decisions. Better-than-expected data typically strengthens the respective currency, while disappointing figures tend to weaken it.' :
  category === 'Forex News' ?
  'The foreign exchange market is the largest and most liquid financial market globally, with trillions of dollars traded daily. Currency prices are influenced by numerous factors including economic data, central bank policies, political events, and market sentiment. Understanding these dynamics is essential for successful forex trading and risk management.' :
  'Market analysis combines technical and fundamental approaches to identify trading opportunities and manage risks. Technical analysts study price charts and indicators to identify patterns and trends, while fundamental analysts focus on economic factors, company performance, and market conditions. A comprehensive approach considers both perspectives for better decision-making.'}

Traders should consider multiple timeframes and risk management strategies when acting on market information. It\'s important to stay updated with the latest developments and adjust trading strategies accordingly as market conditions evolve.`
}

const generateTags = (title: string, category: string): string[] => {
  const baseTags = {
    'Central Bank Announcements': ['Fed', 'ECB', 'BOE', 'BOJ', 'Monetary Policy', 'Interest Rates'],
    'Economic Calendar': ['GDP', 'CPI', 'NFP', 'Economic Data', 'Economic Indicators'],
    'Forex News': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'Currency Markets', 'FX'],
    'Market Analysis': ['Technical Analysis', 'Fundamental Analysis', 'Market Outlook', 'Trading Strategies']
  }

  const categoryTags = baseTags[category] || baseTags['Market Analysis']
  return categoryTags.slice(0, Math.floor(Math.random() * 3) + 2)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') as MarketNewsItem['category'] | null
    const impact = searchParams.get('impact') as MarketNewsItem['impact'] | null
    const currencyPair = searchParams.get('currencyPair')?.toUpperCase() || null

    // Generate news data
    let allNews = generateMarketNews()

    // Apply filters
    let filteredNews = allNews

    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category)
    }

    if (impact) {
      filteredNews = filteredNews.filter(news => news.impact === impact)
    }

    if (currencyPair) {
      filteredNews = filteredNews.filter(news =>
        news.currencyPairs.some(pair => pair.toUpperCase().includes(currencyPair))
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNews = filteredNews.slice(startIndex, endIndex)

    const response: MarketNewsResponse = {
      success: true,
      data: paginatedNews,
      total: filteredNews.length,
      page,
      limit,
      filters: {
        category: category || undefined,
        impact: impact || undefined,
        currencyPair: currencyPair || undefined
      }
    }

    // Add caching headers
    const responseHeaders = new Headers()
    responseHeaders.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return NextResponse.json(response, {
      headers: responseHeaders,
      status: 200
    })
  } catch (error) {
    console.error('Error fetching market news:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market news',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, {
      status: 500
    })
  }
}

export async function OPTIONS() {
  const responseHeaders = new Headers()
  responseHeaders.set('Access-Control-Allow-Origin', '*')
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return new NextResponse(null, {
    status: 200,
    headers: responseHeaders
  })
}