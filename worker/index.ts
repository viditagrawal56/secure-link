import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { requireAuth } from "./middleware/middleware";
import type { Bindings, Variables } from "./types";

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
