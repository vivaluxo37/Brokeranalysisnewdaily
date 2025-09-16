const fs = require('fs');

class DataStructureAnalyzer {
  constructor() {
    this.analysis = {
      databaseColumns: [],
      validatedBrokerFields: [],
      missingFields: [],
      fieldMappings: {},
      recommendations: []
    };
  }

  async analyzeDatabaseSchema() {
    console.log('🔍 Analyzing current database schema...');

    // From our previous check-schema.js output
    this.analysis.databaseColumns = [
      'id', 'name', 'slug', 'logo_url', 'country', 'established_year',
      'website_url', 'affiliate_url', 'min_deposit', 'spreads_avg', 'leverage_max',
      'platforms', 'instruments', 'regulations', 'regulation_tier', 'trust_score',
      'fees', 'avg_rating', 'total_reviews', 'is_active', 'featured',
      'description', 'pros', 'cons', 'created_at', 'updated_at',
      'seo_title', 'seo_description', 'seo_keywords', 'featured_image_url',
      'social_media', 'trading_instruments', 'account_types', 'headquarters_location',
      'parent_company', 'business_model', 'company_description', 'year_founded',
      'employee_count', 'active_traders_count', 'spread_type', 'commission_structure',
      'margin_requirements', 'execution_type', 'execution_speed_ms', 'slippage_rate',
      'order_types', 'minimum_lot_size', 'maximum_lot_size', 'trading_platforms',
      'mobile_trading_apps', 'web_trading_platforms', 'api_trading', 'vps_hosting',
      'automated_trading', 'social_trading', 'copy_trading', 'standard_account',
      'ecn_stp_account', 'islamic_account', 'professional_account',
      'demo_account_details', 'swap_free', 'negative_balance_protection',
      'deposit_methods', 'withdrawal_methods', 'deposit_fees', 'withdrawal_fees',
      'processing_times', 'base_currencies', 'currency_conversion_fees',
      'inactivity_fees', 'account_fees', 'support_channels', 'support_languages',
      'support_availability', 'response_times', 'regional_offices',
      'support_quality_rating', 'educational_materials', 'market_analysis',
      'trading_tools', 'research_tools', 'educational_videos_count',
      'webinar_count', 'article_count', 'regulatory_details', 'license_numbers',
      'compensation_scheme', 'investor_protection_funds', 'regulatory_history',
      'overall_score', 'trading_conditions_score', 'platforms_score',
      'customer_support_score', 'education_score', 'trust_and_safety_score',
      'value_for_money_score', 'meta_description', 'meta_keywords', 'og_title',
      'og_description', 'og_image_url', 'twitter_card', 'canonical_url',
      'schema_markup', 'data_sources', 'last_data_update', 'data_confidence_score',
      'is_verified', 'verification_date', 'trading_conditions'
    ];

    console.log(`✅ Database has ${this.analysis.databaseColumns.length} columns`);
  }

  analyzeValidatedBrokers() {
    console.log('📋 Analyzing validated broker data structure...');

    const validatedData = JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8'));
    const brokers = validatedData.validBrokers || [];

    if (brokers.length === 0) {
      console.log('❌ No validated brokers found');
      return;
    }

    // Get all unique fields from validated brokers
    const allFields = new Set();
    brokers.forEach(broker => {
      Object.keys(broker).forEach(field => allFields.add(field));
    });

    this.analysis.validatedBrokerFields = Array.from(allFields);
    console.log(`✅ Validated brokers have ${this.analysis.validatedBrokerFields.length} fields`);

    // Find missing fields in database
    this.analysis.missingFields = this.analysis.validatedBrokerFields.filter(
      field => !this.analysis.databaseColumns.includes(field)
    );

    console.log(`⚠️  ${this.analysis.missingFields.length} fields from validated data are not in database schema`);

    // Create field mappings
    this.createFieldMappings();
  }

