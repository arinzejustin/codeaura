
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
}

/** Admin client — Use for server-side operations (bypasses RLS) */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/** Public client — Use for auth operations */
export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)

export { supabaseUrl, supabaseAnonKey }
