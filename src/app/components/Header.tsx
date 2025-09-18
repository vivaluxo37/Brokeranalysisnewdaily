'use client'

import { useState, useEffect } from 'react'
import { User, Search, Menu, X, Shield, Star, ChevronDown, ChevronRight, Globe, BookOpen, Calculator, Bell } from 'lucide-react'
import Link from 'next/link'
import SafeUserAuth from '@/components/auth/SafeUserAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  const menuItems = {
    brokers: {
      title: "Forex Brokers",
      icon: Shield,
      submenu: [
        {
          title: "By Country",
          items: [
            { name: "UK Brokers", href: "/brokers/uk" },
            { name: "USA Brokers", href: "/brokers/usa" },
            { name: "Australia Brokers", href: "/brokers/australia" },
            { name: "Canada Brokers", href: "/brokers/canada" },
            { name: "EU Brokers", href: "/brokers/eu" },
            { name: "Swiss Brokers", href: "/brokers/switzerland" },
            { name: "UAE Brokers", href: "/brokers/uae" },
            { name: "Singapore Brokers", href: "/brokers/singapore" }
          ]
        },
        {
          title: "By Regulation",
          items: [
            { name: "FCA Regulated", href: "/brokers/fca" },
            { name: "CySEC Regulated", href: "/brokers/cysec" },
            { name: "ASIC Regulated", href: "/brokers/asic" },
            { name: "FINMA Regulated", href: "/brokers/finma" },
            { name: "FSCA Regulated", href: "/brokers/fsca" }
          ]
        },
        {
          title: "By Trading Style",
          items: [
            { name: "ECN Brokers", href: "/brokers/ecn" },
            { name: "STP Brokers", href: "/brokers/stp" },
            { name: "Market Makers", href: "/brokers/market-makers" },
            { name: "Islamic Brokers", href: "/brokers/islamic" },
            { name: "Hedging Allowed", href: "/brokers/hedging" }
          ]
        },
        {
          title: "By Platform",
          items: [
            { name: "MetaTrader 4", href: "/brokers/mt4" },
            { name: "MetaTrader 5", href: "/brokers/mt5" },
            { name: "cTrader", href: "/brokers/ctrader" },
            { name: "Proprietary Platforms", href: "/brokers/proprietary" }
          ]
        },
        {
          title: "By Account Type",
          items: [
            { name: "Cent Accounts", href: "/brokers/cent-accounts" },
            { name: "Micro Accounts", href: "/brokers/micro-accounts" },
            { name: "VIP Accounts", href: "/brokers/vip-accounts" },
            { name: "Swap-Free Accounts", href: "/brokers/swap-free" }
          ]
        }
      ]
    },
    reviews: {
      title: "Reviews",
      icon: Star,
      submenu: [
        {
          title: "Broker Reviews",
          items: [
            { name: "Latest Reviews", href: "/reviews/latest" },
            { name: "Top Rated Brokers", href: "/reviews/top-rated" },
            { name: "User Reviews", href: "/reviews/user-reviews" },
            { name: "Expert Reviews", href: "/reviews/expert-reviews" },
            { name: "Broker Comparison", href: "/brokers/compare" }
          ]
        },
        {
          title: "Categories",
          items: [
            { name: "Beginner Friendly", href: "/reviews/beginner-friendly" },
            { name: "Advanced Traders", href: "/reviews/advanced" },
            { name: "Low Cost", href: "/reviews/low-cost" },
            { name: "High Leverage", href: "/reviews/high-leverage" },
            { name: "Fast Execution", href: "/reviews/fast-execution" }
          ]
        },
        {
          title: "Write Review",
          items: [
            { name: "Submit Review", href: "/reviews/submit" },
            { name: "Review Guidelines", href: "/reviews/guidelines" },
            { name: "Broker Rating System", href: "/reviews/rating-system" }
          ]
        }
      ]
    },
    education: {
      title: "Education",
      icon: BookOpen,
      submenu: [
        {
          title: "Getting Started",
          items: [
            { name: "Forex Basics", href: "/education/forex-basics" },
            { name: "How to Trade", href: "/education/how-to-trade" },
            { name: "Trading Terminology", href: "/education/terminology" },
            { name: "Risk Management", href: "/education/risk-management" },
            { name: "Trading Psychology", href: "/education/psychology" }
          ]
        },
        {
          title: "Technical Analysis",
          items: [
            { name: "Chart Patterns", href: "/education/chart-patterns" },
            { name: "Technical Indicators", href: "/education/indicators" },
            { name: "Candlestick Analysis", href: "/education/candlesticks" },
            { name: "Support & Resistance", href: "/education/support-resistance" },
            { name: "Trend Analysis", href: "/education/trend-analysis" }
          ]
        },
        {
          title: "Fundamental Analysis",
          items: [
            { name: "Economic Indicators", href: "/education/economic-indicators" },
            { name: "Central Banks", href: "/education/central-banks" },
            { name: "Market News", href: "/education/market-news" },
            { name: "Economic Calendar", href: "/education/economic-calendar" }
          ]
        },
        {
          title: "Trading Strategies",
          items: [
            { name: "Scalping", href: "/education/strategies/scalping" },
            { name: "Day Trading", href: "/education/strategies/day-trading" },
            { name: "Swing Trading", href: "/education/strategies/swing-trading" },
            { name: "Position Trading", href: "/education/strategies/position-trading" },
            { name: "Algorithmic Trading", href: "/education/strategies/algorithmic" }
          ]
        }
      ]
    },
    markets: {
      title: "Markets",
      icon: Globe,
      submenu: [
        {
          title: "Market Analysis",
          items: [
            { name: "Technical Analysis", href: "/markets/technical-analysis" },
            { name: "Fundamental Analysis", href: "/markets/fundamental-analysis" },
            { name: "Market Sentiment", href: "/markets/sentiment" },
            { name: "Economic Calendar", href: "/markets/economic-calendar" },
            { name: "Market Outlook", href: "/markets/outlook" }
          ]
        },
        {
          title: "Live Rates",
          items: [
            { name: "Forex Rates", href: "/markets/forex-rates" },
            { name: "Commodities", href: "/markets/commodities" },
            { name: "Indices", href: "/markets/indices" },
            { name: "Cryptocurrencies", href: "/markets/crypto" },
            { name: "Bonds", href: "/markets/bonds" }
          ]
        },
        {
          title: "News & Analysis",
          items: [
            { name: "Market News", href: "/markets/news" },
            { name: "Daily Analysis", href: "/markets/daily-analysis" },
            { name: "Weekly Outlook", href: "/markets/weekly-outlook" },
            { name: "Central Bank News", href: "/markets/central-bank-news" },
            { name: "Economic Reports", href: "/markets/economic-reports" }
          ]
        }
      ]
    },
    tools: {
      title: "Trading Tools",
      icon: Calculator,
      submenu: [
        {
          title: "Calculators",
          items: [
            { name: "Pip Calculator", href: "/tools/pip-calculator" },
            { name: "Margin Calculator", href: "/tools/margin-calculator" },
            { name: "Profit Calculator", href: "/tools/profit-calculator" },
            { name: "Swap Calculator", href: "/tools/swap-calculator" },
            { name: "Fibonacci Calculator", href: "/tools/fibonacci-calculator" }
          ]
        },
        {
          title: "Charts & Analysis",
          items: [
            { name: "Live Charts", href: "/tools/live-charts" },
            { name: "Economic Calendar", href: "/tools/economic-calendar" },
            { name: "Market Heatmap", href: "/tools/heatmap" },
            { name: "Currency Correlation", href: "/tools/correlation" },
            { name: "Volatility Calculator", href: "/tools/volatility" }
          ]
        },
        {
          title: "Trading Tools",
          items: [
            { name: "Pivot Points", href: "/tools/pivot-points" },
            { name: "Position Size Calculator", href: "/tools/position-size" },
            { name: "Risk Reward Calculator", href: "/tools/risk-reward" },
            { name: "Moving Average", href: "/tools/moving-average" },
            { name: "Currency Converter", href: "/tools/currency-converter" }
          ]
        }
      ]
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-white shadow-sm border-b border-gray-200'
    }`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </span>
              <select className="bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">📞 +1 (555) 123-4567</span>
              <span className="hidden sm:inline">✉️ support@brokeranalysis.com</span>
              <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </button>
              <SafeUserAuth />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 font-heading">BrokerAnalysis</span>
                  <span className="text-xs text-gray-500 -mt-1">Trusted Trading Platform</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {Object.entries(menuItems).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => toggleDropdown(key)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-xl hover:bg-blue-50/50 group"
                  >
                    <menu.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>{menu.title}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Modern Mega Menu Dropdown */}
                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 w-screen max-w-7xl bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200/50 rounded-2xl mt-2 z-50 animate-slide-up">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
                        {menu.submenu.map((section, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-blue-200 pb-3 text-blue-600">
                              {section.title}
                            </h3>
                            <div className="space-y-2">
                              {section.items.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  href={item.href}
                                  className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 px-3 py-2 rounded-lg transition-all duration-300 group"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <ChevronRight className="h-3 w-3 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                  <span className="group-hover:font-medium transition-all duration-300">{item.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Additional Menu Items */}
              <Link href="/promotions" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-xl hover:bg-blue-50/50">
                <span>Promotions</span>
              </Link>
              <Link href="/forum" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-xl hover:bg-blue-50/50">
                <span>Forum</span>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50/50"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors p-1"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-sm">Account</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                      <p className="text-xs text-gray-500">Sign in to access your account</p>
                    </div>
                    <div className="px-4 py-2">
                      <Link href="/sign-in" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Create Account
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/watchlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Watchlist
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-1"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-200/50 py-6 bg-white/95 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative flex bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search brokers, reviews, education, or tools..."
                      className="flex-1 px-6 py-4 pl-14 text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                    />
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                      Search
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="text-gray-500">Popular:</span>
                  <Link href="/brokers/etoro" className="text-blue-600 hover:text-blue-700">eToro</Link>
                  <Link href="/brokers/ic-markets" className="text-blue-600 hover:text-blue-700">IC Markets</Link>
                  <Link href="/education/forex-basics" className="text-blue-600 hover:text-blue-700">Forex Basics</Link>
                  <Link href="/tools/pip-calculator" className="text-blue-600 hover:text-blue-700">Pip Calculator</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-96 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {Object.entries(menuItems).map(([key, menu]) => (
              <div key={key} className="space-y-2">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <menu.icon className="h-4 w-4" />
                    <span>{menu.title}</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === key && (
                  <div className="ml-6 space-y-3">
                    {menu.submenu.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                          {section.title}
                        </h4>
                        <div className="space-y-1">
                          {section.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Additional Mobile Items */}
            <Link href="/promotions" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50">
              Promotions
            </Link>
            <Link href="/forum" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50">
              Forum
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}