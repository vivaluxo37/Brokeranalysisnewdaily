'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Bell, Settings } from 'lucide-react';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import DatabaseFeaturedBrokers from '@/app/components/DatabaseFeaturedBrokers';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import { BrokerCard } from '@/app/components/BrokerCard';
import BrokersErrorBoundary from '@/app/components/BrokersErrorBoundary';
import { BrokerCardSkeleton } from '@/app/components/ui/broker-card-skeleton';
import { Broker } from '@/lib/db/schema';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

interface BrokersPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    filter?: string;
  }>;
}

export default function BrokersPage({ searchParams }: BrokersPageProps) {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonBrokers, setComparisonBrokers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBrokers, setTotalBrokers] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Parse search params
  const unwrappedParams = use(searchParams);
  const query = unwrappedParams.q || '';
  const page = parseInt(unwrappedParams.page || '1');
  const sort = unwrappedParams.sort || 'display_order';
  const filterString = unwrappedParams.filter || '{}';
  const brokersPerPage = 100; // Increased from 24 to show 100+ brokers initially

  // Memoize filter object to prevent infinite re-renders
  const filter = useMemo(() => {
    try {
      return filterString ? JSON.parse(filterString) : {};
    } catch {
      return {};
    }
  }, [filterString]);

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: brokersPerPage.toString(),
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
          // Only update brokers if loading first page or new data
          setBrokers(prev => page === 1 ? data.data : [...prev, ...data.data]);
          setTotalBrokers(data.total || data.data.length);
          setHasMore(data.data.length === brokersPerPage);
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
  }, [query, page, sort, filter, brokersPerPage]);

  // Reset page when filters change, but don't reset brokers here
  // The fetchBrokers effect will handle resetting brokers when page changes to 1
  useEffect(() => {
    if (page !== 1) {
      setCurrentPage(1);
    }
  }, [filter, sort, query]);

  
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

  const loadMoreBrokers = () => {
    setCurrentPage(prev => prev + 1);
  };

  const applyFilters = (newFilters: any) => {
    setCurrentPage(1);
    setBrokers([]);
    // Note: Filter logic needs to be properly implemented with API
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
      <Header />

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
                  <select
                    value={sort}
                    onChange={(e) => {
                      setCurrentPage(1);
                      window.location.href = `/brokers?${new URLSearchParams({
                        q: query,
                        page: '1',
                        sort: e.target.value,
                        filter: JSON.stringify(filter)
                      })}`;
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="display_order">Featured Order</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                    <option value="min_deposit">Lowest Deposit</option>
                    <option value="established_year">Most Established</option>
                    <option value="review_count">Most Reviews</option>
                    <option value="max_leverage">Highest Leverage</option>
                  </select>
                </div>

                {/* Regulation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regulation</label>
                  <div className="space-y-2">
                    {['FCA', 'CySEC', 'ASIC', 'FINMA', 'FSCA', 'SEC', 'DFS'].map(regulator => (
                      <label key={regulator} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilter = { ...filter, regulation: e.target.checked ? regulator : undefined };
                            applyFilters(newFilter);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{regulator}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deposit Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Deposit</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const newFilter = { ...filter, min_deposit: e.target.value || undefined };
                      applyFilters(newFilter);
                    }}
                  >
                    <option value="">Any Amount</option>
                    <option value="1">No Minimum</option>
                    <option value="50">Up to $50</option>
                    <option value="100">Up to $100</option>
                    <option value="250">Up to $250</option>
                    <option value="500">Up to $500</option>
                    <option value="1000">Up to $1,000</option>
                    <option value="5000">Up to $5,000</option>
                  </select>
                </div>

                {/* Account Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Types</label>
                  <div className="space-y-2">
                    {['Standard', 'ECN', 'STP', 'Islamic', 'VIP', 'Cent'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilter = { ...filter, account_type: e.target.checked ? type : undefined };
                            applyFilters(newFilter);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="space-y-2">
                    {['Islamic Accounts', 'Demo Account', 'ECN Trading', 'API Trading', 'Copy Trading', 'Scalping Allowed', 'Hedging Allowed'].map(feature => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilter = { ...filter, features: e.target.checked ? feature : undefined };
                            applyFilters(newFilter);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trading Platform</label>
                  <div className="space-y-2">
                    {['MT4', 'MT5', 'cTrader', 'Web Platform', 'Mobile App', 'TradingView'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilter = { ...filter, platform: e.target.checked ? platform : undefined };
                            applyFilters(newFilter);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Spread Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spread Type</label>
                  <div className="space-y-2">
                    {['Fixed', 'Variable', 'Raw', 'ECN', 'STP'].map(spread => (
                      <label key={spread} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilter = { ...filter, spread_type: e.target.checked ? spread : undefined };
                            applyFilters(newFilter);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{spread}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Leverage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Leverage</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const newFilter = { ...filter, max_leverage: e.target.value || undefined };
                      applyFilters(newFilter);
                    }}
                  >
                    <option value="">Any Leverage</option>
                    <option value="100">Up to 1:100</option>
                    <option value="200">Up to 1:200</option>
                    <option value="500">Up to 1:500</option>
                    <option value="1000">Up to 1:1000</option>
                    <option value="2000">Up to 1:2000</option>
                    <option value="3000">Up to 1:3000</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <div>
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      window.location.href = '/brokers';
                    }}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <BrokersErrorBoundary>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Forex Brokers</h2>
                  <p className="text-gray-600">
                    Showing {brokers.length} of {totalBrokers || '100+'} broker{totalBrokers === 1 ? '' : 's'} found
                    {query && <span> for "{query}"</span>}
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
                <div className={viewMode === 'grid' ?
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" :
                  "space-y-4"
                }>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <BrokerCardSkeleton key={index} viewMode={viewMode} />
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
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" :
                  "space-y-4"
                }>
                  {brokers.map((broker) => (
                    <BrokerCard
                      key={broker.id}
                      broker={broker}
                      viewMode={viewMode}
                      isInComparison={comparisonBrokers.includes(broker.slug)}
                      onToggleComparison={toggleComparison}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && !error && brokers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No brokers found matching your criteria.</p>
                </div>
              )}

              {/* Load More Button */}
              {!loading && !error && brokers.length > 0 && hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreBrokers}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More Brokers'}
                  </button>
                </div>
              )}
            </BrokersErrorBoundary>
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
      <Footer />
    </div>
  );
}