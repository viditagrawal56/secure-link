import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signOut, useSession } from "../lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Copy,
  ExternalLink,
  Trash2,
  LogOut,
  Link2,
  Unlock,
  Lock,
  Plus,
  Check,
  Home,
} from "lucide-react";
import { queryClient } from "../lib/query-client";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: Profile,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.data == null) throw redirect({ to: "/signin" });
  },
});

interface ShortUrl {
  id: string;
  originalUrl: string;
  notifyOnAccess?: boolean;
  isProtected?: boolean;
  shortUrl: string;
  createdAt: string;
}

function Profile() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: urls = [], refetch } = useQuery<ShortUrl[]>({
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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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
  const total = urls.length;
  const protectedCount = urls.filter((url) => url.isProtected).length;
  const publicCount = total - protectedCount;
  return (
    <div className="min-h-screen py-8 sm:py-12 px-2 sm:px-4 text-white">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-4xl font-bold text-white bg-clip-text">
            Welcome, {user.name || "User"}
          </h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Link
              to="/"
              className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-effect p-4 sm:p-6 rounded-lg flex items-center space-x-4">
            <Link2 className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-base sm:text-lg font-semibold">Total URLs</p>
              <p className="text-gray-400">{total}</p>
            </div>
          </div>
          <div className="glass-effect p-4 sm:p-6 rounded-lg flex items-center space-x-4">
            <Unlock className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-base sm:text-lg font-semibold">Public URLs</p>
              <p className="text-gray-400">{publicCount}</p>
            </div>
          </div>
          <div className="glass-effect p-4 sm:p-6 rounded-lg flex items-center space-x-4">
            <Lock className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-base sm:text-lg font-semibold">
                Protected URLs
              </p>
              <p className="text-gray-400">{protectedCount}</p>
            </div>
          </div>
        </div>

        {/* URL Table */}
        <div className="glass-effect rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Your Shortened URLs
            </h2>
            <Link
              to="/shorten"
              className="flex items-center px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create URL
            </Link>
          </div>

          {urls.length === 0 ? (
            <p className="text-gray-400 text-center py-6">
              You haven’t created any URLs yet.
            </p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Short URL</th>
                      <th className="px-4 py-3">Original URL</th>
                      <th className="px-4 py-3">Security</th>
                      <th className="px-4 py-3">Notifications</th>
                      <th className="px-4 py-3">Created At</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-200">
                    {urls.map((url) => (
                      <tr
                        key={url.id}
                        className="border-b border-gray-700 hover:bg-gray-900 transition"
                      >
                        <td className="px-4 py-3 font-mono text-green-400 truncate max-w-xs">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {url.shortUrl}
                          </a>
                        </td>
                        <td className="px-4 py-3 truncate max-w-xs">
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {url.originalUrl}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          {url.isProtected ? (
                            <span className="text-yellow-400">Protected</span>
                          ) : (
                            <span className="text-green-400">Public</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {url.notifyOnAccess ? (
                            <span className="text-yellow-400">Enabled</span>
                          ) : (
                            <span className="text-green-400">Disabled</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {formatDate(url.createdAt)}
                        </td>
                        <td className="px-4 py-3 flex space-x-3">
                          <button
                            onClick={() =>
                              copyToClipboard(url.shortUrl, url.id)
                            }
                            className="text-gray-400 hover:text-green-400"
                            title="Copy URL"
                          >
                            {copiedId === url.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400"
                            title="Visit"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(url.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-900 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-300">
                        Short:
                      </span>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-green-400 truncate max-w-[12rem] hover:underline"
                      >
                        {url.shortUrl}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-300">
                        Original:
                      </span>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 truncate max-w-[12rem] hover:underline"
                      >
                        {url.originalUrl}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span>
                        <span className="font-semibold text-gray-400">
                          Security:{" "}
                        </span>
                        {url.isProtected ? (
                          <span className="text-yellow-400">Protected</span>
                        ) : (
                          <span className="text-green-400">Public</span>
                        )}
                      </span>
                      <span>
                        <span className="font-semibold text-gray-400">
                          Notify:{" "}
                        </span>
                        {url.notifyOnAccess ? (
                          <span className="text-yellow-400">Enabled</span>
                        ) : (
                          <span className="text-green-400">Disabled</span>
                        )}
                      </span>
                      <span>
                        <span className="font-semibold text-gray-400">
                          Created:{" "}
                        </span>
                        <span className="text-gray-400">
                          {formatDate(url.createdAt)}
                        </span>
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl, url.id)}
                        className="text-gray-400 hover:text-green-400"
                        title="Copy URL"
                      >
                        {copiedId === url.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400"
                        title="Visit"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(url.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
