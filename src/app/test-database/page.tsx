'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Bell, Settings } from 'lucide-react';
import DatabaseBrokerSearch from '@/app/components/DatabaseBrokerSearch';
import DatabaseFeaturedBrokers from '@/app/components/DatabaseFeaturedBrokers';
import DatabaseBrokerComparison from '@/app/components/DatabaseBrokerComparison';
import { Broker } from '@/lib/db/schema';
import Footer from '@/app/components/Footer';

export default function TestDatabasePage() {
  const [testResults, setTestResults] = useState<{[key: string]: {success: boolean, message: string, data?: any}}>({});
  const [loading, setLoading] = useState(false);
  const [testBrokers, setTestBrokers] = useState<Broker[]>([]);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { success: false, message: 'Running...' }
    }));

    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, message: 'Test passed', data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  };

  const testDatabaseConnection = async () => {
    const response = await fetch('/api/brokers?limit=1');
    if (!response.ok) throw new Error('Database connection failed');
    const data = await response.json();
    if (!data.success) throw new Error('Database query failed');
    return data.data;
  };

  const testBrokerSearch = async () => {
    const response = await fetch('/api/brokers/search?q=test&limit=5');
    if (!response.ok) throw new Error('Search API failed');
    const data = await response.json();
    if (!data.success) throw new Error('Search query failed');
    return data.data;
  };

  const testFeaturedBrokers = async () => {
    const response = await fetch('/api/brokers/featured?limit=3');
    if (!response.ok) throw new Error('Featured brokers API failed');
    const data = await response.json();
    if (!data.success) throw new Error('Featured brokers query failed');
    return data.data;
  };

  const testBrokerComparison = async () => {
    // Get first two brokers for comparison
    const brokersResponse = await fetch('/api/brokers?limit=2');
    if (!brokersResponse.ok) throw new Error('Could not fetch brokers for comparison');
    const brokersData = await brokersResponse.json();
    if (!brokersData.success || brokersData.data.length < 2) throw new Error('Not enough brokers for comparison');

    const slugs = brokersData.data.slice(0, 2).map((b: Broker) => b.slug);
    const comparisonResponse = await fetch(`/api/brokers/compare?slugs=${slugs.join(',')}`);
    if (!comparisonResponse.ok) throw new Error('Comparison API failed');
    const comparisonData = await comparisonResponse.json();
    if (!comparisonData.success) throw new Error('Comparison query failed');
    return comparisonData.data;
  };

  const testSingleBroker = async () => {
    // Get first broker
    const brokersResponse = await fetch('/api/brokers?limit=1');
    if (!brokersResponse.ok) throw new Error('Could not fetch broker');
    const brokersData = await brokersResponse.json();
    if (!brokersData.success || brokersData.data.length === 0) throw new Error('No brokers found');

    const slug = brokersData.data[0].slug;
    const brokerResponse = await fetch(`/api/brokers/${slug}`);
    if (!brokerResponse.ok) throw new Error('Single broker API failed');
    const brokerData = await brokerResponse.json();
    if (!brokerData.success) throw new Error('Single broker query failed');
    return brokerData.data;
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});

    await Promise.all([
      runTest('Database Connection', testDatabaseConnection),
      runTest('Broker Search API', testBrokerSearch),
      runTest('Featured Brokers API', testFeaturedBrokers),
      runTest('Broker Comparison API', testBrokerComparison),
      runTest('Single Broker API', testSingleBroker),
    ]);

    // Load test brokers for component testing
    try {
      const response = await fetch('/api/brokers?limit=4');
      const data = await response.json();
      if (data.success) {
        setTestBrokers(data.data);
      }
    } catch (error) {
      console.error('Failed to load test brokers:', error);
    }

    setLoading(false);
  };

  const renderTestResult = (testName: string) => {
    const result = testResults[testName];
    if (!result) return null;

    return (
      <div className={`p-4 rounded-lg ${
        result.success
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{testName}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            result.success
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {result.success ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
          {result.message}
        </p>
        {result.data && (
          <details className="mt-2">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
              View Response Data
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
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

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Integration Test</h1>
            <p className="text-lg text-gray-600 mb-8">
              Test all database-connected components and APIs
            </p>
            <button
              onClick={runAllTests}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {Object.keys(testResults).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTestResult('Database Connection')}
              {renderTestResult('Broker Search API')}
              {renderTestResult('Featured Brokers API')}
              {renderTestResult('Broker Comparison API')}
              {renderTestResult('Single Broker API')}
            </div>
          </div>
        )}

        {/* Component Tests */}
        <div className="space-y-12">
          {/* Search Component Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Component Test</h2>
            <DatabaseBrokerSearch
              placeholder="Test search functionality..."
            />
            <p className="text-sm text-gray-600 mt-2">
              Test the search component by typing broker names, features, or regulations
            </p>
          </div>

          {/* Featured Brokers Component Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Brokers Component Test</h2>
            <DatabaseFeaturedBrokers limit={3} showDetails={true} />
            <p className="text-sm text-gray-600 mt-2">
              Featured brokers loaded from database
            </p>
          </div>

          {/* Comparison Component Test */}
          {testBrokers.length >= 2 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Broker Comparison Component Test</h2>
              <DatabaseBrokerComparison
                brokerSlugs={testBrokers.slice(0, Math.min(4, testBrokers.length)).map(b => b.slug)}
              />
              <p className="text-sm text-gray-600 mt-2">
                Comparison component using real database data
              </p>
            </div>
          )}

          {/* API Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Brokers API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers</p>
                <div className="text-xs text-gray-500">
                  • List brokers with pagination<br/>
                  • Filter by criteria<br/>
                  • Sort by various fields
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Search API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers/search</p>
                <div className="text-xs text-gray-500">
                  • Full-text search<br/>
                  • Search suggestions<br/>
                  • Advanced filtering
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Featured API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers/featured</p>
                <div className="text-xs text-gray-500">
                  • Featured brokers<br/>
                  • Customizable limit<br/>
                  • Detailed information
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Comparison API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers/compare</p>
                <div className="text-xs text-gray-500">
                  • Side-by-side comparison<br/>
                  • Scoring algorithm<br/>
                  • Feature matrix
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Single Broker API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers/[slug]</p>
                <div className="text-xs text-gray-500">
                  • Detailed broker info<br/>
                  • All related data<br/>
                  • Complete broker profile
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Reviews API</h3>
                <p className="text-sm text-gray-600 mb-2">/api/brokers/reviews</p>
                <div className="text-xs text-gray-500">
                  • User reviews<br/>
                  • Rating system<br/>
                  • Review moderation
                </div>
              </div>
            </div>
          </div>

          {/* Database Schema Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Schema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="font-medium text-blue-900 mb-2">Core Tables</h3>
                <div className="text-sm text-blue-700">
                  • brokers<br/>
                  • broker_regulations<br/>
                  • broker_features<br/>
                  • broker_trading_conditions
                </div>
              </div>
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-medium text-green-900 mb-2">Account & Platform</h3>
                <div className="text-sm text-green-700">
                  • broker_account_types<br/>
                  • broker_platforms<br/>
                  • broker_payment_methods<br/>
                  • broker_support
                </div>
              </div>
              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <h3 className="font-medium text-purple-900 mb-2">Content & Reviews</h3>
                <div className="text-sm text-purple-700">
                  • broker_education<br/>
                  • broker_reviews<br/>
                  • broker_affiliate_links<br/>
                  • broker_promotions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}