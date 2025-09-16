'use client';

import { useState, useEffect } from 'react';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import DatabaseFeaturedBrokers from '@/app/components/DatabaseFeaturedBrokers';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import { Broker } from '@/lib/db/schema';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';

interface BrokersPageProps {
  searchParams: {
    q?: string;
    page?: string;
    sort?: string;
    filter?: string;
  };
}

export default function BrokersPage({ searchParams }: BrokersPageProps) {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonBrokers, setComparisonBrokers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Parse search params
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const sort = searchParams.sort || 'rating';
  const filter = searchParams.filter ? JSON.parse(searchParams.filter) : {};

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          sort,
        });

        if (query) {
          params.append('q', query);
        }

        if (Object.keys(filter).length > 0) {
          params.append('filter', JSON.stringify(filter));
        }

        const response = await fetch(`/api/brokers?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch brokers');
        }

        const data = await response.json();

        if (data.success) {
          setBrokers(data.data);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, [query, page, sort, filter]);

  
  const toggleComparison = (brokerSlug: string) => {
    setComparisonBrokers(prev => {
      if (prev.includes(brokerSlug)) {
        return prev.filter(slug => slug !== brokerSlug);
      } else if (prev.length < 4) {
        return [...prev, brokerSlug];
      }
      return prev;
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Forex Brokers Directory',
      description: 'Compare 100+ regulated forex brokers with unbiased ratings, detailed reviews, and comprehensive analysis.',
      url: 'https://brokeranalysis.com/brokers',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: brokers.map((broker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://brokeranalysis.com/brokers/${broker.slug}`
        }))
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags
        title="Compare 100+ Forex Brokers - Find Your Perfect Broker | BrokerAnalysis.com"
        description="Comprehensive directory of regulated forex brokers. Compare features, regulations, spreads, and user ratings to find the perfect broker for your trading needs."
        keywords="forex brokers, broker comparison, regulated brokers, forex trading, broker reviews, ECN brokers, STP brokers"
        ogType="website"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Compare Forex Brokers</h1>
            <p className="text-xl text-blue-100 mb-8">
              Find the perfect forex broker with our comprehensive comparison tools
            </p>

            {/* Search Integration */}
            <div className="max-w-2xl mx-auto">
              <DatabaseBrokerSearch
                placeholder="Search brokers by name, features, or regulations..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Bar */}
      {comparisonBrokers.length > 0 && (
        <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Compare {comparisonBrokers.length} broker{comparisonBrokers.length !== 1 ? 's' : ''}
                </span>
                <div className="flex space-x-2">
                  {comparisonBrokers.map(slug => (
                    <span
                      key={slug}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {slug}
                      <button
                        onClick={() => toggleComparison(slug)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setComparisonBrokers([])}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                {comparisonBrokers.length >= 2 && (
                  <a
                    href={`/brokers/compare?slugs=${comparisonBrokers.join(',')}`}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Compare Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                    <option value="min_deposit">Lowest Deposit</option>
                    <option value="established_year">Most Established</option>
                    <option value="review_count">Most Reviews</option>
                  </select>
                </div>

                {/* Regulation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regulation</label>
                  <div className="space-y-2">
                    {['FCA', 'CySEC', 'ASIC', 'FINMA'].map(regulator => (
                      <label key={regulator} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">{regulator}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deposit Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Deposit</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Any Amount</option>
                    <option value="100">Up to $100</option>
                    <option value="250">Up to $250</option>
                    <option value="500">Up to $500</option>
                    <option value="1000">Up to $1,000</option>
                  </select>
                </div>

                {/* Features Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="space-y-2">
                    {['Islamic Accounts', 'Demo Account', 'ECN Trading', 'API Trading', 'Copy Trading'].map(feature => (
                      <label key={feature} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trading Platform</label>
                  <div className="space-y-2">
                    {['MT4', 'MT5', 'cTrader', 'Web Platform', 'Mobile App'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Forex Brokers</h2>
                <p className="text-gray-600">
                  {brokers.length} broker{brokers.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading brokers: {error}</p>
              </div>
            )}

            {/* Brokers Grid */}
            {!loading && !error && brokers.length > 0 && (
              <div className={viewMode === 'grid' ?
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" :
                "space-y-4"
              }>
                {brokers.map((broker) => (
                  <div key={broker.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      {/* Logo and Name */}
                      <div className="flex items-center space-x-4 mb-4">
                        {broker.logo_url ? (
                          <img
                            src={broker.logo_url}
                            alt={broker.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-600">
                              {broker.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {broker.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(broker.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {broker.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleComparison(broker.slug)}
                          className={`p-2 rounded-md ${comparisonBrokers.includes(broker.slug) ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                          {broker.review_count} reviews
                        </div>
                        {broker.featured_status && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Key Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Min Deposit:</span>
                          <span className="font-medium">
                            ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spread:</span>
                          <span className="font-medium">{broker.spread_type}</span>
                        </div>
                        {broker.typical_spread && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Typical Spread:</span>
                            <span className="font-medium">{broker.typical_spread} pips</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max Leverage:</span>
                          <span className="font-medium">1:{broker.max_leverage}</span>
                        </div>
                        {broker.established_year && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Established:</span>
                            <span className="font-medium">{broker.established_year}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {broker.short_description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {broker.short_description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <a
                          href={`/brokers/${broker.slug}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Read Review
                        </a>
                        {broker.affiliate_link && (
                          <a
                            href={broker.affiliate_link}
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Visit Site
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && brokers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No brokers found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Brokers Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Brokers</h2>
          <DatabaseFeaturedBrokers limit={4} showDetails={true} />
        </div>
      </div>

      {/* Comparison Component */}
      {comparisonBrokers.length >= 2 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
            <DatabaseBrokerComparison brokerSlugs={comparisonBrokers} />
          </div>
        </div>
      )}
    </div>
  );
}