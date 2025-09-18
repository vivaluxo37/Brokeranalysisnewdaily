# Broker Review Page Structure & SEO Architecture

## 1. URL Structure for Individual Broker Pages

### Primary URL Pattern:
```
https://yourdomain.com/forex-brokers/[broker-name]
https://yourdomain.com/cfd-brokers/[broker-name]
https://yourdomain.com/stock-brokers/[broker-name]
https://yourdomain.com/crypto-brokers/[broker-name]
```

### Secondary URL Patterns:
```
https://yourdomain.com/brokers/[broker-name]
https://yourdomain.com/broker/[broker-name]-review
https://yourdomain.com/trading-brokers/[broker-name]
```

### URL Structure Best Practices:
- Use lowercase with hyphens (kebab-case)
- Keep URLs descriptive but concise (under 60 characters)
- Include primary keyword for category
- Remove special characters and numbers
- Maintain consistency across all broker pages

### Example URLs:
```
✅ /forex-brokers/ig-markets
✅ /forex-brokers/forex-com
✅ /cfd-brokers/plus500
✅ /stock-brokers/etrade
✅ /crypto-brokers/binance
```

## 2. H1, H2, H3 Hierarchy Structure

### Primary H1 (Always unique per page):
```
<H1>Broker Name Review 2025: Complete Analysis & Rating</H1>
```

### Secondary H2 Structure (Consistent across all broker pages):
```
<H2>Broker Overview</H2>
<H2>Regulation & Safety</H2>
<H2>Trading Conditions</H2>
<H2>Platforms & Trading Tools</H2>
<H2>Account Types & Funding</H2>
<H2>Pros and Cons</H2>
<H2>User Reviews & Ratings</H2>
<H2>Final Verdict</H2>
<H2>FAQ</H2>
```

### Tertiary H3 Structure (Within sections):
```
<!-- Broker Overview -->
<H3>Company Background</H3>
<H3>Market Coverage</H3>
<H3>Awards & Recognition</H3>

<!-- Regulation & Safety -->
<H3>Licensing Information</H3>
<H3>Regulatory Bodies</H3>
<H3>Fund Protection</H3>
<H3>Risk Management</H3>

<!-- Trading Conditions -->
<H3>Spreads & Commissions</H3>
<H3>Leverage Options</H3>
<H3>Minimum Deposit</H3>
<H3>Trading Hours</H3>

<!-- Platforms & Trading Tools -->
<H3>Primary Trading Platforms</H3>
<H3>Mobile Trading Apps</H3>
<H3>Research Tools</H3>
<H3>Automated Trading</H3>

<!-- Account Types & Funding -->
<H3>Account Options</H3>
<H3>Deposit Methods</H3>
<H3>Withdrawal Process</H3>
<H3>Account Fees</H3>
```

## 3. Schema Markup Implementation

### Primary Schema Types:
1. **Review Schema**
```json
{
  "@type": "Review",
  "itemReviewed": {
    "@type": "FinancialService",
    "name": "Broker Name",
    "category": "Forex Broker",
    "provider": {
      "@type": "Organization",
      "name": "Broker Company",
      "url": "https://broker-website.com"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.5",
    "bestRating": "5",
    "worstRating": "1"
  },
  "reviewBody": "Comprehensive review content...",
  "author": {
    "@type": "Organization",
    "name": "Your Website Name"
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15"
}
```

2. **FinancialService Schema**
```json
{
  "@type": "FinancialService",
  "name": "Broker Name",
  "description": "Comprehensive broker offering forex, CFDs, and more",
  "provider": {
    "@type": "Organization",
    "name": "Broker Company",
    "url": "https://broker-website.com",
    "logo": "https://yoursite.com/images/broker-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service"
    }
  },
  "serviceType": ["Brokerage Services", "Investment Services", "Trading Platform"],
  "areaServed": "Worldwide",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "0",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

3. **Breadcrumb Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yoursite.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Brokers",
      "item": "https://yoursite.com/brokers/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Forex Brokers",
      "item": "https://yoursite.com/forex-brokers/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Broker Name",
      "item": "https://yoursite.com/forex-brokers/broker-name/"
    }
  ]
}
```

