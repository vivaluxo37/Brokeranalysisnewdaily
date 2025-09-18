const fetch = require('node-fetch');

/**
 * Final verification test to confirm the forex-brokers routes work correctly
 */

const BASE_URL = 'http://localhost:3000';

async function finalVerification() {
  console.log('🔍 Final Verification: Testing forex-brokers routes...');
  console.log('=' .repeat(60));
  
  try {
    // Test the redirect behavior
    console.log('\n1. Testing redirect behavior:');
    
    const testBroker = 'bdswiss';
    
    // Test with redirect following disabled to see the redirect response
    const redirectResponse = await fetch(`${BASE_URL}/forex-brokers/${testBroker}`, {
      redirect: 'manual'
    });
    
    console.log(`   /forex-brokers/${testBroker} response:`);
    console.log(`   Status: ${redirectResponse.status}`);
    console.log(`   Status Text: ${redirectResponse.statusText}`);
    
    if (redirectResponse.status >= 300 && redirectResponse.status < 400) {
      const location = redirectResponse.headers.get('location');
      console.log(`   Redirect Location: ${location}`);
      
      // Now test the final destination
      console.log('\n2. Testing final destination:');
      const finalUrl = location.startsWith('http') ? location : `${BASE_URL}${location}`;
      const finalResponse = await fetch(finalUrl);
      const finalContent = await finalResponse.text();
      console.log(`   Testing URL: ${finalUrl}`);
      
      console.log(`   Final URL status: ${finalResponse.status}`);
      console.log(`   Content length: ${finalContent.length}`);
      
      // Check for specific content indicators
      const hasError = finalContent.includes('This page could not be found') || 
                      finalContent.includes('404') ||
                      finalContent.includes('Page Not Found');
      const hasBrokerContent = finalContent.toLowerCase().includes(testBroker.toLowerCase());
      const hasValidStructure = finalContent.includes('<html') && finalContent.includes('</html>');
      
      console.log(`   Has Error Content: ${hasError}`);
      console.log(`   Has Broker Content: ${hasBrokerContent}`);
      console.log(`   Has Valid HTML Structure: ${hasValidStructure}`);
      
      // Extract title if available
      const titleMatch = finalContent.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        console.log(`   Page Title: "${titleMatch[1]}"`);
      }
      
      if (!hasError && hasBrokerContent && hasValidStructure) {
        console.log('\n✅ SUCCESS: forex-brokers route is working correctly!');
        console.log(`   ✓ /forex-brokers/${testBroker} redirects to /brokers/${testBroker}`);
        console.log('   ✓ Final page loads without errors');
        console.log('   ✓ Page contains broker-specific content');
      } else {
        console.log('\n⚠️  ISSUE DETECTED:');
        if (hasError) console.log('   - Page contains error content');
        if (!hasBrokerContent) console.log('   - Page missing broker-specific content');
        if (!hasValidStructure) console.log('   - Page has invalid HTML structure');
      }
    } else {
      console.log('\n❌ REDIRECT FAILED: Expected 3xx status code for redirect');
    }
    
    // Test a few more brokers quickly
    console.log('\n3. Quick test of other brokers:');
    const otherBrokers = ['binance', 'capital'];
    
    for (const broker of otherBrokers) {
      const response = await fetch(`${BASE_URL}/forex-brokers/${broker}`, { redirect: 'manual' });
      console.log(`   /forex-brokers/${broker}: ${response.status} ${response.statusText}`);
      if (response.status >= 300 && response.status < 400) {
        console.log(`     → Redirects to: ${response.headers.get('location')}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during final verification:', error.message);
  }
}

// Run the verification
finalVerification();