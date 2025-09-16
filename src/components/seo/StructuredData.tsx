'use client';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Broker' | 'Review' | 'FAQ' | 'BreadcrumbList';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BrokerAnalysis.com',
          url: 'https://brokeranalysis.com',
          logo: 'https://brokeranalysis.com/logo.png',
          description: 'Comprehensive forex broker comparison and analysis platform',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@brokeranalysis.com'
          },
          sameAs: [
            'https://twitter.com/brokeranalysis',
            'https://facebook.com/brokeranalysis',
            'https://linkedin.com/company/brokeranalysis'
          ]
        };

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'BrokerAnalysis.com',
          url: 'https://brokeranalysis.com',
          description: 'Compare 100+ regulated forex brokers with unbiased ratings and detailed analysis',
          publisher: {
            '@type': 'Organization',
            name: 'BrokerAnalysis.com'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://brokeranalysis.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };

      case 'Broker':
        return {
          '@context': 'https://schema.org',
          '@type': 'FinancialService',
          name: data.name,
          url: `https://brokeranalysis.com/brokers/${data.slug}`,
          description: data.description,
          image: data.logo_url,
          telephone: data.phone,
          address: data.headquarters ? {
            '@type': 'PostalAddress',
            addressCountry: data.headquarters
          } : undefined,
          aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.review_count || 0,
            bestRating: 5,
            worstRating: 1
          } : undefined,
          serviceType: 'Forex Trading',
          provider: {
            '@type': 'Organization',
            name: data.name
          }
        };

      case 'Review':
        return {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'FinancialService',
            name: data.broker_name,
            url: `https://brokeranalysis.com/brokers/${data.broker_slug}`
          },
          author: {
            '@type': 'Person',
            name: data.author_name
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: 5,
            worstRating: 1
          },
          datePublished: data.created_at,
          reviewBody: data.content
        };

      case 'FAQ':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}