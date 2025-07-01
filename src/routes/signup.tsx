import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { getSession, signUp } from "../lib/auth-client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormSchema = z.infer<typeof signupSchema>;

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: SignupFormSchema) => {
    setIsLoading(true);

    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Sign up failed");
        return;
      }

      toast.success("Account created successfully!");
      router.navigate({ to: "/profile" });
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
  //     <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-indigo-100">
  //       <h2 className="text-3xl font-bold text-center text-indigo-600">
  //         Create Account
  //       </h2>
  //       <p className="text-center text-sm text-gray-600 mb-6">
  //         Join SecureLink to create and manage protected short URLs
  //       </p>

  //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  //         {/* Name */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Name
  //           </label>
  //           <input
  //             type="name"
  //             disabled={isLoading}
  //             {...register("name")}
  //             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
  //             placeholder="john doe"
  //           />
  //           {errors.name && (
  //             <p className="text-sm text-red-600">{errors.name.message}</p>
  //           )}
  //         </div>
  //         {/* Email */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Email
  //           </label>
  //           <input
  //             type="email"
  //             disabled={isLoading}
  //             {...register("email")}
  //             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
  //             placeholder="you@example.com"
  //           />
  //           {errors.email && (
  //             <p className="text-sm text-red-600">{errors.email.message}</p>
  //           )}
  //         </div>

  //         {/* Password */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Password
  //           </label>
  //           <input
  //             type="password"
  //             disabled={isLoading}
  //             {...register("password")}
  //             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
  //             placeholder="••••••••"
  //           />
  //           {errors.password && (
  //             <p className="text-sm text-red-600">{errors.password.message}</p>
  //           )}
  //         </div>

  //         {/* Confirm Password */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Confirm Password
  //           </label>
  //           <input
  //             type="password"
  //             disabled={isLoading}
  //             {...register("confirmPassword")}
  //             className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
  //             placeholder="••••••••"
  //           />
  //           {errors.confirmPassword && (
  //             <p className="text-sm text-red-600">
  //               {errors.confirmPassword.message}
  //             </p>
  //           )}
  //           {confirmPassword && password === confirmPassword ? (
  //             <p className="text-sm text-green-600 flex items-center mt-1">
  //               <CheckCircle className="w-4 h-4 mr-1" /> Passwords match
  //             </p>
  //           ) : confirmPassword ? (
  //             <p className="text-sm text-red-600 flex items-center mt-1">
  //               <XCircle className="w-4 h-4 mr-1" /> Passwords do not match
  //             </p>
  //           ) : null}
  //         </div>

  //         {/* Submit Button */}
  //         <button
  //           type="submit"
  //           disabled={isLoading}
  //           className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
  //         >
  //           {isLoading ? "Creating account..." : "Create account"}
  //         </button>
  //       </form>

  //       <div className="mt-6 text-center text-sm">
  //         Already have an account?{" "}
  //         <a href="/login" className="text-indigo-600 hover:underline">
  //           Sign in
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // );
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
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