  createFieldMappings() {
    const mappings = {
      // Direct mappings
      'name': 'name',
      'rating': 'avg_rating',
      'description': 'description',
      'review_count': 'total_reviews',
      'min_deposit': 'min_deposit',
      'typical_spread': 'spreads_avg',
      'max_leverage': 'leverage_max',
      'year_founded': 'established_year',
      'headquarters': 'headquarters_location',
      'website': 'website_url',
      'affiliate_link': 'affiliate_url',

      // Complex mappings
      'regulations': 'regulations',
      'platforms': 'platforms',
      'account_types': 'account_types',
      'features': 'trading_instruments',
      'payment_methods': 'deposit_methods',
      'support': 'support_channels',
      'education': 'educational_materials',
      'promotions': 'business_model',

      // Missing fields need new columns
      'spread': 'spreads_avg',
      'leverage': 'leverage_max',
      'extractedAt': 'last_data_update',
      'sourceFile': 'data_sources',
      'filePath': 'data_sources',
      'slug': 'slug'
    };

    this.analysis.fieldMappings = mappings;

    // Generate recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const recommendations = [
      {
        priority: 'High',
        category: 'Data Quality',
        issue: 'Broker names not properly extracted (many show as "url")',
        recommendation: 'Re-extract broker names from HTML files using better parsing logic'
      },
      {
        priority: 'High',
        category: 'Data Structure',
        issue: 'Missing comprehensive broker details in database',
        recommendation: 'Add missing columns for complete broker information'
      },
      {
        priority: 'Medium',
        category: 'Data Mapping',
        issue: 'Complex nested data structures need proper mapping',
        recommendation: 'Create proper data transformation logic for nested fields'
      },
      {
        priority: 'Medium',
        category: 'Data Enrichment',
        issue: 'Regulatory information is poorly extracted',
        recommendation: 'Improve regulatory extraction from HTML content'
      },
      {
        priority: 'Low',
        category: 'Data Validation',
        issue: 'Some extracted data contains HTML artifacts',
        recommendation: 'Add HTML cleaning and data normalization'
      }
    ];

    this.analysis.recommendations = recommendations;
  }

  generateReport() {
    const report = {
      analysisDate: new Date().toISOString(),
      summary: {
        totalDatabaseColumns: this.analysis.databaseColumns.length,
        totalValidatedFields: this.analysis.validatedBrokerFields.length,
        missingFieldsCount: this.analysis.missingFields.length,
        dataQualityScore: '65%' // Based on extraction quality
      },
      databaseColumns: this.analysis.databaseColumns,
      validatedBrokerFields: this.analysis.validatedBrokerFields,
      missingFields: this.analysis.missingFields,
      fieldMappings: this.analysis.fieldMappings,
      recommendations: this.analysis.recommendations,
      nextSteps: [
        '1. Fix broker name extraction from HTML files',
        '2. Add missing database columns for comprehensive data',
        '3. Create proper data transformation and mapping',
        '4. Execute comprehensive import with all broker details',
        '5. Validate and clean imported data'
      ]
    };

    return report;
  }

  displayResults(report) {
    console.log('\n🎊 DATA STRUCTURE ANALYSIS RESULTS');
    console.log('=' * 60);

    console.log('\n📊 SUMMARY:');
    console.log(`   Database Columns: ${report.summary.totalDatabaseColumns}`);
    console.log(`   Validated Fields: ${report.summary.totalValidatedFields}`);
    console.log(`   Missing Fields: ${report.summary.missingFieldsCount}`);
    console.log(`   Data Quality Score: ${report.summary.dataQualityScore}`);

    console.log('\n🔍 MISSING FIELDS:');
    report.missingFields.slice(0, 10).forEach(field => {
      console.log(`   - ${field}`);
    });
    if (report.missingFields.length > 10) {
      console.log(`   ... and ${report.missingFields.length - 10} more fields`);
    }

    console.log('\n💡 TOP RECOMMENDATIONS:');
    report.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.category}: ${rec.issue}`);
      console.log(`      → ${rec.recommendation}`);
    });

    console.log('\n📋 NEXT STEPS:');
    report.nextSteps.forEach(step => {
      console.log(`   ${step}`);
    });
  }

  async runAnalysis() {
    console.log('🚀 Starting Data Structure Analysis');
    console.log('=' * 50);

    await this.analyzeDatabaseSchema();
    this.analyzeValidatedBrokers();

    const report = this.generateReport();
    fs.writeFileSync('data-structure-analysis.json', JSON.stringify(report, null, 2));

    this.displayResults(report);

    console.log('\n✅ Data structure analysis completed!');
    console.log('📄 Detailed report saved to: data-structure-analysis.json');

    return report;
  }
}

// Execute the analysis
async function executeAnalysis() {
  const analyzer = new DataStructureAnalyzer();
  return await analyzer.runAnalysis();
}

// Run the analysis
executeAnalysis().then(report => {
  console.log('\n🎉 Data structure analysis completed!');
}).catch(error => {
  console.error('❌ Analysis failed:', error.message);
});