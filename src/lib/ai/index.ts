import { generateResponse, analyzeBrokerData as analyzeWithGroq, GroqMessage } from './groq'
import { generateAnthropicResponse, analyzeBrokerWithAnthropic, AnthropicMessage } from './anthropic'
import { generateOpenAIResponse, analyzeBrokerWithOpenAI, OpenAIMessage } from './openai'

export type AIProvider = 'groq' | 'anthropic' | 'openai'

export interface AIServiceConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface UnifiedAIResponse {
  content: string
  usage: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  model: string
  provider: AIProvider
}

export class AIService {
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
  }

  async generateResponse(messages: { role: string; content: string }[]): Promise<UnifiedAIResponse> {
    switch (this.config.provider) {
      case 'groq':
        const groqResponse = await generateResponse(
          messages.map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })) as GroqMessage[],
          this.config.model || 'llama3-70b-8192',
          this.config.temperature || 0.7,
          this.config.maxTokens || 2048
        )
        return {
          content: groqResponse.content,
          usage: groqResponse.usage,
          model: groqResponse.model,
          provider: 'groq'
        }

      case 'anthropic':
        const anthropicResponse = await generateAnthropicResponse(
          messages.filter(m => m.role !== 'system').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })) as AnthropicMessage[],
          this.config.model || 'claude-3-sonnet-20240229',
          this.config.maxTokens || 2048
        )
        return {
          content: anthropicResponse.content,
          usage: {
            prompt_tokens: anthropicResponse.usage.input_tokens,
            completion_tokens: anthropicResponse.usage.output_tokens,
            total_tokens: anthropicResponse.usage.input_tokens + anthropicResponse.usage.output_tokens
          },
          model: anthropicResponse.model,
          provider: 'anthropic'
        }

      case 'openai':
        const openaiResponse = await generateOpenAIResponse(
          messages.map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })) as OpenAIMessage[],
          this.config.model || 'gpt-4-turbo-preview',
          this.config.temperature || 0.7,
          this.config.maxTokens || 2048
        )
        return {
          content: openaiResponse.content,
          usage: openaiResponse.usage,
          model: openaiResponse.model,
          provider: 'openai'
        }

      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`)
    }
  }

  async analyzeBroker(brokerData: Record<string, unknown>): Promise<UnifiedAIResponse> {
    switch (this.config.provider) {
      case 'groq':
        const groqAnalysis = await analyzeWithGroq(JSON.stringify(brokerData, null, 2))
        return {
          content: groqAnalysis.content,
          usage: groqAnalysis.usage,
          model: groqAnalysis.model,
          provider: 'groq'
        }

      case 'anthropic':
        const anthropicAnalysis = await analyzeBrokerWithAnthropic(brokerData)
        return {
          content: anthropicAnalysis.content,
          usage: {
            prompt_tokens: anthropicAnalysis.usage.input_tokens,
            completion_tokens: anthropicAnalysis.usage.output_tokens,
            total_tokens: anthropicAnalysis.usage.input_tokens + anthropicAnalysis.usage.output_tokens
          },
          model: anthropicAnalysis.model,
          provider: 'anthropic'
        }

      case 'openai':
        const openaiAnalysis = await analyzeBrokerWithOpenAI(brokerData)
        return {
          content: openaiAnalysis.content,
          usage: openaiAnalysis.usage,
          model: openaiAnalysis.model,
          provider: 'openai'
        }

      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`)
    }
  }
}

// Factory functions for different AI services
export function createGroqService(): AIService {
  return new AIService({
    provider: 'groq',
    model: 'llama3-70b-8192',
    temperature: 0.7,
    maxTokens: 2048
  })
}

export function createAnthropicService(): AIService {
  return new AIService({
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 2048
  })
}

export function createOpenAIService(): AIService {
  return new AIService({
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2048
  })
}

// Default service selector based on availability
export function getDefaultAIService(): AIService {
  // Try Anthropic first, then OpenAI, then Groq
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
    return createAnthropicService()
  }

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    return createOpenAIService()
  }

  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    return createGroqService()
  }

  throw new Error('No AI service API keys configured')
}

// Multi-provider analysis for comprehensive insights
export async function analyzeWithMultipleProviders(brokerData: Record<string, unknown>): Promise<{
  groq?: UnifiedAIResponse
  anthropic?: UnifiedAIResponse
  openai?: UnifiedAIResponse
}> {
  const results: {
    groq?: UnifiedAIResponse
    anthropic?: UnifiedAIResponse
    openai?: UnifiedAIResponse
  } = {}

  // Try each provider if API keys are available
  try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      results.groq = await createGroqService().analyzeBroker(brokerData)
    }
  } catch (error) {
    console.warn('Groq analysis failed:', error)
  }

  try {
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
      results.anthropic = await createAnthropicService().analyzeBroker(brokerData)
    }
  } catch (error) {
    console.warn('Anthropic analysis failed:', error)
  }

  try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      results.openai = await createOpenAIService().analyzeBroker(brokerData)
    }
  } catch (error) {
    console.warn('OpenAI analysis failed:', error)
  }

  return results
}