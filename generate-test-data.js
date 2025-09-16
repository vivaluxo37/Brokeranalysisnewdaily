const fs = require('fs');

class TestDataGenerator {
  constructor() {
    this.testBrokers = [];
    this.testCategories = {
      regulations: ['FCA', 'ASIC', 'CySEC', 'FINMA', 'DFSA', 'FSCA', 'MFSA', 'BaFin'],
      platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'Web Trader', 'Mobile App', 'API Trading'],
      accountTypes: ['Standard Account', 'ECN Account', 'STP Account', 'Islamic Account', 'VIP Account', 'Professional Account'],
      features: ['Low Spreads', 'High Leverage', 'Fast Execution', 'No Commission', 'Negative Balance Protection', 'Segregated Funds']
    };
  }

  generateTestBrokers() {
    const brokerNames = [
      'Admirals', 'Pepperstone', 'IC Markets', 'FP Markets', 'AxiTrader',
      'FxPro', 'OctaFX', 'FXTM', 'HotForex', 'XM.com',
      'Tickmill', 'BlackBull Markets', 'Admiral Markets', 'IG Group', 'CMC Markets',
      'City Index', 'Saxo Bank', 'Interactive Brokers', 'TD Ameritrade', 'OANDA'
    ];

    brokerNames.forEach((name, index) => {
      const broker = {
        id: index + 1,
        name: name,
        slug: this.generateSlug(name),
        logo_url: `/images/brokers/${name.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
        website_url: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `${name} is a leading forex and CFD broker offering competitive trading conditions, advanced platforms, and excellent customer support. With tight spreads, fast execution, and strong regulatory oversight, ${name} provides traders with a reliable trading environment.`,
        short_description: `${name} offers competitive spreads and reliable trading conditions for forex and CFD traders.`,
        rating: this.generateRating(),
        review_count: this.generateReviewCount(),
        featured_status: index < 5, // First 5 brokers are featured
        min_deposit: this.generateMinDeposit(),
        min_deposit_currency: 'USD',
        spread_type: this.generateSpreadType(),
        typical_spread: this.generateSpread(),
        max_leverage: this.generateLeverage(),
        established_year: this.generateYear(),
        headquarters: this.generateHeadquarters(),
        company_size: this.generateCompanySize(),
        total_assets: this.generateAssets(),
        active_traders: this.generateTraders(),
        meta_title: `${name} Review | BrokerAnalysis.com`,
        meta_description: `Read our comprehensive review of ${name}. Learn about spreads, regulations, platforms, and trading conditions.`,
        affiliate_link: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com?ref=brokeranalysis`,
        status: 'active',
        regulations: this.generateRegulations(),
        platforms: this.generatePlatforms(),
        account_types: this.generateAccountTypes(),
        features: this.generateFeatures(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.testBrokers.push(broker);
    });

    return this.testBrokers;
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  generateRating() {
    return parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
  }

  generateReviewCount() {
    return Math.floor(Math.random() * 5000) + 100; // 100 to 5100
  }

  generateMinDeposit() {
    const deposits = [1, 5, 10, 50, 100, 200, 250, 500, 1000];
    return deposits[Math.floor(Math.random() * deposits.length)];
  }

  generateSpreadType() {
    return Math.random() > 0.5 ? 'Variable' : 'Fixed';
  }

  generateSpread() {
    return parseFloat((Math.random() * 2 + 0.1).toFixed(1)); // 0.1 to 2.1
  }

  generateLeverage() {
    const leverages = [30, 50, 100, 200, 300, 500, 1000];
    return leverages[Math.floor(Math.random() * leverages.length)];
  }

  generateYear() {
    return Math.floor(Math.random() * 23) + 2000; // 2000 to 2023
  }

  generateHeadquarters() {
    const locations = [
      'London, UK', 'Sydney, Australia', 'Limassol, Cyprus', 'Zurich, Switzerland',
      'Melbourne, Australia', 'Berlin, Germany', 'Singapore', 'New York, USA'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  generateCompanySize() {
    const sizes = ['Small', 'Medium', 'Large', 'Enterprise'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  generateAssets() {
    return `$${(Math.random() * 900 + 100).toFixed(1)}M`; // $100M to $1000M
  }

  generateTraders() {
    return Math.floor(Math.random() * 900000) + 100000; // 100K to 1M
  }

  generateRegulations() {
    const count = Math.floor(Math.random() * 4) + 1; // 1 to 4 regulations
    const shuffled = [...this.testCategories.regulations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generatePlatforms() {
    const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 platforms
    const shuffled = [...this.testCategories.platforms].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateAccountTypes() {
    const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 account types
    const shuffled = [...this.testCategories.accountTypes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateFeatures() {
    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 features
    const shuffled = [...this.testCategories.features].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateRelatedTestData() {
    // Generate broker regulations
    const regulations = [];
    this.testBrokers.forEach(broker => {
      broker.regulations.forEach(regulation => {
        regulations.push({
          id: regulations.length + 1,
          broker_id: broker.id,
          regulatory_body: regulation,
          license_number: this.generateLicenseNumber(),
          regulation_status: 'Regulated',
          jurisdiction: this.generateJurisdiction(),
          verification_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      });
    });

    // Generate broker features
    const features = [];
    this.testBrokers.forEach(broker => {
      broker.features.forEach(feature => {
        features.push({
          id: features.length + 1,
          broker_id: broker.id,
          feature_name: feature,
          feature_type: this.generateFeatureType(feature),
          description: `${feature} available at ${broker.name}`,
          availability: true,
          category: this.generateFeatureCategory(feature),
          created_at: new Date().toISOString()
        });
      });
    });

    // Generate broker platforms
    const platforms = [];
    this.testBrokers.forEach(broker => {
      broker.platforms.forEach(platform => {
        platforms.push({
          id: platforms.length + 1,
          broker_id: broker.id,
          platform_name: platform,
          platform_type: 'Trading Platform',
          version: 'Latest',
          web_trading: Math.random() > 0.2,
          mobile_trading: Math.random() > 0.1,
          desktop_trading: true,
          features: JSON.stringify(['Charting', 'Order Execution', 'Market Analysis']),
          created_at: new Date().toISOString()
        });
      });
    });

    return { regulations, features, platforms };
  }

  generateLicenseNumber() {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }

  generateJurisdiction() {
    const jurisdictions = ['Global', 'UK', 'Australia', 'EU', 'Switzerland', 'UAE', 'South Africa', 'Malta'];
    return jurisdictions[Math.floor(Math.random() * jurisdictions.length)];
  }

  generateFeatureType(feature) {
    if (feature.includes('Spread') || feature.includes('Commission')) return 'Trading Condition';
    if (feature.includes('Leverage') || feature.includes('Execution')) return 'Trading Feature';
    return 'Safety Feature';
  }

  generateFeatureCategory(feature) {
    if (feature.includes('Spread') || feature.includes('Commission')) return 'Trading Costs';
    if (feature.includes('Leverage') || feature.includes('Execution')) return 'Trading Tools';
    return 'Safety & Security';
  }

  saveTestData() {
    const brokers = this.generateTestBrokers();
    const relatedData = this.generateRelatedTestData();

    const testData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalBrokers: brokers.length,
        totalRegulations: relatedData.regulations.length,
        totalFeatures: relatedData.features.length,
        totalPlatforms: relatedData.platforms.length,
        testEnvironment: true
      },
      brokers: brokers,
      regulations: relatedData.regulations,
      features: relatedData.features,
      platforms: relatedData.platforms,
      usage: {
        frontendTesting: true,
        apiTesting: true,
        componentTesting: true,
        integrationTesting: true
      }
    };

    fs.writeFileSync('test-broker-data.json', JSON.stringify(testData, null, 2));

    // Save individual files for different test scenarios
    fs.writeFileSync('test-brokers-only.json', JSON.stringify(brokers, null, 2));
    fs.writeFileSync('test-regulations.json', JSON.stringify(relatedData.regulations, null, 2));
    fs.writeFileSync('test-features.json', JSON.stringify(relatedData.features, null, 2));
    fs.writeFileSync('test-platforms.json', JSON.stringify(relatedData.platforms, null, 2));

    return testData;
  }

  generateSummary() {
    const testData = this.saveTestData();

    console.log('🧪 Test Data Generated Successfully!');
    console.log('\n📊 Test Data Summary:');
    console.log(`   Total Brokers: ${testData.metadata.totalBrokers}`);
    console.log(`   Total Regulations: ${testData.metadata.totalRegulations}`);
    console.log(`   Total Features: ${testData.metadata.totalFeatures}`);
    console.log(`   Total Platforms: ${testData.metadata.totalPlatforms}`);
    console.log(`   Featured Brokers: ${testData.brokers.filter(b => b.featured_status).length}`);
    console.log(`   Average Rating: ${(testData.brokers.reduce((sum, b) => sum + b.rating, 0) / testData.brokers.length).toFixed(2)}`);

    console.log('\n📁 Files Created:');
    console.log(`   test-broker-data.json - Complete test dataset`);
    console.log(`   test-brokers-only.json - Brokers only`);
    console.log(`   test-regulations.json - Regulations only`);
    console.log(`   test-features.json - Features only`);
    console.log(`   test-platforms.json - Platforms only`);

    console.log('\n🎯 Ready for Frontend Testing!');
    console.log(`   Use test-broker-data.json for comprehensive testing`);
    console.log(`   Use individual files for specific component testing`);

    return testData;
  }
}

// Generate test data for frontend component testing
async function generateTestData() {
  console.log('🚀 Generating test data for frontend component testing...');

  const generator = new TestDataGenerator();
  return generator.generateSummary();
}

// Execute the test data generation
generateTestData().then(testData => {
  console.log('\n🎉 Test data generation completed!');
  console.log('🚀 Frontend components can now be tested with realistic broker data.');
}).catch(error => {
  console.error('❌ Test data generation failed:', error.message);
});