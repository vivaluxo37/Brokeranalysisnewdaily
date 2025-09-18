import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SafeClerkProvider } from "@/components/auth/ClerkErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrokerAnalysis.com - Find Your Trusted Forex Broker",
  description: "Compare 100+ regulated forex brokers with unbiased ratings, detailed reviews, and expert analysis. Find your perfect trading platform today.",
  keywords: "forex brokers, broker reviews, trading platforms, forex trading, regulated brokers, broker comparison",
  openGraph: {
    title: "BrokerAnalysis.com - Find Your Trusted Forex Broker",
    description: "Expert reviews and comparisons of regulated forex brokers. Make informed trading decisions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrokerAnalysis.com - Find Your Trusted Forex Broker",
    description: "Expert reviews and comparisons of regulated forex brokers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SafeClerkProvider>
          {children}
        </SafeClerkProvider>
      </body>
    </html>
  );
}
