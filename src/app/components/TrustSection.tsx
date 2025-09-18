'use client'

import { useState } from 'react'
import { Star, Quote, Shield, Award, Users, TrendingUp, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  content: string
  tradingExperience: string
  location: string
}

interface TrustMetric {
  icon: React.ComponentType<any>
  value: string
  label: string
  description: string
  color: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Professional Trader',
    company: 'Independent',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    content: 'BrokerAnalysis helped me find the perfect broker for my trading style. Their safety analysis is incredibly thorough, and I feel much more confident in my broker choice.',
    tradingExperience: '5 years',
    location: 'London, UK'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Forex Analyst',
    company: 'Trading Firm',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    content: 'The comparison tool is fantastic. I was able to compare 10+ brokers in minutes and found one that saved me thousands in trading costs. Highly recommended!',
    tradingExperience: '8 years',
    location: 'Singapore'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Retail Trader',
    company: 'Self-employed',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    content: 'As a beginner, I was overwhelmed by broker choices. BrokerAnalysis made it simple with their smart matching system. Found my ideal broker in under 5 minutes!',
    tradingExperience: '1 year',
    location: 'Madrid, Spain'
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Algorithmic Trader',
    company: 'Hedge Fund',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    content: 'The technical analysis and API access information is spot-on. Saved me weeks of research when setting up my automated trading systems.',
    tradingExperience: '12 years',
    location: 'New York, USA'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Day Trader',
    company: 'Independent',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    content: 'Real-time updates on broker regulations and safety scores give me peace of mind. The platform is incredibly user-friendly and comprehensive.',
    tradingExperience: '3 years',
    location: 'Toronto, Canada'
  }
]

const trustMetrics: TrustMetric[] = [
  {
    icon: Users,
    value: '100K+',
    label: 'Active Users',
    description: 'Traders trust our platform daily',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    value: '99.8%',
    label: 'Safety Accuracy',
    description: 'Verified broker safety ratings',
    color: 'text-green-600'
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'User Rating',
    description: 'Average platform satisfaction',
    color: 'text-yellow-600'
  },
  {
    icon: Award,
    value: '50+',
    label: 'Industry Awards',
    description: 'Recognition for excellence',
    color: 'text-purple-600'
  }
]

const regulatoryBadges = [
  { name: 'FCA', fullName: 'Financial Conduct Authority', country: 'UK' },
  { name: 'CySEC', fullName: 'Cyprus Securities Exchange Commission', country: 'Cyprus' },
  { name: 'ASIC', fullName: 'Australian Securities & Investments Commission', country: 'Australia' },
  { name: 'FINMA', fullName: 'Financial Market Supervisory Authority', country: 'Switzerland' },
  { name: 'SEC', fullName: 'Securities and Exchange Commission', country: 'USA' },
  { name: 'FSA', fullName: 'Financial Services Agency', country: 'Japan' }
]

export default function TrustSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Trusted Worldwide</span>
          </div>
          
          <h2 className="heading-lg text-gray-900 mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> 100,000+ Traders</span>
          </h2>
          
          <p className="body-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful traders who rely on our platform for safe, 
            informed broker selection and comprehensive market analysis.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustMetrics.map((metric, index) => (
            <div
              key={index}
              className="text-center glass-surface rounded-2xl p-6 hover-lift animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="inline-flex p-4 rounded-2xl bg-white shadow-lg mb-4">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <div className="heading-sm text-gray-900 mb-2">{metric.value}</div>
              <div className="font-semibold text-gray-700 mb-1">{metric.label}</div>
              <div className="body-sm text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="glass-surface rounded-3xl p-8 relative">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 opacity-20">
                <Quote className="h-12 w-12 text-blue-600" />
              </div>

              {/* Testimonial Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  {renderStars(testimonials[currentTestimonial].rating)}
                </div>

                <blockquote className="body-lg text-gray-700 text-center mb-8 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  {/* Avatar placeholder */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {testimonials[currentTestimonial].tradingExperience} experience • {testimonials[currentTestimonial].location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="glass-surface rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="heading-md text-gray-900 mb-4">
              Regulatory Compliance & Safety
            </h3>
            <p className="body-md text-gray-600 max-w-2xl mx-auto">
              We work with brokers regulated by the world's most trusted financial authorities, 
              ensuring your trading capital is protected.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {regulatoryBadges.map((badge, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 group cursor-pointer hover-lift"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <span className="font-bold text-blue-700 text-sm">{badge.name}</span>
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-gray-600">{badge.country}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                All featured brokers are fully regulated and licensed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}