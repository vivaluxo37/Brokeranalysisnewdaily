'use client'

import { ExternalLink, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">BrokerAnalysis.com</h3>
              <p className="text-gray-400 mb-6">
                Your trusted source for unbiased forex broker reviews, comparisons, and trading education.
                Find the perfect broker for your trading needs with our comprehensive analysis.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brokers Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Brokers</h4>
              <ul className="space-y-2">
                {footerLinks.brokers.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Education</h4>
              <ul className="space-y-2">
                {footerLinks.education.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Reviews</h4>
              <ul className="space-y-2">
                {footerLinks.reviews.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Regulatory Information */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h4 className="text-sm font-semibold mb-4">Regulatory Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {regulatoryInfo.map((reg) => (
                <div key={reg.name} className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">{reg.name}</div>
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

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-8">
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
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Powered by</span>
                <span className="text-white font-medium">BrokerAnalysis</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}