import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Sample data structure - replace with your actual extracted data
const sampleBrokerData = {
  name: "Example Broker",
  description: "A comprehensive forex broker offering competitive spreads and multiple trading platforms.",
  regulations: ["FCA", "CySEC", "ASIC"],
  platforms: ["MT4", "MT5", "WebTrader"],
  paymentMethods: ["Credit Card", "Bank Wire", "Skrill", "Neteller"],
  accountTypes: [
    {
      name: "Standard",
      minDeposit: 100,
      currency: "USD",
      spreadType: "Variable",
      leverage: 500
    },
    {
      name: "ECN",
      minDeposit: 1000,
      currency: "USD",
      spreadType: "Raw",
      leverage: 200
    }
  ],
  headquarters: "London, UK",
  founded: 2010,
  minDeposit: 100,
  leverage: "1:500",
  contact: {
    phone: "+44 20 1234 5678",
    email: "support@example.com"
  },
  website: "https://www.example.com"
};

async function importBrokerData(brokerData: any) {
  try {
    // Transform data to match database schema
    const broker = {
      name: brokerData.name,
      slug: brokerData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: brokerData.description,
      short_description: brokerData.description?.substring(0, 150) + '...',
      regulations: brokerData.regulations?.map((reg: string) => ({
        body: reg,
        status: 'Regulated',
        jurisdiction: 'Global'
      })) || [],
      platforms: brokerData.platforms || [],
      payment_methods: brokerData.paymentMethods || [],
      account_types: brokerData.accountTypes?.map((acc: any) => ({
        name: acc.name,
        minDeposit: acc.minDeposit,
        currency: acc.currency,
        spreadType: acc.spreadType,
        leverage: acc.leverage
      })) || [],
      established_year: brokerData.founded,
      headquarters_location: brokerData.headquarters,
      min_deposit: brokerData.minDeposit,
      leverage_max: brokerData.leverage?.replace('1:', '') || '0',
      phone: brokerData.contact?.phone,
      email: brokerData.contact?.email,
      website_url: brokerData.website,
      is_active: true,
      featured: false,
      avg_rating: 0,
      total_reviews: 0
    };

    // Insert broker
    const { data, error } = await supabase
      .from('brokers')
      .insert(broker)
      .select()
      .single();

    if (error) {
      console.error('Error inserting broker:', error);
      return { success: false, error };
    }

    console.log('Successfully imported broker:', data.name);
    return { success: true, data };

  } catch (error) {
    console.error('Error importing broker data:', error);
    return { success: false, error };
  }
}

// Example usage
async function main() {
  // Replace this with your actual data loading logic
  const brokerData: any[] = []; // Load your extracted data here

  const results = [];
  for (const broker of brokerData) {
    const result = await importBrokerData(broker);
    results.push(result);
  }

  console.log('Import completed. Results:', results);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { importBrokerData };