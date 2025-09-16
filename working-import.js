const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class WorkingSupabaseImporter {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.importStats = {
      totalBrokers: 0,
      importedBrokers: 0,
      updatedBrokers: 0,
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
      console.log('🚀 Starting working import...');

      // Load fixed broker data
      const fixedData = JSON.parse(fs.readFileSync('fixed-broker-names.json', 'utf8'));
      const brokers = fixedData.fixedBrokers || [];
      this.importStats.totalBrokers = brokers.length;

      console.log(`📊 Importing ${brokers.length} brokers...`);

      // Import brokers
      for (const broker of brokers) {
        try {
          const result = await this.importWorkingBroker(broker);
          if (result === 'inserted') {
            this.importStats.importedBrokers++;
          } else if (result === 'updated') {
            this.importStats.updatedBrokers++;
          }

          if ((this.importStats.importedBrokers + this.importStats.updatedBrokers) % 10 === 0) {
            console.log(`📈 Progress: ${this.importStats.importedBrokers + this.importStats.updatedBrokers}/${brokers.length} brokers processed`);
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

      console.log('✅ Working import completed!');
      return true;
    } catch (error) {
      console.error('❌ Working import failed:', error.message);
      return false;
    }
  }

  async importWorkingBroker(broker) {
    // Generate slug from name
    const slug = broker.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create minimal working broker record
    const brokerRecord = {
      name: broker.name,
      slug: slug,
      description: this.cleanHtml(broker.description) || '',
      avg_rating: broker.rating || 0,
      total_reviews: broker.review_count || 0,
      min_deposit: this.extractNumber(broker.minDeposit) || 0,
      spreads_avg: this.extractNumber(broker.spread) || this.extractNumber(broker.typical_spread) || 0,
      leverage_max: broker.leverage || broker.max_leverage || '',
      established_year: this.extractYear(broker.year_founded) || null,
      headquarters_location: broker.headquarters || '',
      country: broker.country || broker.headquarters || '',
      is_active: true,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Only add non-empty string fields
    if (broker.website) {
      brokerRecord.website_url = this.extractUrl(broker.website) || '';
    }

    // Check if broker exists
    const { data: existingBroker, error: checkError } = await this.supabase
      .from('brokers')
      .select('id, name')
      .eq('name', broker.name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      throw checkError;
    }

    if (existingBroker) {
      // Update existing broker
      const { error: updateError } = await this.supabase
        .from('brokers')
        .update(brokerRecord)
        .eq('id', existingBroker.id);

      if (updateError) {
        console.log(`Update failed for ${broker.name}: ${updateError.message}`);
        return 'failed';
      }

      return 'updated';
    } else {
      // Insert new broker
      const { error: insertError } = await this.supabase
        .from('brokers')
        .insert([brokerRecord]);

      if (insertError) {
        console.log(`Insert failed for ${broker.name}: ${insertError.message}`);
        return 'failed';
      }

      return 'inserted';
    }
  }

  // Helper methods
  extractUrl(text) {
    if (!text || typeof text !== 'string') return null;
    const urlMatch = text.match(/https?:\/\/[^\s<"]+/);
    return urlMatch ? urlMatch[0] : null;
  }

  extractNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;
    const match = value.toString().match(/[\d,]+\.?\d*/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/,/g, ''));
  }

  extractYear(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;
    const match = value.toString().match(/\b(19|20)\d{2}\b/);
    return match ? parseInt(match[0]) : null;
  }

  cleanHtml(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  async verifyImport() {
    console.log('🔍 Verifying working import...');

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
        updatedBrokers: this.importStats.updatedBrokers,
        failedBrokers: this.importStats.failedBrokers,
        totalProcessed: this.importStats.importedBrokers + this.importStats.updatedBrokers,
        successRate: this.importStats.totalBrokers > 0
          ? ((this.importStats.importedBrokers + this.importStats.updatedBrokers) / this.importStats.totalBrokers * 100).toFixed(2) + '%'
          : '0%'
      },
      errors: this.importStats.errors,
      totalBrokersInDb: this.verificationResults,
      notes: 'Imported basic broker information. Array fields excluded due to database constraints.'
    };

    return report;
  }

  async runImport() {
    console.log('🚀 Starting Working Broker Import');
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
    fs.writeFileSync('working-import-report.json', JSON.stringify(report, null, 2));

    // Display results
    this.displayResults(report);

    console.log('✅ Working import completed!');
    return report;
  }

  displayResults(report) {
    console.log('\n🎊 WORKING IMPORT RESULTS');
    console.log('=' * 50);

    console.log('\n📊 IMPORT STATISTICS:');
    console.log(`   Total Brokers: ${report.statistics.totalBrokers}`);
    console.log(`   New Imports: ${report.statistics.importedBrokers}`);
    console.log(`   Updates: ${report.statistics.updatedBrokers}`);
    console.log(`   Failed: ${report.statistics.failedBrokers}`);
    console.log(`   Success Rate: ${report.statistics.successRate}`);

    console.log(`\n🔍 VERIFICATION:`);
    console.log(`   Total brokers in database: ${report.totalBrokersInDb}`);

    console.log(`\n📝 NOTES:`);
    console.log(`   ${report.notes}`);

    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.broker}: ${error.error}`);
      });
      if (report.errors.length > 5) {
        console.log(`   ... and ${report.errors.length - 5} more errors`);
      }
    }

    console.log('\n📄 Detailed report saved to: working-import-report.json');
  }
}

// Execute the working import
async function executeWorkingImport() {
  const importer = new WorkingSupabaseImporter();
  return await importer.runImport();
}

// Run the working import
executeWorkingImport().then(report => {
  console.log('\n🎉 Working import completed!');
}).catch(error => {
  console.error('❌ Working import failed:', error.message);
});