import type { Session, User } from "better-auth";

export type Variables = {
  user: User;
  session: Session;
};

export type Bindings = {
  ASSETS: Fetcher;
  DB: D1Database;
  URL_CACHE: KVNamespace;
  RESEND_API_KEY: string;
  VITE_BASE_URL: string;
  CLOUDFLARE_ENV: string;
  BETTER_AUTH_SECRET: string;
};
