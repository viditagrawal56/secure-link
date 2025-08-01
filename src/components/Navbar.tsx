import { useSession, signOut } from "../lib/auth-client";
import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      router.navigate({ to: "/" });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-green-400 transition-colors cursor-pointer"
            >
              Secure Link
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
              </div>
            ) : session?.user ? (
              <>
                <button>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
                  >
                    Profile
                  </Link>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
