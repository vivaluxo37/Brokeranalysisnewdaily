import { Groq } from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  content: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export async function generateResponse(
  messages: GroqMessage[],
  model: string = 'llama3-70b-8192',
  temperature: number = 0.7,
  maxTokens: number = 2048
): Promise<GroqResponse> {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
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
    console.error('Groq API Error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function analyzeBrokerData(data: string): Promise<GroqResponse> {
  const systemPrompt = `You are a professional broker analysis AI assistant. Analyze the provided broker data and provide insights on:
- Performance metrics
- Risk assessment
- Trading patterns
- Recommendations for improvement
- Market insights

Provide a comprehensive, structured analysis with clear sections and actionable insights.`

  return generateResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: data }
  ])
}

export async function generateTradingStrategy(
  marketConditions: string,
  riskTolerance: 'low' | 'medium' | 'high'
): Promise<GroqResponse> {
  const systemPrompt = `You are an expert trading strategist. Based on the provided market conditions and risk tolerance, generate a detailed trading strategy including:
- Entry and exit points
- Risk management techniques
- Position sizing recommendations
- Time frames for trades
- Specific instruments to consider

Tailor the strategy to the specified risk tolerance level.`

  const userPrompt = `Market Conditions: ${marketConditions}\nRisk Tolerance: ${riskTolerance}`

  return generateResponse([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ])
}