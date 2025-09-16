'use client';

import { useState, useEffect } from 'react';
import { Broker } from '@/lib/db/schema';

interface DatabaseBrokerComparisonProps {
  brokerSlugs: string[];
}

interface ComparisonData {
  brokers: Array<{
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    rating: number;
    review_count: number;
    min_deposit: number;
    min_deposit_currency: string;
    spread_type: string;
    typical_spread?: number;
    max_leverage: number;
    established_year?: number;
    headquarters?: string;
    website_url?: string;
  }>;
  regulations: Array<{
    brokerId: string;
    brokerName: string;
    regulations: Array<{
      regulatory_body: string;
      license_number?: string;
      jurisdiction?: string;
      regulation_status: string;
    }>;
  }>;
  features: Array<{
    brokerId: string;
    brokerName: string;
    features: Array<{
      name: string;
      type: string;
      category?: string;
      available: boolean;
    }>;
  }>;
  tradingConditions: Array<{
    brokerId: string;
    brokerName: string;
    conditions: Array<{
      instrument_type: string;
      min_spread?: number;
      typical_spread?: number;
      max_leverage?: number;
      commission_rate?: number;
      commission_type: string;
    }>;
  }>;
  accountTypes: Array<{
    brokerId: string;
    brokerName: string;
    accounts: Array<{
      name: string;
      type?: string;
      min_deposit?: number;
      currency: string;
      commission?: number;
      leverage?: number;
      islamic: boolean;
      demo: boolean;
    }>;
  }>;
  platforms: Array<{
    brokerId: string;
    brokerName: string;
    platforms: Array<{
      name: string;
      type?: string;
      version?: string;
      web: boolean;
      mobile: boolean;
      desktop: boolean;
    }>;
  }>;
  paymentMethods: Array<{
    brokerId: string;
    brokerName: string;
    methods: Array<{
      name: string;
      currency?: string;
      deposit: boolean;
      withdrawal: boolean;
      processing_time?: string;
    }>;
  }>;
  support: Array<{
    brokerId: string;
    brokerName: string;
    support: Array<{
      type: string;
      contact_info?: string;
      availability?: string;
      response_time?: string;
    }>;
  }>;
  promotions: Array<{
    brokerId: string;
    brokerName: string;
    promotions: Array<{
      title: string;
      type?: string;
      bonus_amount?: number;
      currency: string;
      min_deposit?: number;
    }>;
  }>;
  featureMatrix: Array<{
    feature: string;
    [brokerId: string]: any;
  }>;
  scores: Array<{
    brokerId: string;
    brokerName: string;
    score: number;
    breakdown: {
      rating: number;
      regulations: number;
      features: number;
      platforms: number;
      support: number;
    };
  }>;
  comparisonSummary: {
    totalBrokers: number;
    averageRating: number;
    averageMinDeposit: number;
    totalRegulations: number;
    mostRegulated: string;
    highestRated: string;
    lowestDeposit: string;
  };
}

export default function DatabaseBrokerComparison({ brokerSlugs }: DatabaseBrokerComparisonProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const response = await fetch(`/api/brokers/compare?slugs=${brokerSlugs.join(',')}`);

        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }

        const data = await response.json();

        if (data.success) {
          setComparisonData(data.data);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comparison data');
      } finally {
        setLoading(false);
      }
    };

    if (brokerSlugs.length > 0) {
      fetchComparisonData();
    }
  }, [brokerSlugs]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Error loading comparison data: {error}</p>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">No comparison data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ComparisonHeader data={comparisonData} />
      <ComparisonScores data={comparisonData} />
      <ComparisonTable data={comparisonData} />
      <FeatureMatrix data={comparisonData} />
      <DetailedComparison data={comparisonData} />
    </div>
  );
}

