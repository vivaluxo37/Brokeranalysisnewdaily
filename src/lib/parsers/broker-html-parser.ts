import { Broker, BrokerRegulation, BrokerFeature, BrokerTradingCondition, BrokerAccountType, BrokerPlatform, BrokerPaymentMethod, BrokerSupport, BrokerEducation, BrokerReview, BrokerAffiliateLink, BrokerPromotion } from '@/lib/db/schema';

export interface ParsedBrokerData {
  broker: Partial<Broker>;
  regulations: Partial<BrokerRegulation>[];
  features: Partial<BrokerFeature>[];
  tradingConditions: Partial<BrokerTradingCondition>[];
  accountTypes: Partial<BrokerAccountType>[];
  platforms: Partial<BrokerPlatform>[];
  paymentMethods: Partial<BrokerPaymentMethod>[];
  support: Partial<BrokerSupport>[];
  education: Partial<BrokerEducation>[];
  reviews: Partial<BrokerReview>[];
  affiliateLinks: Partial<BrokerAffiliateLink>[];
  promotions: Partial<BrokerPromotion>[];
}

export class BrokerHTMLParser {
  private document: Document;

  constructor(html: string) {
    const parser = new DOMParser();
    this.document = parser.parseFromString(html, 'text/html');
  }

  /**
   * Extract all broker information from the HTML page
   */
  parse(): ParsedBrokerData {
    return {
      broker: this.parseBasicInfo(),
      regulations: this.parseRegulations(),
      features: this.parseFeatures(),
      tradingConditions: this.parseTradingConditions(),
      accountTypes: this.parseAccountTypes(),
      platforms: this.parsePlatforms(),
      paymentMethods: this.parsePaymentMethods(),
      support: this.parseSupport(),
      education: this.parseEducation(),
      reviews: this.parseReviews(),
      affiliateLinks: this.parseAffiliateLinks(),
      promotions: this.parsePromotions(),
    };
  }

