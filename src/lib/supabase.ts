import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl) {
  console.error('[supabase] VITE_SUPABASE_URL is not set')
}
if (!supabaseAnonKey) {
  console.error('[supabase] VITE_SUPABASE_ANON_KEY is not set')
}

// Create Supabase client with explicit auth options to persist sessions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
