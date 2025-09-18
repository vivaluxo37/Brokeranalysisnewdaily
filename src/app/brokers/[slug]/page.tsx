import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Bell, Settings } from 'lucide-react';
import { Broker } from '@/lib/db/schema';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';
import Footer from '@/app/components/Footer';

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
  }>;
  platforms: Array<{
    id: string;
    platform_name: string;
    platform_type: string;
    availability: boolean;
    description?: string;
  }>;
  paymentMethods: Array<{
    id: string;
    payment_method_name: string;
    payment_type: string;
    availability: boolean;
    processing_time?: string;
    fees?: string;
  }>;
  support: Array<{
    id: string;
    support_type: string;
    availability: boolean;
    response_time?: string;
    languages?: string[];
  }>;
  education: Array<{
    id: string;
    education_type: string;
    title: string;
    description?: string;
    difficulty_level?: string;
    availability: boolean;
  }>;
}

async function getBrokerData(slug: string): Promise<BrokerDetail | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/brokers/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch broker');
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching broker:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrokerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const broker = await getBrokerData(slug);

  if (!broker) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Broker Not Found</h1>
            <p className="mb-4">The broker you're looking for doesn't exist.</p>
            <Link href="/brokers" className="text-blue-600 hover:text-blue-800">
              Back to Brokers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const generateMetaTitle = () => {
    return `${broker.name} Review | BrokerAnalysis.com`;
  };

  const generateMetaDescription = () => {
    return `Read our comprehensive ${broker.name} review. Learn about spreads, regulations, platforms, and trading conditions. ${broker.short_description || ''}`;
  };

  const generateKeywords = () => {
    return `${broker.name} review, ${broker.name} forex broker, ${broker.name} trading, ${broker.name} spreads, ${broker.name} regulations, ${broker.name} minimum deposit`;
  };

  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Organization",
        "name": broker.name,
        "url": broker.website_url || `https://brokeranalysis.com/brokers/${broker.slug}`
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": broker.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Organization",
        "name": "BrokerAnalysis.com"
      },
      "datePublished": new Date().toISOString()
    };
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

      <MetaTags
        title={generateMetaTitle()}
        description={generateMetaDescription()}
        keywords={generateKeywords()}
        canonicalUrl={`https://brokeranalysis.com/brokers/${broker.slug}`}
        ogType="article"
      />

      <StructuredData type="Review" data={generateStructuredData()} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Broker Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                {broker.logo_url ? (
                  <img
                    src={broker.logo_url}
                    alt={broker.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {broker.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{broker.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(broker.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {broker.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">({broker.review_count} reviews)</span>
                  </div>
                  <p className="text-gray-700 mb-4">{broker.short_description}</p>
                  <div className="flex space-x-4">
                    {broker.affiliate_link && (
                      <a
                        href={broker.affiliate_link}
                        target="_blank"
                        rel="nofollow noreferrer"
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Visit {broker.name}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p>{broker.description || broker.short_description || 'No detailed description available.'}</p>
              </div>
            </div>

            {/* Trading Conditions */}
            {broker.tradingConditions && broker.tradingConditions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Conditions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrument</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Spread</th>
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
                            {condition.min_spread !== undefined ? condition.min_spread : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {condition.max_leverage ? `1:${condition.max_leverage}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {condition.commission_rate ? `${condition.commission_rate}%` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Account Types */}
            {broker.accountTypes && broker.accountTypes.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {broker.accountTypes.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{account.account_name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Min Deposit: ${account.min_deposit} {account.min_deposit_currency}</p>
                        <p>Spread Type: {account.spread_type || 'N/A'}</p>
                        <p>Leverage: {account.leverage ? `1:${account.leverage}` : 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regulations */}
            {broker.regulations && broker.regulations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulation</h2>
                <div className="space-y-3">
                  {broker.regulations.map((regulation) => (
                    <div key={regulation.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{regulation.regulatory_body}</p>
                        {regulation.license_number && (
                          <p className="text-sm text-gray-600">License: {regulation.license_number}</p>
                        )}
                        {regulation.jurisdiction && (
                          <p className="text-sm text-gray-600">Jurisdiction: {regulation.jurisdiction}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms */}
            {broker.platforms && broker.platforms.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Platforms</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {broker.platforms.map((platform) => (
                    <div key={platform.id} className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900">{platform.platform_name}</h3>
                        <p className="text-sm text-gray-600">{platform.platform_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {broker.features && broker.features.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {broker.features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${feature.availability ? 'bg-green-100' : 'bg-red-100'}`}>
                        <svg className={`w-4 h-4 ${feature.availability ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {feature.availability ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{feature.feature_name}</p>
                        {feature.category && (
                          <p className="text-sm text-gray-600">{feature.category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {broker.paymentMethods && broker.paymentMethods.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {broker.paymentMethods.map((method) => (
                    <div key={method.id} className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900">{method.payment_method_name}</h3>
                        <p className="text-sm text-gray-600">{method.payment_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support */}
            {broker.support && broker.support.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Support</h2>
                <div className="space-y-3">
                  {broker.support.map((support) => (
                    <div key={support.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{support.support_type}</p>
                        {support.response_time && (
                          <p className="text-sm text-gray-600">Response time: {support.response_time}</p>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${support.availability ? 'bg-green-100' : 'bg-red-100'}`}>
                        <svg className={`w-4 h-4 ${support.availability ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {support.availability ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {broker.education && broker.education.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {broker.education.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{edu.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{edu.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {edu.education_type}
                        </span>
                        {edu.difficulty_level && (
                          <span className="text-sm text-gray-600">{edu.difficulty_level}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Reviews</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Write a Review
                </button>
              </div>

              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{broker.rating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(broker.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {broker.review_count} reviews</p>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-8">{rating} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${Math.random() * 40 + 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {Math.floor(Math.random() * 40 + 5)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    author: "John D.",
                    rating: 5,
                    date: "2025-09-15",
                    content: "Excellent broker with great spreads and fast execution. Customer support is responsive and helpful.",
                    verified: true
                  },
                  {
                    id: 2,
                    author: "Sarah M.",
                    rating: 4,
                    date: "2025-09-10",
                    content: "Good trading platform with lots of features. The only downside is the withdrawal fees could be lower.",
                    verified: true
                  },
                  {
                    id: 3,
                    author: "Mike R.",
                    rating: 4,
                    date: "2025-09-05",
                    content: "Solid broker overall. Good range of instruments and competitive pricing.",
                    verified: false
                  }
                ].map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{review.author}</span>
                          {review.verified && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.content}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="text-gray-600 hover:text-blue-600 transition-colors">
                        Helpful (12)
                      </button>
                      <button className="text-gray-600 hover:text-blue-600 transition-colors">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Reviews */}
              <div className="text-center mt-8">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-medium">{broker.established_year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Deposit:</span>
                  <span className="font-medium">${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spread Type:</span>
                  <span className="font-medium">{broker.spread_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Leverage:</span>
                  <span className="font-medium">1:{broker.max_leverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Headquarters:</span>
                  <span className="font-medium">{broker.headquarters || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Quick Comparison */}
            <DatabaseBrokerComparison brokerSlugs={[broker.slug]} />

            {/* CTA */}
            {broker.affiliate_link && (
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to trade?</h3>
                <p className="text-gray-600 mb-4">Start trading with {broker.name} today</p>
                <a
                  href={broker.affiliate_link}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-block"
                >
                  Visit {broker.name}
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}