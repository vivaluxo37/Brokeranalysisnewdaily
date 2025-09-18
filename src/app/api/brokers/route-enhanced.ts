import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findBestLogoMatch } from '@/lib/broker-logo-map';

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

    // Additional filters
    const regulation = searchParams.get('regulation');
    const platform = searchParams.get('platform');
    const minDeposit = parseFloat(searchParams.get('minDeposit') || '0');
    const maxDeposit = parseFloat(searchParams.get('maxDeposit') || '1000000');

    // Build query
    let query = supabase
      .from('brokers')
      .select('*', { count: 'exact' });

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

    if (regulation) {
      query = query.contains('regulations', [{ body: regulation }]);
    }

    if (platform) {
      query = query.contains('platforms', [platform]);
    }

    if (minDeposit > 0) {
      query = query.gte('min_deposit', minDeposit);
    }

    if (maxDeposit < 1000000) {
      query = query.lte('min_deposit', maxDeposit);
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

    const { data: brokers, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Transform data to match expected structure
    const transformedBrokers = (brokers || []).map(broker => {
      // Parse regulations array
      const regulations = Array.isArray(broker.regulations) ?
        broker.regulations.map((reg: any, index: number) => ({
          id: `${broker.id}-reg-${index}`,
          broker_id: broker.id,
          regulatory_body: reg.body || reg,
          license_number: reg.license || '',
          regulation_status: reg.status || 'Regulated',
          jurisdiction: reg.jurisdiction || 'Global',
          verification_date: new Date().toISOString().split('T')[0],
          created_at: broker.created_at
        })) : [];

      // Parse account types
      const accountTypes = Array.isArray(broker.account_types) ?
        broker.account_types.map((acc: any, index: number) => ({
          id: `${broker.id}-acc-${index}`,
          broker_id: broker.id,
          account_name: acc.name || 'Standard',
          account_type: acc.type || 'Standard',
          min_deposit: acc.minDeposit || 0,
          min_deposit_currency: acc.currency || 'USD',
          spread_type: acc.spreadType || 'Variable',
          commission: acc.commission || 0,
          leverage: acc.leverage || 100,
          islamic_account: acc.islamic || false,
          demo_available: true,
          features: acc.features || '',
          created_at: broker.created_at
        })) : [];

      // Parse payment methods
      const paymentMethods = Array.isArray(broker.payment_methods) ?
        broker.payment_methods.map((method: string, index: number) => ({
          id: `${broker.id}-pay-${index}`,
          broker_id: broker.id,
          payment_method: method,
          currency: 'USD',
          deposit: true,
          withdrawal: true,
          created_at: broker.created_at
        })) : [];

      return {
        id: broker.id,
        name: broker.name,
        slug: broker.slug,
        logo_url: findBestLogoMatch(broker.name || ''),
        website_url: broker.website_url,
        description: broker.description,
        short_description: broker.short_description || broker.description?.substring(0, 150) + '...',
        rating: broker.avg_rating || 0,
        review_count: broker.total_reviews || 0,
        featured_status: broker.featured || false,
        min_deposit: broker.min_deposit || 0,
        min_deposit_currency: broker.min_deposit_currency || 'USD',
        spread_type: broker.spread_type || 'Variable',
        typical_spread: broker.spreads_avg || 0,
        max_leverage: parseInt(broker.leverage_max) || 0,
        leverage_info: broker.leverage_info || null,
        established_year: broker.established_year,
        headquarters: broker.headquarters_location,
        company_size: broker.employee_count,
        total_assets: broker.total_assets || 0,
        active_traders: broker.active_traders_count || 0,
        status: broker.is_active ? 'active' : 'inactive',
        created_at: broker.created_at,
        updated_at: broker.updated_at,

        // Contact information
        phone: broker.phone,
        email: broker.email,
        address: broker.address,
        support_languages: broker.support_languages || [],

        // Social media
        facebook_url: broker.facebook_url,
        twitter_url: broker.twitter_url,
        linkedin_url: broker.linkedin_url,
        youtube_url: broker.youtube_url,

        // Trading features
        minimum_trade_size: broker.minimum_trade_size,
        maximum_trade_size: broker.maximum_trade_size,
        scalping_allowed: broker.scalping_allowed,
        hedging_allowed: broker.hedging_allowed,
        expert_advisors: broker.expert_advisors,
        news_trading: broker.news_trading,

        // Withdrawal info
        withdrawal_time: broker.withdrawal_time,
        withdrawal_fee: broker.withdrawal_fee || 0,

        // Support info
        support_24_7: broker.support_24_7,
        live_chat: broker.live_chat,
        phone_support: broker.phone_support,
        ticket_system: broker.ticket_system,

        // Company info
        parent_company: broker.parent_company,
        number_of_employees: broker.number_of_employees,
        countries_served: broker.countries_served,

        // Relations
        regulations,
        accountTypes,
        paymentMethods,
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
        tradingConditions: [],
        features: [],
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
      };
    });

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
    console.error('Error details:', JSON.stringify(error, null, 2));
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
    const { data: existingBroker } = await supabase
      .from('brokers')
      .select('id')
      .or(`name.eq.${body.name},slug.eq.${body.slug}`)
      .single();

    if (existingBroker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker with this name or slug already exists',
        },
        { status: 409 }
      );
    }

    // Prepare broker data
    const brokerData = {
      name: body.name,
      slug: body.slug,
      logo_url: body.logo_url,
      website_url: body.website_url,
      description: body.description,
      short_description: body.short_description,
      avg_rating: body.rating || 0,
      total_reviews: body.review_count || 0,
      featured: body.featured_status || false,
      min_deposit: body.min_deposit || 0,
      min_deposit_currency: body.min_deposit_currency || 'USD',
      spread_type: body.spread_type || 'Variable',
      spreads_avg: body.typical_spread,
      leverage_max: body.max_leverage?.toString() || '0',
      leverage_info: body.leverage_info,
      established_year: body.established_year,
      headquarters_location: body.headquarters,
      employee_count: body.company_size,
      total_assets: body.total_assets || 0,
      active_traders_count: body.active_traders || 0,
      affiliate_link: body.affiliate_link,
      is_active: (body.status || 'active') === 'active',

      // New fields
      phone: body.phone,
      email: body.email,
      address: body.address,
      support_languages: body.support_languages || [],
      regulations: body.regulations || [],
      platforms: body.platforms || [],
      payment_methods: body.payment_methods || [],
      account_types: body.account_types || [],

      // Social media
      facebook_url: body.facebook_url,
      twitter_url: body.twitter_url,
      linkedin_url: body.linkedin_url,
      youtube_url: body.youtube_url,

      // Trading features
      minimum_trade_size: body.minimum_trade_size,
      maximum_trade_size: body.maximum_trade_size,
      scalping_allowed: body.scalping_allowed ?? true,
      hedging_allowed: body.hedging_allowed ?? true,
      expert_advisors: body.expert_advisors ?? true,
      news_trading: body.news_trading ?? true,

      // Withdrawal info
      withdrawal_time: body.withdrawal_time,
      withdrawal_fee: body.withdrawal_fee || 0,

      // Support info
      support_24_7: body.support_24_7 || false,
      live_chat: body.live_chat || false,
      phone_support: body.phone_support ?? true,
      ticket_system: body.ticket_system || false,

      // Company info
      parent_company: body.parent_company,
      number_of_employees: body.number_of_employees,
      countries_served: body.countries_served,
    };

    // Create broker
    const { data: broker, error: createError } = await supabase
      .from('brokers')
      .insert(brokerData)
      .select()
      .single();

    if (createError) {
      throw createError;
    }

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