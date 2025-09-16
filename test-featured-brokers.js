const fs = require('fs');
const { execSync } = require('child_process');

class FeaturedBrokersTester {
  constructor() {
    this.testResults = {
      component: 'FeaturedBrokers',
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        successRate: '0%'
      },
      performance: {},
      issues: [],
      recommendations: []
    };
  }

  loadTestData() {
    try {
      const testData = JSON.parse(fs.readFileSync('test-broker-data.json', 'utf8'));
      return testData.brokers;
    } catch (error) {
      console.error('❌ Error loading test data:', error.message);
      return [];
    }
  }

  testDataStructureCompatibility() {
    const test = {
      name: 'Data Structure Compatibility',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const featuredBrokers = testData.filter(broker => broker.featured_status);

      // Test data structure compatibility
      const requiredFields = [
        'id', 'name', 'logo_url', 'rating', 'review_count', 'description',
        'features', 'regulations', 'min_deposit', 'spread', 'affiliate_link'
      ];

      const fieldMapping = {
        'logo': 'logo_url',
        'reviewCount': 'review_count',
        'regulation': 'regulations',
        'minDeposit': 'min_deposit',
        'spread': 'spread',
        'affiliateLink': 'affiliate_link'
      };

      test.details.featuredBrokersCount = featuredBrokers.length;
      test.details.requiredFields = requiredFields;
      test.details.fieldMapping = fieldMapping;

      // Check if all required fields exist
      const missingFields = [];
      requiredFields.forEach(field => {
        const sampleBroker = featuredBrokers[0];
        if (!sampleBroker || sampleBroker[field] === undefined) {
          missingFields.push(field);
        }
      });

      test.details.missingFields = missingFields;

      if (missingFields.length === 0) {
        test.status = 'passed';
        test.details.message = 'All required fields are present in test data';
      } else {
        test.status = 'failed';
        test.details.message = `Missing required fields: ${missingFields.join(', ')}`;
      }

      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;
    }

    this.testResults.tests.push(test);
    return test.status === 'passed';
  }

  testComponentRendering() {
    const test = {
      name: 'Component Rendering Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const featuredBrokers = testData.filter(broker => broker.featured_status);

      // Create a test component file
      const testComponent = this.createTestComponent(featuredBrokers);
      fs.writeFileSync('test-featured-brokers-component.tsx', testComponent);

      // Test TypeScript compilation
      try {
        execSync('npx tsc --noEmit test-featured-brokers-component.tsx', { stdio: 'pipe' });
        test.details.compilation = 'success';
      } catch (error) {
        test.details.compilation = 'failed';
        test.details.compilationErrors = error.message;
      }

      test.details.brokersTested = featuredBrokers.length;
      test.details.averageRating = (featuredBrokers.reduce((sum, b) => sum + b.rating, 0) / featuredBrokers.length).toFixed(2);
      test.details.totalReviews = featuredBrokers.reduce((sum, b) => sum + b.review_count, 0);

      test.status = test.details.compilation === 'success' ? 'passed' : 'failed';
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;
    }

    this.testResults.tests.push(test);
    return test.status === 'passed';
  }

  testResponsiveDesign() {
    const test = {
      name: 'Responsive Design Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const featuredBrokers = testData.filter(broker => broker.featured_status);

      // Test data compatibility with responsive design
      const testCases = [
        { screenSize: 'mobile', width: 375, expectedCols: 1 },
        { screenSize: 'tablet', width: 768, expectedCols: 2 },
        { screenSize: 'desktop', width: 1024, expectedCols: 3 }
      ];

      test.details.responsiveTests = testCases;

      // Check if data works with responsive grid
      const brokerCount = featuredBrokers.length;
      test.details.brokerCount = brokerCount;
      test.details.gridCompatibility = testCases.every(test =>
        brokerCount >= test.expectedCols
      );

      test.status = test.details.gridCompatibility ? 'passed' : 'failed';
      test.details.message = test.details.gridCompatibility
        ? 'Data works with all responsive breakpoints'
        : 'Insufficient data for some responsive breakpoints';

      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;
    }

    this.testResults.tests.push(test);
    return test.status === 'passed';
  }

  testDataValidation() {
    const test = {
      name: 'Data Validation',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const featuredBrokers = testData.filter(broker => broker.featured_status);

      // Validate broker data
      const validationIssues = [];
      featuredBrokers.forEach((broker, index) => {
        if (!broker.name || broker.name.trim() === '') {
          validationIssues.push(`Broker ${index + 1}: Missing name`);
        }
        if (!broker.rating || broker.rating < 0 || broker.rating > 5) {
          validationIssues.push(`Broker ${index + 1}: Invalid rating`);
        }
        if (!broker.review_count || broker.review_count < 0) {
          validationIssues.push(`Broker ${index + 1}: Invalid review count`);
        }
        if (!broker.regulations || broker.regulations.length === 0) {
          validationIssues.push(`Broker ${index + 1}: Missing regulations`);
        }
      });

      test.details.validationIssues = validationIssues;
      test.details.totalBrokers = featuredBrokers.length;
      test.details.issuesCount = validationIssues.length;

      test.status = validationIssues.length === 0 ? 'passed' : 'failed';
      test.details.message = validationIssues.length === 0
        ? 'All broker data is valid'
        : `Found ${validationIssues.length} validation issues`;

      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;
    }

    this.testResults.tests.push(test);
    return test.status === 'passed';
  }

  testPerformanceMetrics() {
    const test = {
      name: 'Performance Metrics',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const featuredBrokers = testData.filter(broker => broker.featured_status);

      // Measure data loading performance
      const startTime = Date.now();
      const dataSize = JSON.stringify(featuredBrokers).length;
      const loadTime = Date.now() - startTime;

      test.details.dataSize = `${(dataSize / 1024).toFixed(2)} KB`;
      test.details.loadTime = `${loadTime} ms`;
      test.details.brokerCount = featuredBrokers.length;

      // Performance thresholds
      const maxLoadTime = 100; // ms
      const maxSize = 50; // KB

      test.details.performanceThresholds = {
        maxLoadTime: `${maxLoadTime} ms`,
        maxSize: `${maxSize} KB`
      };

      const meetsLoadTime = loadTime <= maxLoadTime;
      const meetsSize = (dataSize / 1024) <= maxSize;

      test.status = meetsLoadTime && meetsSize ? 'passed' : 'failed';
      test.details.performanceScore = {
        loadTime: meetsLoadTime,
        size: meetsSize
      };

      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.endTime = Date.now();
      test.duration = test.endTime - test.startTime;
    }

    this.testResults.tests.push(test);
    return test.status === 'passed';
  }

  createTestComponent(brokers) {
    const brokerData = brokers.map(broker => ({
      id: broker.id,
      name: broker.name,
      logo: broker.logo_url || "/api/placeholder/120/60",
      rating: broker.rating,
      reviewCount: broker.review_count,
      description: broker.description,
      features: broker.features,
      regulation: broker.regulations,
      minDeposit: `$${broker.min_deposit}`,
      spread: broker.typical_spread ? `${broker.typical_spread} pips` : 'Variable',
      affiliateLink: broker.affiliate_link
    }));

    return `'use client'

import { Star, Shield, ExternalLink, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Broker {
  id: number
  name: string
  logo: string
  rating: number
  reviewCount: number
  description: string
  features: string[]
  regulation: string[]
  minDeposit: string
  spread: string
  affiliateLink: string
}

const featuredBrokers: Broker[] = ${JSON.stringify(brokerData, null, 2)}

export default function FeaturedBrokers() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={\`h-4 w-4 \${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}\`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Forex Brokers
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Compare and choose from our carefully selected list of regulated and trusted forex brokers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Broker Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">Logo</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{broker.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(broker.rating)}
                      <span className="text-sm text-gray-500">({broker.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Regulated</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{broker.description}</p>

              {/* Key Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {broker.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {broker.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{broker.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Trading Conditions */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Min Deposit</div>
                    <div className="text-sm font-medium">{broker.minDeposit}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Spread</div>
                    <div className="text-sm font-medium">{broker.spread}</div>
                  </div>
                </div>
              </div>

              {/* Regulation */}
              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-1">Regulation:</div>
                <div className="flex flex-wrap gap-1">
                  {broker.regulation.map((reg, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href={broker.affiliateLink} className="flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Broker
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Link href={broker.affiliateLink}>Read Review</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            <Link href="/brokers" className="flex items-center space-x-2">
              <span>View All Brokers</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}`;
  }

  calculateSummary() {
    const tests = this.testResults.tests;
    this.testResults.summary.total = tests.length;
    this.testResults.summary.passed = tests.filter(t => t.status === 'passed').length;
    this.testResults.summary.failed = tests.filter(t => t.status === 'failed').length;
    this.testResults.summary.successRate = `${((this.testResults.summary.passed / this.testResults.summary.total) * 100).toFixed(2)}%`;

    // Calculate performance metrics
    const totalDuration = tests.reduce((sum, test) => sum + (test.duration || 0), 0);
    this.testResults.performance.totalDuration = `${totalDuration} ms`;
    this.testResults.performance.averageDuration = `${Math.round(totalDuration / tests.length)} ms`;
  }

  generateRecommendations() {
    const failedTests = this.testResults.tests.filter(t => t.status === 'failed');

    failedTests.forEach(test => {
      switch (test.name) {
        case 'Data Structure Compatibility':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Data structure mismatch',
            recommendation: 'Update component interface to match database schema'
          });
          break;
        case 'Component Rendering':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Compilation errors',
            recommendation: 'Fix TypeScript errors in component'
          });
          break;
        case 'Data Validation':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Invalid data found',
            recommendation: 'Implement data validation before component rendering'
          });
          break;
        case 'Performance Metrics':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Performance concerns',
            recommendation: 'Optimize data loading and component rendering'
          });
          break;
      }
    });

    // Add general recommendations
    this.testResults.recommendations.push({
      priority: 'Low',
      issue: 'Test coverage',
      recommendation: 'Add more comprehensive unit tests for component'
    });
  }

  runTests() {
    console.log('🧪 Testing FeaturedBrokers component with imported data...');

    // Run all tests
    this.testDataStructureCompatibility();
    this.testComponentRendering();
    this.testResponsiveDesign();
    this.testDataValidation();
    this.testPerformanceMetrics();

    // Calculate summary
    this.calculateSummary();

    // Generate recommendations
    this.generateRecommendations();

    // Save results
    const results = {
      ...this.testResults,
      generatedAt: new Date().toISOString(),
      testDataInfo: {
        file: 'test-broker-data.json',
        totalBrokers: this.loadTestData().length,
        featuredBrokers: this.loadTestData().filter(b => b.featured_status).length
      }
    };

    fs.writeFileSync('featured-brokers-test-results.json', JSON.stringify(results, null, 2));

    // Display results
    this.displayResults();

    return results;
  }

  displayResults() {
    const summary = this.testResults.summary;

    console.log('\n🧪 FeaturedBrokers Component Test Results');
    console.log('=' * 50);

    console.log('\n📊 Summary:');
    console.log(`   Total Tests: ${summary.total}`);
    console.log(`   Passed: ${summary.passed}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Success Rate: ${summary.successRate}`);

    console.log('\n📋 Test Details:');
    this.testResults.tests.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      console.log(`   ${status} ${test.name} (${test.duration || 0}ms)`);
    });

    console.log('\n⚡ Performance:');
    console.log(`   Total Duration: ${this.testResults.performance.totalDuration}`);
    console.log(`   Average Duration: ${this.testResults.performance.averageDuration}`);

    if (this.testResults.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.testResults.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}: ${rec.recommendation}`);
      });
    }

    console.log('\n📄 Detailed results saved to: featured-brokers-test-results.json');
  }
}

// Run the FeaturedBrokers component tests
async function testFeaturedBrokersComponent() {
  const tester = new FeaturedBrokersTester();
  return tester.runTests();
}

// Execute the tests
testFeaturedBrokersComponent().then(results => {
  if (results.summary.successRate === '100%') {
    console.log('\n🎉 All FeaturedBrokers component tests passed!');
    console.log('🚀 Component is ready for production with imported data.');
  } else {
    console.log('\n⚠️  Some tests failed. Review recommendations and fix issues.');
  }
}).catch(error => {
  console.error('❌ FeaturedBrokers testing failed:', error.message);
});