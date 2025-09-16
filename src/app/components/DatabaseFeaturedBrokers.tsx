'use client';

import { useState, useEffect } from 'react';
import { Broker } from '@/lib/db/schema';

interface DatabaseFeaturedBrokersProps {
  limit?: number;
  showDetails?: boolean;
}

export default function DatabaseFeaturedBrokers({
  limit = 5,
  showDetails = false
}: DatabaseFeaturedBrokersProps) {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBrokers = async () => {
      try {
        const response = await fetch(`/api/brokers/featured?limit=${limit}&includeDetails=${showDetails}`);

        if (!response.ok) {
          throw new Error('Failed to fetch featured brokers');
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

    fetchFeaturedBrokers();
  }, [limit, showDetails]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading featured brokers: {error}</p>
      </div>
    );
  }

  if (brokers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No featured brokers available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {brokers.map((broker) => (
        <BrokerCard key={broker.id} broker={broker} showDetails={showDetails} />
      ))}
    </div>
  );
}

interface BrokerCardProps {
  broker: Broker;
  showDetails?: boolean;
}

function BrokerCard({ broker, showDetails }: BrokerCardProps) {
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

    const emptyStars = 5 - Math.ceil(rating);
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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

        {/* Additional Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              {broker.headquarters && (
                <div>📍 {broker.headquarters}</div>
              )}
              {broker.company_size && (
                <div>👥 {broker.company_size}</div>
              )}
              {broker.total_assets && (
                <div>💰 Assets: ${broker.total_assets.toLocaleString()}</div>
              )}
              {broker.active_traders && (
                <div>📈 {broker.active_traders.toLocaleString()} traders</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}