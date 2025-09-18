'use client'

import { ExternalLink, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Shield } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
  ],
  brokers: [
    { name: 'All Brokers', href: '/brokers' },
    { name: 'ECN Brokers', href: '/brokers/ecn' },
    { name: 'STP Brokers', href: '/brokers/stp' },
    { name: 'Market Makers', href: '/brokers/market-makers' },
    { name: 'Islamic Brokers', href: '/brokers/islamic' },
  ],
  education: [
    { name: 'Forex Basics', href: '/education/forex-basics' },
    { name: 'Technical Analysis', href: '/education/technical-analysis' },
    { name: 'Risk Management', href: '/education/risk-management' },
    { name: 'Trading Strategies', href: '/education/strategies' },
    { name: 'Glossary', href: '/education/glossary' },
  ],
  reviews: [
    { name: 'Latest Reviews', href: '/reviews' },
    { name: 'Top Rated Brokers', href: '/reviews/top-rated' },
    { name: 'User Reviews', href: '/reviews/user-reviews' },
    { name: 'Expert Reviews', href: '/reviews/expert-reviews' },
    { name: 'Write a Review', href: '/reviews/write' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'AML Policy', href: '/aml' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Live Chat', href: '/chat' },
    { name: 'Contact Support', href: '/support' },
    { name: 'Feedback', href: '/feedback' },
  ],
}

const regulatoryInfo = [
  { name: 'FCA', description: 'Financial Conduct Authority' },
  { name: 'CySEC', description: 'Cyprus Securities and Exchange Commission' },
  { name: 'ASIC', description: 'Australian Securities and Investments Commission' },
  { name: 'FINMA', description: 'Financial Market Supervisory Authority' },
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/brokeranalysis' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/brokeranalysis' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/brokeranalysis' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/brokeranalysis' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/brokeranalysis' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading">BrokerAnalysis.com</h3>
                  <p className="text-xs text-gray-400">Trusted Trading Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted source for unbiased forex broker reviews, AI-powered comparisons, and comprehensive trading education.
                Find the perfect broker for your trading needs with our advanced analysis platform.
              </p>

              {/* Enhanced Newsletter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-blue-300">Stay Updated</h4>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative flex bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-gray-400"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-blue-300">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brokers Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-blue-300">Brokers</h4>
              <ul className="space-y-3">
                {footerLinks.brokers.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-blue-300">Education</h4>
              <ul className="space-y-3">
                {footerLinks.education.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-blue-300">Reviews</h4>
              <ul className="space-y-3">
                {footerLinks.reviews.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced Regulatory Information */}
          <div className="mt-12 pt-8 border-t border-gray-800/50">
            <h4 className="text-sm font-semibold mb-6 text-blue-300">Regulatory Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {regulatoryInfo.map((reg) => (
                <div key={reg.name} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                  <div className="text-sm font-medium mb-1 text-white group-hover:text-blue-300 transition-colors duration-300">{reg.name}</div>
                  <div className="text-xs text-gray-400">{reg.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-gray-400">support@brokeranalysis.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-gray-400">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Office</div>
                  <div className="text-sm text-gray-400">New York, NY 10001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Footer */}
      <div className="relative bg-black/20 backdrop-blur-sm py-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 BrokerAnalysis.com. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-blue-300 transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Powered by</span>
                <span className="text-white font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">BrokerAnalysis</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}