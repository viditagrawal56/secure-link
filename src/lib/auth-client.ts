import { createAuthClient } from "better-auth/react";

const baseURL = import.meta.env.VITE_BASE_URL;
console.log("[AUTH CLIENT] base url is:", baseURL);
if (!baseURL) {
  throw new Error("VITE_BASE_URL is not defined");
}

export const authClient = createAuthClient({
  baseURL, //TODO: Add the worker domain
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
