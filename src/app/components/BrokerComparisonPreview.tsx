'use client'

import { useState } from 'react'
import { Star, Shield, TrendingUp, Users, ArrowRight, CheckCircle, XCircle, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BrokerData {
  id: string
  name: string
  logo: string
  rating: number
  reviewCount: number
  regulation: string[]
  minDeposit: number
  spread: string
  leverage: string
  platforms: string[]
  features: {
    [key: string]: boolean | string
  }
  pros: string[]
  cons: string[]
  overallScore: number
}

const sampleBrokers: BrokerData[] = [
  {
    id: 'etoro',
    name: 'eToro',
    logo: '/api/placeholder/60/30',
    rating: 4.8,
    reviewCount: 12450,
    regulation: ['FCA', 'CySEC', 'ASIC'],
    minDeposit: 200,
    spread: '1.0 pips',
    leverage: '1:30',
    platforms: ['WebTrader', 'Mobile App'],
    features: {
      copyTrading: true,
      socialTrading: true,
      cryptoTrading: true,
      stockTrading: true,
      demoAccount: true,
      islamicAccount: false,
      vpsHosting: false,
      apiAccess: false
    },
    pros: ['Excellent for beginners', 'Copy trading feature', 'Social trading community'],
    cons: ['Limited advanced tools', 'Higher spreads on some pairs'],
    overallScore: 92
  },
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logo: '/api/placeholder/60/30',
    rating: 4.6,
    reviewCount: 8934,
    regulation: ['ASIC', 'CySEC'],
    minDeposit: 200,
    spread: '0.0 pips',
    leverage: '1:500',
    platforms: ['MT4', 'MT5', 'cTrader'],
    features: {
      copyTrading: false,
      socialTrading: false,
      cryptoTrading: true,
      stockTrading: true,
      demoAccount: true,
      islamicAccount: true,
      vpsHosting: true,
      apiAccess: true
    },
    pros: ['Raw spreads from 0.0 pips', 'Fast execution', 'Multiple platforms'],
    cons: ['Not beginner-friendly', 'Limited educational resources'],
    overallScore: 89
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logo: '/api/placeholder/60/30',
    rating: 4.7,
    reviewCount: 6782,
    regulation: ['ASIC', 'FCA', 'CySEC'],
    minDeposit: 200,
    spread: '0.6 pips',
    leverage: '1:200',
    platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
    features: {
      copyTrading: true,
      socialTrading: false,
      cryptoTrading: true,
      stockTrading: false,
      demoAccount: true,
      islamicAccount: true,
      vpsHosting: true,
      apiAccess: true
    },
    pros: ['Excellent execution speed', 'TradingView integration', 'Good customer support'],
    cons: ['Limited stock trading', 'Higher minimum deposit for some accounts'],
    overallScore: 90
  }
]

const comparisonFeatures = [
  { key: 'regulation', label: 'Regulation', type: 'array' },
  { key: 'minDeposit', label: 'Min Deposit', type: 'currency' },
  { key: 'spread', label: 'Typical Spread', type: 'text' },
  { key: 'leverage', label: 'Max Leverage', type: 'text' },
  { key: 'platforms', label: 'Platforms', type: 'array' },
  { key: 'copyTrading', label: 'Copy Trading', type: 'boolean' },
  { key: 'socialTrading', label: 'Social Trading', type: 'boolean' },
  { key: 'cryptoTrading', label: 'Crypto Trading', type: 'boolean' },
  { key: 'demoAccount', label: 'Demo Account', type: 'boolean' },
  { key: 'islamicAccount', label: 'Islamic Account', type: 'boolean' },
  { key: 'vpsHosting', label: 'VPS Hosting', type: 'boolean' },
  { key: 'apiAccess', label: 'API Access', type: 'boolean' }
]

export default function BrokerComparisonPreview() {
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>(['etoro', 'ic-markets', 'pepperstone'])

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

  const renderFeatureValue = (broker: BrokerData, feature: any): React.ReactNode => {
    const value = feature.key === 'regulation' || feature.key === 'platforms' 
      ? broker[feature.key as keyof BrokerData] 
      : feature.key.includes('.') 
        ? broker.features[feature.key]
        : broker[feature.key as keyof BrokerData]

    switch (feature.type) {
      case 'boolean':
        return value ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )
      case 'array':
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {String(item)}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )
      case 'currency':
        return `$${typeof value === 'number' ? value.toLocaleString() : String(value || 0)}`
      default:
        return typeof value === 'object' && value !== null 
          ? <span className="text-gray-500">-</span>
          : String(value || '') || <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Intelligent Comparison</span>
          </div>
          
          <h2 className="heading-lg text-gray-900 mb-6">
            Compare Brokers
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Side by Side</span>
          </h2>
          
          <p className="body-lg text-gray-600 max-w-3xl mx-auto">
            Make informed decisions with our comprehensive broker comparison tool. 
            Analyze features, costs, and ratings to find your perfect trading partner.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-surface rounded-3xl p-8 mb-12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-6 px-4 font-semibold text-gray-900">Features</th>
                  {sampleBrokers.map((broker) => (
                    <th key={broker.id} className="text-center py-6 px-4 min-w-[200px]">
                      <div className="flex flex-col items-center space-y-3">
                        {/* Logo placeholder */}
                        <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">Logo</span>
                        </div>
                        
                        {/* Broker name */}
                        <h3 className="font-bold text-lg text-gray-900">{broker.name}</h3>
                        
                        {/* Rating */}
                        <div className="flex flex-col items-center space-y-1">
                          {renderStars(broker.rating)}
                          <span className="text-sm text-gray-600">
                            {broker.rating} ({broker.reviewCount.toLocaleString()} reviews)
                          </span>
                        </div>

                        {/* Overall Score */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(broker.overallScore)}`}>
                          {broker.overallScore}/100
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Feature Rows */}
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.key} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {feature.label}
                    </td>
                    {sampleBrokers.map((broker) => (
                      <td key={broker.id} className="py-4 px-4 text-center">
                        {renderFeatureValue(broker, feature)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {sampleBrokers.map((broker, index) => (
            <div
              key={broker.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover-lift animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{broker.name}</h3>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(broker.overallScore)}`}>
                  Overall Score: {broker.overallScore}/100
                </div>
              </div>

              <div className="space-y-4">
                {/* Pros */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Pros</span>
                  </h4>
                  <ul className="space-y-1">
                    {broker.pros.map((pro, proIndex) => (
                      <li key={proIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Cons</span>
                  </h4>
                  <ul className="space-y-1">
                    {broker.cons.map((con, conIndex) => (
                      <li key={conIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-2 mt-6">
                <Button variant="outline" size="sm" className="flex-1">
                  <Link href={`/brokers/${broker.id}`}>Full Review</Link>
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href={`/brokers/${broker.id}/visit`}>Visit Site</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="glass-surface rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="heading-sm text-gray-900 mb-4">
              Ready to Compare More Brokers?
            </h3>
            <p className="body-md text-gray-600 mb-6">
              Use our advanced comparison tool to analyze dozens of brokers across hundreds of features.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-modern">
              <Link href="/compare" className="flex items-center space-x-2">
                <span>Start Full Comparison</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}