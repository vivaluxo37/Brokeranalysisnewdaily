import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get broker slugs from query parameters
    const slugs = searchParams.get('slugs')?.split(',').filter(Boolean) || [];

    if (slugs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No broker slugs provided',
        },
        { status: 400 }
      );
    }

    if (slugs.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot compare more than 5 brokers at once',
        },
        { status: 400 }
      );
    }

    // Get brokers with their details using Supabase
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .in('slug', slugs)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    // If some brokers were not found
    if (!brokers || brokers.length !== slugs.length) {
      const foundSlugs = brokers?.map(b => b.slug) || [];
      const missingSlugs = slugs.filter(slug => !foundSlugs.includes(slug));

      return NextResponse.json(
        {
          success: false,
          error: 'Some brokers not found',
          missingBrokers: missingSlugs,
        },
        { status: 404 }
      );
    }

    // Transform data to match expected structure
    const transformedBrokers = brokers.map(broker => ({
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      logo_url: broker.logo_url,
      website_url: broker.website_url,
      description: broker.description,
      rating: broker.avg_rating || 0,
      review_count: broker.total_reviews || 0,
      min_deposit: broker.min_deposit || 0,
      min_deposit_currency: 'USD',
      spread_type: broker.spread_type || 'Variable',
      typical_spread: broker.spreads_avg || 0,
      max_leverage: parseInt(broker.leverage_max) || 0,
      established_year: broker.established_year || new Date().getFullYear(),
      headquarters: broker.headquarters_location || 'Unknown',
      company_size: broker.employee_count || 'Unknown',
      status: broker.is_active ? 'active' : 'inactive',
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
      promotions: [],
    }));

    // Generate comparison data
    const comparison = generateComparisonData(transformedBrokers);

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to compare brokers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateComparisonData(brokers: any[]) {
  // Basic information comparison
  const basicInfo = brokers.map(broker => ({
    id: broker.id,
    name: broker.name,
    slug: broker.slug,
    logo_url: broker.logo_url,
    rating: broker.rating,
    review_count: broker.review_count,
    min_deposit: broker.min_deposit,
    min_deposit_currency: broker.min_deposit_currency,
    spread_type: broker.spread_type,
    typical_spread: broker.typical_spread,
    max_leverage: broker.max_leverage,
    established_year: broker.established_year,
    headquarters: broker.headquarters,
    website_url: broker.website_url,
  }));

  // Regulations comparison
  const regulations = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    regulations: broker.regulations.map((reg: any) => ({
      regulatory_body: reg.regulatory_body,
      license_number: reg.license_number,
      jurisdiction: reg.jurisdiction,
      regulation_status: reg.regulation_status,
    })),
  }));

  // Features comparison
  const features = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    features: broker.features.map((feature: any) => ({
      name: feature.feature_name,
      type: feature.feature_type,
      category: feature.category,
      available: feature.availability,
    })),
  }));

  // Trading conditions comparison
  const tradingConditions = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    conditions: broker.tradingConditions.map((condition: any) => ({
      instrument_type: condition.instrument_type,
      min_spread: condition.min_spread,
      typical_spread: condition.typical_spread,
      max_leverage: condition.max_leverage,
      commission_rate: condition.commission_rate,
      commission_type: condition.commission_type,
    })),
  }));

  // Account types comparison
  const accountTypes = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    accounts: broker.accountTypes.map((account: any) => ({
      name: account.account_name,
      type: account.account_type,
      min_deposit: account.min_deposit,
      currency: account.min_deposit_currency,
      commission: account.commission,
      leverage: account.leverage,
      islamic: account.islamic_account,
      demo: account.demo_available,
    })),
  }));

  // Platforms comparison
  const platforms = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    platforms: broker.platforms.map((platform: any) => ({
      name: platform.platform_name,
      type: platform.platform_type,
      version: platform.version,
      web: platform.web_trading,
      mobile: platform.mobile_trading,
      desktop: platform.desktop_trading,
    })),
  }));

  // Payment methods comparison
  const paymentMethods = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    methods: broker.paymentMethods.map((method: any) => ({
      name: method.payment_method,
      currency: method.currency,
      deposit: method.deposit,
      withdrawal: method.withdrawal,
      processing_time: method.processing_time,
    })),
  }));

  // Support comparison
  const support = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    support: broker.support.map((sup: any) => ({
      type: sup.support_type,
      contact_info: sup.contact_info,
      availability: sup.availability,
      response_time: sup.response_time,
    })),
  }));

  // Promotions comparison
  const promotions = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.name,
    promotions: broker.promotions.map((promo: any) => ({
      title: promo.title,
      type: promo.promotion_type,
      bonus_amount: promo.bonus_amount,
      currency: promo.bonus_currency,
      min_deposit: promo.min_deposit,
    })),
  }));

  // Generate feature matrix for easy comparison
  const featureMatrix = generateFeatureMatrix(brokers);

  // Generate scoring
  const scores = generateComparisonScores(brokers);

  return {
    brokers: basicInfo,
    regulations,
    features,
    tradingConditions,
    accountTypes,
    platforms,
    paymentMethods,
    support,
    promotions,
    featureMatrix,
    scores,
    comparisonSummary: generateComparisonSummary(brokers),
  };
}

