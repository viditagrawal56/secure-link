import { useSession, signOut } from "../lib/auth-client";
import { Link, useLocation } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { LogOut, User, Home } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const location = useLocation();

  const currentPath = location.pathname;

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

  // Function to determine which buttons to show based on route and auth status
  const getNavigationButtons = () => {
    if (isPending) {
      return (
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        </div>
      );
    }

    if (session?.user) {
      // User is signed in - show different buttons based on route
      switch (currentPath) {
        case "/":
          return (
            <>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          );

        case "/shorten":
          return (
            <>
              <div className="hidden sm:flex items-center space-x-2 text-gray-300 text-sm">
                <User className="w-4 h-4" />
                <span>
                  {session.user.name?.split(" ")[0] ||
                    session.user.email?.split("@")[0]}
                </span>
              </div>

              <Link
                to="/"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Profile
              </Link>
            </>
          );

        case "/profile":
          return (
            <>
              <div className="hidden sm:flex items-center space-x-2 text-gray-300 text-sm">
                <User className="w-4 h-4" />
                <span>
                  {session.user.name?.split(" ")[0] ||
                    session.user.email?.split("@")[0]}
                </span>
              </div>

              <Link
                to="/"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          );

        default:
          return (
            <>
              <div className="hidden sm:flex items-center space-x-2 text-gray-300 text-sm">
                <User className="w-4 h-4" />
                <span>
                  {session.user.name?.split(" ")[0] ||
                    session.user.email?.split("@")[0]}
                </span>
              </div>

              <Link
                to="/"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          );
      }
    } else {
      // User is not signed in
      switch (currentPath) {
        case "/":
          return (
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
          );

        default:
          return (
            <>
              <Link
                to="/"
                className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </>
          );
      }
    }
  };

  return (
    <nav className="w-full z-50 glass-effect">
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

          {/* Dynamic Navigation Items */}
          <div className="flex items-center space-x-4">
            {getNavigationButtons()}
          </div>
        </div>
      </div>
    </nav>
  );
}
