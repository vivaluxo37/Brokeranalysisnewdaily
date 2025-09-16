'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import { Broker } from '@/lib/db/schema';
import MetaTags from '@/components/seo/MetaTags';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const slugsParam = searchParams.get('slugs');
  const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slugsParam) {
      const slugs = slugsParam.split(',').filter(Boolean);
      if (slugs.length >= 2) {
        loadBrokersForComparison(slugs);
      }
    }
  }, [slugsParam]);

  const loadBrokersForComparison = async (slugs: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/brokers/compare?slugs=${slugs.join(',')}`);

      if (!response.ok) {
        throw new Error('Failed to load brokers for comparison');
      }

      const data = await response.json();

      if (data.success) {
        setSelectedBrokers(data.data.brokers);
      } else {
        setError(data.error || 'Failed to load brokers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brokers');
    } finally {
      setLoading(false);
    }
  };

  
  const removeBroker = (brokerId: string) => {
    setSelectedBrokers(prev => prev.filter(b => b.id !== brokerId));
  };

  const getComparisonUrl = () => {
    const slugs = selectedBrokers.map(b => b.slug).join(',');
    return `/brokers/compare?slugs=${slugs}`;
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

  const getComparisonTitle = () => {
    if (selectedBrokers.length === 0) return 'Compare Forex Brokers | BrokerAnalysis.com';
    if (selectedBrokers.length === 2) {
      return `${selectedBrokers[0].name} vs ${selectedBrokers[1].name} Comparison | BrokerAnalysis.com`;
    }
    return `Compare ${selectedBrokers.length} Forex Brokers | BrokerAnalysis.com`;
  };

  const getComparisonDescription = () => {
    if (selectedBrokers.length === 0) {
      return 'Compare forex brokers side by side. Find the best broker for your trading needs with our comprehensive comparison tool.';
    }
    const brokerNames = selectedBrokers.map(b => b.name).join(', ');
    return `Side-by-side comparison of ${brokerNames}. Compare spreads, regulations, platforms, and features to find the best forex broker.`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags
        title={getComparisonTitle()}
        description={getComparisonDescription()}
        keywords="forex broker comparison, compare forex brokers, broker vs broker, forex trading comparison, ECN brokers comparison"
        canonicalUrl="https://brokeranalysis.com/brokers/compare"
        ogType="website"
      />
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Compare Forex Brokers</h1>
            <p className="text-xl text-blue-100 mb-8">
              Side-by-side comparison of forex brokers to help you make the best choice
            </p>
          </div>
        </div>
      </div>

      {/* Broker Selection */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Compare ({selectedBrokers.length}/4)
              </span>
              <div className="flex space-x-2">
                {selectedBrokers.map(broker => (
                  <div key={broker.id} className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                    {broker.logo_url ? (
                      <img
                        src={broker.logo_url}
                        alt={broker.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {broker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-blue-800">{broker.name}</span>
                    <button
                      onClick={() => removeBroker(broker.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedBrokers.length < 4 && (
                  <div className="w-24 h-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">Add</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedBrokers([])}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
              {selectedBrokers.length >= 2 && (
                <a
                  href={getComparisonUrl()}
                  className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Update Comparison
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Brokers to Compare</h2>
          <DatabaseBrokerSearch
            placeholder="Search brokers to add to comparison..."
          />
          <p className="text-sm text-gray-600 mt-2">
            Select up to 4 brokers to compare side by side
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comparison data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {!loading && !error && selectedBrokers.length >= 2 && (
        <DatabaseBrokerComparison brokerSlugs={selectedBrokers.map(b => b.slug)} />
      )}

      {/* Empty State */}
      {!loading && !error && selectedBrokers.length < 2 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Compare Forex Brokers</h3>
            <p className="text-lg text-gray-600 mb-8">
              Select 2-4 brokers to compare their features, trading conditions, and regulations side by side
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2-4</div>
                <div className="text-sm text-gray-600">Brokers to Compare</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Comparison Points</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
                <div className="text-sm text-gray-600">Live Data</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Comparisons */}
      {!loading && !error && selectedBrokers.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Popular Comparisons</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name1: 'Pepperstone', name2: 'IC Markets', category: 'ECN Brokers' },
                  { name1: 'XM', name2: 'FXTM', category: 'Beginner Friendly' },
                  { name1: 'IG', name2: 'CMC Markets', category: 'UK Regulated' },
                  { name1: 'OANDA', name2: 'Forex.com', category: 'US Brokers' },
                  { name1: 'Axi', name2: 'FP Markets', category: 'Low Spreads' },
                  { name1: 'Admirals', name2: 'HotForex', category: 'Islamic Accounts' }
                ].map((comparison, index) => (
                  <a
                    key={index}
                    href={`/brokers/compare?slugs=${comparison.name1.toLowerCase().replace(/\s+/g, '-')},${comparison.name2.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{comparison.category}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comparison.name1}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-medium text-gray-900">{comparison.name2}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}