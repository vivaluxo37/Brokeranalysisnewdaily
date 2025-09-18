const fetch = require('node-fetch');

async function debugBrokerContent() {
  try {
    console.log('Debugging broker page content...');
    
    const response = await fetch('http://localhost:3000/brokers/bdswiss');
    const html = await response.text();
    
    console.log('\n=== Response Status ===');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', html.length);
    
    console.log('\n=== Error Detection ===');
    const errorPatterns = [
      'error',
      'Error',
      'ERROR',
      '404',
      'not found',
      'Not Found',
      'Page not found',
      'Something went wrong'
    ];
    
    errorPatterns.forEach(pattern => {
      if (html.includes(pattern)) {
        console.log(`Found pattern "${pattern}" in content`);
        
        // Find context around the error
        const index = html.indexOf(pattern);
        const start = Math.max(0, index - 100);
        const end = Math.min(html.length, index + 100);
        const context = html.substring(start, end);
        console.log('Context:', context.replace(/\n/g, '\\n'));
        console.log('---');
      }
    });
    
    console.log('\n=== Page Title ===');
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    if (titleMatch) {
      console.log('Title:', titleMatch[1]);
    }
    
    console.log('\n=== Broker Name Detection ===');
    const brokerPatterns = ['bdswiss', 'BDSwiss', 'BD Swiss'];
    brokerPatterns.forEach(pattern => {
      if (html.includes(pattern)) {
        console.log(`Found broker pattern "${pattern}"`);
      }
    });
    
    console.log('\n=== Main Content Structure ===');
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (mainMatch) {
      const mainContent = mainMatch[1];
      console.log('Main content length:', mainContent.length);
      console.log('First 200 chars of main:', mainContent.substring(0, 200).replace(/\n/g, '\\n'));
    }
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}

debugBrokerContent();