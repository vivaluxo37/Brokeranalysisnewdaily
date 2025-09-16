import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    let filterObj: any = {};
    try {
      if (filters) {
        filterObj = JSON.parse(filters);
      }
    } catch (error) {
      // Invalid filter JSON, ignore filters
    }

    // Build search conditions
    const searchConditions: any[] = [
      {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        short_description: {
          contains: query,
          mode: 'insensitive',
        },
      },
    ];

    // Add feature search
    searchConditions.push({
      features: {
        some: {
          feature_name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    });

    // Add regulation search
    searchConditions.push({
      regulations: {
        some: {
          regulatory_body: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    });

    // Add platform search
    searchConditions.push({
      platforms: {
        some: {
          platform_name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    });

    // Build where clause with filters
    const where: any = {
      OR: searchConditions,
      status: 'active',
    };

    // Apply additional filters
    if (filterObj.minRating) {
      where.rating = {
        gte: parseFloat(filterObj.minRating),
      };
    }

    if (filterObj.maxMinDeposit) {
      where.min_deposit = {
        lte: parseFloat(filterObj.maxMinDeposit),
      };
    }

    if (filterObj.establishedYear) {
      where.established_year = {
        gte: parseInt(filterObj.establishedYear),
      };
    }

    if (filterObj.regulatoryBody) {
      where.regulations = {
        some: {
          regulatory_body: {
            contains: filterObj.regulatoryBody,
            mode: 'insensitive',
          },
        },
      };
    }

    if (filterObj.feature) {
      where.features = {
        some: {
          feature_name: {
            contains: filterObj.feature,
            mode: 'insensitive',
          },
        },
      };
    }

    if (filterObj.platform) {
      where.platforms = {
        some: {
          platform_name: {
            contains: filterObj.platform,
            mode: 'insensitive',
          },
        },
      };
    }

    // Get search results
    const [brokers, totalCount] = await Promise.all([
      prisma.broker.findMany({
        where,
        include: {
          regulations: true,
          features: true,
          platforms: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { review_count: 'desc' },
          { name: 'asc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.broker.count({ where }),
    ]);

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

async function generateSearchSuggestions(query: string): Promise<any[]> {
  const suggestions: any[] = [];

  try {
    // Get popular broker names that match the query
    const popularBrokers = await prisma.broker.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        status: 'active',
      },
      select: {
        name: true,
        slug: true,
        rating: true,
        review_count: true,
      },
      orderBy: [
        { review_count: 'desc' },
        { rating: 'desc' },
      ],
      take: 3,
    });

    popularBrokers.forEach(broker => {
      suggestions.push({
        type: 'broker',
        text: broker.name,
        url: `/brokers/${broker.slug}`,
        subtitle: `${broker.rating}/5 (${broker.review_count} reviews)`,
      });
    });

    // Get matching features
    const matchingFeatures = await prisma.brokerFeature.findMany({
      where: {
        feature_name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        feature_name: true,
        category: true,
      },
      distinct: ['feature_name'],
      take: 3,
    });

    matchingFeatures.forEach(feature => {
      suggestions.push({
        type: 'feature',
        text: feature.feature_name,
        subtitle: feature.category || 'Feature',
        filter: `{"feature":"${feature.feature_name}"}`,
      });
    });

    // Get matching regulatory bodies
    const matchingRegulations = await prisma.brokerRegulation.findMany({
      where: {
        regulatory_body: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        regulatory_body: true,
        jurisdiction: true,
      },
      distinct: ['regulatory_body'],
      take: 2,
    });

    matchingRegulations.forEach(reg => {
      suggestions.push({
        type: 'regulation',
        text: reg.regulatory_body,
        subtitle: reg.jurisdiction || 'Regulatory Body',
        filter: `{"regulatoryBody":"${reg.regulatory_body}"}`,
      });
    });

    // Get matching platforms
    const matchingPlatforms = await prisma.brokerPlatform.findMany({
      where: {
        platform_name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        platform_name: true,
        platform_type: true,
      },
      distinct: ['platform_name'],
      take: 2,
    });

    matchingPlatforms.forEach(platform => {
      suggestions.push({
        type: 'platform',
        text: platform.platform_name,
        subtitle: platform.platform_type || 'Trading Platform',
        filter: `{"platform":"${platform.platform_name}"}`,
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

    // Build complex search conditions
    const where: any = {
      status: 'active',
    };

    // Text search conditions
    if (query.trim()) {
      where.OR = [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          short_description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          features: {
            some: {
              feature_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          regulations: {
            some: {
              regulatory_body: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    // Apply advanced filters
    if (filters.ratingRange) {
      where.rating = {
        gte: filters.ratingRange.min,
        lte: filters.ratingRange.max,
      };
    }

    if (filters.depositRange) {
      where.min_deposit = {
        gte: filters.depositRange.min,
        lte: filters.depositRange.max,
      };
    }

    if (filters.establishedYearRange) {
      where.established_year = {
        gte: filters.establishedYearRange.min,
        lte: filters.establishedYearRange.max,
      };
    }

    if (filters.regulatoryBodies && filters.regulatoryBodies.length > 0) {
      where.regulations = {
        some: {
          regulatory_body: {
            in: filters.regulatoryBodies,
          },
        },
      };
    }

    if (filters.features && filters.features.length > 0) {
      where.features = {
        some: {
          feature_name: {
            in: filters.features,
          },
        },
      };
    }

    if (filters.platforms && filters.platforms.length > 0) {
      where.platforms = {
        some: {
          platform_name: {
            in: filters.platforms,
          },
        },
      };
    }

    if (filters.accountTypes && filters.accountTypes.length > 0) {
      where.accountTypes = {
        some: {
          account_name: {
            in: filters.accountTypes,
          },
        },
      };
    }

    // Build sort order
    let orderBy: any[] = [];
    switch (sort.field) {
      case 'rating':
        orderBy.push({ rating: sort.order });
        break;
      case 'name':
        orderBy.push({ name: sort.order });
        break;
      case 'min_deposit':
        orderBy.push({ min_deposit: sort.order });
        break;
      case 'established_year':
        orderBy.push({ established_year: sort.order });
        break;
      case 'review_count':
        orderBy.push({ review_count: sort.order });
        break;
      default:
        // Relevance sorting (search results)
        orderBy = [
          { rating: 'desc' },
          { review_count: 'desc' },
          { name: 'asc' },
        ];
    }

    // Execute search
    const [brokers, totalCount] = await Promise.all([
      prisma.broker.findMany({
        where,
        include: {
          regulations: true,
          features: true,
          tradingConditions: true,
          accountTypes: true,
          platforms: true,
          paymentMethods: true,
          support: true,
          _count: {
            select: {
              reviews: true,
              affiliateLinks: true,
              promotions: true,
            },
          },
        },
        orderBy,
        take: pagination.limit,
        skip: pagination.offset,
      }),
      prisma.broker.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: brokers,
      pagination: {
        ...pagination,
        totalCount,
        hasMore: pagination.offset + pagination.limit < totalCount,
      },
      searchMeta: {
        query,
        filters,
        sort,
        resultCount: totalCount,
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