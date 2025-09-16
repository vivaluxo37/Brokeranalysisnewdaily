const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class DatabaseAnalyzer {
  constructor() {
    require('dotenv').config({ path: '.env.local' });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.analysis = {
      totalBrokers: 0,
      columnAnalysis: {},
      nullColumns: [],
      sampleData: {},
      recommendations: []
    };
  }

  async analyzeDatabase() {
    console.log('🔍 Analyzing Supabase database for empty columns...');

    // Get total count
    const { count, error: countError } = await this.supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting broker count:', countError.message);
      return;
    }

    this.analysis.totalBrokers = count;
    console.log(`📊 Found ${count} brokers in database`);

    // Get sample data to analyze columns
    const { data: sampleBrokers, error: sampleError } = await this.supabase
      .from('brokers')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('❌ Error getting sample data:', sampleError.message);
      return;
    }

    // Get all brokers for comprehensive analysis
    const { data: allBrokers, error: allError } = await this.supabase
      .from('brokers')
      .select('*');

    if (allError) {
      console.error('❌ Error getting all brokers:', allError.message);
      return;
    }

    this.analyzeColumns(allBrokers, sampleBrokers);
    this.generateRecommendations();

    return this.analysis;
  }

  analyzeColumns(allBrokers, sampleBrokers) {
    console.log('📋 Analyzing column data...');

    // Get all column names from sample data
    if (sampleBrokers && sampleBrokers.length > 0) {
      const columns = Object.keys(sampleBrokers[0]);

      columns.forEach(column => {
        const columnStats = {
          total: allBrokers.length,
          nullCount: 0,
          emptyCount: 0,
          populatedCount: 0,
          uniqueValues: new Set(),
          sampleValues: [],
          dataType: this.getDataType(allBrokers, column)
        };

        // Analyze each broker for this column
        allBrokers.forEach(broker => {
          const value = broker[column];

          if (value === null || value === undefined) {
            columnStats.nullCount++;
          } else if (value === '' || (Array.isArray(value) && value.length === 0)) {
            columnStats.emptyCount++;
          } else {
            columnStats.populatedCount++;
            columnStats.uniqueValues.add(
              typeof value === 'object' ? JSON.stringify(value) : String(value)
            );
          }
        });

        // Collect sample values
        const sampleValues = allBrokers
          .map(b => b[column])
          .filter(v => v !== null && v !== undefined && v !== '')
          .slice(0, 3);

        columnStats.sampleValues = sampleValues;
        columnStats.uniqueValues = columnStats.uniqueValues.size;

        this.analysis.columnAnalysis[column] = columnStats;

        // Identify columns that need data enrichment
        const emptyPercentage = ((columnStats.nullCount + columnStats.emptyCount) / columnStats.total) * 100;
        if (emptyPercentage > 50) {
          this.analysis.nullColumns.push({
            column,
            emptyPercentage: emptyPercentage.toFixed(2),
            nullCount: columnStats.nullCount,
            emptyCount: columnStats.emptyCount,
            dataType: columnStats.dataType,
            priority: this.getPriority(column, emptyPercentage)
          });
        }
      });
    }

    // Store sample data for reference
    this.analysis.sampleData = sampleBrokers;
  }

  getDataType(brokers, column) {
    const sampleValue = brokers.find(b => b[column] !== null && b[column] !== undefined)?.[column];

    if (sampleValue === null || sampleValue === undefined) return 'unknown';

    if (Array.isArray(sampleValue)) return 'array';
    if (typeof sampleValue === 'number') return 'number';
    if (typeof sampleValue === 'boolean') return 'boolean';
    if (sampleValue instanceof Date) return 'date';
    if (typeof sampleValue === 'object') return 'object';

    // Check if it's a date string
    if (typeof sampleValue === 'string' && !isNaN(Date.parse(sampleValue))) {
      return 'date';
    }

    return 'string';
  }

  getPriority(column, emptyPercentage) {
    // High priority columns that are crucial for broker information
    const highPriority = [
      'name', 'logo_url', 'country', 'established_year', 'website_url',
      'min_deposit', 'spreads_avg', 'leverage_max', 'avg_rating', 'description',
      'regulations', 'platforms', 'instruments', 'account_types'
    ];

    // Medium priority columns for enhanced features
    const mediumPriority = [
      'affiliate_url', 'spread_type', 'commission_structure', 'trust_score',
      'support_channels', 'educational_materials', 'trading_tools'
    ];

    if (highPriority.includes(column)) return 'High';
    if (mediumPriority.includes(column)) return 'Medium';
    return 'Low';
  }

  generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const recommendations = [
      {
        category: 'Basic Information',
        priority: 'High',
        columns: this.analysis.nullColumns.filter(c => ['name', 'logo_url', 'country', 'established_year', 'website_url'].includes(c.column)),
        action: 'Extract from HTML files using enhanced parsing'
      },
      {
        category: 'Trading Conditions',
        priority: 'High',
        columns: this.analysis.nullColumns.filter(c => ['min_deposit', 'spreads_avg', 'leverage_max', 'spread_type'].includes(c.column)),
        action: 'Extract trading conditions from broker HTML content'
      },
      {
        category: 'Features & Services',
        priority: 'Medium',
        columns: this.analysis.nullColumns.filter(c => ['platforms', 'instruments', 'account_types', 'regulations'].includes(c.column)),
        action: 'Parse feature sections from HTML files'
      },
      {
        category: 'Enhanced Features',
        priority: 'Medium',
        columns: this.analysis.nullColumns.filter(c => ['affiliate_url', 'trust_score', 'support_channels'].includes(c.column)),
        action: 'Extract additional features and search web if needed'
      },
      {
        category: 'SEO & Content',
        priority: 'Low',
        columns: this.analysis.nullColumns.filter(c => ['seo_title', 'seo_description', 'meta_description'].includes(c.column)),
        action: 'Generate SEO content based on broker information'
      }
    ];

    this.analysis.recommendations = recommendations;
  }

  generateReport() {
    const report = {
      analysisDate: new Date().toISOString(),
      summary: {
        totalBrokers: this.analysis.totalBrokers,
        totalColumns: Object.keys(this.analysis.columnAnalysis).length,
        emptyColumns: this.analysis.nullColumns.length,
        highPriorityEmpty: this.analysis.nullColumns.filter(c => c.priority === 'High').length,
        mediumPriorityEmpty: this.analysis.nullColumns.filter(c => c.priority === 'Medium').length
      },
      columnAnalysis: this.analysis.columnAnalysis,
      emptyColumns: this.analysis.nullColumns.sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      recommendations: this.analysis.recommendations,
      sampleData: this.analysis.sampleData,
      nextSteps: [
        '1. Extract missing basic information from HTML files',
        '2. Parse trading conditions and features',
        '3. Generate missing SEO content',
        '4. Search web for information not available locally',
        '5. Update database with complete information'
      ]
    };

    return report;
  }

  displayResults(report) {
    console.log('\n🎊 DATABASE ANALYSIS RESULTS');
    console.log('='.repeat(60));

    console.log('\n📊 SUMMARY:');
    console.log(`   Total Brokers: ${report.summary.totalBrokers}`);
    console.log(`   Total Columns: ${report.summary.totalColumns}`);
    console.log(`   Empty Columns (>50% empty): ${report.summary.emptyColumns}`);
    console.log(`   High Priority Empty: ${report.summary.highPriorityEmpty}`);
    console.log(`   Medium Priority Empty: ${report.summary.mediumPriorityEmpty}`);

    console.log('\n🔍 TOP EMPTY COLUMNS:');
    report.emptyColumns.slice(0, 10).forEach((col, index) => {
      console.log(`   ${index + 1}. [${col.priority}] ${col.column} (${col.emptyPercentage}% empty)`);
    });

    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      if (rec.columns.length > 0) {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.category}:`);
        console.log(`      Columns: ${rec.columns.map(c => c.column).join(', ')}`);
        console.log(`      Action: ${rec.action}`);
      }
    });

    console.log('\n📋 NEXT STEPS:');
    report.nextSteps.forEach(step => {
      console.log(`   ${step}`);
    });
  }

  async runAnalysis() {
    console.log('🚀 Starting Database Analysis');
    console.log('='.repeat(50));

    await this.analyzeDatabase();
    const report = this.generateReport();

    // Save detailed report
    fs.writeFileSync('database-analysis.json', JSON.stringify(report, null, 2));

    this.displayResults(report);

    console.log('\n✅ Database analysis completed!');
    console.log('📄 Detailed report saved to: database-analysis.json');

    return report;
  }
}

// Execute the analysis
async function executeDatabaseAnalysis() {
  const analyzer = new DatabaseAnalyzer();
  return await analyzer.runAnalysis();
}

// Run the analysis
executeDatabaseAnalysis().then(report => {
  console.log('\n🎉 Database analysis completed!');
}).catch(error => {
  console.error('❌ Analysis failed:', error.message);
});