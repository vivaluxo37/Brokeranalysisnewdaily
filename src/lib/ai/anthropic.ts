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
    const systemMessage = messages.find(m => m.role === 'user')?.content || ''

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      system: `You are a professional forex broker analysis AI assistant. Provide accurate, unbiased, and comprehensive analysis of brokers and trading conditions.`,
      messages: messages.filter(m => m.role !== 'system'),
    })

    const content = response.content[0]?.text || ''
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

export async function analyzeBrokerWithAnthropic(brokerData: any): Promise<AnthropicResponse> {
  const systemPrompt = `You are a professional forex broker analysis AI assistant. Analyze the provided broker data and provide insights on:
- Regulatory compliance and trustworthiness
- Trading conditions and cost structure
- Platform quality and user experience
- Customer support quality
- Overall suitability for different trader types
- Comparative advantages and disadvantages

Provide a balanced, objective analysis with clear recommendations.`

  const userPrompt = `Please analyze the following forex broker data:\n\n${JSON.stringify(brokerData, null, 2)}`

  return generateAnthropicResponse([
    { role: 'user', content: userPrompt }
  ])
}

export async function generateMarketInsights(marketData: string): Promise<AnthropicResponse> {
  const systemPrompt = `You are an expert market analyst. Provide insights on:
- Current market trends
- Key economic indicators
- Currency pair analysis
- Trading opportunities
- Risk factors to consider

Focus on actionable insights that traders can use.`

  const userPrompt = `Analyze the following market data and provide insights:\n\n${marketData}`

  return generateAnthropicResponse([
    { role: 'user', content: userPrompt }
  ])
}