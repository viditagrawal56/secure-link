import type { cors } from "hono/cors";

export const corsConfig: Parameters<typeof cors>[0] = {
  origin: ["http://localhost:5173", "https://testing.secure-link.workers.dev"], // TODO: Add the worker domain
  credentials: true,
};
