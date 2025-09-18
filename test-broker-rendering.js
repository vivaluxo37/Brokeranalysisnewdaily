const fetch = require('node-fetch');

async function testBrokerRendering() {
  console.log('Testing broker page rendering and content display...');
  
  const testBrokers = ['bdswiss', 'binance', 'capital'];
  
  for (const brokerSlug of testBrokers) {
    console.log(`\n=== Testing ${brokerSlug} ===`);
    
    try {
      // Test API endpoint
      const apiResponse = await fetch(`http://localhost:3000/api/brokers/${brokerSlug}`);
      const apiData = await apiResponse.json();
      
      console.log('API Status:', apiResponse.status);
      console.log('API Success:', apiData.success);
      
      if (apiData.success && apiData.data) {
        console.log('Broker Name:', apiData.data.name);
        console.log('Broker Slug:', apiData.data.slug);
        console.log('Overall Rating:', apiData.data.overall_rating);
        console.log('Reviews Count:', apiData.data._count?.reviews || 0);
        console.log('Has Regulations:', apiData.data.regulations?.length > 0);
        console.log('Has Features:', apiData.data.features?.length > 0);
      }
      
      // Test page rendering
      const pageResponse = await fetch(`http://localhost:3000/brokers/${brokerSlug}`);
      const pageHtml = await pageResponse.text();
      
      console.log('Page Status:', pageResponse.status);
      console.log('Page Content Length:', pageHtml.length);
      
      // Check for essential content
      const checks = {
        'Has Title': pageHtml.includes('<title>'),
        'Contains Broker Name': pageHtml.toLowerCase().includes(brokerSlug.toLowerCase()),
        'Has Main Content': pageHtml.includes('<main'),
        'Has Navigation': pageHtml.includes('nav'),
        'Has Footer': pageHtml.includes('footer'),
        'Contains Rating': pageHtml.includes('rating') || pageHtml.includes('star'),
        'Has Review Section': pageHtml.includes('review') || pageHtml.includes('Review'),
        'Contains Trading Info': pageHtml.includes('trading') || pageHtml.includes('Trading'),
      };
      
      console.log('Content Checks:');
      Object.entries(checks).forEach(([check, passed]) => {
        console.log(`  ${check}: ${passed ? '✅' : '❌'}`);
      });
      
      // Check for actual error content (not just Next.js internals)
      const actualErrors = [
        'Page not found',
        'Something went wrong',
        'Error 404',
        'This page could not be found',
        'Internal Server Error'
      ];
      
      const hasActualErrors = actualErrors.some(error => 
        pageHtml.includes(error) && !pageHtml.includes('"' + error + '"')
      );
      
      console.log('Has Actual Errors:', hasActualErrors ? '❌' : '✅');
      
    } catch (error) {
      console.error(`Error testing ${brokerSlug}:`, error.message);
    }
  }
  
  console.log('\n✅ Broker rendering tests completed!');
}

testBrokerRendering();