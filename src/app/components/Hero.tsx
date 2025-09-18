'use client'

import { useState } from 'react'
import { Search, ShieldCheck, Star, TrendingUp, Users, Sparkles, ArrowRight, Play } from 'lucide-react'
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
    { icon: Users, label: '100K+', description: 'Active Traders', color: 'text-blue-600' },
    { icon: ShieldCheck, label: '100+', description: 'Regulated Brokers', color: 'text-green-600' },
    { icon: Star, label: '4.8/5', description: 'Average Rating', color: 'text-yellow-600' },
    { icon: TrendingUp, label: '50+', description: 'Countries Covered', color: 'text-purple-600' },
  ]

  const trustIndicators = [
    'FCA Regulated',
    'CySEC Licensed', 
    'ASIC Approved',
    'SEC Compliant'
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1586448681913-2fc1b29c5cca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxmaW5hbmNpYWwlMjBjaGFydHMlMjBncmFwaHMlMjBhYnN0cmFjdCUyMGJhY2tncm91bmR8ZW58MHwwfHxibHVlfDE3NTgwNzQ5ODF8MA&ixlib=rb-4.1.0&q=85"
          alt="Financial charts and graphs background - KOBU Agency on Unsplash"
          className="w-full h-full object-cover"
          style={{width: '100%', height: '100%'}}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-8 hover:bg-white/90 transition-all duration-300">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Trusted by 100K+ Traders Worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-xl text-gray-900 mb-6 max-w-4xl mx-auto">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Forex Broker</span>
            <br />
            <span className="text-3xl lg:text-5xl font-normal text-gray-600">in Minutes, Not Hours</span>
          </h1>

          <p className="body-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Compare 100+ regulated brokers with AI-powered matching, unbiased ratings, and real trader reviews. 
            Make informed decisions with our comprehensive analysis platform.
          </p>

          {/* Enhanced Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by broker name, regulation, features, or country..."
                    className="w-full px-8 py-6 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 btn-modern"
                >
                  <span>Find Brokers</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-modern">
              <Link href="/brokers" className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Browse Safe Brokers</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
              <Link href="/reviews" className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </Link>
            </Button>
          </div>

          {/* Stats Grid with Glass Effect */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-surface rounded-2xl p-6 hover-lift group">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="heading-sm text-gray-900 mb-2">{stat.label}</div>
                  <div className="body-sm text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators with Modern Design */}
          <div className="glass-surface rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <span className="body-md font-semibold text-gray-700">Trusted & Regulated Worldwide</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="body-sm font-medium text-gray-700">{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Hint */}
          <div className="mt-12 animate-bounce">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <span className="body-sm">Scroll to explore our services</span>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}