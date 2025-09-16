import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const brokerId = searchParams.get('brokerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const minRating = parseInt(searchParams.get('minRating') || '1');
    const maxRating = parseInt(searchParams.get('maxRating') || '5');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (!brokerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker ID is required',
        },
        { status: 400 }
      );
    }

    // Check if broker exists
    const { data: broker, error: brokerError } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', brokerId)
      .single();

    if (brokerError || !broker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker not found',
        },
        { status: 404 }
      );
    }

    // For now, return empty reviews array since we don't have a reviews table in Supabase
    // In a real implementation, you would create a reviews table and query it here
    return NextResponse.json({
      success: true,
      data: [],
      pagination: {
        currentPage: page,
        totalCount: 0,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      stats: {
        ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
          rating,
          count: 0,
        })),
        averageRating: broker.avg_rating || 0,
        totalReviews: broker.total_reviews || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching broker reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brokerId,
      rating,
      reviewText,
      tradingExperience,
      accountType,
      username,
      email,
    } = body;

    // Validate required fields
    if (!brokerId || !rating) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker ID and rating are required',
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rating must be between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Check if broker exists
    const { data: broker, error: brokerError } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', brokerId)
      .single();

    if (brokerError || !broker) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broker not found',
        },
        { status: 404 }
      );
    }

    // For now, return a success message without actually storing the review
    // In a real implementation, you would insert into a reviews table
    return NextResponse.json({
      success: true,
      data: {
        id: Date.now().toString(),
        broker_id: brokerId,
        rating,
        review_text: reviewText,
        trading_experience: tradingExperience,
        account_type: accountType,
        username: username || 'Anonymous',
        email,
        verified_status: false,
        approved: false,
        helpful_count: 0,
        reported_count: 0,
        created_at: new Date().toISOString(),
      },
      message: 'Review submitted successfully and pending approval',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create review',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}