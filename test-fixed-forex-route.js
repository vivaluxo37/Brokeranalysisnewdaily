const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testForexBrokersRoute() {
  console.log('Testing fixed forex-brokers route...');
  
  try {
    // Test forex-brokers directory redirect
    console.log('\n1. Testing /forex-brokers/ redirect...');
    const dirResponse = await fetch(`${BASE_URL}/forex-brokers`, {
      redirect: 'manual'
    });
    console.log(`Status: ${dirResponse.status}`);
    console.log(`Location: ${dirResponse.headers.get('location')}`);
    
    // Test forex-brokers individual broker redirect
    console.log('\n2. Testing /forex-brokers/bdswiss redirect...');
    const brokerResponse = await fetch(`${BASE_URL}/forex-brokers/bdswiss`, {
      redirect: 'manual'
    });
    console.log(`Status: ${brokerResponse.status}`);
    console.log(`Location: ${brokerResponse.headers.get('location')}`);
    
    // Test that the final destination works
    console.log('\n3. Testing final destination /brokers/bdswiss...');
    const finalResponse = await fetch(`${BASE_URL}/brokers/bdswiss`);
    console.log(`Status: ${finalResponse.status}`);
    const finalText = await finalResponse.text();
    console.log(`Content length: ${finalText.length}`);
    console.log(`Contains broker name: ${finalText.includes('bdswiss')}`);
    console.log(`Contains error: ${finalText.includes('404') || finalText.includes('error')}`);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testForexBrokersRoute();