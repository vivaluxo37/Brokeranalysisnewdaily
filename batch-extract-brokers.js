const fs = require('fs');
const path = require('path');

// Enhanced HTML parser with better extraction
class BrokerHTMLParser {
  constructor(html) {
    this.html = html;
  }

  extractWithRegex(pattern, defaultValue = null) {
    const match = this.html.match(pattern);
    return match ? match[1] : defaultValue;
  }

  extractBrokerName() {
    // Try multiple patterns to find broker name
    const patterns = [
      /<title>([^-]+)-\s*DailyForex\.com/i,
      /<h1[^>]*>([^<]+)<\/h1>/i,
      /broker[^>]*name[^>]*[:=]["']*([^"'>]+)["']/i,
      /broker[^>]*title[^>]*[:=]["']*([^"'>]+)["']/i
    ];

    for (const pattern of patterns) {
      const match = this.html.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  extractRating() {
    const ratingMatch = this.html.match(/rating[^>]*[:=]["']*([0-9.]+)["']/i) ||
                       this.html.match(/stars?\s*[:=]\s*["']*([0-9.]+)["']/i);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  }

  extractDescription() {
    const descMatch = this.html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    if (descMatch) {
      return descMatch[1];
    }

    // Fallback to first long paragraph
    const paragraphMatch = this.html.match(/<p[^>]*>([^<]{150,})<\/p>/i);
    return paragraphMatch ? paragraphMatch[1].trim() : null;
  }

  extractRegulatoryInfo() {
    const regulations = [];
    const patterns = [
      /regulated\s+by\s+([^,<\s]+)/gi,
      /regulator[^>]*:\s*([^,<\n]+)/gi,
      /licen[cs]ed?\s+by\s+([^,<\s]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(this.html)) !== null) {
        const regulator = match[1].trim();
        if (regulator && !regulations.includes(regulator)) {
          regulations.push(regulator);
        }
      }
    });

    return regulations;
  }

  extractMinDeposit() {
    const depositMatch = this.html.match(/minimum\s+deposit[^0-9]*\$?([0-9,]+)/i) ||
                         this.html.match(/min\s+deposit[^0-9]*\$?([0-9,]+)/i);
    return depositMatch ? depositMatch[1].replace(/,/g, '') : null;
  }

  extractSpread() {
    const spreadMatch = this.html.match(/spread[^0-9]*([0-9.]+)\s*pips?/i) ||
                        this.html.match(/typical\s+spread[^0-9]*([0-9.]+)/i);
    return spreadMatch ? parseFloat(spreadMatch[1]) : null;
  }

  extractLeverage() {
    const leverageMatch = this.html.match(/leverage[^0-9]*([0-9:]+)/i) ||
                          this.html.match(/max\s+leverage[^0-9]*([0-9:]+)/i);
    return leverageMatch ? leverageMatch[1] : null;
  }

  extractAccountTypes() {
    const types = [];
    const typePatterns = [
      /standard\s+account/gi,
      /mini\s+account/gi,
      /micro\s+account/gi,
      /vip\s+account/gi,
      /islamic\s+account/gi,
      /ecn\s+account/gi,
      /stp\s+account/gi
    ];

    typePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(this.html)) !== null) {
        types.push(match[0].trim());
      }
    });

    return [...new Set(types)]; // Remove duplicates
  }

  extractPlatforms() {
    const platforms = [];
    const platformPatterns = [
      /mt4/gi,
      /mt5/gi,
      /metatrader\s*4/gi,
      /metatrader\s*5/gi,
      /cTrader/gi,
      /web\s+trader/gi,
      /mobile\s+trader/gi
    ];

    platformPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(this.html)) !== null) {
        platforms.push(match[0].trim());
      }
    });

    return [...new Set(platforms)];
  }

  extractCompleteInfo() {
    return {
      name: this.extractBrokerName(),
      rating: this.extractRating(),
      description: this.extractDescription(),
      regulations: this.extractRegulatoryInfo(),
      minDeposit: this.extractMinDeposit(),
      spread: this.extractSpread(),
      leverage: this.extractLeverage(),
      accountTypes: this.extractAccountTypes(),
      platforms: this.extractPlatforms(),
      extractedAt: new Date().toISOString()
    };
  }
}

