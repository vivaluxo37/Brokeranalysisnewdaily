const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Logo mapping functions (simplified for import script)
function findBestLogoMatch(brokerName) {
  // Try to match broker names to actual logo files
  const normalizedName = brokerName.toLowerCase().replace(/\s+/g, '-');
  const possibleLogos = [
    `/broker-logos/${normalizedName}.svg`,
    `/broker-logos/${normalizedName}.jpg`,
    `/broker-logos/${normalizedName}.png`,
    `/broker-logos/${brokerName.toLowerCase().replace(/\s+/g, '')}.svg`,
    `/broker-logos/${brokerName.toLowerCase().replace(/\s+/g, '')}.jpg`,
    `/broker-logos/${brokerName.toLowerCase().replace(/\s+/g, '')}.png`,
    `/broker-logos/default-broker-logo.svg`
  ];

  return possibleLogos[0]; // Will use the first option
}

function normalizeBrokerName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

class SafeBrokerImporter {
  constructor() {
    this.supabase = null;
    this.processedBrokers = new Set();
    this.importResults = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    // Initialize Supabase only if environment variables are available
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      console.log('Supabase client initialized successfully');
    } else {
      console.log('Supabase environment variables not found - running in dry-run mode');
    }
  }

  // Load extracted data from JSON file
  loadExtractedData(filePath) {
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

  // Import a single broker (or simulate import in dry-run mode)
  async importBroker(brokerData) {
    try {
      if (!this.supabase) {
        // Dry-run mode
        console.log(`[DRY-RUN] Would import: ${brokerData.name}`);
        this.importResults.success++;
        return { success: true, action: 'dry-run', broker: brokerData.name };
      }

      // Check if broker already exists
      const { data: existing } = await this.supabase
        .from('brokers')
        .select('id, name, slug')
        .or(`name.eq.${brokerData.name},slug.eq.${brokerData.slug}`)
        .single();

      if (existing) {
        console.log(`Skipping existing broker: ${brokerData.name}`);
        this.importResults.skipped++;
        return { success: true, action: 'skipped', broker: brokerData.name };
      }

      // Insert new broker
      const { data: insertedBroker, error: insertError } = await this.supabase
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
      console.log(`Mode: ${this.supabase ? 'LIVE' : 'DRY-RUN'}`);

      // Load extracted data
      const extractedBrokers = this.loadExtractedData(extractedDataPath);

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
      console.log(`Successfully processed: ${this.importResults.success}`);
      console.log(`Failed to process: ${this.importResults.failed}`);
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

  const importer = new SafeBrokerImporter();

  try {
    await importer.importAllBrokers(dataFile);
    console.log('\nImport completed!');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = SafeBrokerImporter;

// Run as CLI if called directly
if (require.main === module) {
  main();
}