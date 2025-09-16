const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class WebSearchEnhancer {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.enhancedData = JSON.parse(fs.readFileSync('enhanced-extracted-data.json', 'utf8'));
    this.databaseAnalysis = JSON.parse(fs.readFileSync('database-analysis.json', 'utf8'));

    this.searchStats = {
      totalBrokers: 0,
      searchedBrokers: 0,
      foundData: {},
      missingData: []
    };
  }

  async enhanceMissingData() {
    console.log('🌐 Enhancing missing data with web searches...');

    // Get current brokers from database
    const { data: brokers, error } = await this.supabase
      .from('brokers')
      .select('name, id, logo_url, country, established_year, website_url');

    if (error) {
      console.error('❌ Error fetching brokers:', error.message);
      return;
    }

    this.searchStats.totalBrokers = brokers.length;

    // Identify brokers missing critical information
    const brokersToEnhance = brokers.filter(broker => {
      return !broker.logo_url || !broker.country || !broker.established_year || !broker.website_url;
    });

    console.log(`📊 Found ${brokersToEnhance.length} brokers needing web enhancement`);

    // Process each broker needing enhancement
    for (const broker of brokersToEnhance) {
      console.log(`🔍 Searching for ${broker.name}...`);

      const enhancedInfo = await this.searchBrokerInfo(broker);

      if (enhancedInfo && Object.keys(enhancedInfo).length > 0) {
        // Update the enhanced data with web search results
        if (!this.enhancedData[broker.name]) {
          this.enhancedData[broker.name] = {};
        }

        Object.assign(this.enhancedData[broker.name], enhancedInfo);
        this.updateSearchStats(enhancedInfo);
      }

      this.searchStats.searchedBrokers++;

      // Add delay to avoid rate limiting
      await this.delay(1000);
    }

    this.displaySearchStats();
    return this.enhancedData;
  }

  async searchBrokerInfo(broker) {
    const enhancedInfo = {};

    // Search for logo if missing
    if (!broker.logo_url) {
      const logoUrl = await this.searchLogoUrl(broker.name);
      if (logoUrl) {
        enhancedInfo.logo_url = logoUrl;
      }
    }

    // Search for country if missing
    if (!broker.country) {
      const country = await this.searchCountryInfo(broker.name);
      if (country) {
        enhancedInfo.country = country;
      }
    }

    // Search for established year if missing
    if (!broker.established_year) {
      const year = await this.searchEstablishedYear(broker.name);
      if (year) {
        enhancedInfo.established_year = year;
      }
    }

    // Search for website if missing or incomplete
    if (!broker.website_url || broker.website_url === '') {
      const website = await this.searchWebsite(broker.name);
      if (website) {
        enhancedInfo.website_url = website;
      }
    }

    return enhancedInfo;
  }

  async searchLogoUrl(brokerName) {
    try {
      // Search for broker logo using multiple search engines
      const searchTerms = [
        `${brokerName} logo official`,
        `${brokerName} trading logo png`,
        `${brokerName} forex broker logo`
      ];

      for (const term of searchTerms) {
        try {
          const results = await this.performSearch(term);
          const logoUrl = this.extractLogoFromResults(results, brokerName);

          if (logoUrl) {
            console.log(`   ✅ Found logo for ${brokerName}`);
            return logoUrl;
          }
        } catch (error) {
          console.log(`   ❌ Logo search failed for ${brokerName}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error searching logo for ${brokerName}:`, error.message);
    }

    return null;
  }

  async searchCountryInfo(brokerName) {
    try {
      const searchTerms = [
        `${brokerName} headquarters location country`,
        `${brokerName} forex broker country`,
        `${brokerName} regulated by`,
        `${brokerName} address location`
      ];

      for (const term of searchTerms) {
        try {
          const results = await this.performSearch(term);
          const country = this.extractCountryFromResults(results);

          if (country) {
            console.log(`   ✅ Found country for ${brokerName}: ${country}`);
            return country;
          }
        } catch (error) {
          console.log(`   ❌ Country search failed for ${brokerName}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error searching country for ${brokerName}:`, error.message);
    }

    return null;
  }

  async searchEstablishedYear(brokerName) {
    try {
      const searchTerms = [
        `${brokerName} established year founded`,
        `${brokerName} since when founded`,
        `${brokerName} founding year`,
        `${brokerName} history established`
      ];

      for (const term of searchTerms) {
        try {
          const results = await this.performSearch(term);
          const year = this.extractYearFromResults(results);

          if (year) {
            console.log(`   ✅ Found established year for ${brokerName}: ${year}`);
            return year;
          }
        } catch (error) {
          console.log(`   ❌ Year search failed for ${brokerName}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error searching year for ${brokerName}:`, error.message);
    }

    return null;
  }

  async searchWebsite(brokerName) {
    try {
      const searchTerms = [
        `${brokerName} official website`,
        `${brokerName} forex broker website`,
        `${brokerName} trading platform website`
      ];

      for (const term of searchTerms) {
        try {
          const results = await this.performSearch(term);
          const website = this.extractWebsiteFromResults(results, brokerName);

          if (website) {
            console.log(`   ✅ Found website for ${brokerName}: ${website}`);
            return website;
          }
        } catch (error) {
          console.log(`   ❌ Website search failed for ${brokerName}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error searching website for ${brokerName}:`, error.message);
    }

    return null;
  }

  async performSearch(searchTerm) {
    // Use Firecrawl for web search
    try {
      const searchResults = await mcp__firecrawl__firecrawl_search({
        query: searchTerm,
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
          onlyMainContent: true
        }
      });

      return searchResults;
    } catch (error) {
      console.error(`   ❌ Search failed for "${searchTerm}":`, error.message);
      return [];
    }
  }

  extractLogoFromResults(results, brokerName) {
    // Look for logo URLs in search results
    for (const result of results) {
      if (result.url && (result.url.includes('.png') || result.url.includes('.jpg') || result.url.includes('.svg'))) {
        return result.url;
      }

      if (result.markdown) {
        // Extract image URLs from markdown content
        const imageMatches = result.markdown.match(/!\[.*?\]\((.*?)\)/g);
        if (imageMatches) {
          for (const match of imageMatches) {
            const urlMatch = match.match(/\((.*?)\)/);
            if (urlMatch && urlMatch[1] && (urlMatch[1].includes('logo') || urlMatch[1].includes(brokerName.toLowerCase()))) {
              return urlMatch[1];
            }
          }
        }
      }
    }

    return null;
  }

  extractCountryFromResults(results) {
    // Look for country information in search results
    const countryKeywords = ['USA', 'UK', 'United States', 'United Kingdom', 'Australia', 'Cyprus', 'Switzerland', 'Germany', 'Japan', 'Canada'];

    for (const result of results) {
      if (result.markdown) {
        for (const country of countryKeywords) {
          if (result.markdown.toLowerCase().includes(country.toLowerCase())) {
            return country;
          }
        }
      }
    }

    return null;
  }

  extractYearFromResults(results) {
    // Look for year information in search results
    for (const result of results) {
      if (result.markdown) {
        const yearMatches = result.markdown.match(/\b(19|20)\d{2}\b/g);
        if (yearMatches) {
          // Return the earliest year found (likely founding year)
          const years = yearMatches.map(y => parseInt(y)).sort((a, b) => a - b);
          return years[0];
        }
      }
    }

    return null;
  }

  extractWebsiteFromResults(results, brokerName) {
    // Look for official website URLs
    for (const result of results) {
      if (result.url && this.isValidWebsiteUrl(result.url, brokerName)) {
        return result.url;
      }

      if (result.markdown) {
        // Extract URLs from markdown content
        const urlMatches = result.markdown.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          for (const url of urlMatches) {
            if (this.isValidWebsiteUrl(url, brokerName)) {
              return url;
            }
          }
        }
      }
    }

    return null;
  }

  isValidWebsiteUrl(url, brokerName) {
    // Basic validation for broker websites
    const invalidDomains = ['dailyforex.com', 'forexpeacearmy.com', 'brokerchooser.com'];

    if (invalidDomains.some(domain => url.includes(domain))) {
      return false;
    }

    // Check if URL contains broker name or is a trading domain
    const brokerNameLower = brokerName.toLowerCase();
    const tradingDomains = ['.com', '.net', '.org', '.io', '.co', '.uk', '.au', '.eu'];

    return tradingDomains.some(domain => url.includes(domain)) ||
           url.toLowerCase().includes(brokerNameLower);
  }

  updateSearchStats(enhancedInfo) {
    Object.keys(enhancedInfo).forEach(column => {
      if (!this.searchStats.foundData[column]) {
        this.searchStats.foundData[column] = 0;
      }
      this.searchStats.foundData[column]++;
    });
  }

  displaySearchStats() {
    console.log('\n📊 WEB SEARCH STATISTICS:');
    console.log(`   Total Brokers: ${this.searchStats.totalBrokers}`);
    console.log(`   Searched Brokers: ${this.searchStats.searchedBrokers}`);
    console.log(`   Enhancement Rate: ${((this.searchStats.searchedBrokers / this.searchStats.totalBrokers) * 100).toFixed(2)}%`);

    console.log('\n📋 DATA FOUND BY SEARCH:');
    Object.entries(this.searchStats.foundData).forEach(([column, count]) => {
      console.log(`   ${column}: ${count} brokers`);
    });
  }

  async runEnhancement() {
    console.log('🚀 Starting Web Search Enhancement');
    console.log('='.repeat(50));

    await this.enhanceMissingData();

    // Save enhanced data with web search results
    fs.writeFileSync('web-enhanced-data.json', JSON.stringify(this.enhancedData, null, 2));

    console.log('\n✅ Web search enhancement completed!');
    console.log('📄 Enhanced data saved to: web-enhanced-data.json');

    return this.enhancedData;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Execute the web search enhancement
async function executeWebSearchEnhancement() {
  const enhancer = new WebSearchEnhancer();
  return await enhancer.runEnhancement();
}

// Run the web search enhancement
executeWebSearchEnhancement().then(data => {
  console.log('\n🎉 Web search enhancement completed!');
}).catch(error => {
  console.error('❌ Web search enhancement failed:', error.message);
});