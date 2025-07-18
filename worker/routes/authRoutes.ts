import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { auth } from "../auth";

const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

authRoutes.on(["POST", "GET"], "/**", async (c) => {
  const { method, url } = c.req;

  const startTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const pathname = new URL(url).pathname;

  try {
    console.log(`[Auth] ${method} ${pathname} - Start`);

    const authHandler = auth(c.env);
    const response = await authHandler.handler(c.req.raw);

    const duration = Math.round(
      (typeof performance !== "undefined" ? performance.now() : Date.now()) -
        startTime
    );
    console.log(`[Auth] ${method} ${pathname} - Success in ${duration}ms`);

    return response;
  } catch (err) {
    const duration = Math.round(
      (typeof performance !== "undefined" ? performance.now() : Date.now()) -
        startTime
    );

    if (err instanceof Error) {
      console.log(
        `[Auth] ${method} ${pathname} - Error after ${duration}ms:`,
        err.stack || err.message
      );
      return c.json(
        { error: "Authentication Error", message: err.message },
        500
      );
    } else {
      console.log(
        `[Auth] ${method} ${pathname} - Unknown error after ${duration}ms:`,
        err
      );
      return c.json(
        { error: "Authentication Error", message: "An unknown error occurred" },
        500
      );
    }
  }
});

export { authRoutes };
