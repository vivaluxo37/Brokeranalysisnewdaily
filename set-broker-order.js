const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Common broker order based on popularity and industry standards
const BROKER_ORDER = [
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
  ' AvaTrade',
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
  'NordFX',
  'BlackBull Markets',
  'Vantage FX',
  'ThinkMarkets',
  'Tickmill',
  'Admiral Markets',
  'Eightcap',
  'AxiTrader',
  'FP Markets',
  'Pepperstone',
  'IC Markets',
  'XM Group',
  'FXTM',
  'Alpari',
  'LiteForex',
  'FXClub',
  'Moneta Markets',
  'HYCM',
  'ACY Securities',
  'AAFX Trading',
  'AdroFX',
  'AETOS',
  'AGM Markets',
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
  'Questrade',
  'Degiro',
  'Revolut',
  'Robinhood',
  'Webull',
  'Moomoo',
  'Coinbase',
  'Binance',
  'Kraken'
];

async function setBrokerDisplayOrder() {
  try {
    console.log('Setting broker display order...');

    // Get all current brokers
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id, name, slug, display_order');

    if (fetchError) {
      console.error('Error fetching brokers:', fetchError);
      return;
    }

    console.log(`Found ${brokers.length} brokers`);

    // Create a map of broker names to their IDs
    const brokerMap = {};
    brokers.forEach(broker => {
      brokerMap[broker.name.toLowerCase()] = broker;
    });

    // Update display order for each broker in the preferred order
    let order = 1;
    const updates = [];

    for (const brokerName of BROKER_ORDER) {
      const broker = brokerMap[brokerName.toLowerCase()];
      if (broker) {
        updates.push({
          id: broker.id,
          name: broker.name,
          display_order: order
        });
        order++;
      }
    }

    // Add remaining brokers with default order
    brokers.forEach(broker => {
      if (!BROKER_ORDER.some(name => name.toLowerCase() === broker.name.toLowerCase())) {
        updates.push({
          id: broker.id,
          name: broker.name,
          display_order: order
        });
        order++;
      }
    });

    console.log(`Updating ${updates.length} brokers...`);

    // Update brokers in batches
    const batchSize = 50;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      const { error: updateError } = await supabase
        .from('brokers')
        .upsert(batch, { onConflict: 'id' });

      if (updateError) {
        console.error(`Error updating batch ${i / batchSize + 1}:`, updateError);
      } else {
        console.log(`Updated batch ${i / batchSize + 1} (${batch.length} brokers)`);
      }
    }

    console.log('Broker display order updated successfully!');
    console.log('\\nFirst 20 brokers in order:');
    const { data: orderedBrokers } = await supabase
      .from('brokers')
      .select('name, display_order')
      .order('display_order', { ascending: true })
      .limit(20);

    orderedBrokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} (order: ${broker.display_order})`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

setBrokerDisplayOrder();