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

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white cursor-pointer">
                <Link to="/">Secure Link</Link>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Secure Your
              <span className="text-green-500 block">Short Links</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create protected short links with email verification, track visits,
            and get notified when someone accesses your content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center glow-effect"
            >
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="glass-effect rounded-xl p-8 hover:scale-105 transition-transform">
              <Lock className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Protected Links
              </h3>
              <p className="text-gray-400">
                Control who can access your links with email verification
              </p>
            </div>
            <div className="glass-effect rounded-xl p-8 hover:scale-105 transition-transform">
              <Bell className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Smart Notifications
              </h3>
              <p className="text-gray-400">
                Get notified when someone visits your protected links
              </p>
            </div>
            <div className="glass-effect rounded-xl p-8 hover:scale-105 transition-transform">
              <BarChart3 className="h-12 w-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Analytics
              </h3>
              <p className="text-gray-400">
                Track clicks and monitor your link performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Secure Link?
            </h2>
            <p className="text-xl text-gray-300">
              Advanced features for modern link management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Email Protection
                    </h3>
                    <p className="text-gray-400">
                      Only authorized emails can access your protected links
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Public & Private
                    </h3>
                    <p className="text-gray-400">
                      Choose between public links or protected ones
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-400">
                      Quick redirects with minimal latency
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-2xl p-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-500 font-mono">
                    securelink.app/abc1234
                  </span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                    Protected
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">
              Simple steps to create and protect your links
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Creator Flow */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                For Link Creators
              </h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Sign Up & Create Account
                    </h4>
                    <p className="text-gray-400">
                      Register with your email and create a secure account to
                      manage your links.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Create Protected Link
                    </h4>
                    <p className="text-gray-400">
                      Enter your long URL and specify authorized email addresses
                      for access control.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Share & Monitor
                    </h4>
                    <p className="text-gray-400">
                      Share your secure short link and receive notifications
                      when authorized users visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visitor Flow */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                For Link Visitors
              </h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Click Protected Link
                    </h4>
                    <p className="text-gray-400">
                      Click on the secure short link shared with you by the
                      creator.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Enter Your Email
                    </h4>
                    <p className="text-gray-400">
                      Provide your email address to verify you're authorized to
                      access the content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Access Content
                    </h4>
                    <p className="text-gray-400">
                      If authorized, you'll be instantly redirected to the
                      original content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="mt-16 glass-effect rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
              <div className="text-center">
                <div className="bg-green-600 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <p className="text-white font-semibold">
                  Create Protected Link
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="bg-green-600 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <p className="text-white font-semibold">
                  Visitor Email Verification
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="bg-green-600 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <p className="text-white font-semibold">
                  Secure Access Granted
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Links?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust Secure Link
          </p>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center glow-effect"
          >
            Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold text-white">Secure Link</span>
          </div>
          <p className="text-gray-400">
            © 2025 Secure Link. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
