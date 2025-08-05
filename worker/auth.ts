import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import type { Bindings } from "./types";

const getTrustedOrigins = (env: Bindings): string[] => {
  if (env.CLOUDFLARE_ENV === "development") {
    return [
      "http://localhost:8787",
      "http://127.0.0.1:8787",
      "http://localhost:5173",
    ];
  }

  if (!env.VITE_BASE_URL) {
    console.log("VITE_BASE_URL is required in staging/production");
    throw new Error("VITE_BASE_URL is required in staging/production");
  }
  return [env.VITE_BASE_URL];
};

export const auth = (env: Bindings) => {
  const trustedOrigins = getTrustedOrigins(env);

  const db = drizzle(env.DB);

  //TODO: Logging for easier debugging, remove it later or cap it to dev env
  console.log("[BetterAuth] Trusted origins:", getTrustedOrigins(env));

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    trustedOrigins,
    secret: env.BETTER_AUTH_SECRET,
  });
};
