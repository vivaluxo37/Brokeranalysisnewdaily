import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    console.log('Test API called with slug:', slug);

    return NextResponse.json({
      success: true,
      message: 'Test API working',
      slug: slug,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test API failed',
      },
      { status: 500 }
    );
  }
}