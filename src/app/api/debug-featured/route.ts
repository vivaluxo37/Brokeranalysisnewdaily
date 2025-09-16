import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!brokers || brokers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No featured brokers found'
      }, { status: 404 });
    }

    const broker = brokers[0];

    return NextResponse.json({
      success: true,
      broker: {
        id: broker.id,
        name: broker.name,
        regulations: broker.regulations,
        platforms: broker.platforms,
        regulationsType: typeof broker.regulations,
        platformsType: typeof broker.platforms
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}