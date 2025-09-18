'use client'

import { useState, useEffect } from 'react'
import { Star, Filter, TrendingUp, Users, Award, MessageSquare, Search, Calendar, ThumbsUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import MetaTags from '@/components/seo/MetaTags'
import Link from 'next/link'

interface Review {
  id: string
  brokerName: string
  brokerLogo: string
  brokerSlug: string
  rating: number
  reviewTitle: string
  reviewContent: string
  author: string
  date: string
  helpfulCount: number
  commentCount: number
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
  verified: boolean
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  totalBrokers: number
  topRatedBroker: string
}

const mockReviews: Review[] = [
  {
    id: '1',
    brokerName: "eToro",
    brokerLogo: "/broker-logos/etoro.svg",
    brokerSlug: "etoro",
    rating: 5,
    reviewTitle: "Excellent platform for beginners",
    reviewContent: "eToro's copy trading feature is amazing for newcomers. The interface is intuitive and educational resources are top-notch.",
    author: "Sarah Johnson",
    date: "2025-09-16",
    helpfulCount: 45,
    commentCount: 12,
    category: "Beginner Friendly",
    sentiment: "positive",
    verified: true
  },
  {
    id: '2',
    brokerName: "IC Markets",
    brokerLogo: "/broker-logos/ic-markets.svg",
    brokerSlug: "ic-markets",
    rating: 4,
    reviewTitle: "Great spreads but high withdrawal fees",
    reviewContent: "Raw spreads are excellent for scalping, but the withdrawal fees can eat into profits if you're not careful with your planning.",
    author: "Mike Chen",
    date: "2025-09-15",
    helpfulCount: 32,
    commentCount: 8,
    category: "Trading Conditions",
    sentiment: "neutral",
    verified: true
  },
  {
    id: '3',
    brokerName: "Pepperstone",
    brokerLogo: "/broker-logos/pepperstone.svg",
    brokerSlug: "pepperstone",
    rating: 5,
    reviewTitle: "Best ECN broker I've used",
    reviewContent: "Lightning fast execution, competitive spreads, and excellent customer support. The Razor account is perfect for serious traders.",
    author: "David Rodriguez",
    date: "2025-09-14",
    helpfulCount: 28,
    commentCount: 6,
    category: "ECN Trading",
    sentiment: "positive",
    verified: true
  },
  {
    id: '4',
    brokerName: "XM",
    brokerLogo: "/broker-logos/xm.svg",
    brokerSlug: "xm",
    rating: 4,
    reviewTitle: "Good for beginners and experienced traders",
    reviewContent: "Wide range of instruments, good educational content, and no deposit/withdrawal fees. The $30 bonus is a nice touch.",
    author: "Emma Thompson",
    date: "2025-09-13",
    helpfulCount: 24,
    commentCount: 5,
    category: "All-Round",
    sentiment: "positive",
    verified: true
  },
  {
    id: '5',
    brokerName: "Forex.com",
    brokerLogo: "/broker-logos/forex-com.svg",
    brokerSlug: "forex-com",
    rating: 3,
    reviewTitle: "Solid platform but high spreads",
    reviewContent: "Reliable platform with good charting tools, but the spreads are wider than many competitors. Good for US traders though.",
    author: "James Wilson",
    date: "2025-09-12",
    helpfulCount: 18,
    commentCount: 9,
    category: "US Trading",
    sentiment: "neutral",
    verified: false
  },
  {
    id: '6',
    brokerName: "IG Group",
    brokerLogo: "/broker-logos/ig.svg",
    brokerSlug: "ig",
    rating: 4,
    reviewTitle: "Excellent UK-based broker",
    reviewContent: "FCA regulated, wide range of markets, and excellent trading platform. The minimum deposit might be high for some beginners.",
    author: "Lisa Anderson",
    date: "2025-09-11",
    helpfulCount: 21,
    commentCount: 7,
    category: "UK Regulated",
    sentiment: "positive",
    verified: true
  }
]

const reviewStats: ReviewStats = {
  totalReviews: 2847,
  averageRating: 4.2,
  totalBrokers: 156,
  topRatedBroker: "Pepperstone"
}

const categories = [
  "All Reviews",
  "Latest Reviews",
  "Top Rated",
  "User Reviews",
  "Expert Reviews",
  "Beginner Friendly",
  "ECN Trading",
  "US Trading",
  "UK Regulated"
]

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "rating", label: "Highest Rating" },
  { value: "helpful", label: "Most Helpful" },
  { value: "comments", label: "Most Discussed" }
]

export default function ReviewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Reviews")
  const [sortBy, setSortBy] = useState("latest")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)

  useEffect(() => {
    let filtered = mockReviews

    // Filter by category
    if (selectedCategory !== "All Reviews") {
      filtered = filtered.filter(review =>
        review.category === selectedCategory ||
        (selectedCategory === "Latest Reviews" && review.id) ||
        (selectedCategory === "Top Rated" && review.rating >= 4) ||
        (selectedCategory === "User Reviews" && !review.author.includes("Expert")) ||
        (selectedCategory === "Expert Reviews" && review.author.includes("Expert"))
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewContent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "helpful":
          return b.helpfulCount - a.helpfulCount
        case "comments":
          return b.commentCount - a.commentCount
        case "latest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    setFilteredReviews(filtered)
  }, [selectedCategory, sortBy, searchTerm])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600"
      case "negative": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <MetaTags
        title="Forex Broker Reviews | Trusted Trading Platform Reviews | BrokerAnalysis.com"
        description="Read authentic forex broker reviews from real traders. Compare ratings, spreads, regulations, and user experiences to find your perfect broker."
        keywords="forex broker reviews, trading platform reviews, broker ratings, user reviews, broker comparison"
        canonicalUrl="https://brokeranalysis.com/reviews"
        ogType="website"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Forex Broker Reviews
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Real reviews from real traders. Make informed decisions with our comprehensive broker analysis platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{reviewStats.totalReviews.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{reviewStats.averageRating}</div>
                <div className="text-blue-200 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{reviewStats.totalBrokers}</div>
                <div className="text-blue-200 text-sm">Brokers Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{reviewStats.topRatedBroker}</div>
                <div className="text-blue-200 text-sm">Top Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews, brokers, or keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Broker Info */}
                <div className="lg:w-48 flex-shrink-0">
                  <div className="flex items-center space-x-3 mb-4">
                    {review.brokerLogo ? (
                      <img
                        src={review.brokerLogo}
                        alt={review.brokerName}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">
                          {review.brokerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/brokers/${review.brokerSlug}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {review.brokerName}
                      </Link>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 ml-1">({review.rating})</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getSentimentColor(review.sentiment)}`}>
                        {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                      </span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {review.category}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {review.reviewTitle}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {review.reviewContent}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>By {review.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(review.date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulCount}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{review.commentCount}</span>
                      </button>
                      <Link
                        href={`/brokers/${review.brokerSlug}#reviews`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All Reviews")
                setSortBy("latest")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="px-8 py-3">
            Load More Reviews
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share Your Trading Experience
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Help other traders make informed decisions by sharing your broker review. Your experience matters!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Write a Review
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3">
              Learn About Our Rating System
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}