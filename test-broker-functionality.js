const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_BROKERS = ['bdswiss', 'capital', 'etoro', 'plus500', 'xtb'];

// Initialize Supabase client
let supabase;
try {
  const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ';
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message);
}

async function testDatabaseConnection() {
  console.log('\n=== Testing Database Connection ===');
  try {
    const { data, error } = await supabase.from('brokers').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

async function testBrokersInDatabase() {
  console.log('\n=== Testing Brokers in Database ===');
  const results = [];
  
  for (const brokerSlug of TEST_BROKERS) {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('id, name, slug, status')
        .eq('slug', brokerSlug)
        .single();
      
      if (error) {
        console.log(`❌ Broker '${brokerSlug}' not found in database:`, error.message);
        results.push({ slug: brokerSlug, exists: false, error: error.message });
      } else {
        console.log(`✅ Broker '${brokerSlug}' found: ${data.name} (Status: ${data.status})`);
        results.push({ slug: brokerSlug, exists: true, data });
      }
    } catch (error) {
      console.log(`❌ Error checking broker '${brokerSlug}':`, error.message);
      results.push({ slug: brokerSlug, exists: false, error: error.message });
    }
  }
  
  return results;
}

async function testAPIEndpoints() {
  console.log('\n=== Testing API Endpoints ===');
  const results = [];
  
  for (const brokerSlug of TEST_BROKERS) {
    try {
      const response = await fetch(`${BASE_URL}/api/brokers/${brokerSlug}`);
      const status = response.status;
      
      if (status === 200) {
        const data = await response.json();
        console.log(`✅ API endpoint /api/brokers/${brokerSlug} - Status: ${status}`);
        console.log(`   Broker: ${data.name || 'Unknown'} (ID: ${data.id || 'N/A'})`);
        results.push({ slug: brokerSlug, status, success: true, data });
      } else {
        console.log(`❌ API endpoint /api/brokers/${brokerSlug} - Status: ${status}`);
        results.push({ slug: brokerSlug, status, success: false });
      }
    } catch (error) {
      console.log(`❌ API endpoint /api/brokers/${brokerSlug} - Error:`, error.message);
      results.push({ slug: brokerSlug, success: false, error: error.message });
    }
  }
  
  return results;
}

async function testBrokerPages() {
  console.log('\n=== Testing Broker Pages ===');
  const results = [];
  
  for (const brokerSlug of TEST_BROKERS) {
    try {
      const response = await fetch(`${BASE_URL}/brokers/${brokerSlug}`);
      const status = response.status;
      const html = await response.text();
      
      // Check for key indicators in the HTML
      const hasMainElement = html.includes('<main');
      const hasErrorBoundary = html.includes('error-boundary') || html.includes('ErrorBoundary');
      const hasLoadingState = html.includes('Loading') || html.includes('loading');
      const hasBrokerContent = html.includes(brokerSlug) || html.includes('broker');
      const is404 = html.includes('404') || html.includes('Not Found');
      
      console.log(`📄 Page /brokers/${brokerSlug} - Status: ${status}`);
      console.log(`   Main element: ${hasMainElement ? '✅' : '❌'}`);
      console.log(`   Error boundary: ${hasErrorBoundary ? '✅' : '❌'}`);
      console.log(`   Loading state: ${hasLoadingState ? '✅' : '❌'}`);
      console.log(`   Broker content: ${hasBrokerContent ? '✅' : '❌'}`);
      console.log(`   Is 404: ${is404 ? '❌' : '✅'}`);
      
      results.push({
        slug: brokerSlug,
        status,
        hasMainElement,
        hasErrorBoundary,
        hasLoadingState,
        hasBrokerContent,
        is404,
        success: status === 200 && hasMainElement && !is404
      });
    } catch (error) {
      console.log(`❌ Page /brokers/${brokerSlug} - Error:`, error.message);
      results.push({ slug: brokerSlug, success: false, error: error.message });
    }
  }
  
  return results;
}

async function generateTestReport(dbResults, apiResults, pageResults) {
  console.log('\n=== COMPREHENSIVE TEST REPORT ===');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBrokers: TEST_BROKERS.length,
      databaseSuccess: dbResults.filter(r => r.exists).length,
      apiSuccess: apiResults.filter(r => r.success).length,
      pageSuccess: pageResults.filter(r => r.success).length
    },
    details: {
      database: dbResults,
      api: apiResults,
      pages: pageResults
    },
    recommendations: []
  };
  
  // Generate recommendations
  if (report.summary.databaseSuccess < TEST_BROKERS.length) {
    report.recommendations.push('Some brokers are missing from the database. Consider adding sample data.');
  }
  
  if (report.summary.apiSuccess < TEST_BROKERS.length) {
    report.recommendations.push('Some API endpoints are failing. Check API route implementation.');
  }
  
  if (report.summary.pageSuccess < TEST_BROKERS.length) {
    report.recommendations.push('Some broker pages are not rendering correctly. Check component implementation and routing.');
  }
  
  // Save report to file
  fs.writeFileSync('broker-test-report.json', JSON.stringify(report, null, 2));
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Database: ${report.summary.databaseSuccess}/${report.summary.totalBrokers} brokers found`);
  console.log(`   API: ${report.summary.apiSuccess}/${report.summary.totalBrokers} endpoints working`);
  console.log(`   Pages: ${report.summary.pageSuccess}/${report.summary.totalBrokers} pages rendering correctly`);
  
  if (report.recommendations.length > 0) {
    console.log(`\n💡 RECOMMENDATIONS:`);
    report.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  console.log(`\n📄 Detailed report saved to: broker-test-report.json`);
  
  return report;
}

async function runAllTests() {
  console.log('🚀 Starting Broker Functionality Tests...');
  
  // Test database connection first
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Cannot proceed with tests - database connection failed');
    return;
  }
  
  // Run all tests
  const dbResults = await testBrokersInDatabase();
  const apiResults = await testAPIEndpoints();
  const pageResults = await testBrokerPages();
  
  // Generate comprehensive report
  const report = await generateTestReport(dbResults, apiResults, pageResults);
  
  console.log('\n✅ All tests completed!');
  return report;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testDatabaseConnection, testBrokersInDatabase, testAPIEndpoints, testBrokerPages };