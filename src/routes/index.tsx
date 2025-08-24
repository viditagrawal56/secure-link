import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Globe,
  Lock,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen gradient-bg">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <section className="pb-16 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Your
              <span className="text-green-500 block">Short Links</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl sm:max-w-3xl mx-auto">
            Create protected short links with email verification, track visits,
            and get notified when someone accesses your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-colors flex items-center justify-center glow-effect text-base sm:text-lg"
            >
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20">
            <div className="glass-effect rounded-xl p-6 sm:p-8 hover:scale-105 transition-transform">
              <Lock className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Protected Links
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Control who can access your links with email verification
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6 sm:p-8 hover:scale-105 transition-transform">
              <Bell className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Smart Notifications
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Get notified when someone visits your protected links
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6 sm:p-8 hover:scale-105 transition-transform">
              <BarChart3 className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Analytics
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Track clicks and monitor your link performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              Why Choose Secure Link?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Advanced features for modern link management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                      Email Protection
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Only authorized emails can access your protected links
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                      Public & Private
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Choose between public links or protected ones
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Quick redirects with minimal latency
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-2xl p-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <span className="text-green-500 font-mono">
                    securelink.app/abc1234
                  </span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm w-fit">
                    Protected
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <div>Original: https://example.com/very-very-long-url</div>
                  <div>Authorized: 3 emails</div>
                  <div>Clicks: 127</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 sm:py-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Simple steps to create and protect your links
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Creator Flow */}
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-5 sm:mb-8 text-center">
                For Link Creators
              </h3>
              <div className="space-y-6 sm:space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                        {
                          [
                            "Sign Up & Create Account",
                            "Create Protected Link",
                            "Share & Monitor",
                          ][i]
                        }
                      </h4>
                      <p className="text-gray-400 text-sm sm:text-base">
                        {
                          [
                            "Register with your email and create a secure account to manage your links.",
                            "Enter your long URL and specify authorized email addresses for access control.",
                            "Share your secure short link and receive notifications when authorized users visit.",
                          ][i]
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Flow */}
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-5 sm:mb-8 text-center">
                For Link Visitors
              </h3>
              <div className="space-y-6 sm:space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                        {
                          [
                            "Click Protected Link",
                            "Enter Your Email",
                            "Access Content",
                          ][i]
                        }
                      </h4>
                      <p className="text-gray-400 text-sm sm:text-base">
                        {
                          [
                            "Click on the secure short link shared with you by the creator.",
                            "Provide your email address to verify you're authorized to access the content.",
                            "If authorized, you'll be instantly redirected to the original content.",
                          ][i]
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="mt-10 sm:mt-16 glass-effect rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
              <div className="text-center flex-1">
                <div className="bg-green-600 p-4 rounded-full mb-2 sm:mb-4 mx-auto w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  Create Protected Link
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 rotate-90 md:rotate-0 flex-shrink-0" />
              <div className="text-center flex-1">
                <div className="bg-green-600 p-4 rounded-full mb-2 sm:mb-4 mx-auto w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                  <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  Visitor Email Verification
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 rotate-90 md:rotate-0 flex-shrink-0" />
              <div className="text-center flex-1">
                <div className="bg-green-600 p-4 rounded-full mb-2 sm:mb-4 mx-auto w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  Secure Access Granted
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6">
            Ready to Secure Your Links?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
            Join thousands of users who trust Secure Link
          </p>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-colors inline-flex items-center glow-effect text-base sm:text-lg"
          >
            Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 sm:py-12 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <span className="text-lg sm:text-xl font-bold text-white">
              Secure Link
            </span>
          </div>
          <p className="text-xs sm:text-base text-gray-400">
            © 2025 Secure Link. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default Home;
