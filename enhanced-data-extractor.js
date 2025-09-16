const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class EnhancedDataExtractor {
  constructor() {
    this.sourceDirectory = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers';
    this.extractedData = {};
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      foundData: {},
      missingData: {}
    };
  }

  async extractMissingData() {
    console.log('🔍 Extracting missing data from HTML files...');

    // Load existing brokers from database
    const databaseAnalysis = JSON.parse(fs.readFileSync('database-analysis.json', 'utf8'));
    const emptyColumns = databaseAnalysis.emptyColumns.filter(col => col.priority === 'High' || col.priority === 'Medium');

    console.log(`📊 Found ${emptyColumns.length} columns to enrich from ${databaseAnalysis.summary.totalBrokers} brokers`);

    // Get list of HTML files
    const htmlFiles = this.getHtmlFiles();
    this.stats.totalFiles = htmlFiles.length;

    console.log(`📁 Found ${htmlFiles.length} HTML files to process`);

    // Process each HTML file
    for (const filePath of htmlFiles) {
      try {
        const brokerName = this.extractBrokerNameFromPath(filePath);
        const enhancedData = await this.extractFromHtmlFile(filePath, brokerName, emptyColumns);

        if (enhancedData && Object.keys(enhancedData).length > 0) {
          this.extractedData[brokerName] = enhancedData;
          this.updateStats(enhancedData);
        }

        this.stats.processedFiles++;

        if (this.stats.processedFiles % 20 === 0) {
          console.log(`📈 Progress: ${this.stats.processedFiles}/${htmlFiles.length} files processed`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }

    this.displayStats();
    return this.extractedData;
  }

  getHtmlFiles() {
    const files = [];
    try {
      const entries = fs.readdirSync(this.sourceDirectory, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.html')) {
          files.push(path.join(this.sourceDirectory, entry.name));
        }
      }
    } catch (error) {
      console.error('❌ Error reading directory:', error.message);
    }

    return files;
  }

  extractBrokerNameFromPath(filePath) {
    const fileName = path.basename(filePath, '.html');
    return fileName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, ' ')
      .replace(/ Review$/i, '')
      .replace(/ Forex$/i, '')
      .replace(/ Broker$/i, '')
      .trim();
  }

  async extractFromHtmlFile(filePath, brokerName, targetColumns) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(content);
      const document = dom.window.document;

      const enhancedData = {};

      // Extract data based on column priorities
      for (const column of targetColumns) {
        const value = this.extractColumnData(document, column.column, brokerName);
        if (value !== null && value !== undefined && value !== '') {
          enhancedData[column.column] = value;
        }
      }

      return enhancedData;
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
      return null;
    }
  }

  extractColumnData(document, column, brokerName) {
    try {
      switch (column) {
        case 'logo_url':
          return this.extractLogoUrl(document);

        case 'country':
        case 'headquarters_location':
          return this.extractCountry(document);

        case 'established_year':
          return this.extractEstablishedYear(document);

        case 'website_url':
          return this.extractWebsiteUrl(document);

        case 'platforms':
          return this.extractPlatforms(document);

        case 'instruments':
        case 'trading_instruments':
          return this.extractInstruments(document);

        case 'regulations':
          return this.extractRegulations(document);

        case 'account_types':
          return this.extractAccountTypes(document);

        case 'affiliate_url':
          return this.extractAffiliateUrl(document);

        case 'trust_score':
          return this.calculateTrustScore(document);

        case 'spread_type':
          return this.extractSpreadType(document);

        case 'support_channels':
          return this.extractSupportChannels(document);

        case 'affiliate_url':
          return this.extractAffiliateUrl(document);

        case 'min_deposit':
          return this.extractMinDeposit(document);

        case 'spreads_avg':
          return this.extractSpreadsAvg(document);

        case 'leverage_max':
          return this.extractLeverageMax(document);

        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  extractLogoUrl(document) {
    // Try multiple selectors for logo
    const logoSelectors = [
      '.broker-logo img',
      '.logo img',
      'img[alt*="logo"]',
      'img[alt*="Logo"]',
      '.broker-profile img',
      'header img'
    ];

    for (const selector of logoSelectors) {
      const logo = document.querySelector(selector);
      if (logo) {
        const src = logo.getAttribute('src') || logo.getAttribute('data-src');
        if (src && !src.includes('placeholder')) {
          return src.startsWith('http') ? src : `https://www.dailyforex.com${src}`;
        }
      }
    }

    return null;
  }

  extractCountry(document) {
    // Look for country information in various places
    const countryPatterns = [
      /(?:Headquarters|Located|HQ|Office):\s*([^,]+)/i,
      /(?:Country|Location):\s*([^,]+)/i,
      /(?:based in|from)\s+([A-Z][a-z]+)/i
    ];

    const textContent = document.body.textContent;

    for (const pattern of countryPatterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Look for structured data
    const structuredData = this.extractStructuredData(document);
    if (structuredData && structuredData.address && structuredData.address.addressCountry) {
      return structuredData.address.addressCountry;
    }

    return null;
  }

  extractEstablishedYear(document) {
    // Look for establishment year
    const yearPatterns = [
      /(?:established|founded|since):\s*(\d{4})/i,
      /(?:est\.)\s*(\d{4})/i,
      /(\d{4})\s*(?:-|–|to)\s*(?:present|now)/i
    ];

    const textContent = document.body.textContent;

    for (const pattern of yearPatterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    // Look for structured data
    const structuredData = this.extractStructuredData(document);
    if (structuredData && structuredData.foundingDate) {
      return new Date(structuredData.foundingDate).getFullYear();
    }

    return null;
  }

  extractWebsiteUrl(document) {
    // Look for website links
    const websiteSelectors = [
      'a[href*="visit"]',
      'a[href*="website"]',
      'a[href*="trade"]',
      '.website a',
      '.official-site a',
      'a[href^="http"]:not([href*="dailyforex"])'
    ];

    for (const selector of websiteSelectors) {
      const link = document.querySelector(selector);
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('http')) {
          return href;
        }
      }
    }

    return null;
  }

  extractPlatforms(document) {
    // Look for trading platforms
    const platformKeywords = ['MT4', 'MT5', 'MetaTrader', 'cTrader', 'WebTrader', 'Mobile App', 'iOS', 'Android'];
    const platforms = [];

    platformKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const textContent = document.body.textContent;
      if (regex.test(textContent)) {
        platforms.push(keyword);
      }
    });

    return platforms.length > 0 ? platforms : null;
  }

  extractInstruments(document) {
    // Look for trading instruments
    const instrumentKeywords = ['Forex', 'CFDs', 'Stocks', 'Indices', 'Commodities', 'Cryptocurrencies', 'Futures', 'Options'];
    const instruments = [];

    instrumentKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const textContent = document.body.textContent;
      if (regex.test(textContent)) {
        instruments.push(keyword);
      }
    });

    return instruments.length > 0 ? instruments : null;
  }

  extractRegulations(document) {
    // Look for regulatory information
    const regulationKeywords = ['FCA', 'ASIC', 'CySEC', 'FSC', 'NFA', 'FINMA', 'BaFin', 'MiFID'];
    const regulations = [];

    regulationKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const textContent = document.body.textContent;
      if (regex.test(textContent)) {
        regulations.push(keyword);
      }
    });

    return regulations.length > 0 ? regulations : null;
  }

  extractAccountTypes(document) {
    // Look for account types
    const accountTypes = ['Standard', 'ECN', 'STP', 'Islamic', 'Swap-Free', 'Demo', 'Professional', 'VIP', 'Cent'];
    const foundTypes = [];

    accountTypes.forEach(type => {
      const regex = new RegExp(type, 'gi');
      const textContent = document.body.textContent;
      if (regex.test(textContent)) {
        foundTypes.push(type);
      }
    });

    return foundTypes.length > 0 ? foundTypes : null;
  }

  extractAffiliateUrl(document) {
    // Look for affiliate links
    const affiliateSelectors = [
      'a[href*="affiliate"]',
      'a[href*="ref"]',
      'a[href*="partner"]',
      'a[href*="ib"]'
    ];

    for (const selector of affiliateSelectors) {
      const link = document.querySelector(selector);
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('http')) {
          return href;
        }
      }
    }

    return null;
  }

  calculateTrustScore(document) {
    // Simple trust score calculation based on content
    const textContent = document.body.textContent;
    let score = 50; // Base score

    // Add points for regulations mentioned
    const regulationCount = (textContent.match(/FCA|ASIC|CySEC|FSC|NFA|FINMA|BaFin/gi) || []).length;
    score += regulationCount * 10;

    // Add points for years in business
    const yearMatch = textContent.match(/(?:since|established|founded):\s*(\d{4})/i);
    if (yearMatch) {
      const years = 2025 - parseInt(yearMatch[1]);
      score += Math.min(20, years / 5);
    }

    return Math.min(100, score);
  }

  extractSpreadType(document) {
    const textContent = document.body.textContent;

    if (textContent.toLowerCase().includes('fixed spread')) {
      return 'Fixed';
    } else if (textContent.toLowerCase().includes('variable spread') || textContent.toLowerCase().includes('floating spread')) {
      return 'Variable';
    }

    return null;
  }

  extractSupportChannels(document) {
    const channels = ['Live Chat', 'Email', 'Phone', '24/7', 'Multilingual'];
    const foundChannels = [];

    channels.forEach(channel => {
      const regex = new RegExp(channel, 'gi');
      const textContent = document.body.textContent;
      if (regex.test(textContent)) {
        foundChannels.push(channel);
      }
    });

    return foundChannels.length > 0 ? foundChannels : null;
  }

  extractMinDeposit(document) {
    // Look for minimum deposit information
    const patterns = [
      /min[.\s]deposit\s*[:$]?\s*(\d+)/gi,
      /minimum[.\s]deposit\s*[:$]?\s*(\d+)/gi,
      /deposit\s*from\s*[$€£]?\s*(\d+)/gi
    ];

    const textContent = document.body.textContent;

    for (const pattern of patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    return null;
  }

  extractSpreadsAvg(document) {
    // Look for spread information
    const patterns = [
      /spread\s*[:from]?\s*(\d+(?:\.\d+)?)\s*pips?/gi,
      /avg[.\s]spread\s*[:from]?\s*(\d+(?:\.\d+)?)\s*pips?/gi,
      /typical[.\s]spread\s*[:from]?\s*(\d+(?:\.\d+)?)\s*pips?/gi
    ];

    const textContent = document.body.textContent;

    for (const pattern of patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }

    return null;
  }

  extractLeverageMax(document) {
    // Look for leverage information
    const patterns = [
      /leverage\s*[:up to]?\s*(\d+:\d+)/gi,
      /max[.\s]leverage\s*[:up to]?\s*(\d+:\d+)/gi,
      /(\d+:\d+)\s*leverage/gi
    ];

    const textContent = document.body.textContent;

    for (const pattern of patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  extractStructuredData(document) {
    // Look for JSON-LD structured data
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        // Invalid JSON, continue
      }
    }
    return null;
  }

  updateStats(enhancedData) {
    Object.keys(enhancedData).forEach(column => {
      if (!this.stats.foundData[column]) {
        this.stats.foundData[column] = 0;
      }
      this.stats.foundData[column]++;
    });
  }

  displayStats() {
    console.log('\n📊 EXTRACTION STATISTICS:');
    console.log(`   Total Files Processed: ${this.stats.processedFiles}/${this.stats.totalFiles}`);
    console.log(`   Success Rate: ${((this.stats.processedFiles / this.stats.totalFiles) * 100).toFixed(2)}%`);

    console.log('\n📋 DATA FOUND BY COLUMN:');
    Object.entries(this.stats.foundData).forEach(([column, count]) => {
      console.log(`   ${column}: ${count} brokers`);
    });
  }

  async runExtraction() {
    console.log('🚀 Starting Enhanced Data Extraction');
    console.log('='.repeat(50));

    const extractedData = await this.extractMissingData();

    // Save extracted data
    fs.writeFileSync('enhanced-extracted-data.json', JSON.stringify(extractedData, null, 2));

    console.log('\n✅ Enhanced data extraction completed!');
    console.log('📄 Extracted data saved to: enhanced-extracted-data.json');

    return extractedData;
  }
}

// Execute the enhanced extraction
async function executeEnhancedExtraction() {
  const extractor = new EnhancedDataExtractor();
  return await extractor.runExtraction();
}

// Run the enhanced extraction
executeEnhancedExtraction().then(data => {
  console.log('\n🎉 Enhanced data extraction completed!');
}).catch(error => {
  console.error('❌ Enhanced extraction failed:', error.message);
});