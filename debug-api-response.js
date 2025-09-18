const fetch = require('node-fetch');

/**
 * Debug script to check what the API is returning for broker slugs
 */

const BASE_URL = 'http://localhost:3000';

async function debugApiResponse() {
  console.log('🔍 Debugging API responses for broker slugs...');
  console.log('=' .repeat(50));
  
  const testBrokers = ['bdswiss', 'binance', 'capital', 'blackbull'];
  
  for (const broker of testBrokers) {
    console.log(`\n📊 Testing API for broker: ${broker}`);
    console.log('-' .repeat(30));
    
    try {
      const response = await fetch(`${BASE_URL}/api/brokers/${broker}`);
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      
      const responseText = await response.text();
      console.log(`Response Length: ${responseText.length} characters`);
      
      try {
        const jsonData = JSON.parse(responseText);
        console.log(`JSON Structure:`);
        console.log(`  - success: ${jsonData.success}`);
        console.log(`  - error: ${jsonData.error || 'none'}`);
        
        if (jsonData.success && jsonData.data) {
          console.log(`  - data.id: ${jsonData.data.id}`);
          console.log(`  - data.name: ${jsonData.data.name}`);
          console.log(`  - data.slug: ${jsonData.data.slug}`);
          console.log(`  - data.status: ${jsonData.data.status}`);
        } else {
          console.log(`  - No valid data found`);
          if (jsonData.error) {
            console.log(`  - Error message: ${jsonData.error}`);
          }
        }
      } catch (parseError) {
        console.log(`❌ Failed to parse JSON response`);
        console.log(`Raw response (first 200 chars): ${responseText.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Summary:');
  console.log('If all brokers return 404 or error responses, the issue is in the API.');
  console.log('If some work and others don\'t, it\'s a data consistency issue.');
}

// Run the debug
debugApiResponse();