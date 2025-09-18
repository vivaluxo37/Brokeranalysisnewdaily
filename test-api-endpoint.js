const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test broker slugs from our database
const testSlugs = ['bdswiss', 'binance', 'capital', 'blackbull'];

async function testApiEndpoint(slug) {
  console.log(`\n🔍 Testing API endpoint for: ${slug}`);
  
  try {
    const url = `${API_BASE_URL}/api/brokers/${slug}`;
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error (${response.status}):`, errorText);
      return false;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ API Success for ${slug}`);
      console.log('Broker data received:');
      console.log('- ID:', data.data.id);
      console.log('- Name:', data.data.name);
      console.log('- Slug:', data.data.slug);
      console.log('- Rating:', data.data.rating);
      console.log('- Review Count:', data.data.review_count);
      console.log('- Regulations:', data.data.regulations?.length || 0, 'items');
      console.log('- Features:', data.data.features?.length || 0, 'items');
      console.log('- Platforms:', data.data.platforms?.length || 0, 'items');
      return true;
    } else {
      console.error(`❌ API returned error:`, data.error);
      return false;
    }
  } catch (err) {
    console.error(`❌ Request failed for ${slug}:`, err.message);
    return false;
  }
}

async function testAllEndpoints() {
  console.log('🚀 Testing API endpoints for broker pages...\n');
  console.log(`Base URL: ${API_BASE_URL}`);
  
  let successCount = 0;
  let totalCount = testSlugs.length;
  
  for (const slug of testSlugs) {
    const success = await testApiEndpoint(slug);
    if (success) successCount++;
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Results: ${successCount}/${totalCount} endpoints working`);
  
  if (successCount === 0) {
    console.log('\n❌ All API endpoints failed. Possible issues:');
    console.log('1. Development server is not running');
    console.log('2. API routes have syntax errors');
    console.log('3. Environment variables are not properly loaded');
    console.log('4. Database connection issues in API routes');
  } else if (successCount < totalCount) {
    console.log('\n⚠️  Some API endpoints failed. Check individual broker data.');
  } else {
    console.log('\n✅ All API endpoints are working correctly!');
  }
}

// Test if server is running
async function checkServerStatus() {
  console.log('🔍 Checking if development server is running...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/brokers`);
    console.log(`✅ Server is running (Status: ${response.status})`);
    return true;
  } catch (err) {
    console.log('❌ Server is not running or not accessible');
    console.log('Please start the development server with: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServerStatus();
  
  if (serverRunning) {
    await testAllEndpoints();
  } else {
    console.log('\n⚠️  Cannot test API endpoints without running server.');
  }
}

main().catch(console.error);