import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { auth } from "../auth";

const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

authRoutes.on(["POST", "GET"], "/**", async (c) => {
  try {
    const authHandler = auth(c.env.DB);
    return await authHandler.handler(c.req.raw);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error during authentication:", err);
      return c.json(
        { error: "Authentication Error", message: err.message },
        500
      );
    } else {
      console.log("Unknown error during authentication:", err);
      return c.json(
        { error: "Authentication Error", message: "An unknown error occurred" },
        500
      );
    }
  }
});

export { authRoutes };
