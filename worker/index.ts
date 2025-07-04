import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { auth } from "./auth";
import { requireAuth } from "./middleware/middleware";
import * as schema from "./db/schema";
import type { Bindings, Variables } from "./types";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://testing.secure-link.workers.dev",
    ], // TODO: Add the worker domain
    credentials: true,
  })
);

app.onError((err, c) => {
  console.log("Error encountered:", err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  try {
    const authHandler = auth(c.env.DB);
    return await authHandler.handler(c.req.raw);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error during authentication:", err);
      return c.json(
        { error: "Authentication Error", message: err.message },
        500
      );
    } else {
      console.log("Unknown error during authentication:", err);
      return c.json(
        { error: "Authentication Error", message: "An unknown error occurred" },
        500
      );
    }
  }
});

app.get("/api/profile", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    return c.json({ user });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error fetching user profile:", err);
      return c.json(
        { error: "Failed to fetch user profile", message: err.message },
        500
      );
    } else {
      console.log("Unknown error while fetching user profile:", err);
      return c.json(
        {
          error: "Profile Fetching Error",
          message: "An unknown error occurred",
        },
        500
      );
    }
  }
});

const createUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

app.post(
  "/api/shorten",
  requireAuth,
  zValidator("json", createUrlSchema),
  async (c) => {
    try {
      const { url } = c.req.valid("json");
      const user = c.get("user");
      const db = drizzle(c.env.DB, { schema });

      // Generate unique short code
      let shortCode = nanoid(6);
      let attempts = 0;
      while (attempts < 5) {
        const existing = await db.query.shortUrls.findFirst({
          where: eq(schema.shortUrls.shortCode, shortCode),
        });
        if (!existing) break;
        shortCode = nanoid(6);
        attempts++;
      }

      if (attempts >= 5) {
        return c.json({ error: "Failed to generate unique short code" }, 500);
      }

      // Create short URL
      const shortUrl = await db
        .insert(schema.shortUrls)
        .values({
          id: nanoid(),
          userId: user.id,
          shortCode,
          originalUrl: url,
        })
        .returning();

      return c.json({
        id: shortUrl[0].id,
        shortCode: shortUrl[0].shortCode,
        originalUrl: shortUrl[0].originalUrl,
        shortUrl: `${new URL(c.req.url).origin}/s/${shortUrl[0].shortCode}`,
        createdAt: shortUrl[0].createdAt,
      });
    } catch (err) {
      console.log("Error creating short URL:", err);
      return c.json({ error: "Failed to create short URL" }, 500);
    }
  }
);

app.get("/api/urls", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const db = drizzle(c.env.DB, { schema });

    const urls = await db.query.shortUrls.findMany({
      where: eq(schema.shortUrls.userId, user.id),
      orderBy: (shortUrls, { desc }) => [desc(shortUrls.createdAt)],
    });

    const baseUrl = new URL(c.req.url).origin;
    const formattedUrls = urls.map((url) => ({
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/s/${url.shortCode}`,
      createdAt: url.createdAt,
    }));

    return c.json(formattedUrls);
  } catch (err) {
    console.log("Error fetching URLs:", err);
    return c.json({ error: "Failed to fetch URLs" }, 500);
  }
});

app.delete("/api/urls/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");
    const db = drizzle(c.env.DB, { schema });

    const url = await db.query.shortUrls.findFirst({
      where: eq(schema.shortUrls.id, id),
    });

    if (!url) {
      return c.json({ error: "URL not found" }, 404);
    }

    if (url.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    await db.delete(schema.shortUrls).where(eq(schema.shortUrls.id, id));

    return c.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.log("Error deleting URL:", err);
    return c.json({ error: "Failed to delete URL" }, 500);
  }
});

app.get("/s/:shortCode", async (c) => {
  try {
    const shortCode = c.req.param("shortCode");
    const db = drizzle(c.env.DB, { schema });

    const url = await db.query.shortUrls.findFirst({
      where: eq(schema.shortUrls.shortCode, shortCode),
    });

    if (!url) {
      return c.text("URL not found", 404);
    }

    return c.redirect(url.originalUrl);
  } catch (err) {
    console.log("Error redirecting URL:", err);
    return c.text("Internal Server Error", 500);
  }
});

app.get("/api/*", (c) => {
  return c.json({ name: "this is from hono" });
});

app.get("*", async (c) => {
  // Try to serve the static asset first
  const url = new URL(c.req.url);
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);

  // If the asset exists (not 404), return it
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // If it's not a static asset and not an API route, serve index.html for SPA routing
  if (!url.pathname.startsWith("/api/")) {
    const indexResponse = await c.env.ASSETS.fetch(
      new Request(new URL("/", url).href)
    );
    return indexResponse;
  }

  return c.text("Not found", 404);
});

export default app;
