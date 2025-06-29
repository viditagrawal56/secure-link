import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/auth-client";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) throw redirect({ to: "/signin" });
  },
});

function RouteComponent() {
  return <div>Hello "/profile"!</div>;
}
