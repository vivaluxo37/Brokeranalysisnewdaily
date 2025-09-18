'use client'

import { ShieldCheck, Search, Star, TrendingUp, Users, Zap, Award, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ServiceHighlight {
  id: string
  icon: React.ComponentType<any>
  title: string
  description: string
  features: string[]
  cta: {
    text: string
    href: string
  }
  gradient: string
  stats?: {
    value: string
    label: string
  }
}

const services: ServiceHighlight[] = [
  {
    id: 'safety-analysis',
    icon: ShieldCheck,
    title: 'Broker Safety Analysis',
    description: 'Advanced AI-powered analysis of broker safety, regulation compliance, and financial stability.',
    features: [
      'Real-time regulatory status monitoring',
      'Financial stability scoring',
      'Risk assessment algorithms',
      'Fraud detection systems'
    ],
    cta: {
      text: 'Check Broker Safety',
      href: '/safety-analysis'
    },
    gradient: 'from-green-500 to-emerald-600',
    stats: {
      value: '99.8%',
      label: 'Accuracy Rate'
    }
  },
  {
    id: 'smart-matching',
    icon: Search,
    title: 'Smart Broker Matching',
    description: 'Intelligent matching system that finds the perfect broker based on your trading style and preferences.',
    features: [
      'Personalized recommendations',
      'Trading style analysis',
      'Feature compatibility check',
      'Cost optimization suggestions'
    ],
    cta: {
      text: 'Find My Broker',
      href: '/broker-matching'
    },
    gradient: 'from-blue-500 to-cyan-600',
    stats: {
      value: '2.3s',
      label: 'Average Match Time'
    }
  },
  {
    id: 'trusted-reviews',
    icon: Star,
    title: 'Trusted Reviews & Ratings',
    description: 'Comprehensive review system with verified trader feedback and expert analysis.',
    features: [
      'Verified trader reviews',
      'Expert professional analysis',
      'Real-time rating updates',
      'Sentiment analysis insights'
    ],
    cta: {
      text: 'Read Reviews',
      href: '/reviews'
    },
    gradient: 'from-purple-500 to-pink-600',
    stats: {
      value: '50K+',
      label: 'Verified Reviews'
    }
  }
]

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: 'Market Analysis',
    description: 'Real-time market insights and trading signals'
  },
  {
    icon: Users,
    title: 'Community Hub',
    description: 'Connect with traders worldwide'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Get notified of important market events'
  },
  {
    icon: Award,
    title: 'Expert Insights',
    description: 'Professional trading advice and tips'
  }
]

export default function ServiceHighlights() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Comprehensive Trading Solutions</span>
          </div>
          
          <h2 className="heading-lg text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Trade Safely</span>
          </h2>
          
          <p className="body-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced platform combines cutting-edge technology with expert insights to provide 
            you with the most comprehensive broker analysis and trading tools available.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover-lift animate-slide-up"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                {service.stats && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-200">
                    <div className="text-xs font-bold text-gray-900">{service.stats.value}</div>
                    <div className="text-xs text-gray-500">{service.stats.label}</div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="heading-sm text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="body-md text-gray-600 mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300 btn-modern`}
                  asChild
                >
                  <Link href={service.cta.href} className="flex items-center justify-center space-x-2">
                    <span>{service.cta.text}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="glass-surface rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="heading-md text-gray-900 mb-4">Plus Many More Features</h3>
            <p className="body-md text-gray-600">
              Discover additional tools and features designed to enhance your trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 mb-4">
                  <feature.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-modern">
            <Link href="/get-started" className="flex items-center space-x-2">
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}