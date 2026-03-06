import { Hono } from "hono";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "../db.js";
import { optionalAuth, type AuthUser } from "../middleware/auth.js";

type Variables = {
  user: AuthUser;
};

const share = new Hono<{ Variables: Variables }>();

/**
 * POST /snapshots — Create a shared snapshot
 * Returns a short_code that can be used to view the snapshot.
 *
 * Auth is optional — anonymous users can also share.
 */
share.post("/", optionalAuth, async (c) => {
  const user = c.get("user") as AuthUser | undefined;

  const body = await c.req.json<{
    code: string;
    language: string;
    config: {
      themeId: string;
      fontId: string;
      fontSize: number;
      lineHeight: number;
      padding: number;
      innerPadding: number;
      borderRadius: number;
      width: number;
      windowStyle: string;
      showLineNumbers: boolean;
      shadow: string;
      bgType: string;
      bgColor?: string;
      bgGradient?: string;
      showTitle: boolean;
      windowTitle: string;
    };
  }>();

  if (!body.code || !body.language || !body.config) {
    return c.json(
      { error: "Missing required fields: code, language, config" },
      400,
    );
  }

  // Generate a unique short code
  const shortCode = nanoid(8);

  const { data, error } = await supabaseAdmin
    .from("snapshots")
    .insert({
      user_id: user?.id || null,
      short_code: shortCode,
      code: body.code,
      language: body.language,
      config: body.config,
    })
    .select("id, short_code, created_at")
    .single();

  if (error) {
    console.error("Snapshot creation failed:", error);
    return c.json({ error: "Failed to create snapshot" }, 500);
  }

  const frontendUrl = process.env.FRONTEND_URL || "https://codeaura.fun";

  return c.json({
    id: data.id,
    shortCode: data.short_code,
    shareUrl: `${frontendUrl}/s/${data.short_code}`,
    createdAt: data.created_at,
  });
});

/**
 * GET /snapshots/:code — Get a snapshot by its short code
 * Public — no auth required.
 * Also increments the view counter.
 */
share.get("/:code", async (c) => {
  const code = c.req.param("code");

  const { data, error } = await supabaseAdmin
    .from("snapshots")
    .select("*")
    .eq("short_code", code)
    .single();

  if (error || !data) {
    return c.json({ error: "Snapshot not found" }, 404);
  }

  // Increment view count (fire-and-forget)
  supabaseAdmin
    .from("snapshots")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", data.id)
    .then(() => {});

  return c.json({
    id: data.id,
    code: data.code,
    language: data.language,
    config: data.config,
    views: data.views,
    createdAt: data.created_at,
  });
});

export default share;
