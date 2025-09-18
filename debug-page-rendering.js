const puppeteer = require('puppeteer');

/**
 * Debug script to check what's actually being rendered on the broker page
 */

async function debugPageRendering() {
  console.log('🔍 Debugging broker page rendering...');
  console.log('=' .repeat(50));
  
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging
    page.on('console', msg => {
      console.log(`🖥️  Browser Console [${msg.type()}]: ${msg.text()}`);
    });
    
    // Set up error logging
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Navigate to broker page
    const testUrl = 'http://localhost:3000/brokers/bdswiss';
    console.log(`\n📄 Loading page: ${testUrl}`);
    
    await page.goto(testUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check page title
    const title = await page.title();
    console.log(`\n📋 Page Title: "${title}"`);
    
    // Check for error indicators
    const errorElements = await page.$$eval('[class*="error"], [class*="404"], [class*="not-found"]', 
      elements => elements.map(el => ({ 
        tagName: el.tagName, 
        className: el.className, 
        textContent: el.textContent?.substring(0, 100) 
      }))
    );
    
    if (errorElements.length > 0) {
      console.log('\n❌ Error elements found:');
      errorElements.forEach((el, i) => {
        console.log(`   ${i + 1}. ${el.tagName}.${el.className}: "${el.textContent}"`);
      });
    } else {
      console.log('\n✅ No obvious error elements found');
    }
    
    // Check for broker-specific content
    const brokerContent = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      return {
        hasBdswiss: bodyText.toLowerCase().includes('bdswiss'),
        hasBroker: bodyText.toLowerCase().includes('broker'),
        hasTrading: bodyText.toLowerCase().includes('trading'),
        hasError404: bodyText.toLowerCase().includes('404') || bodyText.toLowerCase().includes('not found'),
        bodyLength: bodyText.length
      };
    });
    
    console.log('\n📊 Content Analysis:');
    console.log(`   Body text length: ${brokerContent.bodyLength} characters`);
    console.log(`   Contains 'bdswiss': ${brokerContent.hasBdswiss}`);
    console.log(`   Contains 'broker': ${brokerContent.hasBroker}`);
    console.log(`   Contains 'trading': ${brokerContent.hasTrading}`);
    console.log(`   Contains 404/not found: ${brokerContent.hasError404}`);
    
    // Check loading state
    const loadingElements = await page.$$eval('[class*="loading"], [class*="spinner"]', 
      elements => elements.length
    );
    console.log(`   Loading elements: ${loadingElements}`);
    
    // Get main content structure
    const mainContent = await page.evaluate(() => {
      const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
      return {
        tagName: main.tagName,
        childrenCount: main.children.length,
        hasContent: main.textContent && main.textContent.trim().length > 100
      };
    });
    
    console.log('\n🏗️  Page Structure:');
    console.log(`   Main element: ${mainContent.tagName}`);
    console.log(`   Children count: ${mainContent.childrenCount}`);
    console.log(`   Has substantial content: ${mainContent.hasContent}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'broker-page-debug.png', fullPage: true });
    console.log('\n📸 Screenshot saved as: broker-page-debug.png');
    
  } catch (error) {
    console.error('❌ Error during page debugging:', error.message);
    
    // Fallback: simple HTTP test
    console.log('\n🔄 Falling back to HTTP test...');
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch('http://localhost:3000/brokers/bdswiss');
      const content = await response.text();
      
      console.log(`HTTP Status: ${response.status}`);
      console.log(`Content Length: ${content.length}`);
      console.log(`Contains 404: ${content.includes('404')}`);
      console.log(`Contains bdswiss: ${content.toLowerCase().includes('bdswiss')}`);
      
      // Extract title from HTML
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        console.log(`HTML Title: "${titleMatch[1]}"`);
      }
      
    } catch (httpError) {
      console.error('❌ HTTP fallback also failed:', httpError.message);
    }
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the debug
debugPageRendering();