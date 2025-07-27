import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signUp } from "../lib/auth-client";
import { PasswordValidation } from "../components/PasswordValidation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { CheckCircle, Lock, Mail, User, XCircle } from "lucide-react";
import { useState } from "react";
import { handleAuthError, handleAuthSuccess } from "../utils/auth-utils";
import { passwordSchema } from "../components/PasswordValidation";

export const Route = createFileRoute("/signup")({
  component: SignupForm,
  beforeLoad: async () => {
    const session = await getSession();
    console.log("Session object:", session);
    console.log("Session data:", session?.data);
    console.log("Session user:", session?.data?.user);
    if (session?.data?.user) {
      console.log("Redirecting to profile because user exists");
      throw redirect({ to: "/profile" });
    } else {
      console.log("No user found, staying on signup");
    }
  },
});

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(40, "Name cannot be greater than 40 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormSchema = z.infer<typeof signupSchema>;

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupSchema),
  });

  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: SignupFormSchema) => {
    setIsLoading(true);

    try {
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => handleAuthSuccess("Account created successfully!"),
          onError: handleAuthError,
        }
      );
      router.navigate({ to: "/profile" });
    } catch (err) {
      toast.error("Unexpected error during sign-up");
      console.error("Unexpected error during sign-up:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-400">
              Join thousands of users managing secure links
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="name"
                  disabled={isLoading}
                  {...register("name")}
                  placeholder="john doe"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-700"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  type="email"
                  disabled={isLoading}
                  {...register("email")}
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
                  type="password"
                  disabled={isLoading}
                  {...register("password")}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={
                    "w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  }
                />
              </div>
              <PasswordValidation password={password} />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
              </div>
              {confirmPassword && password === confirmPassword ? (
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" /> Passwords match
                </p>
              ) : confirmPassword ? (
                <p className="text-sm text-red-400 flex items-center mt-1">
                  <XCircle className="w-4 h-4 mr-1" /> Passwords do not match
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isLoading || password != confirmPassword}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors glow-effect"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-green-500 hover:text-green-400 transition-colors underline underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
