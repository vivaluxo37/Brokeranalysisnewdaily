'use client'

import Header from './components/Header'
import Hero from './components/Hero'
import ServiceHighlights from './components/ServiceHighlights'
import DatabaseFeaturedBrokers from './components/DatabaseFeaturedBrokers'
import DatabaseBrokerSearch from './components/DatabaseBrokerSearch'
import BrokerComparisonPreview from './components/BrokerComparisonPreview'
import TrustSection from './components/TrustSection'
import LatestReviews from './components/LatestReviews'
import EducationalContent from './components/EducationalContent'
import MarketNews from './components/MarketNews'
import Footer from './components/Footer'
import MetaTags from '@/components/seo/MetaTags'
import StructuredData from '@/components/seo/StructuredData'

export default function ModernHomepage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BrokerAnalysis.com',
      url: 'https://brokeranalysis.com',
      description: 'Compare 100+ regulated forex brokers with AI-powered analysis, unbiased ratings and comprehensive reviews',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://brokeranalysis.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BrokerAnalysis.com',
      url: 'https://brokeranalysis.com',
      logo: 'https://brokeranalysis.com/logo.png',
      description: 'Advanced forex broker comparison and analysis platform with AI-powered matching and safety analysis',
      sameAs: [
        'https://twitter.com/brokeranalysis',
        'https://linkedin.com/company/brokeranalysis',
        'https://facebook.com/brokeranalysis'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Forex Broker Analysis',
      provider: {
        '@type': 'Organization',
        name: 'BrokerAnalysis.com'
      },
      description: 'Comprehensive forex broker safety analysis, comparison tools, and trading education',
      serviceType: 'Financial Analysis',
      areaServed: 'Worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MetaTags
        title="BrokerAnalysis.com - Find Your Perfect Forex Broker in 2025"
        description="Compare 100+ regulated forex brokers with AI-powered analysis. Get unbiased ratings, safety scores, and expert reviews. Find your ideal trading partner in minutes."
        keywords="forex brokers 2025, broker comparison, regulated brokers, forex trading, broker reviews, AI broker matching, trading platform analysis, forex safety"
        structuredData={structuredData}
      />
      
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <Hero />

        {/* Service Highlights */}
        <ServiceHighlights />

        {/* Enhanced Search Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-lg text-gray-900 mb-6">
                Find Your Perfect
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Forex Broker</span>
              </h2>
              <p className="body-lg text-gray-600 max-w-2xl mx-auto">
                Search our comprehensive database of 100+ regulated brokers with advanced filtering and AI-powered recommendations
              </p>
            </div>
            
            <div className="glass-surface rounded-3xl p-8 mb-8">
              <DatabaseBrokerSearch
                placeholder="Search brokers by name, features, regulations, or trading conditions..."
                className="mb-8"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover-lift">
                  <div className="heading-sm text-blue-600 mb-2">100+</div>
                  <div className="body-sm text-gray-600">Regulated Brokers</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover-lift">
                  <div className="heading-sm text-green-600 mb-2">50+</div>
                  <div className="body-sm text-gray-600">Countries Covered</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover-lift">
                  <div className="heading-sm text-purple-600 mb-2">50K+</div>
                  <div className="body-sm text-gray-600">User Reviews</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover-lift">
                  <div className="heading-sm text-orange-600 mb-2">24/7</div>
                  <div className="body-sm text-gray-600">Expert Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Brokers Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-blue-700">Top Rated Brokers</span>
              </div>
              
              <h2 className="heading-lg text-gray-900 mb-6">
                Featured
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Forex Brokers</span>
              </h2>
              
              <p className="body-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked brokers based on regulation, trading conditions, user feedback, and our comprehensive safety analysis
              </p>
            </div>
            
            <DatabaseFeaturedBrokers
              limit={6}
              showDetails={true}
            />
            
            <div className="text-center mt-12">
              <a
                href="/brokers"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl btn-modern"
              >
                View All Brokers
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Broker Comparison Preview */}
        <BrokerComparisonPreview />

        {/* Trust & Social Proof */}
        <TrustSection />

        {/* Latest Reviews */}
        <LatestReviews />

        {/* Educational Content */}
        <EducationalContent />

        {/* Market News */}
        <MarketNews />

        {/* About Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-surface rounded-3xl p-12">
              <h2 className="heading-lg text-gray-900 mb-6">
                Why
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> BrokerAnalysis</span>
                ?
              </h2>
              
              <p className="body-lg text-gray-600 mb-8 leading-relaxed">
                In a world where choosing the wrong broker can cost you thousands, we provide the transparency and insights you need to make informed decisions. Our mission is to democratize access to professional-grade broker analysis, making it easy for every trader to find safe, reliable, and cost-effective trading partners.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-sm text-gray-600">Unbiased analysis with no hidden agendas</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Safety</h3>
                  <p className="text-sm text-gray-600">Rigorous safety checks and regulatory monitoring</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-sm text-gray-600">AI-powered matching and cutting-edge analysis</p>
                </div>
              </div>

              <a
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}