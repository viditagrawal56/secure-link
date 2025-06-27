import { Hono } from "hono";

type Bindings = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

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
