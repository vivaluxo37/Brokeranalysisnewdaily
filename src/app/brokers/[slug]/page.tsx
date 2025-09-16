'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Broker } from '@/lib/db/schema';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';

interface BrokerDetail extends Broker {
  regulations: Array<{
    id: string;
    regulatory_body: string;
    license_number?: string;
    jurisdiction?: string;
    regulation_status: string;
    verification_date?: string;
  }>;
  features: Array<{
    id: string;
    feature_name: string;
    feature_type: string;
    description?: string;
    availability: boolean;
    category?: string;
  }>;
  tradingConditions: Array<{
    id: string;
    instrument_type: string;
    min_spread?: number;
    typical_spread?: number;
    max_leverage?: number;
    commission_rate?: number;
    commission_type: string;
    min_trade_size?: number;
  }>;
  accountTypes: Array<{
    id: string;
    account_name: string;
    account_type?: string;
    min_deposit?: number;
    min_deposit_currency: string;
    spread_type?: string;
    commission?: number;
    leverage?: number;
    islamic_account: boolean;
    demo_available: boolean;
  }>;
  platforms: Array<{
    id: string;
    platform_name: string;
    platform_type?: string;
    version?: string;
    web_trading: boolean;
    mobile_trading: boolean;
    desktop_trading: boolean;
    download_url?: string;
  }>;
  paymentMethods: Array<{
    id: string;
    payment_method: string;
    currency?: string;
    min_amount?: number;
    max_amount?: number;
    processing_time?: string;
    deposit: boolean;
    withdrawal: boolean;
  }>;
  support: Array<{
    id: string;
    support_type: string;
    contact_info?: string;
    availability?: string;
    response_time?: string;
  }>;
  education: Array<{
    id: string;
    resource_type: string;
    title: string;
    description?: string;
    url?: string;
    difficulty_level?: string;
    duration?: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    review_text?: string;
    trading_experience?: number;
    account_type?: string;
    username?: string;
    helpful_count: number;
    created_at: string;
  }>;
  affiliateLinks: Array<{
    id: string;
    link_url: string;
    tracking_code?: string;
    commission_rate?: number;
    commission_type: string;
  }>;
  promotions: Array<{
    id: string;
    title: string;
    description?: string;
    promotion_type?: string;
    bonus_amount?: number;
    min_deposit?: number;
    terms_conditions?: string;
    start_date?: string;
    end_date?: string;
  }>;
  _count: {
    reviews: number;
    affiliateLinks: number;
    promotions: number;
  };
}

interface ReviewFormData {
  rating: number;
  reviewText: string;
  tradingExperience?: number;
  accountType?: string;
  username?: string;
  email?: string;
}

