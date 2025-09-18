// Clerk configuration for Next.js
// This file provides centralized Clerk configuration

export const clerkConfig = {
  // Development mode
  development: process.env.NODE_ENV === 'development',

  // Frontend API URL
  frontendApi: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.replace('pk_', '').split('$')[0],

  // Domain configuration
  domain: 'actual-shark-31.clerk.accounts.dev',

  // Proxy URL if needed
  proxyUrl: process.env.NEXT_PUBLIC_CLERK_PROXY_URL,

  // Satellite configuration
  isSatellite: false,

  // SDK configuration
  sdkConfiguration: {
    // Debug mode
    debug: process.env.NODE_ENV === 'development',

    // Support information
    supportEmail: 'support@brokeranalysis.com',
    helpPageUrl: 'https://brokeranalysis.com/help',
    termsPageUrl: 'https://brokeranalysis.com/terms',
    privacyPageUrl: 'https://brokeranalysis.com/privacy',
  },

  // Session handling
  session: {
    singleSessionMode: true,
    timeoutInMinutes: 60,
  },

  // Telemetry
  telemetry: {
    disabled: process.env.NODE_ENV === 'development',
  },

  // Appearance configuration
  appearance: {
    layout: {
      unsafe_disableDevelopmentModeWarnings: process.env.NODE_ENV === 'production',
    },
    elements: {
      rootBox: "w-full",
      card: "bg-white shadow-lg rounded-lg",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      footerActionLink: "text-blue-600 hover:text-blue-800",
    },
  },
}

// Export publishable key for easy access
export const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!

// Export secret key for server-side use
export const secretKey = process.env.CLERK_SECRET_KEY!

export default clerkConfig