'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Bell, Settings } from 'lucide-react';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import { Broker } from '@/lib/db/schema';
import Footer from '@/app/components/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      setError(null);

      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/brokers/search?q=${encodeURIComponent(query)}&limit=50`);

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();

          if (data.success) {
            setBrokers(data.data);
          } else {
            setError(data.error || 'Search failed');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [query]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-900">
                BrokerAnalysis.com
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <DatabaseBrokerSearch
                placeholder="Search brokers..."
                className="w-96"
              />
              <Link href="/brokers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Brokers
              </Link>
              <Link href="/market-news" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Market News
              </Link>
              <button className="text-gray-700 hover:text-blue-600 p-2 rounded-md">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-700 hover:text-blue-600 p-2 rounded-md">
                <Settings className="h-5 w-5" />
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <DatabaseBrokerSearch
              placeholder="Search brokers, features, regulations..."
              className="mb-4"
            />
            {query && (
              <p className="text-sm text-gray-600 text-center">
                Search results for "{query}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && !error && brokers.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Found {brokers.length} result{brokers.length !== 1 ? 's' : ''}
            </div>
            {brokers.map((broker) => (
              <div key={broker.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {broker.logo_url ? (
                      <img
                        src={broker.logo_url}
                        alt={broker.name}
                        className="w-16 h-16 object-contain flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-gray-600">
                          {broker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            <a href={`/brokers/${broker.slug}`} className="hover:text-blue-600">
                              {broker.name}
                            </a>
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(broker.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {broker.rating.toFixed(1)} ({broker.review_count} reviews)
                            </span>
                          </div>
                        </div>
                        {broker.featured_status && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Min Deposit:</span>
                          <span className="font-medium ml-1">
                            ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Spread:</span>
                          <span className="font-medium ml-1">{broker.spread_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Leverage:</span>
                          <span className="font-medium ml-1">1:{broker.max_leverage}</span>
                        </div>
                        {broker.established_year && (
                          <div>
                            <span className="text-gray-600">Since:</span>
                            <span className="font-medium ml-1">{broker.established_year}</span>
                          </div>
                        )}
                      </div>

                      {broker.short_description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {broker.short_description}
                        </p>
                      )}

                      <div className="flex space-x-3">
                        <a
                          href={`/brokers/${broker.slug}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Read Full Review →
                        </a>
                        {broker.affiliate_link && (
                          <a
                            href={broker.affiliate_link}
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Visit Broker Site →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && brokers.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any brokers matching "{query}". Try searching with different terms.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['ECN brokers', 'MT5 brokers', 'Low spread', 'Islamic accounts', 'Copy trading'].map((term) => (
                  <a
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for brokers</h3>
            <p className="text-gray-600 mb-6">
              Enter a search term above to find forex brokers, compare features, and read reviews.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Best forex brokers', 'Low deposit brokers', 'ECN brokers', 'MT4 brokers', 'Regulated brokers'].map((term) => (
                  <a
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}