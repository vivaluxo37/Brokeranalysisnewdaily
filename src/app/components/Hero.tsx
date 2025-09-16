'use client'

import { useState } from 'react'
import { Search, Shield, Star, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }

  const stats = [
    { icon: Users, label: '100K+', description: 'Active Traders' },
    { icon: Shield, label: '100+', description: 'Regulated Brokers' },
    { icon: Star, label: '4.8/5', description: 'Average Rating' },
    { icon: TrendingUp, label: '50+', description: 'Countries Covered' },
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNTQxOEYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINGg0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your Trusted
            <span className="text-blue-600"> Forex Broker</span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Compare 100+ regulated brokers with unbiased ratings and detailed analysis. Make informed trading decisions.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brokers by name, regulation, or features..."
                  className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Link href="/brokers" className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Find Brokers</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <Link href="/reviews" className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Latest Reviews</span>
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4">Trusted by traders worldwide</div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-gray-700 font-semibold">FCA Regulated</div>
              <div className="text-gray-700 font-semibold">CySEC Licensed</div>
              <div className="text-gray-700 font-semibold">ASIC Approved</div>
              <div className="text-gray-700 font-semibold">SEC Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}