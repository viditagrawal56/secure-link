import type { MiddlewareHandler } from "hono";
import { auth } from "../auth";
import type { Bindings, Variables } from "../types";

export const requireAuth: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: Variables;
}> = async (c: any, next: any) => {
  try {
    const authHandler = auth(c.env.DB);
    const session = await authHandler.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized: No valid session found" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);
    await next();
  } catch (err) {
    if (err instanceof Error) {
      console.log("Authentication error:", err);
      return c.json(
        { error: "Unauthorized: Authentication failure", message: err.message },
        401
      );
    } else {
      console.log("Unknown authentication error:", err);
      return c.json(
        {
          error: "Unauthorized: Authentication failure",
          message: "An unknown error occurred",
        },
        401
      );
    }
  }
};
