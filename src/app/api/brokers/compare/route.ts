import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findBestLogoMatch } from '@/lib/broker-logo-map';

// Broker interface for type safety
interface Broker {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  rating: number;
  review_count: number;
  min_deposit: number;
  min_deposit_currency: string;
  spread_type: string;
  typical_spread: number;
  max_leverage: string;
  established_year: number;
  headquarters: string;
  website_url: string;
  regulations: Regulation[];
  trading_instruments: TradingInstrument[];
  account_types: AccountType[];
  fees: Fee[];
  platforms: Platform[];
  customer_support: CustomerSupport[];
  education: Education[];
  promotions: Promotion[];
}

interface Regulation {
  regulatory_body: string;
  license_number: string;
  jurisdiction: string;
  status: string;
}

interface TradingInstrument {
  category: string;
  instruments: string[];
  spreads: string;
  commissions: string;
}

interface AccountType {
  name: string;
  min_deposit: number;
  currency: string;
  spread_type: string;
  commission: string;
  leverage: string;
  islamic: boolean;
}

interface Fee {
  type: string;
  value: string;
  description: string;
}

interface Platform {
  name: string;
  type: string;
  devices: string[];
}

interface CustomerSupport {
  channel: string;
  availability: string;
  languages: string[];
}

interface Education {
  type: string;
  title: string;
  level: string;
  description: string;
}

interface Promotion {
  type: string;
  title: string;
  description: string;
  expiry_date: string | null;
}

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
      logo_url: findBestLogoMatch((broker.name as string) || ''),
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

function generateComparisonData(brokers: Record<string, unknown>[]) {
  // Basic information comparison
  const basicInfo = brokers.map(broker => ({
    id: broker.id,
    name: broker.name,
    slug: broker.slug,
    logo_url: findBestLogoMatch((broker.name as string) || ''),
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
    regulations: (broker.regulations as Record<string, unknown>[]).map((reg: Record<string, unknown>) => ({
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
    features: (broker.features as Record<string, unknown>[]).map((feature: Record<string, unknown>) => ({
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
    conditions: (broker.tradingConditions as Record<string, unknown>[]).map((condition: Record<string, unknown>) => ({
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
    accounts: (broker.accountTypes as Record<string, unknown>[]).map((account: Record<string, unknown>) => ({
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
    platforms: (broker.platforms as Record<string, unknown>[]).map((platform: Record<string, unknown>) => ({
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
    methods: (broker.paymentMethods as Record<string, unknown>[]).map((method: Record<string, unknown>) => ({
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
    support: (broker.support as Record<string, unknown>[]).map((sup: Record<string, unknown>) => ({
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
    promotions: (broker.promotions as Record<string, unknown>[]).map((promo: Record<string, unknown>) => ({
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

function generateFeatureMatrix(brokers: Record<string, unknown>[]) {
  // Collect all unique features across all brokers
  const allFeatures = new Set<string>();
  brokers.forEach(broker => {
    (broker.features as Record<string, unknown>[]).forEach((feature: Record<string, unknown>) => {
      allFeatures.add(feature.feature_name as string);
    });
  });

  // Create matrix
  const matrix: Record<string, unknown>[] = [];
  Array.from(allFeatures).sort().forEach(featureName => {
    const row: Record<string, unknown> = {
      feature: featureName,
    };

    brokers.forEach(broker => {
      const feature = (broker.features as Record<string, unknown>[]).find((f: Record<string, unknown>) => (f.feature_name as string) === featureName);
      row[broker.id as string] = feature ? feature.availability : false;
    });

    matrix.push(row);
  });

  return matrix;
}

function generateComparisonScores(brokers: Record<string, unknown>[]) {
  const scores = brokers.map(broker => {
    let score = 0;
    let maxScore = 0;

    // Rating score (30%)
    score += ((broker.rating as number) / 5) * 30;
    maxScore += 30;

    // Regulations score (25%)
    const regulationScore = (broker.regulations as Record<string, unknown>[]).length > 0 ? 25 : 0;
    score += regulationScore;
    maxScore += 25;

    // Features score (20%)
    const featureScore = Math.min((broker.features as Record<string, unknown>[]).length * 2, 20);
    score += featureScore;
    maxScore += 20;

    // Platforms score (15%)
    const platformScore = Math.min((broker.platforms as Record<string, unknown>[]).length * 5, 15);
    score += platformScore;
    maxScore += 15;

    // Support score (10%)
    const supportScore = Math.min((broker.support as Record<string, unknown>[]).length * 3, 10);
    score += supportScore;
    maxScore += 10;

    return {
      brokerId: broker.id as string,
      brokerName: broker.name as string,
      score: Math.round((score / maxScore) * 100),
      breakdown: {
        rating: Math.round(((broker.rating as number) / 5) * 30),
        regulations: regulationScore,
        features: featureScore,
        platforms: platformScore,
        support: supportScore,
      },
    };
  });

  return scores.sort((a, b) => b.score - a.score);
}

function generateComparisonSummary(brokers: Record<string, unknown>[]) {
  const totalBrokers = brokers.length;
  const avgRating = brokers.reduce((sum, b) => sum + (b.rating as number), 0) / totalBrokers;
  const totalRegulations = brokers.reduce((sum, b) => sum + (b.regulations as Record<string, unknown>[]).length, 0);
  const avgMinDeposit = brokers.reduce((sum, b) => sum + (b.min_deposit as number), 0) / totalBrokers;

  const mostRegulated = brokers.reduce((prev, current) =>
    (prev.regulations as Record<string, unknown>[]).length > (current.regulations as Record<string, unknown>[]).length ? prev : current
  );

  const highestRated = brokers.reduce((prev, current) =>
    (prev.rating as number) > (current.rating as number) ? prev : current
  );

  const lowestDeposit = brokers.reduce((prev, current) =>
    (prev.min_deposit as number) < (current.min_deposit as number) ? prev : current
  );

  return {
    totalBrokers,
    averageRating: Math.round(avgRating * 100) / 100,
    averageMinDeposit: Math.round(avgMinDeposit),
    totalRegulations,
    mostRegulated: mostRegulated.name as string,
    highestRated: highestRated.name as string,
    lowestDeposit: lowestDeposit.name as string,
  };
}