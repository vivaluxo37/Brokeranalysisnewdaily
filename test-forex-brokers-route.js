const fetch = require('node-fetch');

/**
 * Test script to verify the new /forex-brokers/ routes work correctly
 */

const BASE_URL = 'http://localhost:3000';

async function testForexBrokersRoutes() {
  console.log('🧪 Testing /forex-brokers/ routes...');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Main forex-brokers directory
    console.log('\n1. Testing /forex-brokers/ directory:');
    const directoryResponse = await fetch(`${BASE_URL}/forex-brokers/`);
    console.log(`   Status: ${directoryResponse.status}`);
    console.log(`   Redirected: ${directoryResponse.redirected}`);
    if (directoryResponse.redirected) {
      console.log(`   Final URL: ${directoryResponse.url}`);
    }
    
    // Test 2: Individual broker pages
    const testBrokers = ['bdswiss', 'binance', 'capital'];
    
    console.log('\n2. Testing individual broker pages:');
    for (const broker of testBrokers) {
      console.log(`\n   Testing /forex-brokers/${broker}:`);
      const brokerResponse = await fetch(`${BASE_URL}/forex-brokers/${broker}`);
      console.log(`   Status: ${brokerResponse.status}`);
      console.log(`   Redirected: ${brokerResponse.redirected}`);
      if (brokerResponse.redirected) {
        console.log(`   Final URL: ${brokerResponse.url}`);
      }
      
      // Check if the final page loads correctly
      const content = await brokerResponse.text();
      const hasError = content.includes('This page could not be found') || content.includes('404');
      const hasBrokerContent = content.toLowerCase().includes(broker.toLowerCase());
      
      console.log(`   Has Error: ${hasError}`);
      console.log(`   Has Broker Content: ${hasBrokerContent}`);
      console.log(`   Content Length: ${content.length} chars`);
    }
    
    // Test 3: Compare with original /brokers/ routes
    console.log('\n3. Comparing with original /brokers/ routes:');
    for (const broker of testBrokers) {
      console.log(`\n   Comparing ${broker}:`);
      
      // Test original route
      const originalResponse = await fetch(`${BASE_URL}/brokers/${broker}`);
      const originalContent = await originalResponse.text();
      
      // Test new route
      const newResponse = await fetch(`${BASE_URL}/forex-brokers/${broker}`);
      const newContent = await newResponse.text();
      
      console.log(`   Original /brokers/${broker}: ${originalResponse.status}`);
      console.log(`   New /forex-brokers/${broker}: ${newResponse.status}`);
      console.log(`   Content matches: ${originalContent === newContent}`);
    }
    
    console.log('\n✅ Forex brokers route testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing forex brokers routes:', error.message);
  }
}

// Run the test
testForexBrokersRoutes();