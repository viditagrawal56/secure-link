import { Hono } from "hono";
import type { Bindings, Variables } from "./types";
import { corsConfig } from "./middleware/cors-config";
import { authRoutes } from "./routes/authRoutes";
import { urlRoutes } from "./routes/urlRoutes";
import { staticRoutes } from "./routes/staticRoutes";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", corsConfig);

app.onError((err, c) => {
  console.log("Error encountered:", err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

app.route("/api/auth", authRoutes);

app.route("/api", urlRoutes);

app.route("/", staticRoutes);

export default app;
