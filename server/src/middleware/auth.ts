
import { type Context, type Next } from 'hono'
import { supabaseAdmin } from '../db'

export interface AuthUser {
  id: string
  email?: string
  user_metadata: {
    avatar_url?: string
    user_name?: string
    full_name?: string
    preferred_username?: string
  }
}

/**
 * Middleware that requires authentication.
 * Returns 401 if no valid token is provided.
 */
export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !data.user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Attach user to context
    c.set('user', data.user as AuthUser)
    c.set('token', token)

    await next()
  } catch {
    return c.json({ error: 'Authentication failed' }, 401)
  }
}

/**
 * Optional auth middleware — Attaches user if token present, but doesn't block.
 */
export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const { data } = await supabaseAdmin.auth.getUser(token)
      if (data.user) {
        c.set('user', data.user as AuthUser)
        c.set('token', token)
      }
    } catch {
      // Ignore auth errors for optional auth
    }
  }

  await next()
}
