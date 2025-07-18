import { betterAuth, type Logger } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import type { Bindings } from "./types";

export const auth = (env: Bindings) => {
  const db = env.DB;
  const isDev = env.CLOUDFLARE_ENV === "development";

  const getTrustedOrigins = (): string[] => {
    return isDev
      ? ["http://localhost:8787", "http://127.0.0.1:8787"]
      : [env.VITE_BASE_URL];
  };

  if (!env.VITE_BASE_URL && !isDev) {
    console.log("VITE_BASE_URL is required in staging/production");
    throw new Error("VITE_BASE_URL is required in staging/production");
  }

  //TODO: Logging for easier debugging, remove it later or cap it to dev env
  console.log("[BetterAuth] Trusted origins:", getTrustedOrigins());

  const logger_config: Logger = {
    disabled: false,
    level: "debug",
    log: (level, message, ...args) => {
      console.log(`[BetterAuth][${level.toUpperCase()}]`, message, ...args);
    },
  };

  return betterAuth({
    database: drizzleAdapter(drizzle(db, { schema }), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    trustedOrigins: getTrustedOrigins(),
    logger: logger_config,
    secret: env.BETTER_AUTH_SECRET,
    onAPIError: {
      // Don't throw errors - handle them gracefully
      throw: false,

      // Custom error handler for logging
      onError: async (error: unknown) => {
        const timestamp = new Date().toISOString();

        if (error instanceof Error) {
          console.error(`[BetterAuth Error] ${timestamp}`, {
            message: error.message,
            stack: error.stack,
          });
        } else {
          console.error(`[BetterAuth Unknown Error] ${timestamp}`, error);
        }
      },
    },
  });
};
