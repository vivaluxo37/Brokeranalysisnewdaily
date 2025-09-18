const fetch = require('node-fetch');

// Debug broker page errors
async function debugBrokerErrors() {
  console.log('🔍 Debugging Broker Page Errors\n');
  
  const brokerSlug = 'bdswiss';
  const url = `http://localhost:3000/brokers/${brokerSlug}`;
  
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    
    console.log(`Status: ${response.status}`);
    console.log(`Content Length: ${html.length}`);
    console.log(`Content Type: ${response.headers.get('content-type')}`);
    
    // Check for specific error patterns
    const errorPatterns = [
      { name: '404 Error', pattern: /404/gi },
      { name: 'Not Found', pattern: /This page could not be found/gi },
      { name: 'Error Boundary', pattern: /ErrorFallback/gi },
      { name: 'HTTP Access Error', pattern: /HTTPAccessErrorFallback/gi },
      { name: 'React Error', pattern: /react.*error/gi },
      { name: 'Next.js Error', pattern: /next.*error/gi }
    ];
    
    console.log('\n🔍 Error Pattern Analysis:');
    errorPatterns.forEach(({ name, pattern }) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`  ❌ ${name}: Found ${matches.length} occurrence(s)`);
        matches.slice(0, 3).forEach(match => {
          console.log(`    - "${match}"`);
        });
      } else {
        console.log(`  ✅ ${name}: Not found`);
      }
    });
    
    // Check for broker-specific content
    console.log('\n📊 Content Analysis:');
    const contentChecks = [
      { name: 'Broker Name', pattern: new RegExp(brokerSlug, 'gi') },
      { name: 'BrokerAnalysis', pattern: /BrokerAnalysis/gi },
      { name: 'React Root', pattern: /__next/gi },
      { name: 'Script Tags', pattern: /<script/gi },
      { name: 'Meta Tags', pattern: /<meta/gi }
    ];
    
    contentChecks.forEach(({ name, pattern }) => {
      const matches = html.match(pattern);
      console.log(`  ${matches ? '✅' : '❌'} ${name}: ${matches ? matches.length + ' found' : 'Not found'}`);
    });
    
    // Extract key HTML sections
    console.log('\n📄 HTML Structure Analysis:');
    
    // Check for title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      console.log(`  Title: "${titleMatch[1]}"`);
    }
    
    // Check for error components in script tags
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      console.log(`  Found ${scriptMatches.length} script tags`);
      
      scriptMatches.forEach((script, index) => {
        if (script.includes('NotFound') || script.includes('404') || script.includes('ErrorFallback')) {
          console.log(`  ⚠️  Script ${index + 1} contains error components`);
          
          // Extract error component details
          const errorComponentMatch = script.match(/"NotFound"[^}]*status[^}]*404[^}]*message[^}]*"([^"]*)"/i);
          if (errorComponentMatch) {
            console.log(`    Error Message: "${errorComponentMatch[1]}"`);
          }
        }
      });
    }
    
    // Check for hydration data
    const hydrationMatch = html.match(/__NEXT_DATA__[^<]*/i);
    if (hydrationMatch) {
      console.log(`  ✅ Next.js hydration data found`);
    } else {
      console.log(`  ❌ No Next.js hydration data found`);
    }
    
    // Save a sample of the HTML for manual inspection
    const fs = require('fs');
    const sampleHtml = html.substring(0, 2000) + '\n\n... (truncated) ...\n\n' + html.substring(html.length - 1000);
    fs.writeFileSync('broker-page-sample.html', sampleHtml);
    console.log('\n💾 Sample HTML saved to broker-page-sample.html');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run debug
debugBrokerErrors()
  .then(() => {
    console.log('\n🏁 Debug completed!');
  })
  .catch(error => {
    console.error('💥 Debug runner failed:', error);
  });