// Batch extraction processor
class BatchExtractor {
  constructor(sourceDir) {
    this.sourceDir = sourceDir;
    this.results = [];
    this.errors = [];
  }

  async processFile(fileName) {
    const filePath = path.join(this.sourceDir, fileName);

    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const parser = new BrokerHTMLParser(html);
      const brokerInfo = parser.extractCompleteInfo();

      // Add file metadata
      brokerInfo.sourceFile = fileName;
      brokerInfo.filePath = filePath;
      brokerInfo.fileSize = Buffer.byteLength(html, 'utf8');

      return brokerInfo;

    } catch (error) {
      this.errors.push({
        file: fileName,
        error: error.message
      });
      return null;
    }
  }

  async processBatch(limit = null) {
    const files = fs.readdirSync(this.sourceDir)
      .filter(file => file.endsWith('.html'));

    const filesToProcess = limit ? files.slice(0, limit) : files;

    console.log(`🔄 Processing ${filesToProcess.length} HTML files...`);

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const progress = ((i + 1) / filesToProcess.length * 100).toFixed(1);

      process.stdout.write(`\r📊 Progress: ${progress}% (${i + 1}/${filesToProcess.length}) - ${file}`);

      const result = await this.processFile(file);
      if (result) {
        this.results.push(result);
      }
    }

    console.log('\n✅ Batch processing completed!');
    return this.results;
  }

  generateStats() {
    const stats = {
      totalFiles: this.results.length,
      errors: this.errors.length,
      brokersWithNames: this.results.filter(r => r.name).length,
      brokersWithRatings: this.results.filter(r => r.rating > 0).length,
      brokersWithRegulations: this.results.filter(r => r.regulations.length > 0).length,
      averageRating: 0,
      topRegulators: {},
      uniquePlatforms: new Set()
    };

    // Calculate average rating
    const validRatings = this.results.filter(r => r.rating > 0).map(r => r.rating);
    if (validRatings.length > 0) {
      stats.averageRating = (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(2);
    }

    // Count top regulators
    this.results.forEach(r => {
      r.regulations.forEach(reg => {
        stats.topRegulators[reg] = (stats.topRegulators[reg] || 0) + 1;
      });
      r.platforms.forEach(platform => {
        stats.uniquePlatforms.add(platform);
      });
    });

    // Sort regulators by frequency
    stats.topRegulators = Object.entries(stats.topRegulators)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    stats.uniquePlatforms = stats.uniquePlatforms.size;

    return stats;
  }

  saveResults(outputFile = 'extracted-brokers.json') {
    const exportData = {
      metadata: {
        extractedAt: new Date().toISOString(),
        totalBrokers: this.results.length,
        sourceDirectory: this.sourceDir
      },
      brokers: this.results,
      errors: this.errors,
      statistics: this.generateStats()
    };

    fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2));
    console.log(`💾 Results saved to: ${outputFile}`);
    return outputFile;
  }
}

// Main execution
async function runBatchExtraction() {
  const sourceDir = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers';
  const outputFile = 'extracted-brokers-data.json';

  try {
    console.log('🚀 Starting batch broker data extraction...');
    console.log(`📁 Source directory: ${sourceDir}`);

    const extractor = new BatchExtractor(sourceDir);

    // Process all files
    await extractor.processBatch();

    // Save results
    extractor.saveResults(outputFile);

    // Display summary
    const stats = extractor.generateStats();
    console.log('\n📊 Extraction Summary:');
    console.log(`   Total brokers extracted: ${stats.totalFiles}`);
    console.log(`   Brokers with names: ${stats.brokersWithNames}`);
    console.log(`   Brokers with ratings: ${stats.brokersWithRatings}`);
    console.log(`   Brokers with regulations: ${stats.brokersWithRegulations}`);
    console.log(`   Average rating: ${stats.averageRating}`);
    console.log(`   Unique platforms: ${stats.uniquePlatforms}`);
    console.log(`   Errors encountered: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      extractor.errors.slice(0, 5).forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }

    console.log('\n🎉 Batch extraction completed successfully!');
    return extractor.results;

  } catch (error) {
    console.error(`❌ Batch extraction failed: ${error.message}`);
    return null;
  }
}

// Run the batch extraction
runBatchExtraction().then(results => {
  if (results && results.length > 0) {
    console.log(`\n✅ Successfully extracted data from ${results.length} broker files!`);
  }
});