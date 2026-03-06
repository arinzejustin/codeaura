import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js";
import shareRoutes from "./routes/share.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serveStaticFile = (filePath: string, contentType: string) => {
  return (c: any) => {
    try {
      const content = readFileSync(join(__dirname, "..", "public", filePath));
      return new Response(content, {
        headers: { "Content-Type": contentType },
      });
    } catch (e) {
      console.error("File not found:", filePath, e);
      return c.notFound();
    }
  };
};

const app = new Hono();

app.use("*", logger());

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    return (
      c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "global"
    );
  },
});

app.use("*", limiter);

app.use(
  "*",
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://codeaura.fun",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/favicon.ico", serveStaticFile("favicon.ico", "image/x-icon"));

app.route("/auth", authRoutes);
app.route("/history", historyRoutes);
app.route("/snapshots", shareRoutes);

app.get("/", (c) => {
  return c.json({
    name: "CodeAura API",
    version: "1.0.0",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

const port = parseInt(process.env.PORT || "3000", 10);

export default {
  app,
  port,
  fetch: app.fetch,
};

console.log(`
  ╔═══════════════════════════════════════╗
  ║     ✨ CodeAura API Server          ║
  ║     Running on port ${String(port).padEnd(5)}           ║
  ║     http://localhost:${port}            ║
  ╚═══════════════════════════════════════╝
`);
