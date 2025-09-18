const puppeteer = require('puppeteer');

async function advancedDebug() {
  console.log('🔬 Starting Advanced Homepage Analysis...\n');

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Navigating to homepage...');
    await page.goto('http://localhost:3002', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Check actual HTML structure
    console.log('\n🔍 Analyzing DOM structure...');
    const domAnalysis = await page.evaluate(() => {
      const body = document.body;

      // Get all main content sections
      const sections = Array.from(body.querySelectorAll('section'));
      const mainContent = body.querySelector('main');

      // Check for React hydration issues
      const reactRoot = document.querySelector('#__next');

      // Check for loading states
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="skeleton"]');

      // Check for error states
      const errorElements = document.querySelectorAll('[class*="error"], [role="alert"]');

      // Check if components are being rendered with different selectors
      const potentialComponents = {
        heroSections: document.querySelectorAll('h1, h2').length,
        searchForms: document.querySelectorAll('input[type="search"], input[placeholder*="search"]').length,
        brokerCards: document.querySelectorAll('[class*="broker"], [class*="card"]').length,
        newsSections: document.querySelectorAll('[class*="news"], [class*="market"]').length,
      };

      return {
        hasReactRoot: !!reactRoot,
        reactRootHTML: reactRoot?.innerHTML?.substring(0, 500) || 'No React root found',
        sectionsCount: sections.length,
        mainContentExists: !!mainContent,
        loadingElements: loadingElements.length,
        errorElements: errorElements.length,
        potentialComponents,
        bodyClasses: body.className,
        bodyInnerHTML: body.innerHTML.substring(0, 1000)
      };
    });

    console.log('DOM Analysis Results:');
    console.log(`   - React Root: ${domAnalysis.hasReactRoot ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - Main Content: ${domAnalysis.mainContentExists ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - Sections: ${domAnalysis.sectionsCount}`);
    console.log(`   - Loading Elements: ${domAnalysis.loadingElements}`);
    console.log(`   - Error Elements: ${domAnalysis.errorElements}`);
    console.log(`   - Hero Headers: ${domAnalysis.potentialComponents.heroSections}`);
    console.log(`   - Search Forms: ${domAnalysis.potentialComponents.searchForms}`);
    console.log(`   - Broker Cards: ${domAnalysis.potentialComponents.brokerCards}`);
    console.log(`   - News Sections: ${domAnalysis.potentialComponents.newsSections}`);

    if (domAnalysis.hasReactRoot) {
      console.log('\n📄 React Root Content (first 500 chars):');
      console.log(domAnalysis.reactRootHTML);
    }

    // Check for JavaScript errors during hydration
    console.log('\n⚡ Checking for React hydration issues...');
    const hydrationCheck = await page.evaluate(() => {
      const issues = [];

      // Check if React is properly loaded
      if (typeof React === 'undefined') {
        issues.push('React not loaded');
      }

      // Check if Next.js is loaded
      if (typeof window.next === 'undefined') {
        issues.push('Next.js not loaded');
      }

      // Check for hydration mismatch indicators
      const hydrationWarnings = [];
      const consoleLogs = [];

      // Try to detect common React issues
      try {
        const reactRoot = document.querySelector('#__next');
        if (reactRoot) {
          const hasReactData = reactRoot.hasAttribute('data-reactroot');
          const hasNextData = document.querySelector('#__NEXT_DATA__');

          if (!hasNextData) {
            hydrationWarnings.push('No #__NEXT_DATA__ found');
          }
        }
      } catch (error) {
        hydrationWarnings.push(`Error checking React state: ${error.message}`);
      }

      return {
        reactLoaded: typeof React !== 'undefined',
        nextJsLoaded: typeof window.next !== 'undefined',
        hydrationWarnings,
        consoleLogs
      };
    });

    console.log('React/Next.js Status:');
    console.log(`   - React Loaded: ${hydrationCheck.reactLoaded ? '✅' : '❌'}`);
    console.log(`   - Next.js Loaded: ${hydrationCheck.nextJsLoaded ? '✅' : '❌'}`);

    if (hydrationCheck.hydrationWarnings.length > 0) {
      console.log('   - Hydration Warnings:');
      hydrationCheck.hydrationWarnings.forEach(warning => {
        console.log(`     ⚠️ ${warning}`);
      });
    }

    // Wait a bit more and recheck
    console.log('\n⏳ Waiting 5 seconds for dynamic content...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Recheck components after delay
    console.log('🔍 Rechecking components after delay...');
    const delayedCheck = await page.evaluate(() => {
      const components = {
        anyHeroContent: document.querySelector('h1, h2') !== null,
        anySearchContent: document.querySelector('input') !== null,
        anyCards: document.querySelector('[class*="card"], [class*="broker"]') !== null,
        anyNews: document.querySelector('[class*="news"], [class*="market"]') !== null,
        mainContent: document.querySelector('main')?.innerHTML?.substring(0, 200) || 'No main content'
      };
      return components;
    });

    console.log('Delayed Component Check:');
    console.log(`   - Hero Content: ${delayedCheck.anyHeroContent ? '✅' : '❌'}`);
    console.log(`   - Search Content: ${delayedCheck.anySearchContent ? '✅' : '❌'}`);
    console.log(`   - Cards Content: ${delayedCheck.anyCards ? '✅' : '❌'}`);
    console.log(`   - News Content: ${delayedCheck.anyNews ? '✅' : '❌'}`);

    console.log('\n📄 Main Content Preview:');
    console.log(delayedCheck.mainContent);

    // Take final screenshot
    console.log('\n📸 Taking final screenshot...');
    await page.screenshot({
      path: 'scripts/advanced-debug-screenshot.png',
      fullPage: true
    });

  } catch (error) {
    console.error(`💥 Analysis Error: ${error.message}`);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n🔬 Advanced analysis complete');
  }
}

advancedDebug().catch(console.error);