import { Hono } from "hono";

const app = new Hono();

app.get("/api/*", (c) => {
  return c.json({ name: "this is from hono" });
});

app.get("*", (c) => {
  return c.text("Not found", 404);
});

export default app;
