'use client'

import { Star, Calendar, User, TrendingUp, ThumbsUp, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Review {
  id: number
  brokerName: string
  brokerLogo: string
  rating: number
  reviewTitle: string
  reviewContent: string
  author: string
  date: string
  helpfulCount: number
  commentCount: number
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

const latestReviews: Review[] = [
  {
    id: 1,
    brokerName: "eToro",
    brokerLogo: "/api/placeholder/80/40",
    rating: 5,
    reviewTitle: "Excellent platform for beginners",
    reviewContent: "eToro's copy trading feature is amazing for newcomers. The interface is intuitive and educational resources are top-notch.",
    author: "Sarah Johnson",
    date: "2 days ago",
    helpfulCount: 45,
    commentCount: 12,
    category: "Beginner Friendly",
    sentiment: "positive"
  },
  {
    id: 2,
    brokerName: "IC Markets",
    brokerLogo: "/api/placeholder/80/40",
    rating: 4,
    reviewTitle: "Great spreads but high withdrawal fees",
    reviewContent: "Raw spreads are excellent for scalping, but the withdrawal fees can eat into profits if you're not careful with your planning.",
    author: "Mike Chen",
    date: "3 days ago",
    helpfulCount: 32,
    commentCount: 8,
    category: "Trading Conditions",
    sentiment: "neutral"
  },
  {
    id: 3,
    brokerName: "Pepperstone",
    brokerLogo: "/api/placeholder/80/40",
    rating: 5,
    reviewTitle: "Fast execution and reliable platform",
    reviewContent: "Been using Pepperstone for 2 years. Execution speed is consistently fast and the Razor account offers excellent value.",
    author: "David Wilson",
    date: "5 days ago",
    helpfulCount: 28,
    commentCount: 6,
    category: "Platform Reliability",
    sentiment: "positive"
  },
  {
    id: 4,
    brokerName: "XM Group",
    brokerLogo: "/api/placeholder/80/40",
    rating: 4,
    reviewTitle: "Good educational resources, average spreads",
    reviewContent: "The webinars and educational content are very helpful for learning. Spreads could be tighter compared to other ECN brokers.",
    author: "Emma Rodriguez",
    date: "1 week ago",
    helpfulCount: 19,
    commentCount: 5,
    category: "Education",
    sentiment: "positive"
  },
  {
    id: 5,
    brokerName: "FP Markets",
    brokerLogo: "/api/placeholder/80/40",
    rating: 5,
    reviewTitle: "Perfect for algorithmic trading",
    reviewContent: "API access and VPS hosting make FP Markets ideal for my trading bots. The support team is very knowledgeable about automated trading.",
    author: "Alex Thompson",
    date: "1 week ago",
    helpfulCount: 24,
    commentCount: 3,
    category: "Advanced Trading",
    sentiment: "positive"
  },
  {
    id: 6,
    brokerName: "FXTM",
    brokerLogo: "/api/placeholder/80/40",
    rating: 3,
    reviewTitle: "Good for beginners, limited for professionals",
    reviewContent: "Cent accounts are great for starting out, but professional traders might find the advanced features somewhat limited compared to competitors.",
    author: "Lisa Park",
    date: "2 weeks ago",
    helpfulCount: 31,
    commentCount: 14,
    category: "Account Types",
    sentiment: "neutral"
  }
]

export default function LatestReviews() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Latest Broker Reviews
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Real experiences from real traders. Our community shares honest reviews to help you make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {latestReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Broker Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">Logo</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{review.brokerName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                  {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                </span>
              </div>

              {/* Review Title */}
              <h4 className="font-semibold text-gray-900 mb-2">{review.reviewTitle}</h4>

              {/* Review Content */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{review.reviewContent}</p>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {review.category}
                </span>
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{review.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpfulCount} helpful</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{review.commentCount} comments</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Link href={`/reviews/${review.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Link href="/reviews" className="flex items-center space-x-2">
              <span>View All Reviews</span>
              <TrendingUp className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}