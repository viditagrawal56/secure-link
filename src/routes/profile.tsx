import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signOut, useSession } from "../lib/auth-client";

export const Route = createFileRoute("/profile")({
  component: Profile,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.data == null) throw redirect({ to: "/signin" });
  },
});

function Profile() {
  const { data: session, isPending, error } = useSession();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.navigate({ to: "/signin" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Error loading session or not signed in.
        </p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="glass-effect max-w-2xl mx-auto  shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <div className="mt-1 text-gray-900 font-medium border border-gray-200 rounded px-4 py-2 bg-gray-100">
              {user.name}
            </div>
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-white">
              Email
            </label>
            <div className="mt-1 text-gray-900 font-medium border border-gray-200 rounded px-4 py-2 bg-gray-100">
              {user.email}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
            >
              <button>Back to Home</button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
