import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSession } from "../lib/auth-client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Copy, ExternalLink, Loader2 } from "lucide-react";

export const Route = createFileRoute("/shorten")({
  component: RouteComponent,
});

interface ShortenResponse {
  id: string;
  originalUrl: string;
  isProtected?: boolean;
  shortUrl: string;
  createdAt: string;
}

function RouteComponent() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<ShortenResponse | null>(
    null
  );
  const [isProtected, setIsProtected] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const shortenMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url,
          isProtected,
          authorizedEmails: authorizedEmails
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to shorten URL");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setShortenedUrl(data);
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL shortened successfully!");
      router.navigate({ to: "/profile" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Add protocol if missing
    let formattedUrl = url.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    shortenMutation.mutate(formattedUrl);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg">
            Shorten your URLs quickly and track their performance
          </p>
        </div>
        <div className="text-center mb-8">
          {session ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-green-400">
                Welcome, {session.user.name}!
              </span>
              <Link
                to="/profile"
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                View Profile
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-400">
                Sign in to save and manage your links
              </span>
              <Link
                to="/signin"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* URL Shortening Form */}
        {session && (
          <div className="glass-effect max-w-2xl mx-auto p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Shorten Your URL
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Enter URL to shorten
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={shortenMutation.isPending}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isProtected"
                  type="checkbox"
                  checked={isProtected}
                  onChange={(e) => setIsProtected(e.target.checked)}
                />
                <label htmlFor="isProtected" className="text-white">
                  Make this URL protected
                </label>
              </div>
              {isProtected && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Authorized Emails (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={authorizedEmails}
                    onChange={(e) => setAuthorizedEmails(e.target.value)}
                    placeholder="user1@example.com, user2@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={shortenMutation.isPending || !url.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 glow-effect"
              >
                {shortenMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  "Shorten URL"
                )}
              </button>
            </form>

            {/* Result */}
            {shortenedUrl && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  URL Shortened Successfully!
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-700 font-medium">
                      Short URL:
                    </span>
                    <a
                      href={shortenedUrl.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                    >
                      {shortenedUrl.shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(shortenedUrl.shortUrl)}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={shortenedUrl.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Original URL:</span>{" "}
                    <a
                      href={shortenedUrl.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                    >
                      {shortenedUrl.originalUrl}
                    </a>
                  </div>
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Security:</span>{" "}
                    <span className="font-mono">
                      {shortenedUrl.isProtected ? "Protected" : "Public"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
