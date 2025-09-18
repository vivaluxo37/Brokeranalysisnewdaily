import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, Settings, TrendingUp, Users, BookOpen, Star } from "lucide-react";
import Footer from "@/app/components/Footer";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-900">
                BrokerAnalysis.com
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-8">
                <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/brokers" className="text-gray-600 hover:text-blue-600">
                  Brokers
                </Link>
                <Link href="/market-news" className="text-gray-600 hover:text-blue-600">
                  Market News
                </Link>
                <Link href="/portfolio" className="text-gray-600 hover:text-blue-600">
                  Portfolio
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Trader'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your trading dashboard with the latest market insights and broker analysis.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Brokers</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviews Written</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market News */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Latest Market News</h2>
              <p className="text-gray-600 mt-1">Stay updated with real-time market insights</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Fed Signals Dovish Stance</h3>
                    <p className="text-sm text-gray-600 mt-1">Federal Reserve indicates potential rate cuts amid economic concerns</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">EUR/USD Technical Analysis</h3>
                    <p className="text-sm text-gray-600 mt-1">Key support level at 1.0850, resistance at 1.0950</p>
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>
              </div>
              <Link href="/market-news" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all news →
              </Link>
            </div>
          </div>

          {/* Recommended Brokers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recommended Brokers</h2>
              <p className="text-gray-600 mt-1">Based on your trading preferences</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">FX</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">FP Markets</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(4)}<span className="text-gray-300">★</span>
                        </div>
                        <span className="text-xs text-gray-600 ml-1">(4.5)</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">IC</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">IC Markets</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(4)}<span className="text-gray-300">★</span>
                        </div>
                        <span className="text-xs text-gray-600 ml-1">(4.3)</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
              <Link href="/brokers" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                Browse all brokers →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}