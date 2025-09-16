const fs = require('fs');
const path = require('path');

class BrokerNameFixer {
  constructor() {
    this.sourceDirectory = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers';
    this.fixedBrokers = [];
    this.stats = {
      totalFiles: 0,
      fixedNames: 0,
      failedFixes: 0
    };
  }

  extractBrokerNameFromFileName(filePath) {
    // Extract broker name from HTML file name
    const fileName = path.basename(filePath, '.html');

    // Convert hyphens to spaces and capitalize
    const name = fileName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();

    // Clean up common patterns
    return name
      .replace(/ Review$/i, '')
      .replace(/ Forex$/i, '')
      .replace(/ Broker$/i, '')
      .replace(/ Trading$/i, '')
      .replace(/ Markets$/i, '')
      .replace(/ Group$/i, '')
      .replace(/ Ltd$/i, '')
      .replace(/ Limited$/i, '')
      .replace(/ Inc$/i, '')
      .replace(/ Corp$/i, '')
      .trim();
  }

  extractBrokerNameFromHtmlContent(content) {
    // Try to extract broker name from HTML content
    const patterns = [
      /<h1[^>]*>([^<]+?)<\/h1>/i,
      /<title[^>]*>([^<]+?)\s*(Review|Forex|Broker)?\s*-[^<]*<\/title>/i,
      /"brokerName"\s*:\s*"([^"]+)"/i,
      /"name"\s*:\s*"([^"]+)"/i,
      /class="[^"]*broker-name[^"]*"[^>]*>([^<]+)<\//i,
      /class="[^"]*title[^"]*"[^>]*>([^<]+)<\//i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        let name = match[1].trim();

        // Clean up the extracted name
        name = name
          .replace(/&nbsp;/gi, ' ')
          .replace(/&amp;/gi, '&')
          .replace(/&lt;/gi, '<')
          .replace(/&gt;/gi, '>')
          .replace(/&#39;/gi, "'")
          .replace(/&quot;/gi, '"')
          .replace(/\s+/g, ' ')
          .trim();

        if (name.length > 2 && name.length < 100) {
          return name;
        }
      }
    }

    return null;
  }

  fixBrokerNames() {
    console.log('🔧 Starting broker name fixing process...');

    // Load the existing validated brokers data
    const validatedData = JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8'));
    const brokers = validatedData.validBrokers || [];

    console.log(`📊 Processing ${brokers.length} brokers...`);

    for (const broker of brokers) {
      this.stats.totalFiles++;

      try {
        // Try to get a better name from the file path
        let fixedName = null;

        if (broker.filePath) {
          // Method 1: Extract from file name
          fixedName = this.extractBrokerNameFromFileName(broker.filePath);
        }

        // Method 2: Try to read the HTML file and extract from content
        if (!fixedName || fixedName === 'url' || fixedName.length < 3) {
          if (fs.existsSync(broker.filePath)) {
            const content = fs.readFileSync(broker.filePath, 'utf8');
            fixedName = this.extractBrokerNameFromHtmlContent(content);
          }
        }

        // Method 3: Use existing name if it's reasonable
        if (!fixedName || fixedName === 'url' || fixedName.length < 3) {
          if (broker.name && broker.name !== 'url' && broker.name.length > 2) {
            fixedName = broker.name;
          }
        }

        // Update broker with fixed name
        const fixedBroker = {
          ...broker,
          originalName: broker.name,
          name: fixedName || 'Unknown Broker',
          nameFixed: fixedName && fixedName !== broker.name && broker.name === 'url'
        };

        if (fixedBroker.nameFixed) {
          this.stats.fixedNames++;
          console.log(`✅ Fixed: "${broker.name}" → "${fixedBroker.name}"`);
        } else {
          console.log(`ℹ️  Kept: "${fixedBroker.name}"`);
        }

        this.fixedBrokers.push(fixedBroker);

      } catch (error) {
        this.stats.failedFixes++;
        console.error(`❌ Failed to fix ${broker.name}:`, error.message);

        // Keep original broker if fixing fails
        this.fixedBrokers.push({
          ...broker,
          name: broker.name !== 'url' ? broker.name : 'Unknown Broker',
          nameFixed: false,
          fixError: error.message
        });
      }
    }

    console.log('\n📊 Name Fixing Statistics:');
    console.log(`   Total Processed: ${this.stats.totalFiles}`);
    console.log(`   Successfully Fixed: ${this.stats.fixedNames}`);
    console.log(`   Failed to Fix: ${this.stats.failedFixes}`);
    console.log(`   Success Rate: ${((this.stats.fixedNames / this.stats.totalFiles) * 100).toFixed(2)}%`);

    return this.fixedBrokers;
  }

  saveFixedBrokers() {
    const fixedData = {
      metadata: {
        fixedAt: new Date().toISOString(),
        originalData: JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8')).metadata,
        fixStats: this.stats
      },
      fixedBrokers: this.fixedBrokers
    };

    fs.writeFileSync('fixed-broker-names.json', JSON.stringify(fixedData, null, 2));
    console.log('\n📄 Fixed broker data saved to: fixed-broker-names.json');

    return fixedData;
  }

  generateReport() {
    const report = {
      fixDate: new Date().toISOString(),
      statistics: this.stats,
      sampleFixes: this.fixedBrokers
        .filter(b => b.nameFixed)
        .slice(0, 10)
        .map(b => ({
          original: b.originalName,
          fixed: b.name,
          sourceFile: b.sourceFile
        })),
      recommendations: [
        {
          priority: 'High',
          issue: 'Some broker names still show as "url" or "Unknown"',
          recommendation: 'Manual review needed for remaining unidentified brokers'
        },
        {
          priority: 'Medium',
          issue: 'Data extraction needs improvement',
          recommendation: 'Enhance HTML parser for better broker information extraction'
        }
      ]
    };

    fs.writeFileSync('broker-name-fix-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Fix report saved to: broker-name-fix-report.json');

    return report;
  }

  async runNameFixing() {
    console.log('🚀 Starting Broker Name Fixing Process');
    console.log('=' * 50);

    const fixedBrokers = this.fixBrokerNames();
    const fixedData = this.saveFixedBrokers();
    const report = this.generateReport();

    console.log('\n✅ Broker name fixing completed!');
    console.log(`🎯 ${this.stats.fixedNames} names fixed out of ${this.stats.totalFiles} brokers`);

    return { fixedBrokers, fixedData, report };
  }
}

// Execute the name fixing
async function executeBrokerNameFixing() {
  const fixer = new BrokerNameFixer();
  return await fixer.runNameFixing();
}

// Run the name fixing
executeBrokerNameFixing().then(result => {
  console.log('\n🎉 Broker name fixing completed!');
}).catch(error => {
  console.error('❌ Name fixing failed:', error.message);
});