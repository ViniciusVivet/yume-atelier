/**
 * Auth para API routes: user por cookie ou por Bearer token (client envia no header).
 * Evita 401 quando o server nao ve o cookie.
 */

import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function getAuthUserFromRequest(request: NextRequest): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  const serverSupabase = createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (user) return user

  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: { user: userFromToken } } = await supabase.auth.getUser(token)
  return userFromToken
}

export async function isAdminByEmail(email: string): Promise<boolean> {
  try {
    const supabase = createServiceRoleClient()
    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .maybeSingle()
    return !!data
  } catch {
    return false
  }
}
