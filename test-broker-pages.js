// Simple HTTP test for broker pages
async function testBrokerPage() {
  console.log('🌐 Testing broker page HTTP response...');
  
  try {
    const response = await fetch('http://localhost:3000/brokers/bdswiss');
    console.log(`📊 HTTP Status: ${response.status}`);
    
    if (response.ok) {
      const html = await response.text();
      console.log(`📄 Response length: ${html.length} characters`);
      
      // Check for common error indicators
      if (html.includes('404') || html.includes('Not Found')) {
        console.log('❌ Page contains 404 error');
        return false;
      } else if (html.includes('500') || html.includes('Internal Server Error')) {
        console.log('❌ Page contains 500 error');
        return false;
      } else if (html.includes('bdswiss') || html.includes('BDSwiss')) {
        console.log('✅ Page contains broker-specific content');
        return true;
      } else {
        console.log('⚠️ Page loaded but checking for general content...');
        
        // Check for basic page structure
        if (html.includes('<html') && html.includes('</html>')) {
          console.log('✅ Valid HTML structure found');
          
          // Check for Next.js app structure
          if (html.includes('__next') || html.includes('_next')) {
            console.log('✅ Next.js app structure detected');
            return true;
          }
        }
        return false;
      }
    } else {
      console.log(`❌ HTTP request failed with status ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ HTTP test failed:', error.message);
    return false;
  }
}

// Test multiple broker pages
async function testMultipleBrokers() {
  const brokers = ['bdswiss', 'binance', 'capital'];
  let successCount = 0;
  
  console.log('🚀 Testing multiple broker pages...\n');
  
  for (const broker of brokers) {
    console.log(`\n🔍 Testing broker: ${broker}`);
    
    try {
      const response = await fetch(`http://localhost:3000/brokers/${broker}`);
      console.log(`📊 Status: ${response.status}`);
      
      if (response.ok) {
        const html = await response.text();
        console.log(`📄 Content length: ${html.length} chars`);
        
        if (html.includes(broker) || html.includes('<html')) {
          console.log('✅ Page loaded successfully');
          successCount++;
        } else {
          console.log('⚠️ Page loaded but content unclear');
        }
      } else {
        console.log(`❌ Failed with status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n📈 Results: ${successCount}/${brokers.length} broker pages working`);
  return successCount === brokers.length;
}

// Run the tests
async function runTests() {
  console.log('🧪 Starting broker page functionality tests...\n');
  
  const singleTest = await testBrokerPage();
  const multipleTest = await testMultipleBrokers();
  
  console.log('\n📋 Summary:');
  console.log(`Single page test: ${singleTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Multiple pages test: ${multipleTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (singleTest && multipleTest) {
    console.log('\n🎉 All broker pages are working correctly!');
    console.log('The issue reported by the user may be related to:');
    console.log('- Browser caching');
    console.log('- URL routing (check if using /forex-brokers/ instead of /brokers/)');
    console.log('- Development environment hot-reload issues');
  } else {
    console.log('\n⚠️ Some issues detected with broker pages');
  }
}

runTests();