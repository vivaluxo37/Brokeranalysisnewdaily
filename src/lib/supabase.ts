import { createClient } from '@supabase/supabase-js'

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Service role client for admin operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('count')
      .limit(1)

    if (error) {
      return { connected: false, error: error.message }
    }

    return { connected: true, count: data?.[0]?.count || 0 }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to get featured brokers
export async function getFeaturedBrokers(limit = 5, includeDetails = false) {
  try {
    let query = supabase
      .from('brokers')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .order('avg_rating', { ascending: false })
      .order('total_reviews', { ascending: false })
      .limit(limit)

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching featured brokers:', error)
    return []
  }
}

// Helper function to search brokers
export async function searchBrokers(query: string, filters: any = {}, limit = 10) {
  try {
    let supabaseQuery = supabase
      .from('brokers')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${query}%`)
      .limit(limit)

    // Apply additional filters if needed
    if (filters.rating) {
      supabaseQuery = supabaseQuery.gte('avg_rating', filters.rating)
    }

    const { data, error } = await supabaseQuery

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error searching brokers:', error)
    return []
  }
}