function generateFeatureMatrix(brokers: any[]) {
  // Collect all unique features across all brokers
  const allFeatures = new Set<string>();
  brokers.forEach(broker => {
    broker.features.forEach((feature: any) => {
      allFeatures.add(feature.feature_name);
    });
  });

  // Create matrix
  const matrix: any[] = [];
  Array.from(allFeatures).sort().forEach(featureName => {
    const row: any = {
      feature: featureName,
    };

    brokers.forEach(broker => {
      const feature = broker.features.find((f: any) => f.feature_name === featureName);
      row[broker.id] = feature ? feature.availability : false;
    });

    matrix.push(row);
  });

  return matrix;
}

function generateComparisonScores(brokers: any[]) {
  const scores = brokers.map(broker => {
    let score = 0;
    let maxScore = 0;

    // Rating score (30%)
    score += (broker.rating / 5) * 30;
    maxScore += 30;

    // Regulations score (25%)
    const regulationScore = broker.regulations.length > 0 ? 25 : 0;
    score += regulationScore;
    maxScore += 25;

    // Features score (20%)
    const featureScore = Math.min(broker.features.length * 2, 20);
    score += featureScore;
    maxScore += 20;

    // Platforms score (15%)
    const platformScore = Math.min(broker.platforms.length * 5, 15);
    score += platformScore;
    maxScore += 15;

    // Support score (10%)
    const supportScore = Math.min(broker.support.length * 3, 10);
    score += supportScore;
    maxScore += 10;

    return {
      brokerId: broker.id,
      brokerName: broker.name,
      score: Math.round((score / maxScore) * 100),
      breakdown: {
        rating: Math.round((broker.rating / 5) * 30),
        regulations: regulationScore,
        features: featureScore,
        platforms: platformScore,
        support: supportScore,
      },
    };
  });

  return scores.sort((a, b) => b.score - a.score);
}

function generateComparisonSummary(brokers: any[]) {
  const totalBrokers = brokers.length;
  const avgRating = brokers.reduce((sum, b) => sum + b.rating, 0) / totalBrokers;
  const totalRegulations = brokers.reduce((sum, b) => sum + b.regulations.length, 0);
  const avgMinDeposit = brokers.reduce((sum, b) => sum + b.min_deposit, 0) / totalBrokers;

  const mostRegulated = brokers.reduce((prev, current) =>
    prev.regulations.length > current.regulations.length ? prev : current
  );

  const highestRated = brokers.reduce((prev, current) =>
    prev.rating > current.rating ? prev : current
  );

  const lowestDeposit = brokers.reduce((prev, current) =>
    prev.min_deposit < current.min_deposit ? prev : current
  );

  return {
    totalBrokers,
    averageRating: Math.round(avgRating * 100) / 100,
    averageMinDeposit: Math.round(avgMinDeposit),
    totalRegulations,
    mostRegulated: mostRegulated.name,
    highestRated: highestRated.name,
    lowestDeposit: lowestDeposit.name,
  };
}