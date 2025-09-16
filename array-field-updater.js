const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class ArrayFieldUpdater {
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

  async updateArrayFields() {
    console.log('🔄 Updating array fields with proper PostgreSQL formatting...');

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
        await this.updateBrokerArrayFields(broker);
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

  async updateBrokerArrayFields(broker) {
    const enhancedInfo = this.enhancedData[broker.name];

    if (!enhancedInfo || Object.keys(enhancedInfo).length === 0) {
      console.log(`⏭️  No enhanced data for ${broker.name}`);
      return;
    }

    // Convert array fields to PostgreSQL array format
    const updateData = this.convertArraysToPostgreSQLFormat(enhancedInfo);

    if (Object.keys(updateData).length === 0) {
      console.log(`⏭️  No array data to update for ${broker.name}`);
      return;
    }

    // Update the broker record
    const { error } = await this.supabase
      .from('brokers')
      .update(updateData)
      .eq('id', broker.id);

    if (error) {
      console.error(`❌ Array update failed for ${broker.name}: ${error.message}`);
      throw error;
    }

    this.updateStats.updatedBrokers++;
    this.updateFieldStats(updateData);

    console.log(`✅ Updated ${broker.name} with ${Object.keys(updateData).length} array fields`);
  }

  convertArraysToPostgreSQLFormat(enhancedInfo) {
    const updateData = {};
    const arrayFields = ['platforms', 'instruments', 'regulations', 'account_types', 'support_channels'];

    arrayFields.forEach(field => {
      if (enhancedInfo[field] && Array.isArray(enhancedInfo[field]) && enhancedInfo[field].length > 0) {
        // Convert array to PostgreSQL array literal format
        updateData[field] = this.formatPostgresArray(enhancedInfo[field]);
      }
    });

    return updateData;
  }

  formatPostgresArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }

    // Escape special characters and quote each element
    const escapedElements = array.map(element => {
      if (typeof element !== 'string') {
        element = String(element);
      }

      // Escape backslashes and double quotes
      const escaped = element
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');

      return `"${escaped}"`;
    });

    // Join with commas and wrap in curly braces
    return `{${escapedElements.join(',')}}`;
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
    console.log('\n📊 ARRAY FIELD UPDATE STATISTICS:');
    console.log(`   Total Brokers: ${this.updateStats.totalBrokers}`);
    console.log(`   Updated Brokers: ${this.updateStats.updatedBrokers}`);
    console.log(`   Success Rate: ${((this.updateStats.updatedBrokers / this.updateStats.totalBrokers) * 100).toFixed(2)}%`);

    console.log('\n📋 ARRAY FIELDS UPDATED:');
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

  async runArrayUpdate() {
    console.log('🚀 Starting Array Field Update');
    console.log('='.repeat(50));

    await this.updateArrayFields();

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
        '1. Verify array field updates were successful',
        '2. Run final database analysis to check remaining empty columns',
        '3. Focus on high-priority missing fields like logo_url and established_year',
        '4. Consider web search for remaining missing information'
      ]
    };

    fs.writeFileSync('array-field-update-report.json', JSON.stringify(report, null, 2));

    console.log('\n✅ Array field update completed!');
    console.log('📄 Update report saved to: array-field-update-report.json');

    return report;
  }
}

// Execute the array field update
async function executeArrayFieldUpdate() {
  const updater = new ArrayFieldUpdater();
  return await updater.runArrayUpdate();
}

// Run the array field update
executeArrayFieldUpdate().then(report => {
  console.log('\n🎉 Array field update completed!');
}).catch(error => {
  console.error('❌ Array field update failed:', error.message);
});