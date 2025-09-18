const { JSDOM } = require('jsdom');
const fs = require('fs');

// Debug broker page loading issue
async function debugBrokerPage() {
  console.log('🔍 Debugging Broker Page Loading...');
  
  const url = 'http://localhost:3000/brokers/bdswiss';
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    console.log(`\n📊 Page Analysis for ${url}:`);
    console.log(`Status: ${response.status}`);
    console.log(`Content Length: ${html.length} chars`);
    
    // Check for key elements
    const hasNextScript = html.includes('_next/static');
    const hasReactRoot = html.includes('__next');
    const hasLoadingSkeleton = html.includes('animate-pulse');
    const has404Content = html.includes('404') || html.includes('Not Found');
    const hasBrokerContent = html.includes('broker-detail') || html.includes('trading-conditions');
    const hasErrorBoundary = html.includes('error-boundary');
    
    console.log(`\n🔍 Element Detection:`);
    console.log(`Next.js Scripts: ${hasNextScript ? '✓' : '✗'}`);
    console.log(`React Root: ${hasReactRoot ? '✓' : '✗'}`);
    console.log(`Loading Skeleton: ${hasLoadingSkeleton ? '✓' : '✗'}`);
    console.log(`404 Content: ${has404Content ? '✗' : '✓'}`);
    console.log(`Broker Content: ${hasBrokerContent ? '✓' : '✗'}`);
    console.log(`Error Boundary: ${hasErrorBoundary ? '✗' : '✓'}`);
    
    // Extract and analyze the main content
    const bodyContent = document.body?.innerHTML || '';
    const mainElement = document.querySelector('main');
    const mainContent = mainElement?.innerHTML || 'No main element found';
    
    console.log(`\n📝 Content Analysis:`);
    console.log(`Body has content: ${bodyContent.length > 0 ? '✓' : '✗'}`);
    console.log(`Main element exists: ${mainElement ? '✓' : '✗'}`);
    
    // Check for specific broker page elements
    const brokerNameElement = document.querySelector('[data-testid="broker-name"]') || 
                             document.querySelector('h1') ||
                             document.querySelector('.broker-title');
    
    const loadingElement = document.querySelector('.animate-pulse') ||
                          document.querySelector('[data-testid="loading"]');
    
    const errorElement = document.querySelector('.error-boundary') ||
                        document.querySelector('[data-testid="error"]');
    
    console.log(`\n🎯 Specific Elements:`);
    console.log(`Broker Name Element: ${brokerNameElement ? '✓' : '✗'}`);
    console.log(`Loading Element: ${loadingElement ? '✓' : '✗'}`);
    console.log(`Error Element: ${errorElement ? '✓' : '✗'}`);
    
    if (brokerNameElement) {
      console.log(`Broker Name Text: "${brokerNameElement.textContent?.trim()}"`);  
    }
    
    if (loadingElement) {
      console.log(`Loading Element Classes: ${loadingElement.className}`);
    }
    
    // Save a snippet of the main content for inspection
    const contentSnippet = mainContent.substring(0, 1000);
    fs.writeFileSync('broker-page-debug.html', html);
    fs.writeFileSync('broker-main-content.html', mainContent);
    
    console.log(`\n💾 Debug files saved:`);
    console.log(`- broker-page-debug.html (full page)`);
    console.log(`- broker-main-content.html (main content only)`);
    
    console.log(`\n📋 Main Content Preview (first 500 chars):`);
    console.log(contentSnippet.substring(0, 500));
    
    // Test the API endpoint directly
    console.log(`\n🔗 Testing API Endpoint:`);
    const apiResponse = await fetch('http://localhost:3000/api/brokers/bdswiss');
    const apiData = await apiResponse.json();
    
    console.log(`API Status: ${apiResponse.status}`);
    console.log(`API Success: ${apiData.success}`);
    console.log(`API Broker Name: ${apiData.data?.name || 'N/A'}`);
    
    return {
      pageStatus: response.status,
      hasContent: bodyContent.length > 0,
      hasLoading: hasLoadingSkeleton,
      hasBrokerContent,
      apiWorking: apiData.success,
      brokerName: apiData.data?.name
    };
    
  } catch (error) {
    console.error(`❌ Error debugging broker page: ${error.message}`);
    return { error: error.message };
  }
}

// Run the debug
debugBrokerPage().catch(console.error);