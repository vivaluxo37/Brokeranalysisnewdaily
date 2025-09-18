const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// Test page content loading
async function testPageContent() {
  console.log('🔍 Testing Broker Page Content Loading\n');
  
  try {
    const url = 'http://localhost:3000/brokers/bdswiss';
    console.log(`📄 Fetching: ${url}`);
    
    const response = await fetch(url);
    const html = await response.text();
    
    console.log(`Status: ${response.status}`);
    console.log(`Content Length: ${html.length}`);
    
    // Parse HTML to check for specific elements
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Check for loading skeleton
    const loadingSkeleton = document.querySelector('.animate-pulse');
    console.log(`Loading Skeleton: ${loadingSkeleton ? 'Found' : 'Not Found'}`);
    
    // Check for error messages
    const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
    console.log(`Error Elements: ${errorElements.length} found`);
    
    // Check for broker content
    const brokerContent = html.includes('bdswiss') || html.includes('Bdswiss');
    console.log(`Broker Content: ${brokerContent ? 'Found' : 'Not Found'}`);
    
    // Check for React hydration
    const reactRoot = document.querySelector('#__next');
    console.log(`React Root: ${reactRoot ? 'Found' : 'Not Found'}`);
    
    // Check for specific broker data elements
    const brokerName = document.querySelector('h1, h2, h3');
    console.log(`Broker Title: ${brokerName ? brokerName.textContent.trim() : 'Not Found'}`);
    
    // Check for scripts
    const scripts = document.querySelectorAll('script');
    console.log(`Script Tags: ${scripts.length} found`);
    
    // Look for specific error patterns in HTML
    const errorPatterns = [
      { name: '404 Error', found: html.includes('404') },
      { name: 'Not Found', found: html.includes('This page could not be found') },
      { name: 'Error Boundary', found: html.includes('ErrorFallback') },
      { name: 'Loading State', found: html.includes('animate-pulse') }
    ];
    
    console.log('\n🔍 Content Analysis:');
    errorPatterns.forEach(({ name, found }) => {
      console.log(`  ${found ? '⚠️' : '✅'} ${name}: ${found ? 'Found' : 'Not Found'}`);
    });
    
    // Check if page is stuck in loading state
    if (loadingSkeleton && !brokerContent) {
      console.log('\n❌ Issue: Page appears to be stuck in loading state');
      console.log('   - Loading skeleton is present');
      console.log('   - No broker content found');
      console.log('   - This suggests the API call is not completing successfully');
    }
    
    // Save a portion of HTML for inspection
    const fs = require('fs');
    const bodyContent = document.body ? document.body.innerHTML : 'No body found';
    fs.writeFileSync('page-body-content.html', bodyContent);
    console.log('\n💾 Page body content saved to page-body-content.html');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testPageContent()
  .then(() => {
    console.log('\n🏁 Page content test completed!');
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
  });