  /**
   * Parse basic broker information
   */
  private parseBasicInfo(): Partial<Broker> {
    const broker: Partial<Broker> = {
      name: this.extractText('h1') || this.extractText('.broker-name') || this.extractText('.broker-title'),
      website_url: this.extractAttribute('a[href*="http"]', 'href')?.find(url =>
        url && !url.includes('dailyforex.com') && !url.includes('brokeranalysis.com')
      ),
      description: this.extractText('.description, .broker-description, .content p') ||
                   this.extractText('.review-content, .broker-content'),
      short_description: this.extractText('.short-description, .summary, .excerpt') ||
                        this.extractMeta('description'),
      rating: this.extractRating(),
      featured_status: this.extractBoolean('.featured, .featured-broker, .recommended'),
      min_deposit: this.extractAmount('.min-deposit, .minimum-deposit'),
      min_deposit_currency: this.extractCurrency('.min-deposit, .minimum-deposit') || 'USD',
      spread_type: this.extractText('.spread-type, .spread-info')?.includes('Fixed') ? 'Fixed' : 'Variable',
      typical_spread: this.extractDecimal('.typical-spread, .spread-value, .avg-spread'),
      max_leverage: this.extractLeverage(),
      established_year: this.extractYear('.established, .founded, .since-year'),
      headquarters: this.extractText('.headquarters, .location, .office'),
      company_size: this.extractText('.company-size, .employees, .team-size'),
      total_assets: this.extractAmount('.assets, .total-assets'),
      active_traders: this.extractNumber('.traders, .active-traders, .clients'),
      meta_title: this.extractMeta('title'),
      meta_description: this.extractMeta('description'),
      status: 'active',
    };

    // Generate slug from name
    if (broker.name) {
      broker.slug = broker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Extract logo URL
    const logoImg = this.extractAttribute('img[src*="logo"]', 'src')?.[0];
    if (logoImg) {
      broker.logo_url = logoImg.startsWith('http') ? logoImg : `https:${logoImg}`;
    }

    return broker;
  }

  /**
   * Parse regulatory information
   */
  private parseRegulations(): Partial<BrokerRegulation>[] {
    const regulations: Partial<BrokerRegulation>[] = [];

    // Look for regulatory information in common sections
    const regulationSections = this.document.querySelectorAll('.regulation, .regulations, .license, .regulatory');

    regulationSections.forEach(section => {
      const regulatoryText = section.textContent || '';

      // Extract common regulatory bodies
      const regulatoryBodies = [
        'FCA', 'CySEC', 'ASIC', 'FINMA', 'BaFin', 'MFSA', 'FSCA', 'DFS', 'NFA', 'CFTC',
        'IIROC', 'FMA', 'FSP', 'SCB', 'VFSC', 'SVGFSA', 'Labuan FSA', 'ADGM', 'DFSA'
      ];

      regulatoryBodies.forEach(body => {
        if (regulatoryText.includes(body)) {
          const regulation: Partial<BrokerRegulation> = {
            regulatory_body: body,
            regulation_status: 'Regulated',
            jurisdiction: this.extractJurisdiction(body, regulatoryText),
            license_number: this.extractLicenseNumber(body, regulatoryText),
          };

          regulations.push(regulation);
        }
      });
    });

    return regulations;
  }

  /**
   * Parse broker features and services
   */
  private parseFeatures(): Partial<BrokerFeature>[] {
    const features: Partial<BrokerFeature>[] = [];

    // Common feature categories
    const featureSelectors = [
      { selector: '.features, .broker-features', category: 'General' },
      { selector: '.trading-tools, .tools', category: 'Trading Tools' },
      { selector: '.education, .educational', category: 'Education' },
      { selector: '.research, .analysis', category: 'Research' },
      { selector: '.mobile, .app', category: 'Mobile Trading' },
    ];

    featureSelectors.forEach(({ selector, category }) => {
      const sections = this.document.querySelectorAll(selector);

      sections.forEach(section => {
        const featureItems = section.querySelectorAll('li, .feature-item, .service-item');

        featureItems.forEach(item => {
          const featureText = item.textContent?.trim();
          if (featureText && featureText.length > 0 && featureText.length < 200) {
            features.push({
              feature_name: featureText,
              feature_type: this.categorizeFeature(featureText),
              description: this.extractText('.description', item),
              availability: !this.extractBoolean('.unavailable, .not-available', item),
              category,
            });
          }
        });
      });
    });

    return features;
  }

  /**
   * Parse trading conditions
   */
  private parseTradingConditions(): Partial<BrokerTradingCondition>[] {
    const tradingConditions: Partial<BrokerTradingCondition>[] = [];

    // Parse for different instrument types
    const instrumentTypes = [
      'Forex', 'Indices', 'Commodities', 'Stocks', 'Cryptocurrencies', 'ETFs', 'Bonds'
    ];

    instrumentTypes.forEach(instrument => {
      const conditionSection = this.findSectionContaining(instrument);
      if (conditionSection) {
        const condition: Partial<BrokerTradingCondition> = {
          instrument_type: instrument,
          min_spread: this.extractDecimal(`.min-spread, .spread-min, .${instrument.toLowerCase()}-spread`, conditionSection),
          typical_spread: this.extractDecimal(`.typical-spread, .spread-avg, .${instrument.toLowerCase()}-spread`, conditionSection),
          max_leverage: this.extractLeverage(conditionSection),
          commission_rate: this.extractDecimal(`.commission, .fee, .${instrument.toLowerCase()}-commission`, conditionSection),
          commission_type: this.extractText('.commission-type', conditionSection) || 'per_lot',
          min_trade_size: this.extractAmount('.min-trade, .min-lot, .minimum-trade', conditionSection),
        };

        tradingConditions.push(condition);
      }
    });

    return tradingConditions;
  }

  /**
   * Parse account types
   */
  private parseAccountTypes(): Partial<BrokerAccountType>[] {
    const accountTypes: Partial<BrokerAccountType>[] = [];

    const accountSections = this.document.querySelectorAll('.account-type, .account-types, .trading-account');

    accountSections.forEach(section => {
      const accountName = this.extractText('h3, h4, .account-name', section);
      if (!accountName) return;

      const accountType: Partial<BrokerAccountType> = {
        account_name: accountName,
        account_type: this.extractText('.type, .account-category', section),
        min_deposit: this.extractAmount('.min-deposit, .minimum-deposit', section),
        min_deposit_currency: this.extractCurrency('.min-deposit, .minimum-deposit', section) || 'USD',
        spread_type: this.extractText('.spread-type, .spread-info', section),
        commission: this.extractDecimal('.commission, .fee', section),
        leverage: this.extractLeverage(section),
        islamic_account: this.extractBoolean('.islamic, .swap-free', section),
        demo_available: !this.extractBoolean('.no-demo, .live-only', section),
        features: this.extractFeaturesList(section),
      };

      accountTypes.push(accountType);
    });

    return accountTypes;
  }

  /**
   * Parse trading platforms
   */
  private parsePlatforms(): Partial<BrokerPlatform>[] {
    const platforms: Partial<BrokerPlatform>[] = [];

    const platformSections = this.document.querySelectorAll('.platform, .platforms, .trading-platform');

    platformSections.forEach(section => {
      const platformName = this.extractText('h3, h4, .platform-name', section);
      if (!platformName) return;

      const platform: Partial<BrokerPlatform> = {
        platform_name: platformName,
        platform_type: this.extractText('.platform-type, .type', section),
        version: this.extractText('.version, .build', section),
        web_trading: this.extractBoolean('.web, .web-based, .browser', section),
        mobile_trading: this.extractBoolean('.mobile, .app, .ios, .android', section),
        desktop_trading: this.extractBoolean('.desktop, .download, .windows, .mac', section),
        features: this.extractFeaturesList(section),
        download_url: this.extractAttribute('a[href*="download"]', 'href')?.[0],
      };

      platforms.push(platform);
    });

    return platforms;
  }

  /**
   * Parse payment methods
   */
  private parsePaymentMethods(): Partial<BrokerPaymentMethod>[] {
    const paymentMethods: Partial<BrokerPaymentMethod>[] = [];

    const paymentSections = this.document.querySelectorAll('.payment, .payments, .deposit, .withdrawal');

    paymentSections.forEach(section => {
      const paymentItems = section.querySelectorAll('li, .payment-method, .payment-option');

      paymentItems.forEach(item => {
        const methodName = this.extractText('.name, .method, .payment-name', item) ||
                          this.extractText(item);

        if (methodName && !paymentMethods.find(p => p.payment_method === methodName)) {
          const payment: Partial<BrokerPaymentMethod> = {
            payment_method: methodName,
            currency: this.extractCurrency('.currency', item),
            min_amount: this.extractAmount('.min-amount, .minimum', item),
            max_amount: this.extractAmount('.max-amount, .maximum', item),
            processing_time: this.extractText('.processing-time, .time, .duration', item),
            fees: this.extractFeesInfo(item),
            deposit: !this.extractBoolean('.withdrawal-only', item),
            withdrawal: !this.extractBoolean('.deposit-only', item),
          };

          paymentMethods.push(payment);
        }
      });
    });

    return paymentMethods;
  }

  /**
   * Parse support information
   */
  private parseSupport(): Partial<BrokerSupport>[] {
    const support: Partial<BrokerSupport>[] = [];

    const supportTypes = [
      { type: 'phone', selector: '.phone, .telephone, .support-phone' },
      { type: 'email', selector: '.email, .support-email, .contact-email' },
      { type: 'live_chat', selector: '.chat, .live-chat, .support-chat' },
      { type: 'ticket', selector: '.ticket, .support-ticket, .help-desk' },
    ];

    supportTypes.forEach(({ type, selector }) => {
      const supportSection = this.document.querySelector(selector);
      if (supportSection) {
        support.push({
          support_type: type,
          contact_info: this.extractText('.number, .address, .contact-info', supportSection) ||
                        this.extractText(supportSection),
          availability: this.extractText('.hours, .availability, .schedule', supportSection),
          languages: this.extractLanguages(supportSection),
          response_time: this.extractText('.response-time, .response', supportSection),
        });
      }
    });

    return support;
  }

  /**
   * Parse educational resources
   */
  private parseEducation(): Partial<BrokerEducation>[] {
    const education: Partial<BrokerEducation>[] = [];

    const educationSections = this.document.querySelectorAll('.education, .educational, .learning');

    educationSections.forEach(section => {
      const resourceItems = section.querySelectorAll('li, .resource, .course, .article, .video, .webinar');

      resourceItems.forEach(item => {
        const title = this.extractText('h4, h5, .title, .resource-title', item);
        if (!title) return;

        const resource: Partial<BrokerEducation> = {
          resource_type: this.extractResourceType(item),
          title,
          description: this.extractText('.description, .summary', item),
          url: this.extractAttribute('a[href]', 'href', item)?.[0],
          difficulty_level: this.extractText('.difficulty, .level', item),
          duration: this.extractText('.duration, .length, .time', item),
          language: this.extractText('.language, .lang', item) || 'English',
        };

        education.push(resource);
      });
    });

    return education;
  }

  /**
   * Parse user reviews
   */
  private parseReviews(): Partial<BrokerReview>[] {
    const reviews: Partial<BrokerReview>[] = [];

    const reviewSections = this.document.querySelectorAll('.review, .reviews, .testimonial');

    reviewSections.forEach(section => {
      const reviewItems = section.querySelectorAll('.review-item, .user-review, .comment');

      reviewItems.forEach(item => {
        const rating = this.extractRating(item);
        if (!rating) return;

        const review: Partial<BrokerReview> = {
          rating,
          review_text: this.extractText('.text, .content, .comment-text', item),
          trading_experience: this.extractTradingExperience(item),
          account_type: this.extractText('.account-type, .trading-account', item),
          helpful_count: this.extractNumber('.helpful, .likes, .upvotes', item),
        };

        reviews.push(review);
      });
    });

    return reviews;
  }

  /**
   * Parse affiliate links
   */
  private parseAffiliateLinks(): Partial<BrokerAffiliateLink>[] {
    const affiliateLinks: Partial<BrokerAffiliateLink>[] = [];

    // Look for affiliate links in common locations
    const affiliateSelectors = [
      '.affiliate-link',
      '.visit-broker',
      '.trade-now',
      '.open-account',
      'a[href*="affiliate"]',
      'a[href*="partner"]'
    ];

    affiliateSelectors.forEach(selector => {
      const links = this.document.querySelectorAll(selector);

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !affiliateLinks.find(l => l.link_url === href)) {
          affiliateLinks.push({
            link_url: href,
            tracking_code: this.extractTrackingCode(href),
            commission_type: 'cpa',
            active_status: true,
          });
        }
      });
    });

    return affiliateLinks;
  }

  /**
   * Parse promotions and bonuses
   */
  private parsePromotions(): Partial<BrokerPromotion>[] {
    const promotions: Partial<BrokerPromotion>[] = [];

    const promotionSections = this.document.querySelectorAll('.promotion, .bonus, .offer, .deal');

    promotionSections.forEach(section => {
      const title = this.extractText('h3, h4, .title, .promotion-title', section);
      if (!title) return;

      const promotion: Partial<BrokerPromotion> = {
        title,
        description: this.extractText('.description, .details', section),
        promotion_type: this.extractText('.type, .bonus-type', section),
        bonus_amount: this.extractAmount('.bonus-amount, .amount', section),
        min_deposit: this.extractAmount('.min-deposit, .minimum-deposit', section),
        terms_conditions: this.extractText('.terms, .conditions, .t&c', section),
        active_status: true,
      };

      promotions.push(promotion);
    });

    return promotions;
  }

  // Helper methods
  private extractText(selector: string, context?: Element): string | undefined {
    const element = context ? context.querySelector(selector) : this.document.querySelector(selector);
    return element?.textContent?.trim();
  }

  private extractAttribute(selector: string, attribute: string, context?: Element): string[] | undefined {
    const elements = context ?
      context.querySelectorAll(selector) :
      this.document.querySelectorAll(selector);

    const attributes: string[] = [];
    elements.forEach(element => {
      const value = element.getAttribute(attribute);
      if (value) attributes.push(value);
    });

    return attributes.length > 0 ? attributes : undefined;
  }

  private extractMeta(name: string): string | undefined {
    const meta = this.document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta?.getAttribute('content')?.trim();
  }

  private extractRating(context?: Element): number | undefined {
    const ratingText = this.extractText('.rating, .stars, .score', context);
    if (!ratingText) return undefined;

    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
    if (ratingMatch) {
      const rating = parseFloat(ratingMatch[1]);
      return rating >= 0 && rating <= 5 ? rating : undefined;
    }

    // Extract from star ratings
    const stars = context ?
      context.querySelectorAll('.star, .fa-star, .stars .active') :
      this.document.querySelectorAll('.star, .fa-star, .stars .active');

    return stars.length > 0 ? Math.min(stars.length, 5) : undefined;
  }

  private extractBoolean(selector: string, context?: Element): boolean {
    const element = context ? context.querySelector(selector) : this.document.querySelector(selector);
    return element !== null;
  }

  private extractAmount(selector: string, context?: Element): number | undefined {
    const amountText = this.extractText(selector, context);
    if (!amountText) return undefined;

    const amountMatch = amountText.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    if (amountMatch) {
      return parseFloat(amountMatch[1].replace(',', ''));
    }

    return undefined;
  }

  private extractDecimal(selector: string, context?: Element): number | undefined {
    const decimalText = this.extractText(selector, context);
    if (!decimalText) return undefined;

    const decimalMatch = decimalText.match(/(\d+(?:\.\d+)?)/);
    return decimalMatch ? parseFloat(decimalMatch[1]) : undefined;
  }

  private extractCurrency(selector: string, context?: Element): string | undefined {
    const currencyText = this.extractText(selector, context);
    if (!currencyText) return undefined;

    const currencyMatch = currencyText.match(/\b(USD|EUR|GBP|JPY|AUD|CAD|CHF|CNY)\b/i);
    return currencyMatch ? currencyMatch[1].toUpperCase() : undefined;
  }

  private extractLeverage(context?: Element): number | undefined {
    const leverageText = this.extractText('.leverage, .max-leverage', context);
    if (!leverageText) return undefined;

    const leverageMatch = leverageText.match(/(\d+):1/);
    return leverageMatch ? parseInt(leverageMatch[1]) : undefined;
  }

  private extractYear(selector: string): number | undefined {
    const yearText = this.extractText(selector);
    if (!yearText) return undefined;

    const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : undefined;
  }

  private extractNumber(selector: string, context?: Element): number | undefined {
    const numberText = this.extractText(selector, context);
    if (!numberText) return undefined;

    const numberMatch = numberText.match(/(\d+(?:,\d+)*)/);
    return numberMatch ? parseInt(numberMatch[1].replace(',', '')) : undefined;
  }

  private extractJurisdiction(body: string, text: string): string | undefined {
    const jurisdictions = {
      'FCA': 'UK',
      'CySEC': 'Cyprus',
      'ASIC': 'Australia',
      'FINMA': 'Switzerland',
      'BaFin': 'Germany',
      'MFSA': 'Malta',
      'FSCA': 'South Africa',
      'NFA': 'USA',
      'CFTC': 'USA',
    };

    const jurisdiction = jurisdictions[body as keyof typeof jurisdictions];
    if (jurisdiction && text.toLowerCase().includes(jurisdiction.toLowerCase())) {
      return jurisdiction;
    }

    return undefined;
  }

  private extractLicenseNumber(body: string, text: string): string | undefined {
    const licenseMatch = text.match(new RegExp(`${body}[^\\d]*(\\d+)`, 'i'));
    return licenseMatch ? licenseMatch[1] : undefined;
  }

  private categorizeFeature(featureText: string): string {
    const categories = {
      'MT4': 'Platform',
      'MT5': 'Platform',
      'cTrader': 'Platform',
      'WebTrader': 'Platform',
      'VPS': 'Trading Tool',
      'Copy Trading': 'Trading Tool',
      'Social Trading': 'Trading Tool',
      'API': 'Trading Tool',
      'Economic Calendar': 'Research',
      'Market News': 'Research',
      'Technical Analysis': 'Research',
      'Fundamental Analysis': 'Research',
      'Trading Signals': 'Trading Tool',
      'Auto Trading': 'Trading Tool',
      'Expert Advisors': 'Trading Tool',
      'Demo Account': 'Account Feature',
      'Islamic Account': 'Account Feature',
      'Managed Account': 'Account Feature',
    };

    for (const [keyword, category] of Object.entries(categories)) {
      if (featureText.includes(keyword)) {
        return category;
      }
    }

    return 'General';
  }

  private findSectionContaining(searchTerm: string): Element | null {
    const allElements = this.document.querySelectorAll('*');
    for (const element of allElements) {
      if (element.textContent?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return element.parentElement;
      }
    }
    return null;
  }

  private extractFeaturesList(context: Element): string | undefined {
    const features = Array.from(context.querySelectorAll('li, .feature, .feature-item'))
      .map(item => item.textContent?.trim())
      .filter(text => text && text.length > 0 && text.length < 100);

    return features.length > 0 ? JSON.stringify(features) : undefined;
  }

  private extractFeesInfo(context: Element): string | undefined {
    const feeText = this.extractText('.fee, .fees, .charge, .charges', context);
    if (!feeText) return undefined;

    try {
      // Simple fee structure extraction
      const feeStructure = {
        percentage: this.extractDecimal('.percentage', context),
        fixed: this.extractAmount('.fixed', context),
        minimum: this.extractAmount('.minimum', context),
        description: feeText,
      };

      return JSON.stringify(feeStructure);
    } catch {
      return undefined;
    }
  }

  private extractLanguages(context: Element): string | undefined {
    const languages = Array.from(context.querySelectorAll('.language, .lang'))
      .map(item => item.textContent?.trim())
      .filter(text => text && text.length > 0);

    return languages.length > 0 ? JSON.stringify(languages) : undefined;
  }

  private extractResourceType(context: Element): string {
    if (context.textContent?.toLowerCase().includes('video')) return 'video';
    if (context.textContent?.toLowerCase().includes('webinar')) return 'webinar';
    if (context.textContent?.toLowerCase().includes('course')) return 'course';
    if (context.textContent?.toLowerCase().includes('ebook')) return 'ebook';
    return 'article';
  }

  private extractTradingExperience(context: Element): number | undefined {
    const experienceText = this.extractText('.experience, .trading-experience', context);
    if (!experienceText) return undefined;

    const experienceMatch = experienceText.match(/(\d+)\s*(years?|yrs?)/i);
    return experienceMatch ? parseInt(experienceMatch[1]) : undefined;
  }

  private extractTrackingCode(url: string): string | undefined {
    const trackingMatch = url.match(/[?&](ref|affiliate|partner|track)=([^&]+)/i);
    return trackingMatch ? trackingMatch[2] : undefined;
  }
}