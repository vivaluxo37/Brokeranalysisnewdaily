const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class DatabaseUpdater {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.enhancedData = JSON.parse(fs.readFileSync('enhanced-extracted-data.json', 'utf8'));
    this.updateStats = {
      totalBrokers: 0,
      updatedBrokers: 0,
      updatedFields: {},
      errors: []
    };
  }

  async updateBrokerRecords() {
    console.log('🔄 Updating broker records with enhanced data...');

    // Get current brokers from database
    const { data: brokers, error } = await this.supabase
      .from('brokers')
      .select('id, name');

    if (error) {
      console.error('❌ Error fetching brokers:', error.message);
      return;
    }

    this.updateStats.totalBrokers = brokers.length;
    console.log(`📊 Found ${brokers.length} brokers to update`);

    // Process each broker
    for (const broker of brokers) {
      try {
        await this.updateBrokerRecord(broker);
      } catch (error) {
        console.error(`❌ Error updating ${broker.name}:`, error.message);
        this.updateStats.errors.push({
          broker: broker.name,
          error: error.message
        });
      }
    }

    this.displayUpdateStats();
    return this.updateStats;
  }

  async updateBrokerRecord(broker) {
    const enhancedInfo = this.enhancedData[broker.name];

    if (!enhancedInfo || Object.keys(enhancedInfo).length === 0) {
      console.log(`⏭️  No enhanced data for ${broker.name}`);
      return;
    }

    // Convert array fields to PostgreSQL text format
    const updateData = this.convertToDatabaseFormat(enhancedInfo);

    if (Object.keys(updateData).length === 0) {
      console.log(`⏭️  No new data to update for ${broker.name}`);
      return;
    }

    // Update the broker record
    const { error } = await this.supabase
      .from('brokers')
      .update(updateData)
      .eq('id', broker.id);

    if (error) {
      console.error(`❌ Update failed for ${broker.name}: ${error.message}`);
      throw error;
    }

    this.updateStats.updatedBrokers++;
    this.updateFieldStats(updateData);

    console.log(`✅ Updated ${broker.name} with ${Object.keys(updateData).length} fields`);
  }

  convertToDatabaseFormat(enhancedInfo) {
    const updateData = {};

    Object.entries(enhancedInfo).forEach(([key, value]) => {
      // Skip null/undefined values and array fields that cause issues
      if (value === null || value === undefined) return;

      // Skip array fields that cause PostgreSQL array literal issues
      const arrayFields = ['platforms', 'instruments', 'regulations', 'account_types', 'support_channels'];
      if (arrayFields.includes(key)) return;

      // Only update non-array fields
      if (typeof value === 'string') {
        // Clean up text values
        updateData[key] = this.cleanText(value);
      } else if (typeof value === 'number') {
        updateData[key] = value;
      } else if (typeof value === 'boolean') {
        updateData[key] = value;
      }
    });

    return updateData;
  }

  cleanText(text) {
    if (typeof text !== 'string') return text;

    return text
      .replace(/\s+/g, ' ')  // Multiple spaces to single space
      .replace(/[,;]+$/, '') // Remove trailing commas/semicolons
      .trim();              // Remove leading/trailing whitespace
  }

  updateFieldStats(updateData) {
    Object.keys(updateData).forEach(field => {
      if (!this.updateStats.updatedFields[field]) {
        this.updateStats.updatedFields[field] = 0;
      }
      this.updateStats.updatedFields[field]++;
    });
  }

  displayUpdateStats() {
    console.log('\n📊 UPDATE STATISTICS:');
    console.log(`   Total Brokers: ${this.updateStats.totalBrokers}`);
    console.log(`   Updated Brokers: ${this.updateStats.updatedBrokers}`);
    console.log(`   Success Rate: ${((this.updateStats.updatedBrokers / this.updateStats.totalBrokers) * 100).toFixed(2)}%`);

    console.log('\n📋 FIELDS UPDATED:');
    Object.entries(this.updateStats.updatedFields).forEach(([field, count]) => {
      console.log(`   ${field}: ${count} brokers`);
    });

    if (this.updateStats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.updateStats.errors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.broker}: ${error.error}`);
      });
      if (this.updateStats.errors.length > 5) {
        console.log(`   ... and ${this.updateStats.errors.length - 5} more errors`);
      }
    }
  }

  generateReport() {
    const report = {
      updateDate: new Date().toISOString(),
      statistics: {
        totalBrokers: this.updateStats.totalBrokers,
        updatedBrokers: this.updateStats.updatedBrokers,
        successRate: ((this.updateStats.updatedBrokers / this.updateStats.totalBrokers) * 100).toFixed(2) + '%',
        totalFieldsUpdated: Object.values(this.updateStats.updatedFields).reduce((a, b) => a + b, 0)
      },
      fieldsUpdated: this.updateStats.updatedFields,
      errors: this.updateStats.errors,
      nextSteps: [
        '1. Verify database updates were successful',
        '2. Run final database analysis to check remaining empty columns',
        '3. Consider additional web scraping for missing information',
        '4. Generate missing SEO content automatically'
      ]
    };

    return report;
  }

  async runUpdate() {
    console.log('🚀 Starting Database Update');
    console.log('='.repeat(50));

    await this.updateBrokerRecords();

    const report = this.generateReport();
    fs.writeFileSync('database-update-report.json', JSON.stringify(report, null, 2));

    console.log('\n✅ Database update completed!');
    console.log('📄 Update report saved to: database-update-report.json');

    return report;
  }
}

// Execute the database update
async function executeDatabaseUpdate() {
  const updater = new DatabaseUpdater();
  return await updater.runUpdate();
}

// Run the database update
executeDatabaseUpdate().then(report => {
  console.log('\n🎉 Database update completed!');
}).catch(error => {
  console.error('❌ Database update failed:', error.message);
});