// Debug script to examine the actual page content
async function debugPageContent() {
  console.log('🔍 Debugging page content...');
  
  try {
    const response = await fetch('http://localhost:3000/brokers/bdswiss');
    console.log(`📊 HTTP Status: ${response.status}`);
    
    if (response.ok) {
      const html = await response.text();
      console.log(`📄 Response length: ${html.length} characters\n`);
      
      // Extract key parts of the HTML
      console.log('🔍 Checking page title...');
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/);
      if (titleMatch) {
        console.log(`📝 Title: ${titleMatch[1]}`);
      }
      
      console.log('\n🔍 Checking for 404 indicators...');
      if (html.includes('404')) {
        console.log('❌ Found "404" in content');
        
        // Find context around 404
        const lines = html.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('404')) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
      
      console.log('\n🔍 Checking for broker-specific content...');
      const brokerTerms = ['bdswiss', 'BDSwiss', 'broker', 'trading', 'forex'];
      brokerTerms.forEach(term => {
        if (html.toLowerCase().includes(term.toLowerCase())) {
          console.log(`✅ Found "${term}" in content`);
        } else {
          console.log(`❌ Missing "${term}" in content`);
        }
      });
      
      console.log('\n🔍 Checking page structure...');
      const hasNextJs = html.includes('__next') || html.includes('_next');
      const hasReact = html.includes('react') || html.includes('React');
      const hasBody = html.includes('<body') && html.includes('</body>');
      
      console.log(`Next.js structure: ${hasNextJs ? '✅' : '❌'}`);
      console.log(`React elements: ${hasReact ? '✅' : '❌'}`);
      console.log(`Valid HTML body: ${hasBody ? '✅' : '❌'}`);
      
      // Check for error pages
      console.log('\n🔍 Checking for error page indicators...');
      const errorIndicators = [
        'not found',
        'page not found',
        'error',
        'something went wrong',
        'this page could not be found'
      ];
      
      errorIndicators.forEach(indicator => {
        if (html.toLowerCase().includes(indicator)) {
          console.log(`⚠️ Found error indicator: "${indicator}"`);
        }
      });
      
      // Show first 500 characters of body content
      console.log('\n📄 First 500 characters of content:');
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
      if (bodyMatch) {
        const bodyContent = bodyMatch[1].replace(/<[^>]*>/g, '').trim();
        console.log(bodyContent.substring(0, 500) + '...');
      } else {
        console.log('No body content found');
      }
      
    } else {
      console.log(`❌ HTTP request failed with status ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugPageContent();