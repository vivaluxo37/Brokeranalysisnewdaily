import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIResponse {
  content: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export async function generateOpenAIResponse(
  messages: OpenAIMessage[],
  model: string = 'gpt-4-turbo-preview',
  temperature: number = 0.7,
  maxTokens: number = 2048
): Promise<OpenAIResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const response = completion.choices[0]?.message?.content || ''
    const usage = completion.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    }

    return {
      content: response,
      usage,
      model: completion.model,
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function analyzeBrokerWithOpenAI(brokerData: Record<string, unknown>): Promise<OpenAIResponse> {
  const systemPrompt = `You are a professional forex broker analysis AI assistant. Analyze the provided broker data and provide insights on:
- Regulatory compliance and trustworthiness
- Trading conditions and cost structure
- Platform quality and user experience
- Customer support quality
- Overall suitability for different trader types
- Comparative advantages and disadvantages

Provide a balanced, objective analysis with clear recommendations.`

  const userPrompt = `Please analyze the following forex broker data:\n\n${JSON.stringify(brokerData, null, 2)}`

  return generateOpenAIResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ])
}

export async function generateTradingSignals(marketData: string): Promise<OpenAIResponse> {
  const systemPrompt = `You are an expert trading signal analyst. Based on the provided market data, generate:
- Entry and exit signals for major currency pairs
- Risk management recommendations
- Technical analysis insights
- Market sentiment analysis
- Trading opportunities for different time frames

Provide clear, actionable trading signals with proper risk management.`

  const userPrompt = `Generate trading signals based on the following market data:\n\n${marketData}`

  return generateOpenAIResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ])
}

export async function provideEducationalContent(topic: string): Promise<OpenAIResponse> {
  const systemPrompt = `You are an expert forex trading educator. Provide comprehensive educational content on the requested topic, including:
- Clear definitions and concepts
- Practical examples
- Common mistakes to avoid
- Best practices
- Risk management considerations

Make the content accessible to traders of all levels.`

  const userPrompt = `Please provide educational content on: ${topic}`

  return generateOpenAIResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ])
}