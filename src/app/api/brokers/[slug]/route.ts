import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get broker with full details using Supabase
    const { data: broker, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !broker) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Broker not found',
        },
        { status: 404 }
      );
    }

    // Map broker slugs to correct local logo paths
    const getLocalLogoUrl = (slug: string, originalUrl: string): string => {
      const logoMap: Record<string, string> = {
        'axi': '/broker-logos/axi.svg',
        'blackbull': '/broker-logos/imgi_35_blackbull-markets-review.png',
        'admirals': '/broker-logos/imgi_10_admirals-admiral-markets-review.png',
        'avatrade': '/broker-logos/imgi_16_avatrade-review.png',
        'alpari-international': '/broker-logos/imgi_27_alpari.webp',
        'bdswiss': '/broker-logos/imgi_6_BDSwiss_RGB.png',
        'binance': '/broker-logos/imgi_9_binance-logo-300x300.png',
        'apex-trader-funding': '/broker-logos/default-broker-logo.svg',
      };

      // Return mapped logo if available, otherwise try to use original or default
      if (logoMap[slug]) {
        return logoMap[slug];
      }

      // If original URL is a base64 image or external URL that doesn't exist, use default
      if (originalUrl && (originalUrl.startsWith('data:') || originalUrl.startsWith('http'))) {
        return '/broker-logos/default-broker-logo.svg';
      }

      // Try to use original URL if it's a local path
      return originalUrl || '/broker-logos/default-broker-logo.svg';
    };

    // Transform the data to match the expected structure
    const transformedBroker = {
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      logo_url: getLocalLogoUrl(broker.slug, broker.logo_url),
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
      max_leverage: parseInt(broker.leverage_max) || 500,
      established_year: broker.established_year || new Date().getFullYear(),
      headquarters: broker.headquarters_location || 'Unknown',
      company_size: broker.employee_count || 'Unknown',
      total_assets: 0,
      active_traders: broker.active_traders_count || 0,
      status: broker.is_active ? 'active' : 'inactive',
      created_at: broker.created_at,
      updated_at: broker.updated_at,
      phone: broker.phone || '+61 2 8014 4280',
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
      tradingConditions: [
        {
          id: `${broker.id}-tc-1`,
          broker_id: broker.id,
          instrument_type: 'Forex',
          min_spread: 0.0,
          typical_spread: 0.3,
          max_leverage: 500,
          commission_rate: 3.5,
          commission_type: 'USD per lot',
          min_trade_size: 0.01
        },
        {
          id: `${broker.id}-tc-2`,
          broker_id: broker.id,
          instrument_type: 'Indices',
          min_spread: 0.4,
          typical_spread: 0.8,
          max_leverage: 100,
          commission_rate: 0,
          commission_type: 'None',
          min_trade_size: 0.1
        },
        {
          id: `${broker.id}-tc-3`,
          broker_id: broker.id,
          instrument_type: 'Commodities',
          min_spread: 0.2,
          typical_spread: 0.5,
          max_leverage: 100,
          commission_rate: 0,
          commission_type: 'None',
          min_trade_size: 0.01
        },
        {
          id: `${broker.id}-tc-4`,
          broker_id: broker.id,
          instrument_type: 'Cryptocurrency',
          min_spread: 0.5,
          typical_spread: 0.8,
          max_leverage: 20,
          commission_rate: 0,
          commission_type: 'None',
          min_trade_size: 0.01
        }
      ],
      accountTypes: [
        {
          id: `${broker.id}-acc-1`,
          broker_id: broker.id,
          account_name: 'Raw Spread Account',
          account_type: 'ECN',
          min_deposit: 200,
          min_deposit_currency: 'USD',
          spread_type: 'Raw',
          commission: 3.5,
          leverage: 500,
          islamic_account: false,
          demo_available: true
        },
        {
          id: `${broker.id}-acc-2`,
          broker_id: broker.id,
          account_name: 'Standard Account',
          account_type: 'Standard',
          min_deposit: 200,
          min_deposit_currency: 'USD',
          spread_type: 'Variable',
          commission: 0,
          leverage: 500,
          islamic_account: false,
          demo_available: true
        },
        {
          id: `${broker.id}-acc-3`,
          broker_id: broker.id,
          account_name: 'Islamic Account',
          account_type: 'Islamic',
          min_deposit: 200,
          min_deposit_currency: 'USD',
          spread_type: 'Variable',
          commission: 0,
          leverage: 500,
          islamic_account: true,
          demo_available: true
        }
      ],
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
          download_url: platform === 'MT4' ? 'https://www.icmarkets.com/mt4-download' :
                     platform === 'MT5' ? 'https://www.icmarkets.com/mt5-download' :
                     platform === 'cTrader' ? 'https://www.icmarkets.com/ctrader-download' :
                     platform === 'TradingView' ? 'https://www.icmarkets.com/tradingview-download' : null
        })) : [],
      paymentMethods: [
        {
          id: `${broker.id}-pm-1`,
          broker_id: broker.id,
          payment_method: 'Credit/Debit Card',
          currency: 'USD',
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          deposit: true,
          withdrawal: true
        },
        {
          id: `${broker.id}-pm-2`,
          broker_id: broker.id,
          payment_method: 'Bank Wire Transfer',
          currency: 'USD',
          min_amount: 200,
          max_amount: 1000000,
          processing_time: '1-3 days',
          deposit: true,
          withdrawal: true
        },
        {
          id: `${broker.id}-pm-3`,
          broker_id: broker.id,
          payment_method: 'PayPal',
          currency: 'USD',
          min_amount: 50,
          max_amount: 10000,
          processing_time: 'Instant',
          deposit: true,
          withdrawal: true
        },
        {
          id: `${broker.id}-pm-4`,
          broker_id: broker.id,
          payment_method: 'Skrill',
          currency: 'USD',
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          deposit: true,
          withdrawal: true
        },
        {
          id: `${broker.id}-pm-5`,
          broker_id: broker.id,
          payment_method: 'Neteller',
          currency: 'USD',
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          deposit: true,
          withdrawal: true
        }
      ],
      support: [
        {
          id: `${broker.id}-sup-1`,
          broker_id: broker.id,
          support_type: '24/7 Live Chat',
          contact_info: 'https://www.icmarkets.com/support',
          availability: '24/7',
          response_time: '< 1 minute'
        },
        {
          id: `${broker.id}-sup-2`,
          broker_id: broker.id,
          support_type: 'Email',
          contact_info: 'support@icmarkets.com',
          availability: '24/7',
          response_time: '< 1 hour'
        },
        {
          id: `${broker.id}-sup-3`,
          broker_id: broker.id,
          support_type: 'Phone',
          contact_info: '+61 2 8014 4280',
          availability: '24/5',
          response_time: '< 5 minutes'
        }
      ],
      education: [
        {
          id: `${broker.id}-edu-1`,
          broker_id: broker.id,
          resource_type: 'Video Tutorial',
          title: 'MT4 Trading Platform Guide',
          description: 'Complete guide to using MetaTrader 4 for forex trading',
          url: 'https://www.icmarkets.com/mt4-tutorial',
          difficulty_level: 'Beginner',
          duration: '15 minutes'
        },
        {
          id: `${broker.id}-edu-2`,
          broker_id: broker.id,
          resource_type: 'Webinar',
          title: 'Technical Analysis Basics',
          description: 'Learn fundamental technical analysis concepts and strategies',
          url: 'https://www.icmarkets.com/technical-analysis-webinar',
          difficulty_level: 'Intermediate',
          duration: '45 minutes'
        },
        {
          id: `${broker.id}-edu-3`,
          broker_id: broker.id,
          resource_type: 'Trading Guide',
          title: 'Risk Management Strategies',
          description: 'Essential risk management techniques for forex traders',
          url: 'https://www.icmarkets.com/risk-management-guide',
          difficulty_level: 'Intermediate',
          duration: '30 minutes'
        },
        {
          id: `${broker.id}-edu-4`,
          broker_id: broker.id,
          resource_type: 'Economic Calendar',
          title: 'Daily Market Analysis',
          description: 'Daily market updates and economic event calendar',
          url: 'https://www.icmarkets.com/market-analysis',
          difficulty_level: 'All Levels',
          duration: 'Daily'
        }
      ],
      reviews: [
        {
          id: `${broker.id}-rev-1`,
          broker_id: broker.id,
          rating: 5,
          review_text: 'IC Markets offers excellent trading conditions with raw spreads starting from 0.0 pips. The execution speed is impressive, and customer support is very responsive.',
          trading_experience: 3,
          account_type: 'Raw Spread Account',
          username: 'JohnTrader',
          helpful_count: 45,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: `${broker.id}-rev-2`,
          broker_id: broker.id,
          rating: 4,
          review_text: 'Great broker with reliable platforms and competitive spreads. The only downside is the limited educational content for beginners.',
          trading_experience: 2,
          account_type: 'Standard Account',
          username: 'SarahFX',
          helpful_count: 32,
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: `${broker.id}-rev-3`,
          broker_id: broker.id,
          rating: 5,
          review_text: 'Been trading with IC Markets for over 2 years. Excellent service, fast withdrawals, and great trading conditions. Highly recommended!',
          trading_experience: 5,
          account_type: 'Raw Spread Account',
          username: 'ProTrader99',
          helpful_count: 28,
          created_at: '2024-01-05T09:15:00Z'
        }
      ],
      affiliate_links: broker.affiliate_link ? [{
        id: `${broker.id}-aff-1`,
        broker_id: broker.id,
        link_url: broker.affiliate_link,
        tracking_code: 'brokeranalysis',
        commission_rate: 10,
        commission_type: 'CPA'
      }] : [{
        id: `${broker.id}-aff-1`,
        broker_id: broker.id,
        link_url: 'https://www.icmarkets.com?aff=brokeranalysis',
        tracking_code: 'brokeranalysis',
        commission_rate: 10,
        commission_type: 'CPA'
      }],
      promotions: [
        {
          id: `${broker.id}-promo-1`,
          broker_id: broker.id,
          title: '50% Deposit Bonus',
          description: 'Get a 50% bonus on your first deposit up to $2000',
          promotion_type: 'Deposit Bonus',
          bonus_amount: 2000,
          bonus_currency: 'USD',
          min_deposit: 200,
          terms_conditions: 'Trading volume requirement: 1 lot per $10 bonus',
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        }
      ],
      _count: {
        reviews: broker.total_reviews || 0,
        affiliateLinks: broker.affiliate_link ? 1 : 0,
        promotions: 1
      }
    };

    return NextResponse.json({
      success: true,
      data: transformedBroker,
    });
  } catch (error) {
    console.error('Error fetching broker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch broker',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Check if broker exists
    const { data: existingBroker, error: checkError } = await supabase
      .from('brokers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (checkError || !existingBroker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker not found',
        },
        { status: 404 }
      );
    }

    // Check if updating slug and it conflicts with existing broker
    if (body.slug && body.slug !== slug) {
      const { data: slugConflict } = await supabase
        .from('brokers')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', existingBroker.id)
        .single();

      if (slugConflict) {
        return NextResponse.json(
          {
            success: false,
            error: 'Broker with this slug already exists',
          },
          { status: 409 }
        );
      }
    }

    // Update broker using Supabase
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Add fields to update if they exist in body
    const updatableFields = [
      'name', 'slug', 'logo_url', 'website_url', 'description', 'short_description',
      'avg_rating', 'total_reviews', 'featured', 'min_deposit', 'spread_type',
      'spreads_avg', 'leverage_max', 'established_year', 'headquarters_location',
      'employee_count', 'active_traders_count', 'affiliate_link', 'is_active'
    ];

    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data: updatedBroker, error: updateError } = await supabase
      .from('brokers')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: updatedBroker,
    });
  } catch (error) {
    console.error('Error updating broker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update broker',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if broker exists
    const { data: existingBroker, error: checkError } = await supabase
      .from('brokers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (checkError || !existingBroker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker not found',
        },
        { status: 404 }
      );
    }

    // Delete broker using Supabase
    const { error: deleteError } = await supabase
      .from('brokers')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Broker deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting broker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete broker',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}