import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AnthropicResponse {
  content: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
  model: string
}

export async function generateAnthropicResponse(
  messages: AnthropicMessage[],
  model: string = 'claude-3-sonnet-20240229',
  maxTokens: number = 2048
): Promise<AnthropicResponse> {
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      system: `You are a professional forex broker analysis AI assistant. Provide accurate, unbiased, and comprehensive analysis of brokers and trading conditions.`,
      messages,
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const usage = response.usage || {
      input_tokens: 0,
      output_tokens: 0,
    }

    return {
      content,
      usage,
      model: response.model,
    }
  } catch (error) {
    console.error('Anthropic API Error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function analyzeBrokerWithAnthropic(brokerData: Record<string, unknown>): Promise<AnthropicResponse> {
  const userPrompt = `Please analyze the following forex broker data:\n\n${JSON.stringify(brokerData, null, 2)}`

  return generateAnthropicResponse([
    { role: 'user', content: userPrompt }
  ])
}

export async function generateMarketInsights(marketData: string): Promise<AnthropicResponse> {
  const userPrompt = `Analyze the following market data and provide insights:
- Current market trends
- Key economic indicators
- Currency pair analysis
- Trading opportunities
- Risk factors to consider

Focus on actionable insights that traders can use.

Market data:
${marketData}`

  return generateAnthropicResponse([
    { role: 'user', content: userPrompt }
  ])
}