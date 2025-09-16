import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mock data for development when database is not available
const mockFeaturedBrokers = [
  {
    id: '1',
    name: 'XM Group',
    slug: 'xm-group',
    logo_url: '/brokers/xm-logo.png',
    website_url: 'https://www.xm.com',
    description: 'XM Group is a globally recognized forex and CFD broker with over 3.5 million clients worldwide.',
    short_description: 'Established in 2009, XM offers competitive spreads and excellent customer support.',
    rating: 4.5,
    review_count: 1250,
    featured_status: true,
    min_deposit: 5.00,
    min_deposit_currency: 'USD',
    spread_type: 'Variable',
    typical_spread: 0.1,
    max_leverage: 1000,
    established_year: 2009,
    headquarters: 'Cyprus',
    company_size: '1000+ employees',
    total_assets: 500000000.00,
    active_traders: 3500000,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    regulations: [
      {
        id: '1',
        broker_id: '1',
        regulatory_body: 'CySEC',
        license_number: '120/10',
        regulation_status: 'Regulated',
        jurisdiction: 'Cyprus',
        verification_date: '2023-01-01',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        broker_id: '1',
        regulatory_body: 'FCA',
        license_number: '705428',
        regulation_status: 'Regulated',
        jurisdiction: 'UK',
        verification_date: '2023-01-01',
        created_at: new Date().toISOString()
      }
    ],
    features: [
      {
        id: '1',
        broker_id: '1',
        feature_name: 'Zero Fee Withdrawals',
        feature_type: 'Trading',
        description: 'No fees on deposits and withdrawals',
        availability: true,
        category: 'Fees',
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    name: 'FXTM',
    slug: 'fxtm',
    logo_url: '/brokers/fxtm-logo.png',
    website_url: 'https://www.forextime.com',
    description: 'ForexTime (FXTM) is a leading forex broker offering innovative trading solutions.',
    short_description: 'FXTM provides educational resources and competitive trading conditions.',
    rating: 4.3,
    review_count: 980,
    featured_status: true,
    min_deposit: 10.00,
    min_deposit_currency: 'USD',
    spread_type: 'Variable',
    typical_spread: 0.2,
    max_leverage: 1000,
    established_year: 2011,
    headquarters: 'Cyprus',
    company_size: '500+ employees',
    total_assets: 300000000.00,
    active_traders: 2000000,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    regulations: [
      {
        id: '3',
        broker_id: '2',
        regulatory_body: 'CySEC',
        license_number: '185/12',
        regulation_status: 'Regulated',
        jurisdiction: 'Cyprus',
        verification_date: '2023-01-01',
        created_at: new Date().toISOString()
      }
    ],
    features: [
      {
        id: '2',
        broker_id: '2',
        feature_name: 'Educational Resources',
        feature_type: 'Education',
        description: 'Comprehensive trading education',
        availability: true,
        category: 'Education',
        created_at: new Date().toISOString()
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '5');
    const includeDetails = searchParams.get('includeDetails') === 'true';

    // Try to fetch from database first
    let featuredBrokers;
    try {
      let query = supabase
        .from('brokers')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .order('avg_rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .order('name', { ascending: true })
        .limit(limit);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      featuredBrokers = data || [];

      // If detailed information is requested, fetch related data
      if (includeDetails && featuredBrokers.length > 0) {
        // Transform data to match expected structure
        featuredBrokers = featuredBrokers.map(broker => ({
          id: broker.id,
          name: broker.name,
          slug: broker.slug,
          logo_url: broker.logo_url,
          website_url: broker.website_url,
          description: broker.description,
          short_description: broker.description?.substring(0, 150) + '...',
          rating: broker.avg_rating || 0,
          review_count: broker.total_reviews || 0,
          featured_status: broker.featured,
          min_deposit: broker.min_deposit || 0,
          min_deposit_currency: 'USD',
          spread_type: broker.spread_type || 'Variable',
          typical_spread: broker.spreads_avg || 0,
          max_leverage: parseInt(broker.leverage_max) || 0,
          established_year: broker.established_year || new Date().getFullYear(),
          headquarters: broker.headquarters_location || 'Unknown',
          company_size: broker.employee_count || 'Unknown',
          total_assets: 0,
          active_traders: broker.active_traders_count || 0,
          status: broker.is_active ? 'active' : 'inactive',
          created_at: broker.created_at,
          updated_at: broker.updated_at,
          regulations: Array.isArray(broker.regulations) ?
          broker.regulations.map((reg: string, index: number) => ({
            id: `${broker.id}-reg-${index}`,
            broker_id: broker.id,
            regulatory_body: reg,
            license_number: '',
            regulation_status: 'Regulated',
            jurisdiction: 'Global',
            verification_date: new Date().toISOString().split('T')[0],
            created_at: broker.created_at
          })) : [],
        features: Array.isArray(broker.platforms) ?
          broker.platforms.slice(0, 5).map((platform: string, index: number) => ({
            id: `${broker.id}-feat-${index}`,
            broker_id: broker.id,
            feature_name: platform,
            feature_type: 'Platform',
            description: `${platform} trading platform`,
            availability: true,
            category: 'Trading',
            created_at: broker.created_at
          })) : [],
          accountTypes: [],
          platforms: [],
          promotions: []
        }));
      }
    } catch (dbError) {
      console.warn('Database connection failed, using mock data:', dbError);
      // Fallback to mock data when database is not available
      featuredBrokers = mockFeaturedBrokers.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: featuredBrokers,
      count: featuredBrokers.length,
    });
  } catch (error) {
    console.error('Error fetching featured brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured brokers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brokerIds, action } = body;

    if (!brokerIds || !Array.isArray(brokerIds) || brokerIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker IDs are required',
        },
        { status: 400 }
      );
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action must be either "add" or "remove"',
        },
        { status: 400 }
      );
    }

    // Update featured status for specified brokers using Supabase
    const { data, error } = await supabase
      .from('brokers')
      .update({
        featured: action === 'add',
        updated_at: new Date().toISOString()
      })
      .in('id', brokerIds)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action === 'add' ? 'added' : 'removed'} ${data?.length || 0} brokers from featured list`,
      updatedCount: data?.length || 0,
    });
  } catch (error) {
    console.error('Error updating featured brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update featured brokers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}