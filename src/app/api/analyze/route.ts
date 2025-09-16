import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrokerData } from '@/lib/ai/groq'

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data) {
      return NextResponse.json(
        { error: 'No data provided for analysis' },
        { status: 400 }
      )
    }

    const analysis = await analyzeBrokerData(data)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('Analysis API Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze broker data' },
      { status: 500 }
    )
  }
}