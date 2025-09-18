const fetch = require('node-fetch');
const fs = require('fs');

/**
 * Examine the actual HTML content of the broker page
 */

async function examineHtmlContent() {
  console.log('🔍 Examining HTML content of broker page...');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/brokers/bdswiss');
    const html = await response.text();
    
    console.log(`Status: ${response.status}`);
    console.log(`Content Length: ${html.length} characters`);
    console.log();
    
    // Save full HTML for inspection
    fs.writeFileSync('broker-page-full.html', html);
    console.log('📄 Full HTML saved to: broker-page-full.html');
    
    // Extract and analyze key parts
    console.log('\n🔍 Content Analysis:');
    console.log('-' .repeat(30));
    
    // Check title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      console.log(`Title: "${titleMatch[1]}"`);
    }
    
    // Check for 404 content
    const has404 = html.includes('404');
    const hasNotFound = html.toLowerCase().includes('not found');
    const hasError = html.toLowerCase().includes('error');
    
    console.log(`Contains '404': ${has404}`);
    console.log(`Contains 'not found': ${hasNotFound}`);
    console.log(`Contains 'error': ${hasError}`);
    
    // Check for broker-specific content
    const hasBdswiss = html.toLowerCase().includes('bdswiss');
    const hasBrokerData = html.includes('broker') && html.includes('trading');
    
    console.log(`Contains 'bdswiss': ${hasBdswiss}`);
    console.log(`Has broker data: ${hasBrokerData}`);
    
    // Look for specific error patterns
    console.log('\n🚨 Error Pattern Analysis:');
    console.log('-' .repeat(30));
    
    // Check for common error messages
    const errorPatterns = [
      'Page not found',
      'Broker not found',
      'Something went wrong',
      'Error loading',
      'Failed to fetch',
      '404',
      'Not Found'
    ];
    
    errorPatterns.forEach(pattern => {
      const found = html.toLowerCase().includes(pattern.toLowerCase());
      if (found) {
        console.log(`❌ Found error pattern: "${pattern}"`);
        
        // Find context around the error
        const index = html.toLowerCase().indexOf(pattern.toLowerCase());
        const start = Math.max(0, index - 100);
        const end = Math.min(html.length, index + pattern.length + 100);
        const context = html.substring(start, end).replace(/\s+/g, ' ');
        console.log(`   Context: ...${context}...`);
      }
    });
    
    // Check for React hydration or client-side content
    console.log('\n⚛️  React Content Analysis:');
    console.log('-' .repeat(30));
    
    const hasReactRoot = html.includes('__next') || html.includes('react');
    const hasClientScript = html.includes('<script') && html.includes('_next');
    const hasHydrationData = html.includes('__NEXT_DATA__');
    
    console.log(`Has React root: ${hasReactRoot}`);
    console.log(`Has client scripts: ${hasClientScript}`);
    console.log(`Has hydration data: ${hasHydrationData}`);
    
    // Extract Next.js data if present
    if (hasHydrationData) {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          console.log('\n📊 Next.js Page Data:');
          console.log(`   Page: ${nextData.page}`);
          console.log(`   Query: ${JSON.stringify(nextData.query)}`);
          console.log(`   Props keys: ${Object.keys(nextData.props || {}).join(', ')}`);
        } catch (e) {
          console.log('❌ Failed to parse Next.js data');
        }
      }
    }
    
    // Look for the main content area
    console.log('\n🏗️  HTML Structure Analysis:');
    console.log('-' .repeat(30));
    
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1];
      const bodyText = bodyContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      console.log(`Body text length: ${bodyText.length} characters`);
      console.log(`First 200 chars: "${bodyText.substring(0, 200)}..."`);
      
      if (bodyText.length < 500) {
        console.log('⚠️  Very short body content - possible loading issue');
      }
    }
    
  } catch (error) {
    console.error('❌ Error examining HTML content:', error.message);
  }
}

// Run the examination
examineHtmlContent();