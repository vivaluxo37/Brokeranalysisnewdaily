const fs = require('fs');
const path = require('path');

// Simple HTML parser to test extraction
class SimpleHTMLParser {
  constructor(html) {
    this.html = html;
  }

  // Simple regex-based extractor for testing
  extractWithRegex(pattern, defaultValue = null) {
    const match = this.html.match(pattern);
    return match ? match[1] : defaultValue;
  }

  extractBrokerName() {
    return this.extractWithRegex(/<title>([^-]+)-\s*DailyForex\.com/i) ||
           this.extractWithRegex(/<h1[^>]*>([^<]+)<\/h1>/i) ||
           this.extractWithRegex(/broker["'\s]*name["'\s]*[:=]["'\s]*([^"'\s>]+)/i);
  }

  extractRating() {
    return this.extractWithRegex(/rating["'\s]*[:=]["'\s]*([\d.]+)/i) ||
           this.extractWithRegex(/stars?\s*[:=]\s*["'\s]*([\d.]+)/i);
  }

  extractDescription() {
    return this.extractWithRegex(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
           this.extractWithRegex(/<p[^>]*>([^<]{100,})<\/p>/i);
  }

  extractRegulatoryInfo() {
    const regulations = [];
    const regulatorPattern = /regulated\s+by\s+([^,<\s]+)/gi;
    let match;
    while ((match = regulatorPattern.exec(this.html)) !== null) {
      regulations.push(match[1].trim());
    }
    return regulations;
  }

  extractMinDeposit() {
    return this.extractWithRegex(/minimum\s+deposit["'\s]*[:=]?\s*["'\s]*\$?([\d,]+)/i) ||
           this.extractWithRegex(/min\s+deposit["'\s]*[:=]?\s*["'\s]*\$?([\d,]+)/i);
  }

  extractBasicInfo() {
    return {
      name: this.extractBrokerName(),
      rating: this.extractRating() ? parseFloat(this.extractRating()) : 0,
      description: this.extractDescription(),
      regulations: this.extractRegulatoryInfo(),
      minDeposit: this.extractMinDeposit(),
      extractedAt: new Date().toISOString()
    };
  }
}

// Test the parser on a sample file
async function testParser() {
  const sampleFile = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers\\admirals-review.html';

  try {
    console.log(`📖 Reading sample file: ${sampleFile}`);

    if (!fs.existsSync(sampleFile)) {
      throw new Error(`Sample file not found: ${sampleFile}`);
    }

    const html = fs.readFileSync(sampleFile, 'utf8');
    console.log(`📄 File size: ${(html.length / 1024).toFixed(2)} KB`);

    const parser = new SimpleHTMLParser(html);
    const brokerInfo = parser.extractBasicInfo();

    console.log('\n📊 Extracted Broker Information:');
    console.log(`   Name: ${brokerInfo.name || 'Not found'}`);
    console.log(`   Rating: ${brokerInfo.rating || 'Not found'}`);
    console.log(`   Min Deposit: $${brokerInfo.minDeposit || 'Not found'}`);
    console.log(`   Regulations: ${brokerInfo.regulations.length > 0 ? brokerInfo.regulations.join(', ') : 'Not found'}`);
    console.log(`   Description: ${brokerInfo.description ? brokerInfo.description.substring(0, 200) + '...' : 'Not found'}`);

    console.log('\n✅ Parser test completed successfully!');
    return brokerInfo;

  } catch (error) {
    console.error(`❌ Parser test failed: ${error.message}`);
    return null;
  }
}

// Run the test
testParser().then(result => {
  if (result) {
    console.log('\n🎉 HTML parser test successful!');
    console.log('Ready to proceed with batch extraction');
  } else {
    console.log('\n⚠️  Parser test failed - need to refine extraction logic');
  }
});