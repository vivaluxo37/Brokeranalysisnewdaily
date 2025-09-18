const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase database connection...');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('brokers')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    console.log('Total brokers in database:', data?.length || 0);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function checkBrokerData() {
  console.log('\n📊 Checking broker data...');
  
  try {
    // Get first 5 brokers with their basic info
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug, website_url, is_active')
      .limit(5);
    
    if (error) {
      console.error('❌ Failed to fetch brokers:', error.message);
      return [];
    }
    
    if (!brokers || brokers.length === 0) {
      console.log('⚠️  No brokers found in database');
      return [];
    }
    
    console.log(`✅ Found ${brokers.length} brokers:`);
    brokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} (slug: ${broker.slug}) - Active: ${broker.is_active}`);
    });
    
    return brokers;
  } catch (err) {
    console.error('❌ Error checking broker data:', err.message);
    return [];
  }
}

async function testSpecificBroker(slug) {
  console.log(`\n🎯 Testing specific broker: ${slug}`);
  
  try {
    const { data: broker, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`❌ Failed to fetch broker '${slug}':`, error.message);
      return null;
    }
    
    if (!broker) {
      console.log(`⚠️  Broker '${slug}' not found`);
      return null;
    }
    
    console.log(`✅ Found broker: ${broker.name}`);
    console.log('Broker data structure:');
    console.log('- ID:', broker.id);
    console.log('- Name:', broker.name);
    console.log('- Slug:', broker.slug);
    console.log('- Website:', broker.website_url);
    console.log('- Active:', broker.is_active);
    console.log('- Platforms:', broker.platforms);
    console.log('- Regulations:', broker.regulations);
    
    return broker;
  } catch (err) {
    console.error(`❌ Error testing broker '${slug}':`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting broker database diagnostics...\n');
  
  // Test connection
  const connectionOk = await testDatabaseConnection();
  if (!connectionOk) {
    console.log('\n❌ Database connection failed. Please check your environment variables.');
    return;
  }
  
  // Check broker data
  const brokers = await checkBrokerData();
  
  if (brokers.length > 0) {
    // Test the first broker
    const firstBroker = brokers[0];
    await testSpecificBroker(firstBroker.slug);
  }
  
  console.log('\n🏁 Diagnostics complete!');
}

main().catch(console.error);