4. **FAQ Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Broker Name regulated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Broker Name is regulated by multiple regulatory bodies including..."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum deposit at Broker Name?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The minimum deposit at Broker Name varies by account type..."
      }
    }
  ]
}
```

## 4. Content Sections and Order

### Primary Content Sections (in order):

#### 1. Broker Overview (200-250 words)
- Company background and history
- Market coverage and global presence
- Key achievements and awards
- Overall rating summary

#### 2. Regulation & Safety (300-400 words)
- Regulatory licenses and jurisdictions
- Financial protection schemes
- Risk management protocols
- Security measures and compliance

#### 3. Trading Conditions (400-500 words)
- Spreads for major instruments
- Commission structure
- Leverage ratios by asset class
- Minimum deposit requirements
- Trading hours and holidays

#### 4. Platforms & Trading Tools (500-600 words)
- Primary platform overview (MetaTrader, cTrader, etc.)
- Mobile app capabilities
- Research and analysis tools
- Automated trading options
- Order execution types

#### 5. Account Types & Funding (300-400 words)
- Account tiers and features
- Deposit/withdrawal methods
- Processing times and fees
- Account verification process
- Funding currency options

#### 6. Pros and Cons (150-200 words)
- Key advantages in bullet points
- Main limitations in bullet points
- Who this broker is best suited for

#### 7. User Reviews & Ratings (200-300 words)
- User sentiment analysis
- Common praise points
- Frequent complaints
- Customer support responsiveness

#### 8. Final Verdict (100-150 words)
- Overall assessment
- Target audience recommendation
- Competitive positioning
- Rating summary

#### 9. FAQ Section (300-500 words)
- 10-15 frequently asked questions
- Detailed answers for each question
- Links to related broker comparisons

## 5. Meta Tag Templates

### Meta Title Template:
```
Primary: Broker Name Review 2025: [Rating]⭐ Complete Analysis
Alternative: [Broker Type] Broker Review 2025 - [Key Feature] | [Site Name]
Character Limit: 55-60 characters
```

### Meta Description Template:
```
Primary: Complete Broker Name review 2025. [Rating]⭐ rating covering regulations, platforms, fees, and trading conditions. Is Broker Name right for you?
Alternative: In-depth analysis of Broker Name including spreads, leverage, account types, and user reviews. Compare with top brokers and make informed decisions.
Character Limit: 155-160 characters
```

### Open Graph Tags:
```html
<meta property="og:title" content="Broker Name Review 2025: [Rating]⭐ Complete Analysis">
<meta property="og:description" content="Complete Broker Name review covering regulations, platforms, fees, and trading conditions.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://yoursite.com/forex-brokers/broker-name/">
<meta property="og:image" content="https://yoursite.com/images/broker-name-preview.jpg">
<meta property="og:site_name" content="Broker Review Site">
<meta property="article:published_time" content="2025-01-15T10:00:00Z">
<meta property="article:modified_time" content="2025-01-15T10:00:00Z">
<meta property="article:author" content="Your Website Name">
<meta property="article:section" content="Broker Reviews">
```

### Canonical URL Pattern:
```html
<link rel="canonical" href="https://yoursite.com/forex-brokers/broker-name/" />
```

## 6. Technical Requirements

### Dynamic Routing Structure:
```javascript
// Example URL pattern matching
const brokerRoutes = [
  {
    pattern: '/forex-brokers/:brokerId',
    template: 'forex-broker-review',
    category: 'forex'
  },
  {
    pattern: '/cfd-brokers/:brokerId',
    template: 'cfd-broker-review',
    category: 'cfd'
  },
  {
    pattern: '/stock-brokers/:brokerId',
    template: 'stock-broker-review',
    category: 'stocks'
  },
  {
    pattern: '/crypto-brokers/:brokerId',
    template: 'crypto-broker-review',
    category: 'crypto'
  }
]
```

### Schema Markup Implementation:
- Load schema data dynamically based on broker ID
- Validate schema before page rendering
- Update schema when content is modified
- Include structured data in JSON-LD format

### Performance Requirements:
- Page load time under 2 seconds
- Mobile-first design implementation
- Core Web Vitals optimization
- Lazy loading for images and videos

### Accessibility Requirements:
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio compliance (4.5:1 minimum)

## 7. Content Quality Guidelines

### Content Length Targets:
- Total article length: 2,500-3,500 words
- Minimum content per section: 150 words
- Maximum content per section: 600 words
- FAQ section: 10-15 questions with detailed answers

### Content Freshness:
- Update broker reviews quarterly or when significant changes occur
- Update regulatory information immediately when changes happen
- Refresh user reviews data monthly
- Update platform information when new versions are released

### E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):
- Include author credentials and expertise
- Provide direct experience with the broker when possible
- Cite regulatory sources with links
- Include user testimonials with verification
- Display contact information and transparency

### Internal Linking Guidelines:
- Link to 3-5 relevant comparison pages
- Link to 2-3 educational content pieces
- Link to 1-2 related broker reviews
- Include 2-3 contextual links to category pages
- Use descriptive anchor text for all internal links

This structure ensures consistency across all broker review pages while allowing for customization based on individual broker characteristics and user search intent variations.