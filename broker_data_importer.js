const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
// Logo mapping functions (simplified for import script)
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

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class BrokerDataImporter {
  constructor() {
    this.processedBrokers = new Set();
    this.importResults = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
  }

  // Load extracted data from JSON file
  async loadExtractedData(filePath) {
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      console.log(`Loaded ${data.brokers.length} brokers from extracted data`);
      return data.brokers;
    } catch (error) {
      console.error('Error loading extracted data:', error);
      throw error;
    }
  }

  // Transform extracted broker data to database format
  transformBrokerData(extractedBroker) {
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
      avg_rating: 4.0, // Default rating since we don't have review data
      total_reviews: 0,
      featured: false,
      min_deposit: minDeposit || 0,
      min_deposit_currency: 'USD',
      spread_type: 'Variable',
      spreads_avg: 0, // Default value
      leverage_max: '500', // Default leverage
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
      account_types: [...new Set(extractedBroker.accountTypes)],
      extracted_data: {
        pageId: extractedBroker.pageId,
        fileName: extractedBroker.fileName,
        extractedAt: extractedBroker.extractedAt,
        dataSource: extractedBroker.dataSource,
        originalPlatforms: extractedBroker.platforms,
        originalRegulations: extractedBroker.regulations,
        originalPaymentMethods: extractedBroker.paymentMethods,
        originalAccountTypes: extractedBroker.accountTypes
      }
    };
  }

  // Check if broker already exists
  async checkExistingBroker(name, slug) {
    const { data, error } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .or(`name.eq.${name},slug.eq.${slug}`)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking existing broker:', error);
      return null;
    }

    return data;
  }

  // Import a single broker
  async importBroker(brokerData) {
    try {
      // Check if broker already exists
      const existing = await this.checkExistingBroker(brokerData.name, brokerData.slug);

      if (existing) {
        console.log(`Skipping existing broker: ${brokerData.name}`);
        this.importResults.skipped++;
        return { success: true, action: 'skipped', broker: brokerData.name };
      }

      // Insert new broker
      const { data: insertedBroker, error: insertError } = await supabase
        .from('brokers')
        .insert([{
          name: brokerData.name,
          slug: brokerData.slug,
          logo_url: brokerData.logo_url,
          website_url: brokerData.website_url,
          description: brokerData.description,
          short_description: brokerData.short_description,
          avg_rating: brokerData.avg_rating,
          total_reviews: brokerData.total_reviews,
          featured: brokerData.featured,
          min_deposit: brokerData.min_deposit,
          min_deposit_currency: brokerData.min_deposit_currency,
          spread_type: brokerData.spread_type,
          spreads_avg: brokerData.spreads_avg,
          leverage_max: brokerData.leverage_max,
          established_year: brokerData.established_year,
          headquarters_location: brokerData.headquarters_location,
          employee_count: brokerData.employee_count,
          total_assets: brokerData.total_assets,
          active_traders_count: brokerData.active_traders_count,
          affiliate_link: brokerData.affiliate_link,
          is_active: brokerData.is_active,
          platforms: brokerData.platforms,
          regulations: brokerData.regulations,
          payment_methods: brokerData.payment_methods,
          account_types: brokerData.account_types,
          extracted_data: brokerData.extracted_data
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log(`Successfully imported: ${brokerData.name}`);
      this.importResults.success++;
      return { success: true, action: 'imported', broker: brokerData.name, id: insertedBroker.id };

    } catch (error) {
      console.error(`Error importing ${brokerData.name}:`, error);
      this.importResults.failed++;
      this.importResults.errors.push({
        broker: brokerData.name,
        error: error.message
      });
      return { success: false, action: 'failed', broker: brokerData.name, error: error.message };
    }
  }

  // Import all brokers from extracted data
  async importAllBrokers(extractedDataPath) {
    try {
      console.log('Starting broker data import...');

      // Load extracted data
      const extractedBrokers = await this.loadExtractedData(extractedDataPath);

      console.log(`Processing ${extractedBrokers.length} broker records...`);

      // Process each broker
      for (const extractedBroker of extractedBrokers) {
        const transformedData = this.transformBrokerData(extractedBroker);

        if (!transformedData) {
          console.log(`Skipping non-broker entry: ${extractedBroker.brokerName}`);
          continue;
        }

        // Check for duplicates
        const brokerKey = transformedData.name.toLowerCase();
        if (this.processedBrokers.has(brokerKey)) {
          console.log(`Skipping duplicate: ${transformedData.name}`);
          continue;
        }

        this.processedBrokers.add(brokerKey);

        // Import the broker
        const result = await this.importBroker(transformedData);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Print summary
      console.log('\n=== Import Summary ===');
      console.log(`Successfully imported: ${this.importResults.success}`);
      console.log(`Failed to import: ${this.importResults.failed}`);
      console.log(`Skipped (existing): ${this.importResults.skipped}`);
      console.log(`Total processed: ${this.processedBrokers.size}`);

      if (this.importResults.errors.length > 0) {
        console.log('\n=== Errors ===');
        this.importResults.errors.forEach(error => {
          console.log(`- ${error.broker}: ${error.error}`);
        });
      }

      return this.importResults;

    } catch (error) {
      console.error('Fatal error during import:', error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dataFile = args[0] || './extracted_broker_data_fixed.json';

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
    process.exit(1);
  }

  const importer = new BrokerDataImporter();

  try {
    await importer.importAllBrokers(dataFile);
    console.log('\nImport completed!');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = BrokerDataImporter;

// Run as CLI if called directly
if (require.main === module) {
  main();
}