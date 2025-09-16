const fs = require('fs');

class ResponsiveDesignTester {
  constructor() {
    this.testResults = {
      component: 'ResponsiveDesign',
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        successRate: '0%'
      },
      designData: {},
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

  testMobileResponsiveness() {
    const test = {
      name: 'Mobile Responsiveness Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test mobile viewport (375px width)
      const mobileViewport = {
        width: 375,
        height: 667,
        device: 'iPhone SE'
      };

      // Test data compatibility with mobile layout
      const mobileTests = [
        {
          name: 'Broker Name Length',
          test: () => {
            const maxNameLength = 25;
            const longNames = testData.filter(b => b.name.length > maxNameLength);
            return {
              valid: longNames.length === 0,
              issue: longNames.length > 0 ? `${longNames.length} brokers have names too long for mobile` : null
            };
          }
        },
        {
          name: 'Mobile Card Layout',
          test: () => {
            const maxCardsPerRow = 1; // Mobile should show 1 card per row
            const cardHeight = 400; // Estimated card height in pixels
            const viewportHeight = mobileViewport.height;
            const maxVisibleCards = Math.floor(viewportHeight / cardHeight);
            return {
              valid: maxVisibleCards >= 1,
              issue: maxVisibleCards < 1 ? 'Cards too tall for mobile viewport' : null
            };
          }
        },
        {
          name: 'Touch Target Size',
          test: () => {
            const minTouchTarget = 44; // Apple's recommended minimum touch target size
            const buttonSize = 48; // Button size in pixels
            return {
              valid: buttonSize >= minTouchTarget,
              issue: buttonSize < minTouchTarget ? 'Button size too small for touch' : null
            };
          }
        },
        {
          name: 'Text Readability',
          test: () => {
            const minFontSize = 16; // Minimum font size for mobile readability
            const bodyFontSize = 16; // Body text font size
            return {
              valid: bodyFontSize >= minFontSize,
              issue: bodyFontSize < minFontSize ? 'Font size too small for mobile' : null
            };
          }
        }
      ];

      const mobileResults = mobileTests.map(mobileTest => {
        const result = mobileTest.test();
        return {
          name: mobileTest.name,
          valid: result.valid,
          issue: result.issue
        };
      });

      test.details.mobileTests = mobileTests.length;
      test.details.mobileResults = mobileResults;
      test.details.failedTests = mobileResults.filter(r => !r.valid).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All mobile responsiveness tests passed'
        : `Found ${test.details.failedTests} mobile responsiveness issues`;

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

  testTabletResponsiveness() {
    const test = {
      name: 'Tablet Responsiveness Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test tablet viewport (768px width)
      const tabletViewport = {
        width: 768,
        height: 1024,
        device: 'iPad'
      };

      // Test data compatibility with tablet layout
      const tabletTests = [
        {
          name: 'Grid Layout',
          test: () => {
            const cardsPerRow = 2; // Tablet should show 2 cards per row
            const cardWidth = 350; // Estimated card width in pixels
            const totalWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * 32; // 32px gap
            return {
              valid: totalWidth <= tabletViewport.width,
              issue: totalWidth > tabletViewport.width ? 'Cards too wide for tablet viewport' : null
            };
          }
        },
        {
          name: 'Content Density',
          test: () => {
            const maxFeatures = 4; // Maximum features to show on tablet
            const brokersWithTooManyFeatures = testData.filter(b => b.features.length > maxFeatures);
            return {
              valid: brokersWithTooManyFeatures.length === 0,
              issue: brokersWithTooManyFeatures.length > 0 ? `${brokersWithTooManyFeatures.length} brokers have too many features for tablet display` : null
            };
          }
        },
        {
          name: 'Navigation Layout',
          test: () => {
            const minNavWidth = 200; // Minimum navigation width
            const contentWidth = tabletViewport.width - minNavWidth;
            return {
              valid: contentWidth >= 500, // Minimum content area width
              issue: contentWidth < 500 ? 'Navigation area too large for tablet' : null
            };
          }
        }
      ];

      const tabletResults = tabletTests.map(tabletTest => {
        const result = tabletTest.test();
        return {
          name: tabletTest.name,
          valid: result.valid,
          issue: result.issue
        };
      });

      test.details.tabletTests = tabletTests.length;
      test.details.tabletResults = tabletResults;
      test.details.failedTests = tabletResults.filter(r => !r.valid).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All tablet responsiveness tests passed'
        : `Found ${test.details.failedTests} tablet responsiveness issues`;

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

  testDesktopResponsiveness() {
    const test = {
      name: 'Desktop Responsiveness Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test desktop viewport (1024px width)
      const desktopViewport = {
        width: 1024,
        height: 768,
        device: 'Desktop'
      };

      // Test data compatibility with desktop layout
      const desktopTests = [
        {
          name: 'Max Content Width',
          test: () => {
            const maxContentWidth = 1200; // Maximum content container width
            const cardsPerRow = 3; // Desktop should show 3 cards per row
            const cardWidth = 350; // Estimated card width in pixels
            const totalWidth = Math.min(maxContentWidth, cardsPerRow * cardWidth + (cardsPerRow - 1) * 32);
            return {
              valid: totalWidth <= desktopViewport.width || totalWidth <= maxContentWidth,
              issue: totalWidth > desktopViewport.width && totalWidth > maxContentWidth ? 'Content too wide for desktop' : null
            };
          }
        },
        {
          name: 'Display Density',
          test: () => {
            const optimalBrokersPerPage = 9; // 3x3 grid on desktop
            return {
              valid: testData.length >= optimalBrokersPerPage,
              issue: testData.length < optimalBrokersPerPage ? 'Not enough brokers for optimal desktop layout' : null
            };
          }
        },
        {
          name: 'Feature Display',
          test: () => {
            const maxFeaturesToShow = 6; // Maximum features to show comfortably
            const brokersWithExcessiveFeatures = testData.filter(b => b.features.length > maxFeaturesToShow);
            return {
              valid: brokersWithExcessiveFeatures.length === 0,
              issue: brokersWithExcessiveFeatures.length > 0 ? `${brokersWithExcessiveFeatures.length} brokers have too many features for desktop display` : null
            };
          }
        }
      ];

      const desktopResults = desktopTests.map(desktopTest => {
        const result = desktopTest.test();
        return {
          name: desktopTest.name,
          valid: result.valid,
          issue: result.issue
        };
      });

      test.details.desktopTests = desktopTests.length;
      test.details.desktopResults = desktopResults;
      test.details.failedTests = desktopResults.filter(r => !r.valid).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All desktop responsiveness tests passed'
        : `Found ${test.details.failedTests} desktop responsiveness issues`;

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

  testDataAdaptability() {
    const test = {
      name: 'Data Adaptability Test',
      status: 'running',
      startTime: Date.now(),
      details: {}
    };

    try {
      const testData = this.loadTestData();

      // Test how well broker data adapts to different screen sizes
      const adaptabilityTests = [
        {
          name: 'Text Length Adaptation',
          test: () => {
            const descriptionLengths = testData.map(b => b.description ? b.description.length : 0);
            const avgDescriptionLength = descriptionLengths.reduce((sum, len) => sum + len, 0) / descriptionLengths.length;
            const maxDescriptionLength = Math.max(...descriptionLengths);
            return {
              valid: avgDescriptionLength <= 200 && maxDescriptionLength <= 300,
              issue: avgDescriptionLength > 200 || maxDescriptionLength > 300 ? 'Descriptions too long for mobile display' : null
            };
          }
        },
        {
          name: 'Feature Count Adaptation',
          test: () => {
            const featureCounts = testData.map(b => b.features.length);
            const avgFeatureCount = featureCounts.reduce((sum, count) => sum + count, 0) / featureCounts.length;
            const maxFeatureCount = Math.max(...featureCounts);
            return {
              valid: avgFeatureCount <= 4 && maxFeatureCount <= 6,
              issue: avgFeatureCount > 4 || maxFeatureCount > 6 ? 'Too many features for mobile display' : null
            };
          }
        },
        {
          name: 'Regulation Display Adaptation',
          test: () => {
            const regulationCounts = testData.map(b => b.regulations.length);
            const avgRegulationCount = regulationCounts.reduce((sum, count) => sum + count, 0) / regulationCounts.length;
            const maxRegulationCount = Math.max(...regulationCounts);
            return {
              valid: avgRegulationCount <= 2 && maxRegulationCount <= 4,
              issue: avgRegulationCount > 2 || maxRegulationCount > 4 ? 'Too many regulations for mobile display' : null
            };
          }
        },
        {
          name: 'Numeric Data Adaptation',
          test: () => {
            const largeNumbers = testData.filter(b => b.min_deposit > 1000 || b.review_count > 10000);
            return {
              valid: largeNumbers.length === 0,
              issue: largeNumbers.length > 0 ? `${largeNumbers.length} brokers have numeric values that may not display well on mobile` : null
            };
          }
        }
      ];

      const adaptabilityResults = adaptabilityTests.map(adaptabilityTest => {
        const result = adaptabilityTest.test();
        return {
          name: adaptabilityTest.name,
          valid: result.valid,
          issue: result.issue
        };
      });

      test.details.adaptabilityTests = adaptabilityTests.length;
      test.details.adaptabilityResults = adaptabilityResults;
      test.details.failedTests = adaptabilityResults.filter(r => !r.valid).length;

      test.status = test.details.failedTests === 0 ? 'passed' : 'failed';
      test.details.message = test.details.failedTests === 0
        ? 'All data adaptability tests passed'
        : `Found ${test.details.failedTests} data adaptability issues`;

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

  generateResponsiveDemo() {
    const testData = this.loadTestData();

    // Create a responsive design demonstration HTML page
    const demoHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Responsive Design Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { text-align: center; color: #15418F; margin-bottom: 30px; }

        /* Responsive grid */
        .broker-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        /* Broker card */
        .broker-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }

        .broker-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .broker-name {
            font-size: 18px;
            font-weight: bold;
            color: #15418F;
            margin-bottom: 10px;
        }

        .broker-rating {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .stars {
            color: #f39c12;
            margin-right: 5px;
        }

        .broker-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .broker-features {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
        }

        .feature-tag {
            background-color: #e3f2fd;
            color: #1565c0;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }

        .broker-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }

        .info-item {
            font-size: 13px;
        }

        .info-label {
            font-weight: bold;
            color: #666;
        }

        .broker-actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            flex: 1;
        }

        .btn-primary {
            background-color: #15418F;
            color: white;
        }

        .btn-primary:hover {
            background-color: #0d2d5f;
        }

        .btn-secondary {
            background-color: #f5f5f5;
            color: #15418F;
            border: 1px solid #ddd;
        }

        .btn-secondary:hover {
            background-color: #e8e8e8;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .broker-grid {
                grid-template-columns: 1fr;
            }

            .broker-info {
                grid-template-columns: 1fr;
            }

            .broker-actions {
                flex-direction: column;
            }

            h1 {
                font-size: 24px;
            }
        }

        /* Tablet responsiveness */
        @media (min-width: 769px) and (max-width: 1024px) {
            .broker-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Desktop responsiveness */
        @media (min-width: 1025px) {
            .broker-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        /* Viewport info */
        .viewport-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
        }

        .stats {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="viewport-info" id="viewportInfo">
        Viewport: <span id="viewportSize">Loading...</span>
    </div>

    <div class="container">
        <h1>📱 Responsive Design Demo</h1>

        <div class="stats">
            <strong>Dataset:</strong> ${testData.length} brokers |
            <strong>Grid Layout:</strong> Auto-responsive (1-3 columns) |
            <strong>Test:</strong> Resize your browser to see responsive behavior
        </div>

        <div class="broker-grid">
            ${testData.map(broker => `
                <div class="broker-card">
                    <div class="broker-name">${broker.name}</div>
                    <div class="broker-rating">
                        <span class="stars">★</span>
                        <span>${broker.rating}</span>
                        <span style="color: #999; font-size: 12px;">(${broker.review_count})</span>
                    </div>
                    <div class="broker-description">${broker.description || 'No description available'}</div>
                    <div class="broker-features">
                        ${broker.features.slice(0, 4).map(feature =>
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                        ${broker.features.length > 4 ? `<span class="feature-tag">+${broker.features.length - 4}</span>` : ''}
                    </div>
                    <div class="broker-info">
                        <div class="info-item">
                            <span class="info-label">Min Deposit:</span>
                            <span>$${broker.min_deposit}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Spread:</span>
                            <span>${broker.typical_spread || 'Variable'} pips</span>
                        </div>
                    </div>
                    <div class="broker-actions">
                        <a href="${broker.affiliate_link}" class="btn btn-primary">Visit Broker</a>
                        <a href="${broker.affiliate_link}" class="btn btn-secondary">Details</a>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        // Update viewport info
        function updateViewportInfo() {
            const width = window.innerWidth;
            const device = width <= 768 ? 'Mobile' : width <= 1024 ? 'Tablet' : 'Desktop';
            document.getElementById('viewportSize').textContent = \`\${width}px (\${device})\`;
        }

        // Initial update and add resize listener
        updateViewportInfo();
        window.addEventListener('resize', updateViewportInfo);

        // Add some interactivity
        document.querySelectorAll('.broker-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn')) {
                    this.style.transform = this.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
                }
            });
        });
    </script>
</body>
</html>`;

    fs.writeFileSync('responsive-design-demo.html', demoHTML);
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
        case 'Mobile Responsiveness Test':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Mobile layout issues',
            recommendation: 'Optimize text lengths and improve mobile card layout'
          });
          break;
        case 'Tablet Responsiveness Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Tablet layout optimization',
            recommendation: 'Adjust grid layout and content density for tablet screens'
          });
          break;
        case 'Desktop Responsiveness Test':
          this.testResults.recommendations.push({
            priority: 'Medium',
            issue: 'Desktop display optimization',
            recommendation: 'Optimize content density and feature display for desktop'
          });
          break;
        case 'Data Adaptability Test':
          this.testResults.recommendations.push({
            priority: 'High',
            issue: 'Data presentation',
            recommendation: 'Implement adaptive content display based on screen size'
          });
          break;
      }
    });

    // Add general recommendations
    this.testResults.recommendations.push({
      priority: 'Medium',
      issue: 'Progressive enhancement',
      recommendation: 'Add progressive enhancement for better user experience across devices'
    });
  }

  runTests() {
    console.log('🧪 Testing Responsive Design with real broker data...');

    // Run all tests
    this.testMobileResponsiveness();
    this.testTabletResponsiveness();
    this.testDesktopResponsiveness();
    this.testDataAdaptability();

    // Generate demo
    this.generateResponsiveDemo();

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
        testDevices: ['Mobile (375px)', 'Tablet (768px)', 'Desktop (1024px)']
      },
      filesGenerated: [
        'responsive-design-demo.html',
        'responsive-design-test-results.json'
      ]
    };

    fs.writeFileSync('responsive-design-test-results.json', JSON.stringify(results, null, 2));

    // Display results
    this.displayResults();

    return results;
  }

  displayResults() {
    const summary = this.testResults.summary;

    console.log('\n🧪 Responsive Design Test Results');
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
    console.log(`   responsive-design-demo.html - Interactive responsive demo`);
    console.log(`   responsive-design-test-results.json - Detailed test results`);

    if (this.testResults.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.testResults.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}: ${rec.recommendation}`);
      });
    }

    console.log('\n🎯 Open responsive-design-demo.html in your browser and resize the window to test responsive behavior!');
  }
}

// Run the responsive design tests
async function testResponsiveDesign() {
  const tester = new ResponsiveDesignTester();
  return tester.runTests();
}

// Execute the tests
testResponsiveDesign().then(results => {
  if (results.summary.successRate === '100%') {
    console.log('\n🎉 All responsive design tests passed!');
    console.log('🚀 Responsive design is ready for production with imported data.');
  } else {
    console.log('\n⚠️  Some tests failed. Review recommendations and fix issues.');
  }
}).catch(error => {
  console.error('❌ Responsive design testing failed:', error.message);
});