import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Filter parameters
    const search = searchParams.get('search') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxRating = parseFloat(searchParams.get('maxRating') || '5');
    const featured = searchParams.get('featured') === 'true';
    const status = searchParams.get('status') || 'active';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build query
    let query = supabase
      .from('brokers')
      .select('*');

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (featured) {
      query = query.eq('featured', true);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    }

    // Apply rating filter
    query = query.gte('avg_rating', minRating).lte('avg_rating', maxRating);

    // Apply sorting
    if (sortBy === 'rating') {
      query = query.order('avg_rating', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'min_deposit') {
      query = query.order('min_deposit', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'established_year') {
      query = query.order('established_year', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'review_count') {
      query = query.order('total_reviews', { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: brokers, error } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    // Apply same filters for count
    if (search) {
      countQuery = countQuery.ilike('name', `%${search}%`);
    }
    if (featured) {
      countQuery = countQuery.eq('featured', true);
    }
    if (status === 'active') {
      countQuery = countQuery.eq('is_active', true);
    }
    if (minRating > 0 || maxRating < 5) {
      countQuery = countQuery.gte('avg_rating', minRating).lte('avg_rating', maxRating);
    }

    const { count } = await countQuery;

    // Transform data to match expected structure
    const transformedBrokers = (brokers || []).map(broker => ({
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
      phone: broker.phone,
      affiliate_link: broker.affiliate_link,
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
      tradingConditions: [],
      accountTypes: [],
      platforms: Array.isArray(broker.platforms) ?
        broker.platforms.map((platform: string, index: number) => ({
          id: `${broker.id}-plat-${index}`,
          broker_id: broker.id,
          platform_name: platform,
          platform_type: 'Trading',
          version: 'Latest',
          web_trading: true,
          mobile_trading: true,
          desktop_trading: true,
          download_url: null
        })) : [],
      paymentMethods: [],
      support: [],
      education: [],
      reviews: [],
      affiliate_links: broker.affiliate_link ? [{
        id: `${broker.id}-aff-1`,
        broker_id: broker.id,
        link_url: broker.affiliate_link,
        tracking_code: '',
        commission_rate: 0,
        commission_type: 'CPA'
      }] : [],
      promotions: [],
      _count: {
        reviews: broker.total_reviews || 0,
        affiliateLinks: broker.affiliate_link ? 1 : 0,
        promotions: 0
      }
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: transformedBrokers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brokers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Check if broker already exists
    const existingBroker = await prisma.broker.findFirst({
      where: {
        OR: [
          { name: body.name },
          { slug: body.slug },
        ],
      },
    });

    if (existingBroker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker with this name or slug already exists',
        },
        { status: 409 }
      );
    }

    // Create broker
    const broker = await prisma.broker.create({
      data: {
        name: body.name,
        slug: body.slug,
        logo_url: body.logo_url,
        website_url: body.website_url,
        description: body.description,
        short_description: body.short_description,
        rating: body.rating || 0,
        review_count: body.review_count || 0,
        featured_status: body.featured_status || false,
        min_deposit: body.min_deposit || 0,
        min_deposit_currency: body.min_deposit_currency || 'USD',
        spread_type: body.spread_type || 'Variable',
        typical_spread: body.typical_spread,
        max_leverage: body.max_leverage || 0,
        established_year: body.established_year,
        headquarters: body.headquarters,
        company_size: body.company_size,
        total_assets: body.total_assets,
        active_traders: body.active_traders,
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        affiliate_link: body.affiliate_link,
        status: body.status || 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: broker,
    });
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create broker',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}