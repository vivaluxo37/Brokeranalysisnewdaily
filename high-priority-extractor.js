const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class HighPriorityExtractor {
  constructor() {
    this.sourceDirectory = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers';
    this.extractedData = {};
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      foundData: {
        logo_url: 0,
        established_year: 0,
        affiliate_url: 0,
        spread_type: 0
      },
      errors: []
    };
  }

  async extractHighPriorityFields() {
    console.log('🎯 Extracting high-priority fields from HTML files...');

    // Get current brokers from database
    const databaseAnalysis = JSON.parse(fs.readFileSync('database-analysis.json', 'utf8'));
    const highPriorityColumns = [
      { column: 'logo_url', priority: 'High' },
      { column: 'established_year', priority: 'High' },
      { column: 'affiliate_url', priority: 'Medium' },
      { column: 'spread_type', priority: 'Medium' }
    ];

    console.log(`📊 Targeting ${highPriorityColumns.length} high-priority columns for ${databaseAnalysis.summary.totalBrokers} brokers`);

    // Get list of HTML files
    const htmlFiles = this.getHtmlFiles();
    this.stats.totalFiles = htmlFiles.length;

    console.log(`📁 Found ${htmlFiles.length} HTML files to process`);

    // Process each HTML file
    for (const filePath of htmlFiles) {
      try {
        const brokerName = this.extractBrokerNameFromPath(filePath);
        const enhancedData = await this.extractHighPriorityFromHtml(filePath, brokerName, highPriorityColumns);

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
        this.stats.errors.push({
          file: filePath,
          error: error.message
        });
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
      .replace(/ Pros & Cons Revealed$/i, '')
      .replace(/ \[\d{4}\]$/i, '')
      .trim();
  }

  async extractHighPriorityFromHtml(filePath, brokerName, targetColumns) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(content);
      const document = dom.window.document;

      const enhancedData = {};

      // Extract high-priority data with enhanced methods
      for (const column of targetColumns) {
        const value = this.extractHighPriorityData(document, column.column, brokerName);
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

  extractHighPriorityData(document, column, brokerName) {
    try {
      switch (column) {
        case 'logo_url':
          return this.extractEnhancedLogoUrl(document, brokerName);

        case 'established_year':
          return this.extractEnhancedEstablishedYear(document);

        case 'affiliate_url':
          return this.extractEnhancedAffiliateUrl(document, brokerName);

        case 'spread_type':
          return this.extractEnhancedSpreadType(document);

        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  extractEnhancedLogoUrl(document, brokerName) {
    // Enhanced logo extraction with multiple strategies
    const logoSelectors = [
      '.broker-logo img',
      '.logo img',
      'img[alt*="logo"]',
      'img[alt*="Logo"]',
      '.broker-profile img',
      'header img',
      '.company-logo img',
      '.brand-logo img',
      '.broker-header img',
      '.broker-avatar img',
      '.broker-image img'
    ];

    // Also look for images with broker name in alt text
    const brokerNameLower = brokerName.toLowerCase();
    const altTextSelectors = [
      `img[alt*="${brokerNameLower}"]`,
      `img[title*="${brokerNameLower}"]`
    ];

    const allSelectors = [...logoSelectors, ...altTextSelectors];

    for (const selector of allSelectors) {
      const logo = document.querySelector(selector);
      if (logo) {
        const src = logo.getAttribute('src') || logo.getAttribute('data-src');
        if (src && !src.includes('placeholder') && !src.includes('default')) {
          // Ensure absolute URL
          if (src.startsWith('http')) {
            return src;
          } else if (src.startsWith('//')) {
            return `https:${src}`;
          } else {
            return `https://www.dailyforex.com${src}`;
          }
        }
      }
    }

    // Look for any image in the main content area
    const mainContentSelectors = [
      '.broker-content img',
      '.broker-info img',
      '.broker-details img',
      '.broker-overview img',
      '.main-content img',
      '.content img'
    ];

    for (const selector of mainContentSelectors) {
      const images = document.querySelectorAll(selector);
      for (const img of images) {
        const src = img.getAttribute('src');
        if (src && !src.includes('placeholder') && !src.includes('default')) {
          // Check if it could be a logo by size or position
          const alt = img.getAttribute('alt') || '';
          if (alt.toLowerCase().includes(brokerNameLower) || alt.toLowerCase().includes('logo')) {
            if (src.startsWith('http')) {
              return src;
            } else if (src.startsWith('//')) {
              return `https:${src}`;
            } else {
              return `https://www.dailyforex.com${src}`;
            }
          }
        }
      }
    }

    return null;
  }

  extractEnhancedEstablishedYear(document) {
    // Enhanced year extraction with multiple patterns
    const yearPatterns = [
      /(?:established|founded|since|est\.|founding)\s*[:\-]?\s*(\d{4})/gi,
      /(?:operating|in business|trading)\s*since\s*(\d{4})/gi,
      /(\d{4})\s*(?:\-|–|to)\s*(?:present|now|current)/gi,
      /(?:over|more than)\s*(\d{1,2})\s*years?\s*(?:in business|operating|trading)/gi,
      /with\s*(\d{1,2})\s*\+?\s*years?\s*(?:experience|history)/gi
    ];

    const textContent = document.body.textContent;

    for (const pattern of yearPatterns) {
      const match = textContent.match(pattern);
      if (match) {
        // For "over X years" patterns, calculate approximate year
        if (pattern.toString().includes('over') || pattern.toString().includes('more than')) {
          const years = parseInt(match[1]);
          const approximateYear = 2025 - years;
          if (approximateYear >= 1970 && approximateYear <= 2025) {
            return approximateYear;
          }
        } else {
          const year = parseInt(match[1]);
          if (year >= 1970 && year <= 2025) {
            return year;
          }
        }
      }
    }

    // Look for structured data
    const structuredData = this.extractStructuredData(document);
    if (structuredData && structuredData.foundingDate) {
      return new Date(structuredData.foundingDate).getFullYear();
    }

    // Look for copyright notices with year ranges
    const copyrightPatterns = [
      /(?:©|copyright)\s*(\d{4})\s*[\-\s]*(\d{4})/gi,
      /(?:©|copyright)\s*(\d{4})/gi
    ];

    for (const pattern of copyrightPatterns) {
      const match = textContent.match(pattern);
      if (match) {
        // Use the earliest year for founding year
        const year1 = parseInt(match[1]);
        const year2 = match[2] ? parseInt(match[2]) : year1;
        const foundingYear = Math.min(year1, year2);
        if (foundingYear >= 1970 && foundingYear <= 2025) {
          return foundingYear;
        }
      }
    }

    return null;
  }

  extractEnhancedAffiliateUrl(document, brokerName) {
    // Enhanced affiliate URL extraction
    const affiliateSelectors = [
      'a[href*="affiliate"]',
      'a[href*="ref"]',
      'a[href*="partner"]',
      'a[href*="ib"]',
      'a[href*="introducing-broker"]',
      'a[href*="aff"]',
      'a[href*="refer"]',
      'a[href*="join-now"]',
      'a[href*="sign-up"]',
      'a[href*="register"]',
      'a[href*="open-account"]',
      'a[href*="trade-now"]',
      'a[href*="visit-broker"]'
    ];

    for (const selector of affiliateSelectors) {
      const links = document.querySelectorAll(selector);
      for (const link of links) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('http') && !href.includes('dailyforex')) {
          // Check if it's not a generic link
          const linkText = link.textContent.toLowerCase();
          if (linkText.includes('affiliate') || linkText.includes('partner') ||
              linkText.includes('join') || linkText.includes('sign') ||
              linkText.includes('trade') || linkText.includes('open')) {
            return href;
          }
        }
      }
    }

    return null;
  }

  extractEnhancedSpreadType(document) {
    // Enhanced spread type extraction
    const textContent = document.body.textContent.toLowerCase();

    // Check for fixed spreads
    if (textContent.includes('fixed spread') || textContent.includes('fixed spreads')) {
      return 'Fixed';
    }

    // Check for variable spreads
    if (textContent.includes('variable spread') || textContent.includes('variable spreads') ||
        textContent.includes('floating spread') || textContent.includes('floating spreads')) {
      return 'Variable';
    }

    // Check for both types
    if (textContent.includes('both fixed and variable spreads') ||
        textContent.includes('fixed and variable spreads')) {
      return 'Both';
    }

    // Look for spread type in tables or comparison sections
    const tableHeaders = document.querySelectorAll('th, td');
    for (const header of tableHeaders) {
      const headerText = header.textContent.toLowerCase();
      if (headerText.includes('spread type') || headerText.includes('type of spread')) {
        const cell = header.nextElementSibling || header.parentElement.nextElementSibling?.querySelector('td');
        if (cell) {
          const cellText = cell.textContent.toLowerCase();
          if (cellText.includes('fixed')) return 'Fixed';
          if (cellText.includes('variable') || cellText.includes('floating')) return 'Variable';
          if (cellText.includes('both')) return 'Both';
        }
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
      if (this.stats.foundData[column] !== undefined) {
        this.stats.foundData[column]++;
      }
    });
  }

  displayStats() {
    console.log('\n📊 HIGH-PRIORITY EXTRACTION STATISTICS:');
    console.log(`   Total Files Processed: ${this.stats.processedFiles}/${this.stats.totalFiles}`);
    console.log(`   Success Rate: ${((this.stats.processedFiles / this.stats.totalFiles) * 100).toFixed(2)}%`);

    console.log('\n📋 HIGH-PRIORITY DATA FOUND:');
    Object.entries(this.stats.foundData).forEach(([column, count]) => {
      console.log(`   ${column}: ${count} brokers`);
    });

    if (this.stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.stats.errors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.file}: ${error.error}`);
      });
      if (this.stats.errors.length > 5) {
        console.log(`   ... and ${this.stats.errors.length - 5} more errors`);
      }
    }
  }

  async runHighPriorityExtraction() {
    console.log('🚀 Starting High-Priority Data Extraction');
    console.log('='.repeat(50));

    const extractedData = await this.extractHighPriorityFields();

    // Save extracted data
    fs.writeFileSync('high-priority-extracted-data.json', JSON.stringify(extractedData, null, 2));

    console.log('\n✅ High-priority data extraction completed!');
    console.log('📄 Extracted data saved to: high-priority-extracted-data.json');

    return extractedData;
  }
}

// Execute the high-priority extraction
async function executeHighPriorityExtraction() {
  const extractor = new HighPriorityExtractor();
  return await extractor.runHighPriorityExtraction();
}

// Run the high-priority extraction
executeHighPriorityExtraction().then(data => {
  console.log('\n🎉 High-priority data extraction completed!');
}).catch(error => {
  console.error('❌ High-priority extraction failed:', error.message);
});