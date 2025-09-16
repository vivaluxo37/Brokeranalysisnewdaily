import Header from './components/Header'
import Hero from './components/Hero'
import DatabaseFeaturedBrokers from './components/DatabaseFeaturedBrokers'
import DatabaseBrokerSearch from './components/DatabaseBrokerSearch'
import LatestReviews from './components/LatestReviews'
import EducationalContent from './components/EducationalContent'
import MarketNews from './components/MarketNews'
import Footer from './components/Footer'
import MetaTags from '@/components/seo/MetaTags'
import StructuredData from '@/components/seo/StructuredData'

export default function Home() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BrokerAnalysis.com',
      url: 'https://brokeranalysis.com',
      description: 'Compare 100+ regulated forex brokers with unbiased ratings and detailed analysis',
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
      description: 'Comprehensive forex broker comparison and analysis platform'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MetaTags
        title="BrokerAnalysis.com - Compare 100+ Regulated Forex Brokers"
        description="Find and compare regulated forex brokers with unbiased ratings, detailed reviews, and comprehensive analysis. Make informed trading decisions."
        keywords="forex brokers, broker comparison, regulated brokers, forex trading, broker reviews, forex analysis"
        structuredData={structuredData}
      />
      <Header />
      <main>
        <Hero />

        {/* Enhanced Search Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Your Perfect Forex Broker
              </h2>
              <p className="text-lg text-gray-600">
                Search our comprehensive database of 100+ regulated brokers
              </p>
            </div>
            <DatabaseBrokerSearch
              placeholder="Search brokers by name, features, regulations, or trading conditions..."
              className="mb-8"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">100+</div>
                <div className="text-sm text-gray-600">Regulated Brokers</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Countries Covered</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-600">User Reviews</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">24/7</div>
                <div className="text-sm text-gray-600">Expert Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Database-Powered Featured Brokers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Forex Brokers
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked brokers based on regulation, trading conditions, and user feedback
              </p>
            </div>
            <DatabaseFeaturedBrokers
              limit={6}
              showDetails={true}
            />
            <div className="text-center mt-8">
              <a
                href="/brokers"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Brokers
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <LatestReviews />
        <EducationalContent />
        <MarketNews />
      </main>
      <Footer />
    </div>
  )
}
