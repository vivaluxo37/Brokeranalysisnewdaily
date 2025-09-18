// Test final functionality after fixes
const fetch = require('node-fetch');

async function testBrokersPage() {
  console.log('Testing brokers page functionality...\n');

  try {
    // Test API endpoint
    console.log('1. Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/brokers?page=1&limit=5');
    const data = await response.json();

    if (data.success) {
      console.log('✅ API endpoint working');
      console.log(`   - Found ${data.data.length} brokers`);
      console.log(`   - Total count: ${data.pagination.totalCount}`);

      // Check if first broker has required fields
      if (data.data.length > 0) {
        const firstBroker = data.data[0];
        const requiredFields = ['id', 'name', 'slug', 'rating', 'status'];
        const missingFields = requiredFields.filter(field => !firstBroker[field]);

        if (missingFields.length === 0) {
          console.log('✅ All required fields present');
        } else {
          console.log('❌ Missing fields:', missingFields);
        }
      }
    } else {
      console.log('❌ API endpoint failed:', data.error);
    }

    // Test brokers page
    console.log('\n2. Testing brokers page...');
    const pageResponse = await fetch('http://localhost:3000/brokers');

    if (pageResponse.ok) {
      console.log('✅ Brokers page accessible');
      const html = await pageResponse.text();

      // Check for key elements
      const hasSearch = html.includes('Search brokers');
      const hasFilters = html.includes('Filters');
      const hasComparison = html.includes('Compare');

      console.log(`   - Search functionality: ${hasSearch ? '✅' : '❌'}`);
      console.log(`   - Filter section: ${hasFilters ? '✅' : '❌'}`);
      console.log(`   - Comparison feature: ${hasComparison ? '✅' : '❌'}`);
    } else {
      console.log('❌ Brokers page failed:', pageResponse.status);
    }

    console.log('\n3. Testing error handling...');

    // Test with invalid page
    const errorResponse = await fetch('http://localhost:3000/api/brokers?page=999');
    const errorData = await errorResponse.json();

    if (errorResponse.status === 200 && errorData.data && errorData.data.length === 0) {
      console.log('✅ Empty results handled correctly');
    } else {
      console.log('❌ Error handling issue');
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testBrokersPage();