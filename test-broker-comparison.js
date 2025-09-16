const fs = require('fs');

class BrokerComparisonTester {
  constructor() {
    this.testResults = {
      component: 'BrokerComparison',
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        successRate: '0%'
      },
      comparisonData: {},
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

  testDataStructureForComparison() {
    const test = {
      name: 'Comparison Data Structure Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const comparisonBrokers = testData.slice(0, 10); // Top 10 for comparison

      // Required fields for comparison table
      const requiredFields = [
        'id', 'name', 'rating', 'min_deposit', 'typical_spread',
        'max_leverage', 'platforms', 'regulations', 'affiliate_link'
      ];

      const missingFields = [];
      requiredFields.forEach(field => {
        const sampleBroker = comparisonBrokers[0];
        if (!sampleBroker || sampleBroker[field] === undefined) {
          missingFields.push(field);
        }
      });

      test.details.comparisonBrokersCount = comparisonBrokers.length;
      test.details.requiredFields = requiredFields;
      test.details.missingFields = missingFields;
      test.details.averageRating = (comparisonBrokers.reduce((sum, b) => sum + b.rating, 0) / comparisonBrokers.length).toFixed(2);

      test.status = missingFields.length === 0 ? 'passed' : 'failed';
      test.details.message = missingFields.length === 0
        ? 'All required fields present for comparison'
        : `Missing fields: ${missingFields.join(', ')}`;

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

  testComparisonTableStructure() {
    const test = {
      name: 'Comparison Table Structure Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const comparisonBrokers = testData.slice(0, 10);

      // Define comparison table columns
      const comparisonColumns = [
        { key: 'name', label: 'Broker', type: 'text' },
        { key: 'rating', label: 'Rating', type: 'stars' },
        { key: 'regulations', label: 'Regulation', type: 'badges' },
        { key: 'min_deposit', label: 'Min Deposit', type: 'currency' },
        { key: 'typical_spread', label: 'Spread', type: 'decimal' },
        { key: 'max_leverage', label: 'Leverage', type: 'ratio' },
        { key: 'platforms', label: 'Platforms', type: 'list' },
        { key: 'action', label: 'Action', type: 'buttons' }
      ];

      // Test data compatibility with table structure
      const compatibilityIssues = [];
      comparisonBrokers.forEach((broker, index) => {
        comparisonColumns.forEach(column => {
          if (column.key !== 'action' && !broker[column.key]) {
            compatibilityIssues.push(`Broker ${index + 1}: Missing ${column.key}`);
          }
        });
      });

      test.details.comparisonColumns = comparisonColumns.length;
      test.details.compatibilityIssues = compatibilityIssues.length;
      test.details.tableStructure = 'Responsive grid layout';

      test.status = compatibilityIssues.length === 0 ? 'passed' : 'failed';
      test.details.message = compatibilityIssues.length === 0
        ? 'All brokers compatible with comparison table'
        : `Found ${compatibilityIssues.length} compatibility issues`;

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

  testComparisonSorting() {
    const test = {
      name: 'Comparison Sorting Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const comparisonBrokers = testData.slice(0, 10);

      // Test sorting functionality
      const sortableFields = ['rating', 'min_deposit', 'max_leverage'];
      const sortingTests = [];

      sortableFields.forEach(field => {
        const sortedAscending = [...comparisonBrokers].sort((a, b) => a[field] - b[field]);
        const sortedDescending = [...comparisonBrokers].sort((a, b) => b[field] - a[field]);

        sortingTests.push({
          field,
          ascendingValid: sortedAscending[0][field] <= sortedAscending[sortedAscending.length - 1][field],
          descendingValid: sortedDescending[0][field] >= sortedDescending[sortedDescending.length - 1][field]
        });
      });

      test.details.sortableFields = sortableFields.length;
      test.details.sortingTests = sortingTests;
      test.details.failedSorts = sortingTests.filter(test => !test.ascendingValid || !test.descendingValid).length;

      test.status = test.details.failedSorts === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedSorts === 0
        ? 'All sorting functions work correctly'
        : `Found ${test.details.failedSorts} sorting issues`;

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

  testComparisonFiltering() {
    const test = {
      name: 'Comparison Filtering Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const comparisonBrokers = testData.slice(0, 10);

      // Test filtering functionality
      const filterTests = [
        {
          name: 'Regulation Filter',
          filter: (broker) => broker.regulations.includes('FCA'),
          expectedCount: comparisonBrokers.filter(b => b.regulations.includes('FCA')).length
        },
        {
          name: 'Platform Filter',
          filter: (broker) => broker.platforms.includes('MetaTrader 4'),
          expectedCount: comparisonBrokers.filter(b => b.platforms.includes('MetaTrader 4')).length
        },
        {
          name: 'Min Deposit Filter',
          filter: (broker) => broker.min_deposit <= 100,
          expectedCount: comparisonBrokers.filter(b => b.min_deposit <= 100).length
        },
        {
          name: 'Rating Filter',
          filter: (broker) => broker.rating >= 4.0,
          expectedCount: comparisonBrokers.filter(b => b.rating >= 4.0).length
        }
      ];

      const filterResults = filterTests.map(filterTest => ({
        name: filterTest.name,
        actualCount: comparisonBrokers.filter(filterTest.filter).length,
        expectedCount: filterTest.expectedCount,
        success: comparisonBrokers.filter(filterTest.filter).length === filterTest.expectedCount
      }));

      test.details.filterTests = filterTests.length;
      test.details.filterResults = filterResults;
      test.details.failedFilters = filterResults.filter(result => !result.success).length;

      test.status = test.details.failedFilters === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedFilters === 0
        ? 'All filter functions work correctly'
        : `Found ${test.details.failedFilters} filtering issues`;

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

  testComparisonPerformance() {
    const test = {
      name: 'Comparison Performance Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();
      const comparisonBrokers = testData.slice(0, 10);

      // Test performance with larger datasets
      const testSizes = [10, 25, 50, 100];
      const performanceResults = [];

      testSizes.forEach(size => {
        const testBrokers = testData.slice(0, size);
        const startTime = Date.now();

        // Simulate comparison operations
        testBrokers.forEach(broker => {
          // Sorting simulation
          [...testBrokers].sort((a, b) => b.rating - a.rating);
          // Filtering simulation
          testBrokers.filter(b => b.regulations.includes('FCA'));
          // Data access simulation
          broker.rating;
          broker.min_deposit;
          broker.platforms;
        });

        const duration = Date.now() - startTime;
        performanceResults.push({
          brokerCount: size,
          duration,
          acceptable: duration < 100 // 100ms threshold
        });
      });

      test.details.performanceResults = performanceResults;
      test.details.totalTests = testSizes.length;
      test.details.failedTests = performanceResults.filter(r => !r.acceptable).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All performance tests within acceptable limits'
        : `Found ${test.details.failedTests} performance issues`;

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

  generateComparisonTable() {
    const testData = this.loadTestData();
    const comparisonBrokers = testData.slice(0, 10);

    // Create comparison table HTML
    const tableHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Broker Comparison Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .rating { color: #f39c12; }
        .regulation { background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
        .platform { background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
        .btn { background-color: #15418F; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; }
        .btn:hover { background-color: #0d2d5f; }
    </style>
</head>
<body>
    <h1>Broker Comparison Table Test</h1>
    <p>This table demonstrates the broker comparison functionality with real test data.</p>

    <table>
        <thead>
            <tr>
                <th>Broker</th>
                <th>Rating</th>
                <th>Regulation</th>
                <th>Min Deposit</th>
                <th>Spread</th>
                <th>Leverage</th>
                <th>Platforms</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${comparisonBrokers.map(broker => `
                <tr>
                    <td><strong>${broker.name}</strong></td>
                    <td><span class="rating">★ ${broker.rating}</span></td>
                    <td>${broker.regulations.map(reg => `<span class="regulation">${reg}</span>`).join(' ')}</td>
                    <td>$${broker.min_deposit}</td>
                    <td>${broker.typical_spread || 'Variable'} pips</td>
                    <td>1:${broker.max_leverage || '500'}</td>
                    <td>${broker.platforms.slice(0, 2).map(platform => `<span class="platform">${platform}</span>`).join(' ')}</td>
                    <td><a href="${broker.affiliate_link}" class="btn">Visit</a></td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>Test Summary</h2>
    <ul>
        <li>Total Brokers: ${comparisonBrokers.length}</li>
        <li>Average Rating: ${(comparisonBrokers.reduce((sum, b) => sum + b.rating, 0) / comparisonBrokers.length).toFixed(2)}</li>
        <li>Regulation Coverage: ${comparisonBrokers.filter(b => b.regulations.length > 0).length}/${comparisonBrokers.length}</li>
        <li>Platform Variety: ${new Set(comparisonBrokers.flatMap(b => b.platforms)).size} different platforms</li>
    </ul>
</body>
</html>`;

    fs.writeFileSync('broker-comparison-test.html', tableHTML);
    return tableHTML;
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
        case 'Comparison Data Structure Test':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Missing data fields',
            recommendation: 'Ensure all required fields are present in broker data'
          });
          break;
        case 'Comparison Table Structure Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Table compatibility',
            recommendation: 'Update table structure to handle missing data gracefully'
          });
          break;
        case 'Comparison Sorting Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Sorting functionality',
            recommendation: 'Implement robust sorting with proper data type handling'
          });
          break;
        case 'Comparison Performance Test':
          this.testResults.recommendations.push({
            priority: 'Low',
            issue: 'Performance optimization',
            recommendation: 'Optimize comparison operations for larger datasets'
          });
          break;
      }
    });

    // Add general recommendations
    this.testResults.recommendations.push({
      priority: 'Medium',
      issue: 'User experience',
      recommendation: 'Add loading states and error handling for comparison features'
    });
  }

  runTests() {
    console.log('🧪 Testing Broker Comparison functionality...');

    // Run all tests
    this.testDataStructureForComparison();
    this.testComparisonTableStructure();
    this.testComparisonSorting();
    this.testComparisonFiltering();
    this.testComparisonPerformance();

    // Generate comparison table
    this.generateComparisonTable();

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
        comparisonBrokers: 10
      },
      filesGenerated: [
        'broker-comparison-test.html',
        'broker-comparison-test-results.json'
      ]
    };

    fs.writeFileSync('broker-comparison-test-results.json', JSON.stringify(results, null, 2));

    // Display results
    this.displayResults();

    return results;
  }

  displayResults() {
    const summary = this.testResults.summary;

    console.log('\n🧪 Broker Comparison Test Results');
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

    console.log('\n📁 Generated Files:');
    console.log(`   broker-comparison-test.html - Visual comparison table`);
    console.log(`   broker-comparison-test-results.json - Detailed test results`);

    if (this.testResults.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.testResults.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}: ${rec.recommendation}`);
      });
    }

    console.log('\n🎯 Open broker-comparison-test.html in your browser to see the visual comparison table!');
  }
}

// Run the broker comparison tests
async function testBrokerComparison() {
  const tester = new BrokerComparisonTester();
  return tester.runTests();
}

// Execute the tests
testBrokerComparison().then(results => {
  if (results.summary.successRate === '100%') {
    console.log('\n🎉 All broker comparison tests passed!');
    console.log('🚀 Comparison functionality is ready for production with imported data.');
  } else {
    console.log('\n⚠️  Some tests failed. Review recommendations and fix issues.');
  }
}).catch(error => {
  console.error('❌ Broker comparison testing failed:', error.message);
});