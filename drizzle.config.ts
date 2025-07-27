import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return url;
  } catch (err) {
    console.log(`Error  ${err}`);
    throw new Error(
      "Failed to locate local D1 database. Ensure Wrangler has initialized the database."
    );
  }
}

function getEnvironmentConfig() {
  const env = required("CLOUDFLARE_ENV");
  console.log("drizzle-config env", env);
  switch (env) {
    case "production":
      return {
        driver: "d1-http" as const,
        dbCredentials: {
          accountId: required("CLOUDFLARE_ACCOUNT_ID"),
          databaseId: required("CLOUDFLARE_DATABASE_ID_PROD"),
          token: required("CLOUDFLARE_D1_TOKEN"),
        },
      };
    case "staging":
      return {
        driver: "d1-http" as const,
        dbCredentials: {
          accountId: required("CLOUDFLARE_ACCOUNT_ID"),
          databaseId: required("CLOUDFLARE_DATABASE_ID_STAGING"),
          token: required("CLOUDFLARE_D1_TOKEN"),
        },
      };
    default: // development
      return {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      };
  }
}

export default defineConfig({
  out: "./drizzle",
  schema: "./worker/db/schema.ts",
  dialect: "sqlite",
  ...getEnvironmentConfig(),
});
