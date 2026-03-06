
import { Hono } from "hono";
import { supabaseAdmin } from "../db.js";
import { requireAuth, type AuthUser } from "../middleware/auth.js";

type Variables = {
  user: AuthUser;
};

const history = new Hono<{ Variables: Variables }>();

/**
 * GET /history — Get all history entries for the authenticated user
 */
history.get("/", requireAuth, async (c) => {
  const user = c.get("user") as AuthUser;

  const { data, error } = await supabaseAdmin
    .from("history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return c.json({ error: "Failed to fetch history" }, 500);
  }

  return c.json({ entries: data });
});

/**
 * POST /history/sync — Sync local history entries to the server.
 * Accepts an array of entries; upserts by sync_id to avoid duplicates.
 */
history.post("/sync", requireAuth, async (c) => {
  const user = c.get("user") as AuthUser;
  const body = await c.req.json<{
    entries: Array<{
      syncId: string;
      themeId: string;
      language: string;
      codePreview: string;
      config: Record<string, any>;
      pinned: boolean;
      timestamp: number;
    }>;
  }>();

  if (!body.entries || !Array.isArray(body.entries)) {
    return c.json({ error: "Invalid request body" }, 400);
  }

  const rows = body.entries.map((entry) => ({
    user_id: user.id,
    sync_id: entry.syncId,
    theme_id: entry.themeId,
    language: entry.language,
    code_preview: entry.codePreview,
    config: entry.config,
    pinned: entry.pinned,
    created_at: new Date(entry.timestamp).toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("history")
    .upsert(rows, { onConflict: "sync_id" });

  if (error) {
    return c.json({ error: "Failed to sync entries" }, 500);
  }

  return c.json({ synced: rows.length });
});

/**
 * DELETE /history/:id — Delete a specific history entry
 */
history.delete("/:id", requireAuth, async (c) => {
  const user = c.get("user") as AuthUser;
  const id = c.req.param("id");

  const { error } = await supabaseAdmin
    .from("history")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return c.json({ error: "Failed to delete entry" }, 500);
  }

  return c.json({ success: true });
});

export default history;
