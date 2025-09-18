import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Reviews endpoint is working',
    data: []
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Review submission received',
      data: body
    });
  } catch (error) {
    console.error('Error processing review:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process review',
      },
      { status: 400 }
    );
  }
}