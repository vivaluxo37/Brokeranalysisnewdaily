'use client'

import { Star, Shield, ExternalLink, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Broker {
  id: number
  name: string
  logo: string
  rating: number
  reviewCount: number
  description: string
  features: string[]
  regulation: string[]
  minDeposit: string
  spread: string
  affiliateLink: string
}

const featuredBrokers: Broker[] = [
  {
    id: 1,
    name: "eToro",
    logo: "/broker-logos/etoro.svg",
    rating: 4.8,
    reviewCount: 2847,
    description: "Social trading platform with copy trading features and 0% commission on stocks.",
    features: ["Copy Trading", "0% Commission", "Demo Account", "Mobile App"],
    regulation: ["FCA", "CySEC", "ASIC"],
    minDeposit: "$50",
    spread: "Variable",
    affiliateLink: "/brokers/etoro"
  },
  {
    id: 2,
    name: "IC Markets",
    logo: "/broker-logos/ic-markets.svg",
    rating: 4.7,
    reviewCount: 1956,
    description: "ECN broker with raw spreads from 0.0 pips and ultra-fast execution.",
    features: ["Raw Spreads", "ECN Trading", "VPS Hosting", "API Access"],
    regulation: ["ASIC", "CySEC", "FSA"],
    minDeposit: "$200",
    spread: "0.0 pips",
    affiliateLink: "/brokers/ic-markets"
  },
  {
    id: 3,
    name: "Pepperstone",
    logo: "/broker-logos/pepperstone.svg",
    rating: 4.6,
    reviewCount: 1634,
    description: "Award-winning forex broker with competitive spreads and fast execution.",
    features: [" Razor Account", "cTrader", "TradingView", "Education"],
    regulation: ["FCA", "ASIC", "CySEC", "BaFin"],
    minDeposit: "$0",
    spread: "0.0 pips",
    affiliateLink: "/brokers/pepperstone"
  },
  {
    id: 4,
    name: "XM Group",
    logo: "/broker-logos/xm-group.svg",
    rating: 4.5,
    reviewCount: 3124,
    description: "Multi-asset broker with tight spreads and excellent customer support.",
    features: ["No Requotes", "Negative Balance Protection", "Webinars", "Bonuses"],
    regulation: ["CySEC", "FCA", "ASIC"],
    minDeposit: "$5",
    spread: "0.0 pips",
    affiliateLink: "/brokers/xm-group"
  },
  {
    id: 5,
    name: "FP Markets",
    logo: "/broker-logos/fp-markets.svg",
    rating: 4.7,
    reviewCount: 1423,
    description: "Australian ECN broker with deep liquidity and advanced trading tools.",
    features: ["ECN Pricing", "Algorithmic Trading", "VPS", "Research Tools"],
    regulation: ["ASIC", "CySEC", "FSA"],
    minDeposit: "$100",
    spread: "0.0 pips",
    affiliateLink: "/brokers/fp-markets"
  },
  {
    id: 6,
    name: "FXTM",
    logo: "/broker-logos/fxtm.svg",
    rating: 4.4,
    reviewCount: 2891,
    description: "Global forex broker with educational resources and competitive spreads.",
    features: ["Cent Accounts", "Copy Trading", "Education", "Analytics"],
    regulation: ["FCA", "CySEC", "FSCA"],
    minDeposit: "$10",
    spread: "0.1 pips",
    affiliateLink: "/brokers/fxtm"
  }
]

export default function FeaturedBrokers() {
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
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Forex Brokers
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Compare and choose from our carefully selected list of regulated and trusted forex brokers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Broker Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={broker.logo}
                    alt={`${broker.name} logo`}
                    className="w-16 h-8 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{broker.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(broker.rating)}
                      <span className="text-sm text-gray-500">({broker.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Regulated</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{broker.description}</p>

              {/* Key Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {broker.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {broker.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{broker.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Trading Conditions */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Min Deposit</div>
                    <div className="text-sm font-medium">{broker.minDeposit}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Spread</div>
                    <div className="text-sm font-medium">{broker.spread}</div>
                  </div>
                </div>
              </div>

              {/* Regulation */}
              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-1">Regulation:</div>
                <div className="flex flex-wrap gap-1">
                  {broker.regulation.map((reg, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href={broker.affiliateLink} className="flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Broker
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Link href={broker.affiliateLink}>Read Review</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            <Link href="/brokers" className="flex items-center space-x-2">
              <span>View All Brokers</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}