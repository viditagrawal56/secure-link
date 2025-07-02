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
  component: RouteComponent,
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

const loginSchema = z.object({
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

type LoginFormSchema = z.infer<typeof loginSchema>;

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully!");
      router.navigate({ to: "/profile" });
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50">
  //     <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
  //       <div className="text-center">
  //         <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
  //           Welcome Back
  //         </h2>
  //         <p className="mt-2 text-sm text-gray-600">
  //           Sign in to your account to manage your secure links
  //         </p>
  //       </div>

  //       <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
  //         {/* Email */}
  //         <div>
  //           <label
  //             htmlFor="email"
  //             className="block text-sm font-medium text-gray-700 mb-1"
  //           >
  //             Email Address
  //           </label>
  //           <div className="relative">
  //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  //               <Mail className="h-5 w-5 text-gray-400" />
  //             </div>
  //             <input
  //               id="email"
  //               type="email"
  //               autoComplete="email"
  //               {...register("email")}
  //               disabled={isLoading}
  //               placeholder="you@example.com"
  //               className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
  //             />
  //           </div>
  //           {errors.email && (
  //             <p className="text-sm text-red-600 mt-1">
  //               {errors.email.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Password */}
  //         <div>
  //           <label
  //             htmlFor="password"
  //             className="block text-sm font-medium text-gray-700 mb-1"
  //           >
  //             Password
  //           </label>
  //           <div className="relative">
  //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  //               <Lock className="h-5 w-5 text-gray-400" />
  //             </div>
  //             <input
  //               id="password"
  //               type="password"
  //               autoComplete="current-password"
  //               {...register("password")}
  //               disabled={isLoading}
  //               placeholder="••••••••"
  //               className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
  //             />
  //           </div>
  //           {errors.password && (
  //             <p className="text-sm text-red-600 mt-1">
  //               {errors.password.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Submit */}
  //         <div>
  //           <button
  //             type="submit"
  //             disabled={isLoading}
  //             className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all font-medium text-sm shadow-sm disabled:opacity-70"
  //           >
  //             {isLoading ? (
  //               <span className="flex items-center">
  //                 <svg
  //                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <circle
  //                     className="opacity-25"
  //                     cx="12"
  //                     cy="12"
  //                     r="10"
  //                     stroke="currentColor"
  //                     strokeWidth="4"
  //                   ></circle>
  //                   <path
  //                     className="opacity-75"
  //                     fill="currentColor"
  //                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
  //                   ></path>
  //                 </svg>
  //                 Signing in...
  //               </span>
  //             ) : (
  //               <span className="flex items-center">
  //                 Sign in
  //                 <ArrowRight className="ml-2 h-4 w-4" />
  //               </span>
  //             )}
  //           </button>
  //         </div>
  //       </form>

  //       <div className="mt-6">
  //         <div className="relative">
  //           <div className="absolute inset-0 flex items-center">
  //             <div className="w-full border-t border-gray-300" />
  //           </div>
  //           <div className="relative flex justify-center text-sm">
  //             <span className="px-2 bg-white text-gray-500">
  //               New to SecureLink?
  //             </span>
  //           </div>
  //         </div>

  //         <div className="mt-6">
  //           <Link
  //             to="/signup"
  //             className="w-full flex justify-center py-3 px-4 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  //           >
  //             Create an account
  //           </Link>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="mt-8 text-center text-sm text-gray-600">
  //       <p>
  //         By signing in, you agree to our{" "}
  //         <a
  //           href="#"
  //           className="font-medium text-indigo-600 hover:text-indigo-500"
  //         >
  //           Terms of Service
  //         </a>{" "}
  //         and{" "}
  //         <a
  //           href="#"
  //           className="font-medium text-indigo-600 hover:text-indigo-500"
  //         >
  //           Privacy Policy
  //         </a>
  //       </p>
  //     </div>
  //   </div>
  // );

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
