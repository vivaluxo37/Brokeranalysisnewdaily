const fetch = require('node-fetch');

// Inspect API data structure
async function inspectApiData() {
  console.log('🔍 Inspecting API Data Structure\n');
  
  try {
    // Test individual broker endpoint
    const brokerUrl = 'http://localhost:3000/api/brokers/bdswiss';
    console.log(`📊 Testing: ${brokerUrl}`);
    
    const brokerResponse = await fetch(brokerUrl);
    const brokerData = await brokerResponse.json();
    
    console.log(`Status: ${brokerResponse.status}`);
    console.log(`Response Structure:`);
    console.log(JSON.stringify(brokerData, null, 2));
    
    // Test brokers list endpoint
    console.log(`\n\n📋 Testing: http://localhost:3000/api/brokers`);
    
    const listResponse = await fetch('http://localhost:3000/api/brokers');
    const listData = await listResponse.json();
    
    console.log(`Status: ${listResponse.status}`);
    console.log(`List Response Structure:`);
    console.log(JSON.stringify(listData, null, 2));
    
  } catch (error) {
    console.error('💥 Inspection failed:', error.message);
  }
}

// Run inspection
inspectApiData()
  .then(() => {
    console.log('\n🏁 Inspection completed!');
  })
  .catch(error => {
    console.error('💥 Inspector failed:', error);
  });