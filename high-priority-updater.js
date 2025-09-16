const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class HighPriorityUpdater {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.highPriorityData = JSON.parse(fs.readFileSync('high-priority-extracted-data.json', 'utf8'));
    this.updateStats = {
      totalBrokers: 0,
      updatedBrokers: 0,
      updatedFields: {},
      errors: []
    };
  }

  async updateHighPriorityFields() {
    console.log('🎯 Updating high-priority fields in database...');

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
        await this.updateBrokerHighPriorityFields(broker);
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

  async updateBrokerHighPriorityFields(broker) {
    const highPriorityInfo = this.highPriorityData[broker.name];

    if (!highPriorityInfo || Object.keys(highPriorityInfo).length === 0) {
      console.log(`⏭️  No high-priority data for ${broker.name}`);
      return;
    }

    // Convert data for database update
    const updateData = this.convertToDatabaseFormat(highPriorityInfo);

    if (Object.keys(updateData).length === 0) {
      console.log(`⏭️  No new high-priority data to update for ${broker.name}`);
      return;
    }

    // Update the broker record
    const { error } = await this.supabase
      .from('brokers')
      .update(updateData)
      .eq('id', broker.id);

    if (error) {
      console.error(`❌ High-priority update failed for ${broker.name}: ${error.message}`);
      throw error;
    }

    this.updateStats.updatedBrokers++;
    this.updateFieldStats(updateData);

    console.log(`✅ Updated ${broker.name} with high-priority fields: ${Object.keys(updateData).join(', ')}`);
  }

  convertToDatabaseFormat(highPriorityInfo) {
    const updateData = {};

    Object.entries(highPriorityInfo).forEach(([key, value]) => {
      // Skip null/undefined values
      if (value === null || value === undefined) return;

      // Handle different data types
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
    console.log('\n📊 HIGH-PRIORITY UPDATE STATISTICS:');
    console.log(`   Total Brokers: ${this.updateStats.totalBrokers}`);
    console.log(`   Updated Brokers: ${this.updateStats.updatedBrokers}`);
    console.log(`   Success Rate: ${((this.updateStats.updatedBrokers / this.updateStats.totalBrokers) * 100).toFixed(2)}%`);

    console.log('\n📋 HIGH-PRIORITY FIELDS UPDATED:');
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

  async runHighPriorityUpdate() {
    console.log('🚀 Starting High-Priority Field Update');
    console.log('='.repeat(50));

    await this.updateHighPriorityFields();

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
        '1. Verify high-priority field updates were successful',
        '2. Run final database analysis to check remaining empty columns',
        '3. Implement web search for remaining missing high-priority data',
        '4. Focus on established_year which needs web search',
        '5. Complete medium and low priority column enhancements'
      ]
    };

    fs.writeFileSync('high-priority-update-report.json', JSON.stringify(report, null, 2));

    console.log('\n✅ High-priority field update completed!');
    console.log('📄 Update report saved to: high-priority-update-report.json');

    return report;
  }
}

// Execute the high-priority update
async function executeHighPriorityUpdate() {
  const updater = new HighPriorityUpdater();
  return await updater.runHighPriorityUpdate();
}

// Run the high-priority update
executeHighPriorityUpdate().then(report => {
  console.log('\n🎉 High-priority field update completed!');
}).catch(error => {
  console.error('❌ High-priority field update failed:', error.message);
});