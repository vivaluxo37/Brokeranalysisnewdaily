const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class SupabaseBrokerImporter {
  constructor() {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.importStats = {
      totalBrokers: 0,
      importedBrokers: 0,
      failedBrokers: 0,
      errors: [],
      tables: {}
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
      console.log('🚀 Starting actual Supabase import...');

      // Load validated broker data
      const validatedData = JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8'));
      const brokerData = validatedData.validBrokers || validatedData.brokers || [];
      this.importStats.totalBrokers = brokerData.length;

      console.log(`📊 Importing ${brokerData.length} validated brokers...`);

      // Import brokers
      for (const broker of brokerData) {
        try {
          await this.importBroker(broker);
          this.importStats.importedBrokers++;

          if (this.importStats.importedBrokers % 10 === 0) {
            console.log(`📈 Progress: ${this.importStats.importedBrokers}/${brokerData.length} brokers imported`);
          }
        } catch (error) {
          this.importStats.failedBrokers++;
          this.importStats.errors.push({
            broker: broker.name,
            error: error.message
          });
          console.error(`❌ Failed to import ${broker.name}:`, error.message);
        }
      }

      console.log('✅ Broker import completed!');
      return true;
    } catch (error) {
      console.error('❌ Broker import failed:', error.message);
      return false;
    }
  }

  async importBroker(broker) {
    // Insert main broker record
    const { data: brokerRecord, error: brokerError } = await this.supabase
      .from('brokers')
      .insert([{
        name: broker.name,
        description: broker.description || '',
        rating: broker.rating || 0,
        review_count: broker.review_count || 0,
        min_deposit: broker.min_deposit || 0,
        typical_spread: broker.typical_spread || 0,
        max_leverage: broker.max_leverage || 0,
        website: broker.website || '',
        year_founded: broker.year_founded || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (brokerError) throw brokerError;

    const brokerId = brokerRecord.id;

    // Import related data
    await this.importBrokerFeatures(brokerId, broker.features || []);
    await this.importBrokerRegulations(brokerId, broker.regulations || []);
    await this.importBrokerPlatforms(brokerId, broker.platforms || []);
    await this.importBrokerAccounts(brokerId, broker.account_types || []);
    await this.importBrokerPayments(brokerId, broker.payment_methods || []);
    await this.importBrokerSupport(brokerId, broker.support || {});
    await this.importBrokerEducation(brokerId, broker.education || []);
    await this.importBrokerPromotions(brokerId, broker.promotions || []);

    // Track table statistics
    this.importStats.tables.brokers = (this.importStats.tables.brokers || 0) + 1;
  }

  async importBrokerFeatures(brokerId, features) {
    if (!features.length) return;

    const { error } = await this.supabase
      .from('broker_features')
      .insert(
        features.map(feature => ({
          broker_id: brokerId,
          feature_name: feature.name || feature,
          feature_description: feature.description || '',
          is_available: true
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_features = (this.importStats.tables.broker_features || 0) + features.length;
  }

  async importBrokerRegulations(brokerId, regulations) {
    if (!regulations.length) return;

    const { error } = await this.supabase
      .from('broker_regulations')
      .insert(
        regulations.map(reg => ({
          broker_id: brokerId,
          regulator: reg.regulator || reg,
          license_number: reg.license_number || '',
          status: 'active'
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_regulations = (this.importStats.tables.broker_regulations || 0) + regulations.length;
  }

  async importBrokerPlatforms(brokerId, platforms) {
    if (!platforms.length) return;

    const { error } = await this.supabase
      .from('broker_platforms')
      .insert(
        platforms.map(platform => ({
          broker_id: brokerId,
          platform_name: platform.name || platform,
          platform_type: platform.type || 'trading',
          is_available: true
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_platforms = (this.importStats.tables.broker_platforms || 0) + platforms.length;
  }

  async importBrokerAccounts(brokerId, accounts) {
    if (!accounts.length) return;

    const { error } = await this.supabase
      .from('broker_account_types')
      .insert(
        accounts.map(account => ({
          broker_id: brokerId,
          account_type: account.type || account,
          min_deposit: account.min_deposit || 0,
          max_leverage: account.max_leverage || 0,
          spread_type: account.spread_type || 'variable',
          commission: account.commission || 0
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_account_types = (this.importStats.tables.broker_account_types || 0) + accounts.length;
  }

  async importBrokerPayments(brokerId, payments) {
    if (!payments.length) return;

    const { error } = await this.supabase
      .from('broker_payment_methods')
      .insert(
        payments.map(payment => ({
          broker_id: brokerId,
          payment_method: payment.method || payment,
          is_available: true,
          processing_time: payment.processing_time || ''
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_payment_methods = (this.importStats.tables.broker_payment_methods || 0) + payments.length;
  }

  async importBrokerSupport(brokerId, support) {
    if (!support || !Object.keys(support).length) return;

    const supportMethods = [
      { method: 'phone', value: support.phone },
      { method: 'email', value: support.email },
      { method: 'live_chat', value: support.live_chat },
      { method: 'languages', value: Array.isArray(support.languages) ? support.languages.join(', ') : support.languages }
    ].filter(s => s.value);

    if (supportMethods.length === 0) return;

    const { error } = await this.supabase
      .from('broker_support')
      .insert(
        supportMethods.map(method => ({
          broker_id: brokerId,
          support_method: method.method,
          contact_info: method.value,
          availability: '24/7'
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_support = (this.importStats.tables.broker_support || 0) + supportMethods.length;
  }

  async importBrokerEducation(brokerId, education) {
    if (!education.length) return;

    const { error } = await this.supabase
      .from('broker_education')
      .insert(
        education.map(edu => ({
          broker_id: brokerId,
          education_type: edu.type || 'article',
          title: edu.title || '',
          description: edu.description || '',
          difficulty_level: edu.level || 'beginner'
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_education = (this.importStats.tables.broker_education || 0) + education.length;
  }

  async importBrokerPromotions(brokerId, promotions) {
    if (!promotions.length) return;

    const { error } = await this.supabase
      .from('broker_promotions')
      .insert(
        promotions.map(promo => ({
          broker_id: brokerId,
          promotion_type: promo.type || 'bonus',
          title: promo.title || '',
          description: promo.description || '',
          is_active: true
        }))
      );

    if (error) throw error;
    this.importStats.tables.broker_promotions = (this.importStats.tables.broker_promotions || 0) + promotions.length;
  }

  async verifyImport() {
    console.log('🔍 Verifying import...');

    const tables = [
      'brokers', 'broker_features', 'broker_regulations', 'broker_platforms',
      'broker_account_types', 'broker_payment_methods', 'broker_support',
      'broker_education', 'broker_promotions'
    ];

    const verificationResults = {};

    for (const table of tables) {
      const { count, error } = await this.supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        verificationResults[table] = count;
      }
    }

    return verificationResults;
  }

  generateReport() {
    const report = {
      importDate: new Date().toISOString(),
      supabaseProject: process.env.SUPABASE_URL,
      statistics: {
        totalBrokers: this.importStats.totalBrokers,
        importedBrokers: this.importStats.importedBrokers,
        failedBrokers: this.importStats.failedBrokers,
        successRate: ((this.importStats.importedBrokers / this.importStats.totalBrokers) * 100).toFixed(2) + '%'
      },
      tablesImported: this.importStats.tables,
      errors: this.importStats.errors,
      verificationResults: this.verificationResults
    };

    return report;
  }

  async runImport() {
    console.log('🚀 Starting Supabase Broker Import Process');
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
    fs.writeFileSync('supabase-import-report.json', JSON.stringify(report, null, 2));

    // Display results
    this.displayResults(report);

    console.log('✅ Supabase import process completed!');
    return report;
  }

  displayResults(report) {
    console.log('\n🎊 SUPABASE IMPORT RESULTS');
    console.log('=' * 50);

    console.log('\n📊 IMPORT STATISTICS:');
    console.log(`   Total Brokers: ${report.statistics.totalBrokers}`);
    console.log(`   Imported: ${report.statistics.importedBrokers}`);
    console.log(`   Failed: ${report.statistics.failedBrokers}`);
    console.log(`   Success Rate: ${report.statistics.successRate}`);

    console.log('\n📋 TABLES IMPORTED:');
    Object.entries(report.tablesImported).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`);
    });

    console.log('\n🔍 VERIFICATION RESULTS:');
    Object.entries(report.verificationResults).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records in database`);
    });

    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.broker}: ${error.error}`);
      });
    }

    console.log('\n📄 Detailed report saved to: supabase-import-report.json');
  }
}

// Execute the import
async function executeSupabaseImport() {
  const importer = new SupabaseBrokerImporter();
  return await importer.runImport();
}

// Run the import
executeSupabaseImport().then(report => {
  console.log('\n🎉 Supabase import completed successfully!');
}).catch(error => {
  console.error('❌ Import failed:', error.message);
});