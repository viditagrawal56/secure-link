import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSession } from "../lib/auth-client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link2, Loader2, Lock, Users, Bell } from "lucide-react";

export const Route = createFileRoute("/shorten")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    url: "",
    isProtected: false,
    notifyOnAccess: false,
    authorizedEmails: "",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const shortenMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url: formData.url,
          isProtected: formData.isProtected,
          notifyOnAccess: formData.notifyOnAccess,
          authorizedEmails: formData.authorizedEmails
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL shortened successfully!");
      router.navigate({ to: "/profile" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Shorten Your Link
          </h1>
          <p className="text-lg text-gray-300">
            Transform your long URLs into short, memorable links with optional
            authentication
          </p>
        </div>

        <div className="glass-effect p-8 rounded-2xl shadow-lg">
          {session ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formData.url.trim()) {
                  toast.error("Please enter a URL");
                  return;
                }
                if (formData.isProtected && !formData.authorizedEmails.trim()) {
                  toast.error("Please enter at least one authorized email");
                  return;
                }
                shortenMutation.mutate();
              }}
              className="space-y-6"
            >
              {/* Original URL */}
              <div>
                <label className="block text-sm text-white mb-1">
                  <span className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-green-500" />
                    Original URL
                  </span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleFormChange}
                  className="w-full bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                  placeholder="https://example.com/very-long-url"
                  required
                />
              </div>

              {/* Notify on Access */}
              <div className="flex items-center gap-3">
                <input
                  id="notifyOnAccess"
                  type="checkbox"
                  name="notifyOnAccess"
                  checked={formData.notifyOnAccess}
                  onChange={handleFormChange}
                />
                <label
                  htmlFor="notifyOnAccess"
                  className="text-white flex items-center gap-1"
                >
                  <Bell className="h-4 w-4 text-green-500" />
                  Notify me on access
                </label>
              </div>

              {/* Require Email Authentication */}
              <div className="flex items-center gap-3">
                <input
                  id="isProtected"
                  type="checkbox"
                  name="isProtected"
                  checked={formData.isProtected}
                  onChange={handleFormChange}
                />
                <label
                  htmlFor="isProtected"
                  className="text-white flex items-center gap-1"
                >
                  <Lock className="h-4 w-4 text-green-500" />
                  Require Email Authentication
                </label>
              </div>

              {/* Authorized Emails */}
              {formData.isProtected && (
                <div>
                  <label className="block text-sm text-white mb-1">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Authorized Emails
                    </span>
                  </label>
                  <input
                    type="text"
                    name="authorizedEmails"
                    value={formData.authorizedEmails}
                    onChange={handleFormChange}
                    placeholder="user@example.com, another@example.com"
                    className="w-full bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={shortenMutation.isPending || !formData.url.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex justify-center items-center gap-2 disabled:bg-gray-600 transition-all"
              >
                {shortenMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create Short URL</>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center text-gray-300">
              Please{" "}
              <Link to="/signin" className="text-green-400 underline">
                sign in
              </Link>{" "}
              to shorten and manage your links.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
