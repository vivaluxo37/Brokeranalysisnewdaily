const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Get one broker record to see the actual schema
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error checking schema:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 Actual broker table columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof data[0][key]}`);
      });
    } else {
      console.log('No brokers found in database');
    }

    // Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('brokers')
      .select('*')
      .limit(0);

    if (columnsError) {
      console.log('Schema error:', columnsError.message);
    }

  } catch (error) {
    console.error('Failed to check schema:', error.message);
  }
}

checkSchema();