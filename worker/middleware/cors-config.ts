import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";
import type { Bindings } from "../types";

function getCorsOrigins(env: Bindings): string[] {
  const isDev = env.CLOUDFLARE_ENV === "development";

  if (!env.VITE_BASE_URL && !isDev) {
    throw new Error("Missing VITE_BASE_URL in non-development environment");
  }

  return isDev
    ? ["http://localhost:8787", "http://127.0.0.1:8787"]
    : [env.VITE_BASE_URL];
}

export const corsConfig: MiddlewareHandler = async (c, next) => {
  const env = c.env;
  const allowedOrigins = new Set(getCorsOrigins(env));

  const originChecker = (origin: string) => {
    const isAllowed = allowedOrigins.has(origin);

    if (env.CLOUDFLARE_ENV === "development") {
      console.log("=== CORS DEBUG ===");
      console.log("Environment:", env.CLOUDFLARE_ENV);
      console.log("Incoming Origin:", origin || "(none)");
      console.log("Allowed Origins:", [...allowedOrigins]);
      console.log("Is Origin Allowed?", isAllowed);
      console.log("CORS Origin Set To:", isAllowed ? origin : "(null)");
      console.log("==================");
    }

    return isAllowed ? origin : null;
  };

  return cors({
    origin: originChecker,
    credentials: true,
  })(c, next);
};