export default function BrokerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [broker, setBroker] = useState<BrokerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    reviewText: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const response = await fetch(`/api/brokers/${params.slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/brokers');
            return;
          }
          throw new Error('Failed to fetch broker');
        }

        const data = await response.json();

        if (data.success) {
          setBroker(data.data);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch broker');
      } finally {
        setLoading(false);
      }
    };

    fetchBroker();
  }, [params.slug, router]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const response = await fetch(`/api/brokers/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brokerId: broker?.id,
          ...reviewForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setShowReviewForm(false);
      setReviewForm({ rating: 5, reviewText: '' });

      // Refresh broker data to show new review
      const brokerResponse = await fetch(`/api/brokers/${params.slug}`);
      if (brokerResponse.ok) {
        const data = await brokerResponse.json();
        if (data.success) {
          setBroker(data.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !broker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Error loading broker: {error}</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const metaTitle = broker ? `${broker.name} Review | ${broker.rating}/5 Rating | BrokerAnalysis.com` : 'Forex Broker Review';
  const metaDescription = broker ?
    `Detailed review of ${broker.name}. Rating: ${broker.rating}/5. ${broker.description || 'Comprehensive broker analysis with trading conditions, regulations, and user reviews.'}` :
    'Comprehensive forex broker review with detailed analysis, trading conditions, and user ratings.';

  const brokerStructuredData = broker ? {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: broker.name,
    url: `https://brokeranalysis.com/brokers/${broker.slug}`,
    description: broker.description || `${broker.name} forex broker review and analysis`,
    image: broker.logo_url,
    telephone: broker.phone,
    address: broker.headquarters ? {
      '@type': 'PostalAddress',
      addressCountry: broker.headquarters
    } : undefined,
    aggregateRating: broker.rating ? {
      '@type': 'AggregateRating',
      ratingValue: broker.rating,
      reviewCount: broker.review_count || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    serviceType: 'Forex Trading',
    provider: {
      '@type': 'Organization',
      name: broker.name
    }
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {broker && (
        <>
          <MetaTags
            title={metaTitle}
            description={metaDescription}
            keywords={`${broker.name}, forex broker review, ${broker.regulations?.join(', ') || 'regulated brokers'}, forex trading, broker comparison`}
            canonicalUrl={`https://brokeranalysis.com/brokers/${broker.slug}`}
            ogImage={broker.logo_url || '/og-default.jpg'}
            ogType="article"
          />
          <StructuredData type="Broker" data={broker} />
        </>
      )}
      {/* Enhanced Header with Trust Signals */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {broker.logo_url && (
                <div className="relative">
                  <img
                    src={broker.logo_url}
                    alt={broker.name}
                    className="w-24 h-24 object-contain bg-white rounded-lg p-2 shadow-sm border"
                  />
                  {broker.status === 'active' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{broker.name}</h1>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(broker.rating)}
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {broker.rating.toFixed(1)}/5
                    </span>
                    <span className="text-gray-600">
                      ({broker._count.reviews} reviews)
                    </span>
                  </div>
                  {broker.featured_status && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-md">
                      ⭐ Featured Broker
                    </span>
                  )}
                  {broker.status === 'active' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
                      ✅ Active
                    </span>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Regulated</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Secure</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Since {broker.established_year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col space-y-3">
            <a
              href={`/brokers/compare?slugs=${broker.slug}`}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span>Compare Brokers</span>
            </a>
            {broker.affiliate_links.length > 0 && (
              <a
                href={broker.affiliate_links[0].link_url}
                target="_blank"
                rel="nofollow noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <span>Visit Official Site</span>
              </a>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-blue-800">Min Deposit</div>
            </div>
            <div className="text-xl font-bold text-blue-900">
              ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-green-800">Spread Type</div>
            </div>
            <div className="text-xl font-bold text-green-900">{broker.spread_type}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-purple-800">Max Leverage</div>
            </div>
            <div className="text-xl font-bold text-purple-900">1:{broker.max_leverage}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-orange-800">Established</div>
            </div>
            <div className="text-xl font-bold text-orange-900">{broker.established_year || 'N/A'}</div>
          </div>
        </div>

        {/* Regulatory Compliance Section */}
        {broker.regulations && broker.regulations.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900">Regulatory Compliance</h3>
                <p className="text-sm text-emerald-700">Licensed and regulated by multiple financial authorities</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {broker.regulations.slice(0, 6).map((reg, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-800">{reg.regulatory_body}</span>
                  {reg.license_number && (
                    <span className="text-xs text-gray-500">• {reg.license_number}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trading', label: 'Trading' },
            { id: 'accounts', label: 'Accounts' },
            { id: 'platforms', label: 'Platforms' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && <OverviewTab broker={broker} />}
          {activeTab === 'trading' && <TradingTab broker={broker} />}
          {activeTab === 'accounts' && <AccountsTab broker={broker} />}
          {activeTab === 'platforms' && <PlatformsTab broker={broker} />}
          {activeTab === 'reviews' && (
            <ReviewsTab
              broker={broker}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              handleSubmitReview={handleSubmitReview}
              submittingReview={submittingReview}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Promotions */}
          {broker.promotions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Promotions</h3>
              {broker.promotions.map((promo) => (
                <div key={promo.id} className="mb-4 last:mb-0">
                  <h4 className="font-medium text-gray-900">{promo.title}</h4>
                  {promo.bonus_amount && (
                    <p className="text-sm text-gray-600 mt-1">
                      Bonus: ${promo.bonus_amount.toLocaleString()} {promo.bonus_currency}
                    </p>
                  )}
                  {promo.min_deposit && (
                    <p className="text-sm text-gray-600">
                      Min Deposit: ${promo.min_deposit.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Regulations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Information</h3>
            <div className="space-y-2">
              {broker.regulations.length > 0 ? (
                broker.regulations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{reg.regulatory_body}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reg.regulation_status === 'Regulated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reg.regulation_status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No regulatory information available</p>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
            <div className="space-y-2">
              {broker.support.length > 0 ? (
                broker.support.map((sup) => (
                  <div key={sup.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{sup.support_type.replace('_', ' ')}</span>
                    {sup.contact_info && (
                      <span className="text-sm text-gray-600">{sup.contact_info}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No support information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ broker }: { broker: BrokerDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">About {broker.name}</h3>
        <p className="text-gray-700 leading-relaxed">{broker.description}</p>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {broker.features.slice(0, 6).map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{feature.feature_name}</span>
            </div>
          ))}
        </div>
      </div>

      {broker.headquarters && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h4>
          <div className="space-y-2 text-gray-700">
            <p><strong>Headquarters:</strong> {broker.headquarters}</p>
            {broker.established_year && (
              <p><strong>Founded:</strong> {broker.established_year}</p>
            )}
            {broker.company_size && (
              <p><strong>Company Size:</strong> {broker.company_size}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TradingTab({ broker }: { broker: BrokerDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trading Conditions</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrument</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Spread</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typical Spread</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Leverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {broker.tradingConditions.map((condition) => (
                <tr key={condition.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {condition.instrument_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condition.min_spread ? `${condition.min_spread} pips` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condition.typical_spread ? `${condition.typical_spread} pips` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condition.max_leverage ? `1:${condition.max_leverage}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condition.commission_rate ? `${condition.commission_rate} ${condition.commission_type}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {broker.paymentMethods.map((method) => (
            <div key={method.id} className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium text-gray-900">{method.payment_method}</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>Deposit: {method.deposit ? '✓' : '✗'}</div>
                <div>Withdrawal: {method.withdrawal ? '✓' : '✗'}</div>
                {method.currency && <div>Currency: {method.currency}</div>}
                {method.processing_time && <div>Processing: {method.processing_time}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountsTab({ broker }: { broker: BrokerDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Types</h3>
        <div className="space-y-4">
          {broker.accountTypes.map((account) => (
            <div key={account.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{account.account_name}</h4>
                <div className="flex space-x-2">
                  {account.islamic_account && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                      Islamic
                    </span>
                  )}
                  {account.demo_available && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Demo
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Min Deposit:</span>
                  <span className="ml-2 font-medium">
                    ${account.min_deposit?.toLocaleString() || 'N/A'} {account.min_deposit_currency}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Spread Type:</span>
                  <span className="ml-2 font-medium">{account.spread_type || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Commission:</span>
                  <span className="ml-2 font-medium">
                    {account.commission ? `${account.commission} lots` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Leverage:</span>
                  <span className="ml-2 font-medium">
                    {account.leverage ? `1:${account.leverage}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlatformsTab({ broker }: { broker: BrokerDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trading Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {broker.platforms.map((platform) => (
            <div key={platform.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{platform.platform_name}</h4>
                {platform.version && (
                  <span className="text-sm text-gray-600">v{platform.version}</span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    platform.web_trading ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Web Trading
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    platform.mobile_trading ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Mobile
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    platform.desktop_trading ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Desktop
                  </span>
                </div>
                {platform.download_url && (
                  <a
                    href={platform.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Download Platform →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {broker.education.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Educational Resources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {broker.education.slice(0, 4).map((edu) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{edu.title}</h5>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {edu.resource_type}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{edu.description}</p>
                )}
                {edu.url && (
                  <a
                    href={edu.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    View Resource →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({
  broker,
  showReviewForm,
  setShowReviewForm,
  reviewForm,
  setReviewForm,
  handleSubmitReview,
  submittingReview,
}: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= reviewForm.rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {reviewForm.rating}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience with this broker..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trading Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={reviewForm.tradingExperience || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, tradingExperience: parseInt(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <input
                  type="text"
                  value={reviewForm.accountType || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, accountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Standard, ECN, Islamic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username (optional)</label>
                <input
                  type="text"
                  value={reviewForm.username || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {broker.reviews.length > 0 ? (
          broker.reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-lg">
                        {star <= review.rating ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{review.username || 'Anonymous'}</h5>
                    <p className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                      {review.trading_experience && ` • ${review.trading_experience} years experience`}
                      {review.account_type && ` • ${review.account_type}`}
                    </p>
                  </div>
                </div>
              </div>
              {review.review_text && (
                <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to review this broker!</p>
          </div>
        )}
      </div>
    </div>
  );
}