function ComparisonHeader({ data }: { data: ComparisonData }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Broker Comparison
      </h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Brokers Compared:</span>
            <span className="text-blue-700 ml-2">{data.comparisonSummary.totalBrokers}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Average Rating:</span>
            <span className="text-blue-700 ml-2">{data.comparisonSummary.averageRating}/5</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Avg Min Deposit:</span>
            <span className="text-blue-700 ml-2">${data.comparisonSummary.averageMinDeposit.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Most Regulated:</span>
            <span className="text-blue-700 ml-2">{data.comparisonSummary.mostRegulated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonScores({ data }: { data: ComparisonData }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Scores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.scores.map((score) => (
          <div key={score.brokerId} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{score.brokerName}</h3>
              <div className="text-2xl font-bold text-blue-600">{score.score}/100</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">{score.breakdown.rating}/30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Regulations</span>
                <span className="font-medium">{score.breakdown.regulations}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Features</span>
                <span className="font-medium">{score.breakdown.features}/20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platforms</span>
                <span className="font-medium">{score.breakdown.platforms}/15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Support</span>
                <span className="font-medium">{score.breakdown.support}/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTable({ data }: { data: ComparisonData }) {
  const comparisonFeatures = [
    {
      label: 'Broker',
      type: 'broker',
    },
    {
      label: 'Rating',
      type: 'rating',
    },
    {
      label: 'Min Deposit',
      type: 'deposit',
    },
    {
      label: 'Spread Type',
      type: 'spread',
    },
    {
      label: 'Max Leverage',
      type: 'leverage',
    },
    {
      label: 'Established',
      type: 'established',
    },
    {
      label: 'Regulations',
      type: 'regulations',
    },
    {
      label: 'Platforms',
      type: 'platforms',
    },
    {
      label: 'Account Types',
      type: 'accounts',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Comparison</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {data.brokers.map((broker) => (
                  <th key={broker.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {broker.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonFeatures.map((feature) => (
                <tr key={feature.label} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.label}
                  </td>
                  {data.brokers.map((broker) => (
                    <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {getComparisonValue(feature.type, broker, data)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FeatureMatrix({ data }: { data: ComparisonData }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Comparison</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {data.brokers.map((broker) => (
                  <th key={broker.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {broker.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.featureMatrix.map((row) => (
                <tr key={row.feature} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.feature}
                  </td>
                  {data.brokers.map((broker) => {
                    const value = row[broker.id];
                    return (
                      <td key={broker.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {value ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailedComparison({ data }: { data: ComparisonData }) {
  return (
    <div className="space-y-8">
      {/* Regulations */}
      <Section title="Regulatory Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.regulations.map((brokerReg) => (
            <div key={brokerReg.brokerId} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{brokerReg.brokerName}</h3>
              <div className="space-y-1 text-sm">
                {brokerReg.regulations.length > 0 ? (
                  brokerReg.regulations.map((reg, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{reg.regulatory_body}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        reg.regulation_status === 'Regulated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.regulation_status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No regulatory information available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Trading Conditions */}
      <Section title="Trading Conditions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.tradingConditions.map((brokerCond) => (
            <div key={brokerCond.brokerId} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{brokerCond.brokerName}</h3>
              <div className="space-y-2 text-sm">
                {brokerCond.conditions.length > 0 ? (
                  brokerCond.conditions.map((cond, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                      <div className="font-medium text-gray-900">{cond.instrument_type}</div>
                      <div className="text-gray-600">
                        Spread: {cond.typical_spread || cond.min_spread || 'N/A'} pips
                      </div>
                      <div className="text-gray-600">
                        Leverage: 1:{cond.max_leverage || 'N/A'}
                      </div>
                      {cond.commission_rate && (
                        <div className="text-gray-600">
                          Commission: {cond.commission_rate} {cond.commission_type}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No trading conditions available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Account Types */}
      <Section title="Account Types">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.accountTypes.map((brokerAccounts) => (
            <div key={brokerAccounts.brokerId} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{brokerAccounts.brokerName}</h3>
              <div className="space-y-2 text-sm">
                {brokerAccounts.accounts.length > 0 ? (
                  brokerAccounts.accounts.map((account, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                      <div className="font-medium text-gray-900">{account.name}</div>
                      <div className="text-gray-600">
                        Min Deposit: ${account.min_deposit?.toLocaleString() || 'N/A'} {account.currency}
                      </div>
                      <div className="text-gray-600">
                        Leverage: {account.leverage ? `1:${account.leverage}` : 'N/A'}
                      </div>
                      <div className="flex space-x-4 mt-1">
                        {account.islamic && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Islamic
                          </span>
                        )}
                        {account.demo && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No account types available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function getComparisonValue(type: string, broker: any, data: ComparisonData) {
  switch (type) {
    case 'broker':
      return (
        <div className="flex flex-col items-center">
          {broker.logo_url && (
            <img src={broker.logo_url} alt={broker.name} className="w-8 h-8 object-contain mb-1" />
          )}
          <span className="font-medium">{broker.name}</span>
        </div>
      );
    case 'rating':
      return (
        <div className="flex flex-col items-center">
          <span className="font-medium">{broker.rating}/5</span>
          <span className="text-xs text-gray-500">({broker.review_count})</span>
        </div>
      );
    case 'deposit':
      return `$${broker.min_deposit.toLocaleString()}`;
    case 'spread':
      return broker.spread_type;
    case 'leverage':
      return `1:${broker.max_leverage}`;
    case 'established':
      return broker.established_year || 'N/A';
    case 'regulations':
      const regulations = data.regulations.find(r => r.brokerId === broker.id);
      return regulations?.regulations.length || 0;
    case 'platforms':
      const platforms = data.platforms.find(p => p.brokerId === broker.id);
      return platforms?.platforms.length || 0;
    case 'accounts':
      const accounts = data.accountTypes.find(a => a.brokerId === broker.id);
      return accounts?.accounts.length || 0;
    default:
      return 'N/A';
  }
}