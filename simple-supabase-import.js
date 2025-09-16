const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class SimpleSupabaseImporter {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.importStats = {
      totalBrokers: 0,
      importedBrokers: 0,
      failedBrokers: 0,
      errors: []
    };
  }

  async testConnection() {
    try {
      console.log('🔌 Testing Supabase connection...');
      const { data, error } = await this.supabase
        .from('brokers')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
      }

      console.log('✅ Supabase connection successful!');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  async importBrokers() {
    try {
      console.log('🚀 Starting simplified Supabase import...');

      // Load validated broker data
      const validatedData = JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8'));
      const brokerData = validatedData.validBrokers || [];
      this.importStats.totalBrokers = brokerData.length;

      console.log(`📊 Importing ${brokerData.length} validated brokers...`);

      // Import brokers with simplified mapping
      for (const broker of brokerData) {
        try {
          await this.importBrokerSimple(broker);
          this.importStats.importedBrokers++;

          if (this.importStats.importedBrokers % 10 === 0) {
            console.log(`📈 Progress: ${this.importStats.importedBrokers}/${brokerData.length} brokers imported`);
          }
        } catch (error) {
          this.importStats.failedBrokers++;
          this.importStats.errors.push({
            broker: broker.name || 'Unknown',
            error: error.message
          });
          console.error(`❌ Failed to import ${broker.name || 'Unknown'}:`, error.message);
        }
      }

      console.log('✅ Broker import completed!');
      return true;
    } catch (error) {
      console.error('❌ Broker import failed:', error.message);
      return false;
    }
  }

  async importBrokerSimple(broker) {
    // Extract broker name from available fields
    const brokerName = broker.name || broker.title || 'Unknown Broker';

    // Generate slug from name
    const slug = brokerName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create simplified broker record matching existing schema
    const brokerRecord = {
      name: brokerName,
      slug: slug,
      country: broker.country || broker.headquarters || 'Unknown',
      established_year: broker.year_founded || broker.established_year || null,
      website_url: broker.website || broker.url || '',
      min_deposit: this.extractNumber(broker.min_deposit) || 0,
      spreads_avg: this.extractNumber(broker.typical_spread) || 0,
      leverage_max: broker.max_leverage || '',
      avg_rating: broker.rating || 0,
      total_reviews: broker.review_count || 0,
      is_active: true,
      featured: false,
      description: broker.description || '',
      company_description: broker.description || '',
      headquarters_location: broker.headquarters || broker.country || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert broker record
    const { data: insertedBroker, error: insertError } = await this.supabase
      .from('brokers')
      .insert([brokerRecord])
      .select()
      .single();

    if (insertError) {
      console.log(`⚠️  Broker may already exist: ${brokerName}`);
      // Try to update existing broker
      const { data: updatedBroker, error: updateError } = await this.supabase
        .from('brokers')
        .update(brokerRecord)
        .eq('name', brokerName)
        .select()
        .single();

      if (updateError) {
        console.log(`Update failed for ${brokerName}: ${updateError.message}`);
        // Don't throw error, just continue
        return;
      }
    }

    return insertedBroker;
  }

  extractNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    const match = value.toString().match(/[\d,]+\.?\d*/);
    if (!match) return 0;

    return parseFloat(match[0].replace(/,/g, ''));
  }

  async verifyImport() {
    console.log('🔍 Verifying import...');

    const { count, error } = await this.supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error verifying import:', error);
      return 0;
    }

    return count;
  }

  generateReport() {
    const report = {
      importDate: new Date().toISOString(),
      supabaseProject: process.env.SUPABASE_URL,
      statistics: {
        totalBrokers: this.importStats.totalBrokers,
        importedBrokers: this.importStats.importedBrokers,
        failedBrokers: this.importStats.failedBrokers,
        successRate: this.importStats.totalBrokers > 0
          ? ((this.importStats.importedBrokers / this.importStats.totalBrokers) * 100).toFixed(2) + '%'
          : '0%'
      },
      errors: this.importStats.errors,
      totalBrokersInDb: this.verificationResults
    };

    return report;
  }

  async runImport() {
    console.log('🚀 Starting Simplified Supabase Broker Import');
    console.log('=' * 50);

    // Test connection
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      console.error('❌ Cannot proceed with import - connection failed');
      return false;
    }

    // Import brokers
    const importOk = await this.importBrokers();
    if (!importOk) {
      console.error('❌ Import process failed');
      return false;
    }

    // Verify import
    this.verificationResults = await this.verifyImport();

    // Generate and save report
    const report = this.generateReport();
    fs.writeFileSync('simple-supabase-import-report.json', JSON.stringify(report, null, 2));

    // Display results
    this.displayResults(report);

    console.log('✅ Simplified Supabase import completed!');
    return report;
  }

  displayResults(report) {
    console.log('\n🎊 SIMPLIFIED SUPABASE IMPORT RESULTS');
    console.log('=' * 50);

    console.log('\n📊 IMPORT STATISTICS:');
    console.log(`   Total Brokers: ${report.statistics.totalBrokers}`);
    console.log(`   Imported: ${report.statistics.importedBrokers}`);
    console.log(`   Failed: ${report.statistics.failedBrokers}`);
    console.log(`   Success Rate: ${report.statistics.successRate}`);

    console.log(`\n🔍 VERIFICATION:`);
    console.log(`   Total brokers in database: ${report.totalBrokersInDb}`);

    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.slice(0, 10).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.broker}: ${error.error}`);
      });
      if (report.errors.length > 10) {
        console.log(`   ... and ${report.errors.length - 10} more errors`);
      }
    }

    console.log('\n📄 Detailed report saved to: simple-supabase-import-report.json');
  }
}

// Execute the import
async function executeSimpleImport() {
  const importer = new SimpleSupabaseImporter();
  return await importer.runImport();
}

// Run the import
executeSimpleImport().then(report => {
  console.log('\n🎉 Simplified Supabase import completed!');
}).catch(error => {
  console.error('❌ Import failed:', error.message);
});