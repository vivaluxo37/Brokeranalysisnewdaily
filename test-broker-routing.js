const fetch = require('node-fetch');

async function testBrokerRouting() {
  console.log('=== Testing Broker Routing and API ===\n');
  
  const baseUrl = 'http://localhost:3000';
  const testSlugs = ['bdswiss', 'binance', 'capital', 'blackbull'];
  
  // Test 1: Check if API endpoints work
  console.log('1. Testing API endpoints:');
  for (const slug of testSlugs) {
    try {
      const response = await fetch(`${baseUrl}/api/brokers/${slug}`);
      console.log(`   /api/brokers/${slug}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   - Success: ${data.success}, Has data: ${!!data.data}`);
        if (data.data) {
          console.log(`   - Broker name: ${data.data.name}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   - Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   - Network error: ${error.message}`);
    }
    console.log('');
  }
  
  // Test 2: Check if broker pages return proper HTML
  console.log('2. Testing broker page routes:');
  for (const slug of testSlugs) {
    try {
      const response = await fetch(`${baseUrl}/brokers/${slug}`);
      console.log(`   /brokers/${slug}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const html = await response.text();
        
        // Check for key indicators
        const hasReactRoot = html.includes('__next');
        const hasLoadingSkeleton = html.includes('animate-pulse');
        const has404Error = html.includes('404') || html.includes('This page could not be found');
        const hasErrorBoundary = html.includes('error-boundary') || html.includes('Error');
        const hasBrokerContent = html.includes(slug) || html.includes('broker');
        
        console.log(`   - Has React/Next.js: ${hasReactRoot}`);
        console.log(`   - Has loading skeleton: ${hasLoadingSkeleton}`);
        console.log(`   - Has 404 error: ${has404Error}`);
        console.log(`   - Has error boundary: ${hasErrorBoundary}`);
        console.log(`   - Has broker content: ${hasBrokerContent}`);
        
        // Check for specific Next.js routing issues
        if (has404Error) {
          console.log(`   - ⚠️  Page shows 404 - routing issue detected`);
        }
        
        if (hasLoadingSkeleton && !hasBrokerContent) {
          console.log(`   - ⚠️  Page stuck in loading state`);
        }
      }
    } catch (error) {
      console.log(`   - Network error: ${error.message}`);
    }
    console.log('');
  }
  
  // Test 3: Check if the dynamic route file exists
  console.log('3. Checking route structure:');
  try {
    const fs = require('fs');
    const path = require('path');
    
    const routeFiles = [
      'src/app/brokers/[slug]/page.tsx',
      'src/app/api/brokers/[slug]/route.ts'
    ];
    
    for (const file of routeFiles) {
      const exists = fs.existsSync(file);
      console.log(`   ${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
      
      if (exists) {
        const stats = fs.statSync(file);
        console.log(`   - Size: ${stats.size} bytes`);
        console.log(`   - Modified: ${stats.mtime.toISOString()}`);
      }
    }
  } catch (error) {
    console.log(`   - Error checking files: ${error.message}`);
  }
  
  console.log('\n=== Test Complete ===');
}

testBrokerRouting().catch(console.error);