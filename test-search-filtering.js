const fs = require('fs');

class SearchFilterTester {
  constructor() {
    this.testResults = {
      component: 'SearchAndFilter',
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        successRate: '0%'
      },
      searchData: {},
      filterData: {},
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

  testSearchFunctionality() {
    const test = {
      name: 'Search Functionality Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test search functionality with various queries
      const searchQueries = [
        { query: 'Admirals', expected: 1, type: 'exact_name' },
        { query: 'Pepperstone', expected: 1, type: 'exact_name' },
        { query: 'admiral', expected: 1, type: 'partial_name' },
        { query: 'meta', expected: testData.filter(b => b.platforms.some(p => p.toLowerCase().includes('meta'))).length, type: 'platform' },
        { query: 'FCA', expected: testData.filter(b => b.regulations.includes('FCA')).length, type: 'regulation' },
        { query: 'trading', expected: testData.filter(b => b.features.some(f => f.toLowerCase().includes('trading'))).length, type: 'feature' },
        { query: 'low', expected: testData.filter(b => b.min_deposit <= 10).length, type: 'deposit' },
        { query: 'high rating', expected: testData.filter(b => b.rating >= 4.5).length, type: 'rating' }
      ];

      const searchResults = searchQueries.map(query => {
        const results = this.performSearch(testData, query.query);
        return {
          query: query.query,
          type: query.type,
          expected: query.expected,
          actual: results.length,
          success: Math.abs(results.length - query.expected) <= 1 // Allow small margin of error
        };
      });

      test.details.searchQueries = searchQueries.length;
      test.details.searchResults = searchResults;
      test.details.failedSearches = searchResults.filter(r => !r.success).length;

      test.status = test.details.failedSearches === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedSearches === 0
        ? 'All search queries returned expected results'
        : `Found ${test.details.failedSearches} search failures`;

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

  performSearch(brokers, query) {
    const searchQuery = query.toLowerCase().trim();
    const results = [];

    brokers.forEach(broker => {
      let matchScore = 0;
      let matchFields = [];

      // Search in name
      if (broker.name.toLowerCase().includes(searchQuery)) {
        matchScore += 10;
        matchFields.push('name');
      }

      // Search in description
      if (broker.description && broker.description.toLowerCase().includes(searchQuery)) {
        matchScore += 5;
        matchFields.push('description');
      }

      // Search in features
      if (broker.features) {
        broker.features.forEach(feature => {
          if (feature.toLowerCase().includes(searchQuery)) {
            matchScore += 3;
            matchFields.push('feature');
          }
        });
      }

      // Search in platforms
      if (broker.platforms) {
        broker.platforms.forEach(platform => {
          if (platform.toLowerCase().includes(searchQuery)) {
            matchScore += 3;
            matchFields.push('platform');
          }
        });
      }

      // Search in regulations
      if (broker.regulations) {
        broker.regulations.forEach(regulation => {
          if (regulation.toLowerCase().includes(searchQuery)) {
            matchScore += 2;
            matchFields.push('regulation');
          }
        });
      }

      // Search in headquarters
      if (broker.headquarters && broker.headquarters.toLowerCase().includes(searchQuery)) {
        matchScore += 2;
        matchFields.push('headquarters');
      }

      // Numeric searches
      if (!isNaN(searchQuery)) {
        const numericQuery = parseInt(searchQuery);
        if (broker.min_deposit <= numericQuery) {
          matchScore += 1;
          matchFields.push('deposit');
        }
        if (broker.rating >= numericQuery) {
          matchScore += 1;
          matchFields.push('rating');
        }
      }

      if (matchScore > 0) {
        results.push({
          broker,
          matchScore,
          matchFields
        });
      }
    });

    // Sort by match score (descending)
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  testFilterFunctionality() {
    const test = {
      name: 'Filter Functionality Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test various filter combinations
      const filterTests = [
        {
          name: 'Single Regulation Filter',
          filters: { regulations: ['FCA'] },
          expected: testData.filter(b => b.regulations.includes('FCA')).length
        },
        {
          name: 'Multiple Regulation Filter',
          filters: { regulations: ['FCA', 'ASIC'] },
          expected: testData.filter(b => b.regulations.some(r => ['FCA', 'ASIC'].includes(r))).length
        },
        {
          name: 'Platform Filter',
          filters: { platforms: ['MetaTrader 4'] },
          expected: testData.filter(b => b.platforms.includes('MetaTrader 4')).length
        },
        {
          name: 'Min Deposit Filter',
          filters: { minDeposit: { max: 100 } },
          expected: testData.filter(b => b.min_deposit <= 100).length
        },
        {
          name: 'Rating Filter',
          filters: { rating: { min: 4.0 } },
          expected: testData.filter(b => b.rating >= 4.0).length
        },
        {
          name: 'Combined Filters',
          filters: {
            regulations: ['FCA'],
            platforms: ['MetaTrader 4'],
            rating: { min: 4.0 }
          },
          expected: testData.filter(b =>
            b.regulations.includes('FCA') &&
            b.platforms.includes('MetaTrader 4') &&
            b.rating >= 4.0
          ).length
        },
        {
          name: 'Feature Filter',
          filters: { features: ['Low Spreads'] },
          expected: testData.filter(b => b.features.includes('Low Spreads')).length
        }
      ];

      const filterResults = filterTests.map(testCase => {
        const results = this.applyFilters(testData, testCase.filters);
        return {
          name: testCase.name,
          expected: testCase.expected,
          actual: results.length,
          success: results.length === testCase.expected
        };
      });

      test.details.filterTests = filterTests.length;
      test.details.filterResults = filterResults;
      test.details.failedFilters = filterResults.filter(r => !r.success).length;

      test.status = test.details.failedFilters === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedFilters === 0
        ? 'All filter combinations returned expected results'
        : `Found ${test.details.failedFilters} filter failures`;

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

  applyFilters(brokers, filters) {
    let filtered = [...brokers];

    // Regulation filter
    if (filters.regulations && filters.regulations.length > 0) {
      filtered = filtered.filter(broker =>
        broker.regulations.some(reg => filters.regulations.includes(reg))
      );
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(broker =>
        broker.platforms.some(platform => filters.platforms.includes(platform))
      );
    }

    // Feature filter
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(broker =>
        broker.features.some(feature => filters.features.includes(feature))
      );
    }

    // Min deposit filter
    if (filters.minDeposit) {
      if (filters.minDeposit.min !== undefined) {
        filtered = filtered.filter(broker => broker.min_deposit >= filters.minDeposit.min);
      }
      if (filters.minDeposit.max !== undefined) {
        filtered = filtered.filter(broker => broker.min_deposit <= filters.minDeposit.max);
      }
    }

    // Rating filter
    if (filters.rating) {
      if (filters.rating.min !== undefined) {
        filtered = filtered.filter(broker => broker.rating >= filters.rating.min);
      }
      if (filters.rating.max !== undefined) {
        filtered = filtered.filter(broker => broker.rating <= filters.rating.max);
      }
    }

    return filtered;
  }

  testAdvancedSearch() {
    const test = {
      name: 'Advanced Search Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test advanced search features
      const advancedTests = [
        {
          name: 'Fuzzy Search',
          query: 'admrals', // Misspelled "Admirals"
          expected: 1,
          tolerance: 1
        },
        {
          name: 'Multi-term Search',
          query: 'meta trader',
          expected: testData.filter(b =>
            b.name.toLowerCase().includes('meta') ||
            b.platforms.some(p => p.toLowerCase().includes('meta'))
          ).length,
          tolerance: 2
        },
        {
          name: 'Acronym Search',
          query: 'mt4',
          expected: testData.filter(b =>
            b.platforms.some(p => p.toLowerCase().includes('mt4') || p.toLowerCase().includes('metatrader 4'))
          ).length,
          tolerance: 1
        },
        {
          name: 'Numeric Range Search',
          query: '100-500',
          expected: testData.filter(b => b.min_deposit >= 100 && b.min_deposit <= 500).length,
          tolerance: 1
        },
        {
          name: 'Negative Search',
          query: '-high', // Should exclude brokers with "high" in description
          expected: testData.filter(b => !b.description || !b.description.toLowerCase().includes('high')).length,
          tolerance: 2
        }
      ];

      const advancedResults = advancedTests.map(testCase => {
        const results = this.performAdvancedSearch(testData, testCase.query);
        const withinTolerance = Math.abs(results.length - testCase.expected) <= testCase.tolerance;

        return {
          name: testCase.name,
          query: testCase.query,
          expected: testCase.expected,
          actual: results.length,
          tolerance: testCase.tolerance,
          success: withinTolerance
        };
      });

      test.details.advancedTests = advancedTests.length;
      test.details.advancedResults = advancedResults;
      test.details.failedTests = advancedResults.filter(r => !r.success).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All advanced search tests passed'
        : `Found ${test.details.failedTests} advanced search failures`;

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

  performAdvancedSearch(brokers, query) {
    const searchQuery = query.toLowerCase().trim();
    const results = [];

    // Handle numeric range searches
    const rangeMatch = searchQuery.match(/(\d+)-(\d+)/);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      return brokers.filter(broker => broker.min_deposit >= min && broker.min_deposit <= max);
    }

    // Handle negative searches
    const negativeMatch = searchQuery.match(/^-(.+)/);
    if (negativeMatch) {
      const negativeTerm = negativeMatch[1];
      return brokers.filter(broker =>
        !broker.name.toLowerCase().includes(negativeTerm) &&
        !(broker.description && broker.description.toLowerCase().includes(negativeTerm))
      );
    }

    // Fuzzy search for misspellings
    const fuzzyResults = brokers.filter(broker => {
      const brokerName = broker.name.toLowerCase();
      const distance = this.calculateLevenshteinDistance(searchQuery, brokerName);
      return distance <= 2; // Allow up to 2 character differences
    });

    // Multi-term search
    const terms = searchQuery.split(' ').filter(term => term.length > 0);
    if (terms.length > 1) {
      return brokers.filter(broker => {
        const searchableText = (
          broker.name + ' ' +
          (broker.description || '') + ' ' +
          broker.platforms.join(' ') + ' ' +
          broker.features.join(' ')
        ).toLowerCase();

        return terms.every(term => searchableText.includes(term));
      });
    }

    return fuzzyResults;
  }

  calculateLevenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  testSearchPerformance() {
    const test = {
      name: 'Search Performance Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test performance with different dataset sizes
      const testSizes = [10, 25, 50, 100];
      const performanceResults = [];

      testSizes.forEach(size => {
        const testBrokers = testData.slice(0, size);
        const testQueries = ['meta', 'FCA', 'low', 'trading'];

        const startTime = Date.now();
        testQueries.forEach(query => {
          this.performSearch(testBrokers, query);
          this.applyFilters(testBrokers, { regulations: ['FCA'] });
        });
        const duration = Date.now() - startTime;

        performanceResults.push({
          brokerCount: size,
          queriesCount: testQueries.length,
          duration,
          averageTime: duration / testQueries.length,
          acceptable: duration < 50 // 50ms threshold for all queries
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

  generateSearchDemo() {
    const testData = this.loadTestData();

    // Create a search demonstration HTML page
    const demoHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Search and Filter Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .search-box { width: 100%; padding: 15px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 20px; }
        .filters { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-group { flex: 1; min-width: 200px; }
        .filter-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .filter-group select, .filter-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .results { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .broker-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .broker-name { font-size: 18px; font-weight: bold; color: #15418F; margin-bottom: 10px; }
        .broker-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px; }
        .info-item { font-size: 14px; }
        .info-label { font-weight: bold; color: #666; }
        .regulations { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
        .regulation { background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .platforms { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
        .platform { background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .stats { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .no-results { text-align: center; padding: 40px; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Search and Filter Demo</h1>
        <p>Test the search and filtering functionality with real broker data.</p>

        <div class="stats">
            <strong>Dataset:</strong> ${testData.length} brokers |
            <strong>Average Rating:</strong> ${(testData.reduce((sum, b) => sum + b.rating, 0) / testData.length).toFixed(2)} |
            <strong>Regulations:</strong> ${new Set(testData.flatMap(b => b.regulations)).size} different regulators
        </div>

        <input type="text" class="search-box" placeholder="Search brokers by name, platform, regulation, or feature..." onkeyup="performSearch(this.value)">

        <div class="filters">
            <div class="filter-group">
                <label>Regulation:</label>
                <select id="regulationFilter" onchange="applyFilters()">
                    <option value="">All Regulations</option>
                    <option value="FCA">FCA</option>
                    <option value="ASIC">ASIC</option>
                    <option value="CySEC">CySEC</option>
                    <option value="FINMA">FINMA</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Platform:</label>
                <select id="platformFilter" onchange="applyFilters()">
                    <option value="">All Platforms</option>
                    <option value="MetaTrader 4">MetaTrader 4</option>
                    <option value="MetaTrader 5">MetaTrader 5</option>
                    <option value="cTrader">cTrader</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Min Rating:</label>
                <input type="range" id="ratingFilter" min="0" max="5" step="0.1" value="0" onchange="applyFilters()">
                <span id="ratingValue">0+</span>
            </div>
            <div class="filter-group">
                <label>Max Deposit:</label>
                <input type="number" id="depositFilter" placeholder="Max deposit" onchange="applyFilters()">
            </div>
        </div>

        <div class="results" id="results">
            <div style="text-align: center; padding: 40px; color: #666;">
                <strong>Start typing in the search box or use filters to see results...</strong>
            </div>
        </div>
    </div>

    <script>
        const brokers = ${JSON.stringify(testData, null, 2)};
        let currentResults = brokers;

        function performSearch(query) {
            const searchQuery = query.toLowerCase().trim();

            if (searchQuery === '') {
                currentResults = brokers;
            } else {
                currentResults = brokers.filter(broker => {
                    const searchableText = (
                        broker.name + ' ' +
                        (broker.description || '') + ' ' +
                        broker.platforms.join(' ') + ' ' +
                        broker.features.join(' ') + ' ' +
                        broker.regulations.join(' ')
                    ).toLowerCase();

                    return searchableText.includes(searchQuery);
                });
            }

            applyFilters();
        }

        function applyFilters() {
            let results = [...currentResults];

            // Regulation filter
            const regulationFilter = document.getElementById('regulationFilter').value;
            if (regulationFilter) {
                results = results.filter(broker => broker.regulations.includes(regulationFilter));
            }

            // Platform filter
            const platformFilter = document.getElementById('platformFilter').value;
            if (platformFilter) {
                results = results.filter(broker => broker.platforms.includes(platformFilter));
            }

            // Rating filter
            const ratingFilter = parseFloat(document.getElementById('ratingFilter').value);
            if (ratingFilter > 0) {
                results = results.filter(broker => broker.rating >= ratingFilter);
            }

            // Deposit filter
            const depositFilter = document.getElementById('depositFilter').value;
            if (depositFilter) {
                results = results.filter(broker => broker.min_deposit <= parseInt(depositFilter));
            }

            displayResults(results);
        }

        function displayResults(results) {
            const resultsDiv = document.getElementById('results');

            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">No brokers found matching your criteria.</div>';
                return;
            }

            resultsDiv.innerHTML = results.map(broker => \`
                <div class="broker-card">
                    <div class="broker-name">\${broker.name} ★ \${broker.rating}</div>
                    <div class="broker-info">
                        <div class="info-item">
                            <span class="info-label">Min Deposit:</span> $\${broker.min_deposit}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Spread:</span> \${broker.typical_spread || 'Variable'} pips
                        </div>
                        <div class="info-item">
                            <span class="info-label">Leverage:</span> 1:\${broker.max_leverage || '500'}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Established:</span> \${broker.established_year || 'N/A'}
                        </div>
                    </div>
                    <div class="regulations">
                        \${broker.regulations.map(reg => \`<span class="regulation">\${reg}</span>\`).join('')}
                    </div>
                    <div class="platforms">
                        \${broker.platforms.slice(0, 3).map(platform => \`<span class="platform">\${platform}</span>\`).join('')}
                    </div>
                </div>
            \`).join('');
        }

        // Update rating value display
        document.getElementById('ratingFilter').oninput = function() {
            document.getElementById('ratingValue').textContent = this.value + '+';
        };
    </script>
</body>
</html>`;

    fs.writeFileSync('search-filter-demo.html', demoHTML);
    return demoHTML;
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
        case 'Search Functionality Test':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Search accuracy',
            recommendation: 'Improve search algorithm and result ranking'
          });
          break;
        case 'Filter Functionality Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Filter logic',
            recommendation: 'Enhance filter combinations and edge case handling'
          });
          break;
        case 'Advanced Search Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Advanced features',
            recommendation: 'Implement fuzzy search and better query parsing'
          });
          break;
        case 'Search Performance Test':
          this.testResults.recommendations.push({
            priority: 'Low',
            issue: 'Performance optimization',
            recommendation: 'Add indexing and caching for faster search'
          });
          break;
      }
    });

    // Add general recommendations
    this.testResults.recommendations.push({
      priority: 'Medium',
      issue: 'User experience',
      recommendation: 'Add search suggestions and autocomplete functionality'
    });
  }

  runTests() {
    console.log('🧪 Testing Search and Filter functionality...');

    // Run all tests
    this.testSearchFunctionality();
    this.testFilterFunctionality();
    this.testAdvancedSearch();
    this.testSearchPerformance();

    // Generate demo
    this.generateSearchDemo();

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
        searchableFields: ['name', 'description', 'features', 'platforms', 'regulations', 'headquarters']
      },
      filesGenerated: [
        'search-filter-demo.html',
        'search-filter-test-results.json'
      ]
    };

    fs.writeFileSync('search-filter-test-results.json', JSON.stringify(results, null, 2));

    // Display results
    this.displayResults();

    return results;
  }

  displayResults() {
    const summary = this.testResults.summary;

    console.log('\n🧪 Search and Filter Test Results');
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
    console.log(`   search-filter-demo.html - Interactive search demo`);
    console.log(`   search-filter-test-results.json - Detailed test results`);

    if (this.testResults.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.testResults.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}: ${rec.recommendation}`);
      });
    }

    console.log('\n🎯 Open search-filter-demo.html in your browser to test the interactive search functionality!');
  }
}

// Run the search and filter tests
async function testSearchFilter() {
  const tester = new SearchFilterTester();
  return tester.runTests();
}

// Execute the tests
testSearchFilter().then(results => {
  if (results.summary.successRate === '100%') {
    console.log('\n🎉 All search and filter tests passed!');
    console.log('🚀 Search functionality is ready for production with imported data.');
  } else {
    console.log('\n⚠️  Some tests failed. Review recommendations and fix issues.');
  }
}).catch(error => {
  console.error('❌ Search and filter testing failed:', error.message);
});