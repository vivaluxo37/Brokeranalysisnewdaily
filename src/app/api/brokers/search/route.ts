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

    const query = searchParams.get('q') || '';
    const filters = searchParams.get('filters') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    // Parse filters
    let filterObj: Record<string, unknown> = {};
    try {
      if (filters) {
        filterObj = JSON.parse(filters);
      }
    } catch {
      // Invalid filter JSON, ignore filters
    }

    // Build search conditions using text search
    let whereCondition = `is_active.eq.true`;

    // Add text search for query
    if (query.trim()) {
      whereCondition += `,name.ilike.*${query}*,description.ilike.*${query}*,short_description.ilike.*${query}*`;
    }

    // Apply additional filters
    if (filterObj.minRating) {
      whereCondition += `,avg_rating.gte.${filterObj.minRating}`;
    }

    if (filterObj.maxMinDeposit) {
      whereCondition += `,min_deposit.lte.${filterObj.maxMinDeposit}`;
    }

    if (filterObj.establishedYear) {
      whereCondition += `,established_year.gte.${filterObj.establishedYear}`;
    }

    // Get search results using Supabase
    let supabaseQuery = supabase
      .from('brokers')
      .select('*')
      .eq('is_active', true)
      .order('avg_rating', { ascending: false })
      .order('total_reviews', { ascending: false })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    // Add text search for query
    if (query.trim()) {
      supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }

    // Apply additional filters
    if (filterObj.minRating) {
      supabaseQuery = supabaseQuery.gte('avg_rating', filterObj.minRating);
    }

    if (filterObj.maxMinDeposit) {
      supabaseQuery = supabaseQuery.lte('min_deposit', filterObj.maxMinDeposit);
    }

    if (filterObj.establishedYear) {
      supabaseQuery = supabaseQuery.gte('established_year', filterObj.establishedYear);
    }

    const { data: brokersData, error } = await supabaseQuery;

    if (error) {
      throw error;
    }

    // Transform data to match expected structure
    const brokers = brokersData?.map(broker => ({
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      logo_url: findBestLogoMatch(broker.name || ''),
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
    })) || [];

    // Get total count for pagination
    const totalCount = brokersData?.length || 0;

    // Generate search suggestions
    const suggestions = await generateSearchSuggestions(query);

    // Highlight search terms in results
    const highlightedResults = brokers.map(broker => ({
      ...broker,
      _searchHighlight: {
        name: highlightText(broker.name, query),
        description: highlightText(broker.description || '', query),
        shortDescription: highlightText(broker.short_description || '', query),
      },
    }));

    return NextResponse.json({
      success: true,
      data: highlightedResults,
      pagination: {
        totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      suggestions,
      searchMeta: {
        query,
        filters: filterObj,
        resultCount: totalCount,
        searchTime: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error searching brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search brokers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function generateSearchSuggestions(query: string): Promise<Record<string, unknown>[]> {
  const suggestions: Record<string, unknown>[] = [];

  try {
    // Get popular broker names that match the query
    const { data: popularBrokers } = await supabase
      .from('brokers')
      .select('name, slug, avg_rating, total_reviews')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .order('total_reviews', { ascending: false })
      .order('avg_rating', { ascending: false })
      .limit(3);

    popularBrokers?.forEach((broker: any) => {
      suggestions.push({
        type: 'broker',
        text: broker.name,
        url: `/brokers/${broker.slug}`,
        subtitle: `${broker.avg_rating || 0}/5 (${broker.total_reviews || 0} reviews)`,
      });
    });

    // Generate mock suggestions for features, regulations, and platforms
    const features = ['MetaTrader 4', 'MetaTrader 5', 'Mobile Trading', 'Islamic Accounts', 'ECN Trading'];
    const regulations = ['FCA', 'CySEC', 'ASIC', 'FSCA'];
    const platforms = ['MetaTrader 4', 'MetaTrader 5', 'WebTrader', 'Mobile App'];

    features.filter(f => f.toLowerCase().includes(query.toLowerCase())).forEach(feature => {
      suggestions.push({
        type: 'feature',
        text: feature,
        subtitle: 'Trading Feature',
        filter: `{\"feature\":\"${feature}\"}`,
      });
    });

    regulations.filter(r => r.toLowerCase().includes(query.toLowerCase())).forEach(reg => {
      suggestions.push({
        type: 'regulation',
        text: reg,
        subtitle: 'Regulatory Body',
        filter: `{\"regulatoryBody\":\"${reg}\"}`,
      });
    });

    platforms.filter(p => p.toLowerCase().includes(query.toLowerCase())).forEach(platform => {
      suggestions.push({
        type: 'platform',
        text: platform,
        subtitle: 'Trading Platform',
        filter: `{\"platform\":\"${platform}\"}`,
      });
    });

  } catch (error) {
    console.error('Error generating suggestions:', error);
  }

  return suggestions.slice(0, 10); // Limit to 10 suggestions
}

function highlightText(text: string, query: string): string {
  if (!text || !query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// POST endpoint for advanced search with complex filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      query,
      filters = {},
      sort = { field: 'relevance', order: 'desc' },
      pagination = { limit: 20, offset: 0 },
    } = body;

    if (!query || !query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    // Execute search with proper Supabase query methods
    let searchQuery = supabase
      .from('brokers')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.*${query}*,description.ilike.*${query}*`);

    // Apply advanced filters
    if (filters.ratingRange) {
      searchQuery = searchQuery
        .gte('avg_rating', filters.ratingRange.min)
        .lte('avg_rating', filters.ratingRange.max);
    }

    if (filters.depositRange) {
      searchQuery = searchQuery
        .gte('min_deposit', filters.depositRange.min)
        .lte('min_deposit', filters.depositRange.max);
    }

    if (filters.establishedYearRange) {
      searchQuery = searchQuery
        .gte('established_year', filters.establishedYearRange.min)
        .lte('established_year', filters.establishedYearRange.max);
    }

    const { data: brokers, error } = await searchQuery
      .order(sort.field === 'rating' ? 'avg_rating' : 'name', { ascending: sort.order === 'asc' })
      .range(pagination.offset, pagination.offset + pagination.limit - 1);

    if (error) {
      throw error;
    }

    // Transform data
    const transformedBrokers = brokers?.map(broker => ({
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      logo_url: findBestLogoMatch(broker.name || ''),
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
      status: broker.is_active ? 'active' : 'inactive',
      regulations: Array.isArray(broker.regulations) ?
        broker.regulations.map((reg: string, index: number) => ({
          regulatory_body: reg,
          jurisdiction: 'Global',
        })) : [],
      features: Array.isArray(broker.platforms) ?
        broker.platforms.map((platform: string) => ({
          feature_name: platform,
          category: 'Trading',
        })) : [],
      platforms: Array.isArray(broker.platforms) ?
        broker.platforms.map((platform: string) => ({
          platform_name: platform,
          platform_type: 'Trading',
        })) : [],
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedBrokers,
      pagination: {
        ...pagination,
        totalCount: brokers?.length || 0,
        hasMore: pagination.offset + pagination.limit < (brokers?.length || 0),
      },
      searchMeta: {
        query,
        filters,
        sort,
        resultCount: brokers?.length || 0,
        searchTime: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform advanced search',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}