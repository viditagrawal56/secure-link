import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signOut, useSession } from "../lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Copy, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { queryClient } from "../lib/query-client";

export const Route = createFileRoute("/profile")({
  component: Profile,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.data == null) throw redirect({ to: "/signin" });
  },
});

interface ShortUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

function Profile() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();

  const {
    data: urls = [],
    isLoading: urlsLoading,
    refetch,
  } = useQuery<ShortUrl[]>({
    queryKey: ["urls"],
    queryFn: async () => {
      const response = await fetch("/api/urls", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch URLs");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/urls/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete URL");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      refetch();
      toast.success("URL deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = async () => {
    try {
      await signOut();
      router.navigate({ to: "/signin" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      deleteMutation.mutate(id);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <div className="glass-effect max-w-2xl mx-auto shadow-md rounded-lg p-8 mb-10">
        <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <div className="mt-1 text-gray-900 font-medium border border-gray-200 rounded px-4 py-2 bg-gray-100">
              {user.name}
            </div>
          </div>
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
              Back to Home
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

      {/* URLs Section */}
      <div className="glass-effect max-w-4xl mx-auto rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Shortened URLs</h2>
          <span className="text-gray-300 text-sm">
            {urls.length} URL{urls.length !== 1 ? "s" : ""}
          </span>
        </div>

        {urlsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-300">Loading URLs...</span>
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              You haven't created any short URLs yet.
            </p>
            <Link
              to="/shorten"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Your First URL
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => (
              <div
                key={url.id}
                className="bg-white bg-opacity-10 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono text-sm font-medium"
                      >
                        {url.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="text-gray-400 hover:text-gray-300 p-1"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <span>Original URL: </span>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono"
                      >
                        {url.originalUrl}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm gap-4 ml-4">
                    <span>Created: {formatDate(url.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDelete(url.id)}
                    className="text-red-500 hover:text-red-400 p-1"
                    title="Delete URL"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 p-1"
                    title="Visit URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
