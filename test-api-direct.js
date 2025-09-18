const fetch = require('node-fetch');

// Test API endpoints directly
async function testApiEndpoints() {
  console.log('🔍 Testing API Endpoints Directly\n');
  
  const brokers = ['bdswiss', 'binance', 'capital', 'blackbull'];
  
  for (const broker of brokers) {
    console.log(`\n📊 Testing broker: ${broker}`);
    
    try {
      // Test the API endpoint
      const apiUrl = `http://localhost:3000/api/brokers/${broker}`;
      console.log(`  API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Response Type: ${typeof data}`);
      
      if (response.status === 200) {
        console.log(`  ✅ API Success`);
        console.log(`  Data Keys: ${Object.keys(data).join(', ')}`);
        
        if (data.name) {
          console.log(`  Broker Name: ${data.name}`);
        }
        if (data.slug) {
          console.log(`  Broker Slug: ${data.slug}`);
        }
        if (data.description) {
          console.log(`  Description Length: ${data.description.length} chars`);
        }
        if (data.rating) {
          console.log(`  Rating: ${data.rating}`);
        }
        if (data.reviews) {
          console.log(`  Reviews Count: ${data.reviews.length}`);
        }
      } else {
        console.log(`  ❌ API Error: ${response.status}`);
        console.log(`  Error Data:`, data);
      }
      
    } catch (error) {
      console.log(`  💥 Request Failed: ${error.message}`);
    }
  }
  
  // Test the brokers list endpoint
  console.log(`\n\n📋 Testing Brokers List API`);
  try {
    const listUrl = 'http://localhost:3000/api/brokers';
    console.log(`  List URL: ${listUrl}`);
    
    const response = await fetch(listUrl);
    const data = await response.json();
    
    console.log(`  Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log(`  ✅ List API Success`);
      console.log(`  Total Brokers: ${Array.isArray(data) ? data.length : 'Not an array'}`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`  Sample Broker Keys: ${Object.keys(data[0]).join(', ')}`);
        data.slice(0, 3).forEach((broker, index) => {
          console.log(`    ${index + 1}. ${broker.name || broker.slug || 'Unknown'} (${broker.slug})`);
        });
      }
    } else {
      console.log(`  ❌ List API Error: ${response.status}`);
      console.log(`  Error Data:`, data);
    }
    
  } catch (error) {
    console.log(`  💥 List Request Failed: ${error.message}`);
  }
}

// Run tests
testApiEndpoints()
  .then(() => {
    console.log('\n🏁 API tests completed!');
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
  });