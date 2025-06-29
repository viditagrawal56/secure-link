import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/auth-client";

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (session) throw redirect({ to: "/profile" });
  },
});

function RouteComponent() {
  return <div>Hello "/signin"!</div>;
}
