import {
  createFileRoute,
  redirect,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signIn } from "../lib/auth-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/signin")({
  component: SignIn,
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.data?.user) {
      console.log("Redirecting to profile because user exists");
      throw redirect({ to: "/profile" });
    } else {
      console.log("No user found, staying on signin");
    }
  },
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), "Must include an uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must include a lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must include a number")
    .refine(
      (val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
      "Must include a special character"
    ),
});

type SigninFormSchema = z.infer<typeof signinSchema>;

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormSchema) => {
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Login failed");
        console.log(result.error.message);
        return;
      }

      toast.success("Logged in successfully!");
      router.navigate({ to: "/profile" });
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.log("Error during sign-in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to manage your secure links</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors glow-effect"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-20 bg-gray-400 border-t"></div>
            <span className="text-gray-400">New to Secure Link?</span>
            <div className="w-20 bg-gray-400 border-t"></div>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-700 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
