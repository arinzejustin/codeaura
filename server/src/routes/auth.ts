import { Hono } from "hono";
import { supabaseAuth, supabaseAdmin } from "../db.js";
import { requireAuth, type AuthUser } from "../middleware/auth.js";

type Variables = {
  user: AuthUser;
  token: string;
};

const auth = new Hono<{ Variables: Variables }>();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://codeaura.fun";

/**
 * GET /auth/github — Initiate GitHub OAuth
 * Redirects the user to GitHub via Supabase Auth.
 */
auth.get("/github", async (c) => {
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${FRONTEND_URL}/auth/callback`,
      scopes: "read:user user:email",
    },
  });

  if (error || !data.url) {
    return c.json({ error: "Failed to initiate OAuth" }, 500);
  }

  return c.redirect(data.url);
});

/**
 * GET /auth/callback — Handle OAuth callback from Supabase
 * Exchanges the code for a session and redirects to frontend with tokens.
 */
auth.get("/callback", async (c) => {
  const code = c.req.query("code");

  if (!code) {
    return c.redirect(`${FRONTEND_URL}?auth_error=missing_code`);
  }

  try {
    const { data, error } =
      await supabaseAuth.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return c.redirect(`${FRONTEND_URL}?auth_error=exchange_failed`);
    }

    const { access_token, refresh_token } = data.session;
    const user = data.user;

    // Redirect to frontend with token in URL fragment (safer than query params)
    const params = new URLSearchParams({
      access_token,
      refresh_token: refresh_token || "",
      user_id: user.id,
      user_name:
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        "",
      full_name: user.user_metadata?.full_name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
      email: user.email || "",
    });

    return c.redirect(`${FRONTEND_URL}/auth/callback?${params.toString()}`);
  } catch {
    return c.redirect(`${FRONTEND_URL}?auth_error=server_error`);
  }
});

/**
 * GET /auth/me — Get current authenticated user
 */
auth.get("/me", requireAuth, async (c) => {
  const user = c.get("user") as AuthUser;

  return c.json({
    id: user.id,
    login:
      user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username ||
      "",
    name: user.user_metadata?.full_name || null,
    avatarUrl: user.user_metadata?.avatar_url || "",
    email: user.email || null,
  });
});

/**
 * POST /auth/logout — Logout (invalidate token server-side)
 */
auth.post("/logout", requireAuth, async (c) => {
  const token = c.get("token") as string;

  try {
    await supabaseAdmin.auth.admin.signOut(token);
  } catch {
    // Token may already be invalid
  }

  return c.json({ success: true });
});

export default auth;
