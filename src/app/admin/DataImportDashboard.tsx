'use client';

import { useState, useEffect } from 'react';

interface ImportStats {
  totalBrokers: number;
  totalRegulations: number;
  totalFeatures: number;
  totalTradingConditions: number;
  totalAccountTypes: number;
  totalPlatforms: number;
  totalPaymentMethods: number;
  totalSupport: number;
  totalEducation: number;
  totalReviews: number;
  totalAffiliateLinks: number;
  totalPromotions: number;
}

interface ImportResult {
  success: boolean;
  processedFiles: number;
  importedBrokers: number;
  failedFiles: number;
  errors: string[];
  warnings: string[];
  stats: {
    regulations: number;
    features: number;
    tradingConditions: number;
    accountTypes: number;
    platforms: number;
    paymentMethods: number;
    support: number;
    education: number;
    reviews: number;
    affiliateLinks: number;
    promotions: number;
  };
  processingTime: number;
}

interface ImportConfig {
  sourceDirectory: string;
  filePatterns: string[];
  batchSize: number;
  maxRetries: number;
  enableLogging: boolean;
  skipExisting: boolean;
  validationStrict: boolean;
}

export default function DataImportDashboard() {
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<ImportConfig>({
    sourceDirectory: 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers',
    filePatterns: ['*-review.html', '*.js'],
    batchSize: 5,
    maxRetries: 3,
    enableLogging: true,
    skipExisting: true,
    validationStrict: false,
  });

  // Load initial stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/import/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const startImport = async () => {
    setImporting(true);
    setImportResult(null);
    setLogs([]);

    try {
      const response = await fetch('/api/admin/import/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();
      setImportResult(result);
      setLogs(result.logs || []);

      // Reload stats after import
      await loadStats();
    } catch (error) {
      setLogs([`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setImporting(false);
    }
  };

  const validateConfig = () => {
    return config.sourceDirectory && config.filePatterns.length > 0 && config.batchSize > 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Import Dashboard</h1>
        <p className="text-gray-600">
          Import broker data from scraped HTML and JavaScript files into the database
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Database Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard title="Brokers" value={stats.totalBrokers} color="blue" />
            <StatCard title="Regulations" value={stats.totalRegulations} color="green" />
            <StatCard title="Features" value={stats.totalFeatures} color="purple" />
            <StatCard title="Platforms" value={stats.totalPlatforms} color="yellow" />
            <StatCard title="Reviews" value={stats.totalReviews} color="red" />
            <StatCard title="Promotions" value={stats.totalPromotions} color="indigo" />
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Configuration</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Directory
              </label>
              <input
                type="text"
                value={config.sourceDirectory}
                onChange={(e) => setConfig(prev => ({ ...prev, sourceDirectory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.batchSize}
                onChange={(e) => setConfig(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Patterns (comma-separated)
              </label>
              <input
                type="text"
                value={config.filePatterns.join(', ')}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  filePatterns: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={config.maxRetries}
                onChange={(e) => setConfig(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableLogging"
                checked={config.enableLogging}
                onChange={(e) => setConfig(prev => ({ ...prev, enableLogging: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-900">
                Enable Logging
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="skipExisting"
                checked={config.skipExisting}
                onChange={(e) => setConfig(prev => ({ ...prev, skipExisting: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="skipExisting" className="ml-2 block text-sm text-gray-900">
                Skip Existing Brokers
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="validationStrict"
                checked={config.validationStrict}
                onChange={(e) => setConfig(prev => ({ ...prev, validationStrict: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="validationStrict" className="ml-2 block text-sm text-gray-900">
                Strict Validation
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={startImport}
              disabled={importing || !validateConfig()}
              className={`px-6 py-3 rounded-md font-medium ${
                importing || !validateConfig()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Results</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Processed Files"
                value={importResult.processedFiles}
                color={importResult.failedFiles === 0 ? 'green' : 'yellow'}
              />
              <StatCard
                title="Imported Brokers"
                value={importResult.importedBrokers}
                color="green"
              />
              <StatCard
                title="Failed Files"
                value={importResult.failedFiles}
                color={importResult.failedFiles > 0 ? 'red' : 'green'}
              />
              <StatCard
                title="Processing Time"
                value={`${importResult.processingTime}ms`}
                color="blue"
              />
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <StatCard
                title="Regulations"
                value={importResult.stats.regulations}
                color="green"
                small
              />
              <StatCard
                title="Features"
                value={importResult.stats.features}
                color="purple"
                small
              />
              <StatCard
                title="Trading Conditions"
                value={importResult.stats.tradingConditions}
                color="yellow"
                small
              />
              <StatCard
                title="Account Types"
                value={importResult.stats.accountTypes}
                color="indigo"
                small
              />
              <StatCard
                title="Platforms"
                value={importResult.stats.platforms}
                color="blue"
                small
              />
              <StatCard
                title="Payment Methods"
                value={importResult.stats.paymentMethods}
                color="red"
                small
              />
            </div>

            {/* Errors and Warnings */}
            {(importResult.errors.length > 0 || importResult.warnings.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {importResult.errors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-2">Errors</h3>
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 max-h-64 overflow-y-auto">
                      <ul className="space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-800">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {importResult.warnings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-yellow-900 mb-2">Warnings</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-h-64 overflow-y-auto">
                      <ul className="space-y-1">
                        {importResult.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-800">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Import Logs</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {logs.join('\n')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={loadStats}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Stats'}
        </button>
        <button
          onClick={() => {
            setImportResult(null);
            setLogs([]);
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Clear Results
        </button>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  small?: boolean;
}

function StatCard({ title, value, color, small = false }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 ${small ? '' : 'p-6'}`}>
      <div className={`text-sm font-medium ${small ? 'text-xs' : ''}`}>{title}</div>
      <div className={`text-2xl font-bold ${small ? 'text-lg' : ''}`}>{value}</div>
    </div>
  );
}