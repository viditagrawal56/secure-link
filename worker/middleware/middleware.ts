import type { MiddlewareHandler } from "hono";
import { auth } from "../auth";
import type { Bindings, Variables } from "../types";

export const requireAuth: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: Variables;
}> = async (c: any, next: any) => {
  const authHandler = auth(c.env.DB);
  const session = await authHandler.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
};
