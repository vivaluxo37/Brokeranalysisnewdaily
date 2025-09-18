const fs = require('fs');

// Logo mapping functions (simplified for test script)
function findBestLogoMatch(brokerName) {
  return `/broker-logos/default-broker-logo.svg`;
}

function normalizeBrokerName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Load extracted data from JSON file
function loadExtractedData(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    return data.brokers;
  } catch (error) {
    console.error('Error loading extracted data:', error);
    throw error;
  }
}

// Transform extracted broker data to database format
function transformBrokerData(extractedBroker) {
  const brokerName = extractedBroker.brokerName;
  const normalizedName = normalizeBrokerName(brokerName);

  // Skip non-broker entries
  if (brokerName.includes('brokers-directory-list') ||
      brokerName.includes('best-forex-brokers') ||
      brokerName.includes('regulation') ||
      brokerName.includes('credit-card-brokers') ||
      brokerName.length < 2) {
    return null;
  }

  // Extract founded year from description or content
  let foundedYear = extractedBroker.foundedYear;
  if (!foundedYear && extractedBroker.description) {
    const yearMatch = extractedBroker.description.match(/since (\d{4})|founded in (\d{4})|established (\d{4})/i);
    if (yearMatch) {
      foundedYear = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
    }
  }

  // Extract minimum deposit from description or content
  let minDeposit = extractedBroker.minimumDeposit;
  if (!minDeposit && extractedBroker.description) {
    const depositMatch = extractedBroker.description.match(/minimum deposit of \$?(\d+)/i);
    if (depositMatch) {
      minDeposit = parseFloat(depositMatch[1]);
    }
  }

  // Extract headquarters from regulations or description
  let headquarters = extractedBroker.headquarters[0] || '';
  if (!headquarters && extractedBroker.regulations.length > 0) {
    const regulationText = extractedBroker.regulations.join(' ');
    const locationMatch = regulationText.match(/(?:headquartered|located|based)\s+in\s+([^.]+)/i);
    if (locationMatch) {
      headquarters = locationMatch[1].trim();
    }
  }

  // Generate slug from broker name
  const slug = brokerName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Clean description
  const cleanDescription = extractedBroker.description
    .replace(/<meta id=description name=description content="/g, '')
    .replace(/">/g, '')
    .replace(/"/g, '')
    .trim();

  // Extract platforms (unique and clean)
  const platforms = [...new Set(extractedBroker.platforms.map(p =>
    p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
  ))].filter(p => p.length > 2);

  // Extract regulation bodies (unique)
  const regulationBodies = [...new Set(extractedBroker.regulationBodies)];

  return {
    name: brokerName,
    slug: slug,
    logo_url: findBestLogoMatch(brokerName),
    website_url: `https://${normalizedName.replace(/\s/g, '')}.com`,
    description: cleanDescription,
    short_description: cleanDescription.length > 150 ?
      cleanDescription.substring(0, 150) + '...' : cleanDescription,
    avg_rating: 4.0,
    total_reviews: 0,
    featured: false,
    min_deposit: minDeposit || 0,
    min_deposit_currency: 'USD',
    spread_type: 'Variable',
    spreads_avg: 0,
    leverage_max: '500',
    established_year: foundedYear || null,
    headquarters_location: headquarters,
    employee_count: null,
    total_assets: 0,
    active_traders_count: 0,
    affiliate_link: null,
    is_active: true,
    platforms: platforms,
    regulations: regulationBodies,
    payment_methods: [...new Set(extractedBroker.paymentMethods)],
    account_types: [...new Set(extractedBroker.accountTypes)]
  };
}

// Main test function
async function testTransformation() {
  try {
    console.log('Testing broker data transformation...\n');

    // Load extracted data
    const extractedBrokers = loadExtractedData('./extracted_broker_data_fixed.json');
    console.log(`Loaded ${extractedBrokers.length} brokers from extracted data\n`);

    // Test transformation on first few brokers
    const sampleBrokers = extractedBrokers.slice(0, 5);
    let validCount = 0;

    for (const extractedBroker of sampleBrokers) {
      const transformed = transformBrokerData(extractedBroker);

      if (transformed) {
        validCount++;
        console.log(`${transformed.name}:`);
        console.log(`  Slug: ${transformed.slug}`);
        console.log(`  Founded: ${transformed.established_year || 'Unknown'}`);
        console.log(`  Min Deposit: $${transformed.min_deposit}`);
        console.log(`  HQ: ${transformed.headquarters_location || 'Unknown'}`);
        console.log(`  Platforms: ${transformed.platforms.join(', ')}`);
        console.log(`  Regulations: ${transformed.regulations.join(', ')}`);
        console.log();
      } else {
        console.log(`${extractedBroker.brokerName}: Skipped (non-broker)\n`);
      }
    }

    // Test all brokers
    console.log('Testing all brokers...');
    let totalValid = 0;
    let totalSkipped = 0;
    const allBrokers = [];

    for (const extractedBroker of extractedBrokers) {
      const transformed = transformBrokerData(extractedBroker);
      if (transformed) {
        totalValid++;
        allBrokers.push(transformed);
      } else {
        totalSkipped++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total brokers processed: ${extractedBrokers.length}`);
    console.log(`Valid brokers: ${totalValid}`);
    console.log(`Skipped (non-broker): ${totalSkipped}`);
    console.log(`Import success rate: ${((totalValid / extractedBrokers.length) * 100).toFixed(1)}%`);

    // Show some statistics
    const allPlatforms = new Set();
    const allRegulations = new Set();
    const allPaymentMethods = new Set();

    allBrokers.forEach(broker => {
      broker.platforms.forEach(p => allPlatforms.add(p));
      broker.regulations.forEach(r => allRegulations.add(r));
      broker.payment_methods.forEach(p => allPaymentMethods.add(p));
    });

    console.log(`\n=== Data Diversity ===`);
    console.log(`Unique platforms: ${allPlatforms.size}`);
    console.log(`Unique regulations: ${allRegulations.size}`);
    console.log(`Unique payment methods: ${allPaymentMethods.size}`);

    // Save transformed data for inspection
    fs.writeFileSync('./transformed_broker_data.json', JSON.stringify(allBrokers, null, 2));
    console.log(`\nTransformed data saved to: transformed_broker_data.json`);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testTransformation();