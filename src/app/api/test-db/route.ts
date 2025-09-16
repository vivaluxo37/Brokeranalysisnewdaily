import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test basic connection
    const { data, error } = await supabase
      .from('brokers')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Failed to connect to database'
      }, { status: 500 });
    }

    // Get actual broker data
    const { data: brokers, error: brokerError } = await supabase
      .from('brokers')
      .select('*')
      .limit(2);

    // Get featured brokers
    const { data: featuredBrokers, error: featuredError } = await supabase
      .from('brokers')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .limit(2);

    // Check if any featured brokers exist
    const { count: featuredCount, error: countError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)
      .eq('is_active', true);

    if (brokerError) {
      return NextResponse.json({
        success: false,
        error: brokerError.message,
        details: 'Failed to fetch broker data'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      brokerCount: data?.[0]?.count || 0,
      sampleBrokers: brokers?.length || 0,
      sampleBroker: brokers?.[0] || null,
      featuredBrokersCount: featuredCount || 0,
      featuredBrokerData: featuredBrokers?.length || 0,
      featuredSample: featuredBrokers?.[0] || null,
      env: {
        supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Not set',
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Unexpected error occurred'
    }, { status: 500 });
  }
}