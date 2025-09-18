const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugHomepage() {
  console.log('🔍 Starting Homepage Debug Analysis...\n');

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Arrays to collect issues
  const consoleErrors = [];
  const consoleWarnings = [];
  const networkErrors = [];
  const resourceErrors = [];

  // Capture console errors
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      consoleErrors.push({
        type: 'console',
        message: text,
        location: msg.location(),
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Console Error: ${text}`);
    } else if (type === 'warning') {
      consoleWarnings.push({
        type: 'console',
        message: text,
        location: msg.location(),
        timestamp: new Date().toISOString()
      });
      console.log(`⚠️ Console Warning: ${text}`);
    }
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    consoleErrors.push({
      type: 'page',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`💥 Page Error: ${error.message}`);
  });

  // Capture network failures
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    networkErrors.push({
      url: request.url(),
      method: request.method(),
      error: failure?.errorText || 'Unknown error',
      timestamp: new Date().toISOString()
    });
    console.log(`🌐 Network Error: ${request.url()} - ${failure?.errorText}`);
  });

  // Capture resource load failures
  page.on('response', (response) => {
    if (response.status() >= 400) {
      resourceErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      });
      console.log(`📦 Resource Error: ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('🌐 Navigating to homepage...');
    await page.goto('http://localhost:3002', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Waiting for page to fully load...');
    await page.waitForSelector('body', { timeout: 10000 });

    // Performance metrics
    const metrics = await page.metrics();
    console.log('\n📊 Performance Metrics:');
    console.log(`   - Layout Count: ${metrics.LayoutCount}`);
    console.log(`   - Recalc Style Count: ${metrics.RecalcStyleCount}`);
    console.log(`   - Script Duration: ${metrics.ScriptDuration}ms`);
    console.log(`   - Task Duration: ${metrics.TaskDuration}ms`);

    // Check for missing elements
    console.log('\n🔍 Checking key components...');
    const componentChecks = await page.evaluate(() => {
      const checks = {};

      // Key components to check
      const selectors = {
        header: 'header',
        hero: '[data-testid="hero"]',
        featuredBrokers: '[data-testid="featured-brokers"]',
        searchSection: '[data-testid="broker-search"]',
        latestReviews: '[data-testid="latest-reviews"]',
        educationalContent: '[data-testid="educational-content"]',
        marketNews: '[data-testid="market-news"]',
        footer: 'footer'
      };

      for (const [name, selector] of Object.entries(selectors)) {
        try {
          const element = document.querySelector(selector);
          checks[name] = {
            exists: !!element,
            visible: element ? element.offsetParent !== null : false,
            text: element ? element.textContent?.substring(0, 100) : ''
          };
        } catch (error) {
          checks[name] = {
            exists: false,
            visible: false,
            error: error.message
          };
        }
      }

      return checks;
    });

    console.log('Component Check Results:');
    for (const [component, result] of Object.entries(componentChecks)) {
      const status = result.exists ? (result.visible ? '✅' : '👻') : '❌';
      console.log(`   ${status} ${component}: ${result.exists ? 'Found' : 'Missing'} ${result.visible ? '(Visible)' : '(Hidden)'}`);
    }

    // Check for CSS issues
    console.log('\n🎨 Checking CSS issues...');
    const cssIssues = await page.evaluate(() => {
      const issues = [];

      // Check for common Tailwind issues
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);

      if (computedStyle.fontFamily === 'initial') {
        issues.push('Body font not properly set');
      }

      // Check for elements with display: none that shouldn't be
      const hiddenElements = document.querySelectorAll('[style*="display: none"]');
      if (hiddenElements.length > 0) {
        issues.push(`${hiddenElements.length} elements with display: none`);
      }

      return issues;
    });

    if (cssIssues.length > 0) {
      console.log('CSS Issues Found:');
      cssIssues.forEach(issue => console.log(`   ⚠️ ${issue}`));
    }

    // Take a screenshot for visual reference
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({
      path: 'scripts/homepage-debug.png',
      fullPage: true
    });

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3002',
      performance: metrics,
      components: componentChecks,
      cssIssues: cssIssues,
      errors: {
        console: consoleErrors,
        network: networkErrors,
        resources: resourceErrors,
        warnings: consoleWarnings
      }
    };

    // Save report
    const reportPath = path.join(__dirname, 'homepage-debug-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Debug report saved to: ${reportPath}`);

    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`   - Console Errors: ${consoleErrors.length}`);
    console.log(`   - Console Warnings: ${consoleWarnings.length}`);
    console.log(`   - Network Errors: ${networkErrors.length}`);
    console.log(`   - Resource Errors: ${resourceErrors.length}`);
    console.log(`   - CSS Issues: ${cssIssues.length}`);
    console.log(`   - Components Checked: ${Object.keys(componentChecks).length}`);

    if (consoleErrors.length > 0 || networkErrors.length > 0) {
      console.log('\n❌ ISSUES FOUND - Check the detailed report for more information');
    } else {
      console.log('\n✅ HOMEPAGE LOADED SUCCESSFULLY');
    }

  } catch (error) {
    console.error(`\n💥 Critical Error: ${error.message}`);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n🔍 Debug analysis complete');
  }
}

// Run the analysis
debugHomepage().catch(console.error);