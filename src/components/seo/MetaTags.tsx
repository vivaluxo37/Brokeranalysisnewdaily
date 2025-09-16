'use client';

import { usePathname } from 'next/navigation';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: any[];
}

const defaultMeta = {
  title: 'BrokerAnalysis.com - Compare 100+ Regulated Forex Brokers',
  description: 'Find and compare regulated forex brokers with unbiased ratings, detailed reviews, and comprehensive analysis. Make informed trading decisions.',
  keywords: 'forex brokers, broker comparison, regulated brokers, forex trading, broker reviews, forex analysis',
  ogImage: '/og-default.jpg',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
};

export default function MetaTags({
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  canonicalUrl,
  ogImage = defaultMeta.ogImage,
  ogType = defaultMeta.ogType,
  twitterCard = defaultMeta.twitterCard,
  noIndex = false,
  structuredData = []
}: MetaTagsProps) {
  const pathname = usePathname();
  const fullUrl = canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://brokeranalysis.com'}${pathname}`;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BrokerAnalysis.com" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="BrokerAnalysis.com" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@brokeranalysis" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#15418F" />
      <meta name="msapplication-TileColor" content="#15418F" />

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}
    </>
  );
}