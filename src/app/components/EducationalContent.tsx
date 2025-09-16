'use client'

import { BookOpen, GraduationCap, TrendingUp, Award, Star, ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EducationalResource {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  rating: number
  enrollments: number
  type: 'article' | 'video' | 'course' | 'guide'
  author: string
}

const educationalResources: EducationalResource[] = [
  {
    id: 1,
    title: "Forex Trading Basics for Beginners",
    description: "Learn the fundamentals of forex trading, including terminology, market hours, and basic trading strategies.",
    category: "Getting Started",
    difficulty: "Beginner",
    duration: "15 min read",
    rating: 4.8,
    enrollments: 15420,
    type: "article",
    author: "Dr. Sarah Mitchell"
  },
  {
    id: 2,
    title: "Technical Analysis Masterclass",
    description: "Master chart patterns, indicators, and technical analysis techniques used by professional traders.",
    category: "Technical Analysis",
    difficulty: "Intermediate",
    duration: "2 hours",
    rating: 4.9,
    enrollments: 8934,
    type: "course",
    author: "Mark Thompson"
  },
  {
    id: 3,
    title: "Risk Management Strategies",
    description: "Essential risk management techniques to protect your capital and maximize trading success.",
    category: "Risk Management",
    difficulty: "Intermediate",
    duration: "1 hour",
    rating: 4.7,
    enrollments: 12105,
    type: "guide",
    author: "Jennifer Chen"
  },
  {
    id: 4,
    title: "Understanding Market Sentiment",
    description: "Learn how to read and interpret market sentiment to make better trading decisions.",
    category: "Market Analysis",
    difficulty: "Intermediate",
    duration: "45 min read",
    rating: 4.6,
    enrollments: 7542,
    type: "article",
    author: "Robert Wallace"
  },
  {
    id: 5,
    title: "Advanced Price Action Trading",
    description: "Master price action trading strategies without relying on indicators.",
    category: "Trading Strategies",
    difficulty: "Advanced",
    duration: "3 hours",
    rating: 4.8,
    enrollments: 5623,
    type: "course",
    author: "Alex Rodriguez"
  },
  {
    id: 6,
    title: "Broker Selection Guide",
    description: "Complete guide to choosing the right forex broker based on your trading style and needs.",
    category: "Broker Selection",
    difficulty: "Beginner",
    duration: "20 min read",
    rating: 4.9,
    enrollments: 18945,
    type: "guide",
    author: "Emma Wilson"
  },
  {
    id: 7,
    title: "Economic Calendar Trading",
    description: "Learn to trade economic news events and market-moving announcements.",
    category: "Fundamental Analysis",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    rating: 4.5,
    enrollments: 6832,
    type: "video",
    author: "David Park"
  },
  {
    id: 8,
    title: "Trading Psychology Masterclass",
    description: "Overcome psychological barriers and develop the mindset of a successful trader.",
    category: "Trading Psychology",
    difficulty: "Intermediate",
    duration: "2 hours",
    rating: 4.8,
    enrollments: 9234,
    type: "course",
    author: "Dr. Lisa Chang"
  },
  {
    id: 9,
    title: "Cryptocurrency Trading Basics",
    description: "Introduction to cryptocurrency trading and its relationship with forex markets.",
    category: "Digital Assets",
    difficulty: "Beginner",
    duration: "30 min read",
    rating: 4.4,
    enrollments: 8765,
    type: "article",
    author: "Michael Torres"
  },
  {
    id: 10,
    title: "Algorithmic Trading Introduction",
    description: "Understanding the basics of algorithmic trading and automated systems.",
    category: "Advanced Trading",
    difficulty: "Advanced",
    duration: "4 hours",
    rating: 4.7,
    enrollments: 3456,
    type: "course",
    author: "Dr. James Liu"
  },
  {
    id: 11,
    title: "Swing Trading Strategies",
    description: "Learn swing trading techniques to capture medium-term market movements.",
    category: "Trading Strategies",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    rating: 4.6,
    enrollments: 7890,
    type: "video",
    author: "Sarah Johnson"
  },
  {
    id: 12,
    title: "Regulatory Compliance Guide",
    description: "Understanding forex broker regulations and how they protect traders.",
    category: "Regulation",
    difficulty: "Beginner",
    duration: "25 min read",
    rating: 4.8,
    enrollments: 11234,
    type: "article",
    author: "Mark Anderson"
  }
]

const categories = [
  { name: "Getting Started", icon: BookOpen, count: 12 },
  { name: "Technical Analysis", icon: TrendingUp, count: 18 },
  { name: "Risk Management", icon: Shield, count: 8 },
  { name: "Advanced Trading", icon: Award, count: 15 },
  { name: "Market Psychology", icon: GraduationCap, count: 6 },
]

export default function EducationalContent() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-xs font-bold">V</span>
        </div>
      case 'course':
        return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">C</span>
        </div>
      case 'guide':
        return <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 text-xs font-bold">G</span>
        </div>
      default:
        return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-600 text-xs font-bold">A</span>
        </div>
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100'
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'Advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trading Education Hub
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Comprehensive resources to help you master forex trading, from beginner basics to advanced strategies.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/education/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors duration-300 border border-gray-200 hover:border-blue-300">
                  <category.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.count} resources</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Featured Resources</h3>
            <Link href="/education" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationalResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(resource.type)}
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{resource.duration}</div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{resource.description}</p>

                {/* Category */}
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {resource.category}
                  </span>
                </div>

                {/* Author and Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{resource.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{resource.enrollments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/education/${resource.id}`}>Start Learning</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Master Forex Trading?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of traders who have improved their skills with our comprehensive educational resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/education">Browse All Courses</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/education/free-resources">Free Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}