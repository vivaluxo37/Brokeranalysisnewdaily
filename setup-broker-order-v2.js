const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// First, let's add the display_order column using RPC
async function addDisplayOrderColumn() {
  try {
    console.log('Adding display_order column to brokers table...');

    // Try to add the column using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;`
    });

    if (error) {
      console.log('Could not add column via RPC, trying alternative approach...');
      return false;
    }

    console.log('Column added successfully!');
    return true;
  } catch (error) {
    console.log('Error adding column:', error.message);
    return false;
  }
}

// Preferred broker order based on industry standards
const PREFERRED_BROKER_ORDER = [
  'XM',
  'IC Markets',
  'Pepperstone',
  'FP Markets',
  'Axi',
  'FXTM',
  'Tickmill',
  'Admirals',
  'Eightcap',
  'Forex.com',
  'OANDA',
  'IG Markets',
  'CMC Markets',
  'City Index',
  'Saxo Bank',
  'Interactive Brokers',
  'TD Ameritrade',
  'AvaTrade',
  'Plus500',
  'eToro',
  'FBS',
  'FXCM',
  'FXPro',
  'Exness',
  'HotForex',
  'IronFX',
  'OctaFX',
  'Instaforex',
  'RoboForex',
  'Libertex',
  'Admiral Markets',
  'Vantage FX',
  'ThinkMarkets',
  'BlackBull Markets',
  'NordFX',
  'LiteForex',
  'FXClub',
  'Moneta Markets',
  'ACY Securities',
  'Alpari International',
  'ATC Brokers',
  'ADSS',
  'Angel One',
  'Bdswiss',
  'Binance',
  'Capital',
  'Cfi Trade',
  'Cft',
  'Cmc',
  'Cmtrading',
  'Coinbase',
  'Ctrader',
  'Degiro',
  'Deriv',
  'Dukascopy',
  'E Trade',
  'E8 Funding',
  'Easymarkets',
  'Etx Capital',
  'Europefx',
  'Forexmart',
  'Freetrade',
  'Friedberg Direct',
  'Ftmo',
  'Fusion',
  'Fxcc',
  'Fxgt',
  'Fxify',
  'FXPrimus',
  'HDFC Securities',
  'Hola Prime',
  'Hugo S Way',
  'ICICI Direct',
  'Ifc',
  'IG Group',
  'IG US',
  'Investous',
  'Iq Option',
  'Kraken',
  'Legacy Fx',
  'Liteforex',
  'Markets',
  'Moomoo',
  'Motilal Oswal',
  'Mtrading',
  'Nadex',
  'Naga',
  'Octa',
  'Paxforex',
  'Pipfarm',
  'Primexbt',
  'Profitex',
  'Pu Prime',
  'Purple',
  'Questrade',
  'Rebels Funding',
  'Revolut',
  'Robinhood',
  'Sabiotrade',
  'Saxo Capital',
  'Sharekhan',
  'Squared Financial',
  'STN',
  'Swissquote',
  'Tastyfx',
  'Thinkforex',
  'Trade Nation',
  'Trade360',
  'Traders Way',
  'Tradestation',
  'Trading 212',
  'Vanguard',
  'Webull',
  'XM Group',
  'Xtb',
  'Zerodha',
  'Zulutrade',
  'Fineco Bank',
  'Fondex',
  'Fidelity',
  'Degiro',
  'Revolut',
  'Robinhood',
  'Webull',
  'Moomoo',
  'Coinbase',
  'Binance',
  'Kraken'
];

async function setupBrokerOrder() {
  try {
    console.log('Setting up broker display order system...');

    // Step 1: Check if display_order column exists
    console.log('Checking if display_order column exists...');
    const { data: testBroker, error: testError } = await supabase
      .from('brokers')
      .select('display_order')
      .limit(1);

    if (testError && testError.code === '42703') {
      console.log('display_order column does not exist. Creating it...');

      // Create the column using a different approach
      console.log('Please manually run this SQL in your Supabase SQL editor:');
      console.log('\nALTER TABLE brokers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;');
      console.log('CREATE INDEX IF NOT EXISTS idx_brokers_display_order ON brokers(display_order);');

      console.log('\nAfter running the SQL, run this script again.');
      return;
    }

    // Step 2: Get all current brokers
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id, name, slug, display_order');

    if (fetchError) {
      console.error('Error fetching brokers:', fetchError);
      return;
    }

    console.log(`Found ${brokers.length} brokers`);

    // Step 3: Create a map for quick lookup
    const brokerMap = {};
    brokers.forEach(broker => {
      brokerMap[broker.name.toLowerCase()] = broker;
    });

    // Step 4: Prepare updates with preferred order
    const updates = [];
    let order = 1;

    // Set preferred order first
    for (const brokerName of PREFERRED_BROKER_ORDER) {
      const broker = brokerMap[brokerName.toLowerCase()];
      if (broker) {
        updates.push({
          id: broker.id,
          name: broker.name,
          display_order: order++
        });
        console.log(`Setting ${broker.name} to order ${updates[updates.length - 1].display_order}`);
      }
    }

    // Add remaining brokers
    brokers.forEach(broker => {
      if (!PREFERRED_BROKER_ORDER.some(name => name.toLowerCase() === broker.name.toLowerCase())) {
        updates.push({
          id: broker.id,
          name: broker.name,
          display_order: order++
        });
      }
    });

    console.log(`\nPreparing to update ${updates.length} brokers...`);

    // Step 5: Update in batches
    const batchSize = 50;
    let updatedCount = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      for (const broker of batch) {
        const { error } = await supabase
          .from('brokers')
          .update({ display_order: broker.display_order })
          .eq('id', broker.id);

        if (error) {
          console.error(`Error updating ${broker.name}:`, error);
        } else {
          updatedCount++;
        }
      }

      console.log(`Updated batch ${Math.floor(i / batchSize) + 1} (${Math.min(batchSize, updates.length - i)} brokers)`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} brokers!`);

    // Step 6: Show the first 20 brokers in new order
    console.log('\n📋 First 20 brokers in new order:');
    const { data: orderedBrokers } = await supabase
      .from('brokers')
      .select('name, display_order')
      .order('display_order', { ascending: true })
      .limit(20);

    orderedBrokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} (order: ${broker.display_order})`);
    });

    console.log('\n🎉 Broker order setup complete! Your /brokers page will now show brokers in this order.');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupBrokerOrder();