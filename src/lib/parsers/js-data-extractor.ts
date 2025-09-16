import { Broker, BrokerRegulation, BrokerFeature, BrokerTradingCondition, BrokerAccountType, BrokerPlatform, BrokerPaymentMethod, BrokerSupport, BrokerEducation, BrokerReview, BrokerAffiliateLink, BrokerPromotion } from '@/lib/db/schema';

export interface BrokerDataFromJS {
  brokers: any[];
  config: any;
  apiEndpoints: any[];
}

export class JavaScriptDataExtractor {
  /**
   * Extract broker data from JavaScript bundle
   */
  static extractFromBundle(jsContent: string): BrokerDataFromJS {
    const result: BrokerDataFromJS = {
      brokers: [],
      config: {},
      apiEndpoints: []
    };

    // Extract API endpoints
    result.apiEndpoints = this.extractAPIEndpoints(jsContent);

    // Extract broker data structures
    result.brokers = this.extractBrokerObjects(jsContent);

    // Extract configuration
    result.config = this.extractConfiguration(jsContent);

    return result;
  }

  /**
   * Extract API endpoints from JavaScript
   */
  private static extractAPIEndpoints(jsContent: string): any[] {
    const endpoints: any[] = [];

    // Look for common API endpoint patterns
    const patterns = [
      /ApiEnvHost\s*=\s*['"]([^'"]+)['"]/gi,
      /DailyforexAPI\s*=\s*['"]([^'"]+)['"]/gi,
      /['"]([^'"]*\/api\/[^'"]+)['"]/gi,
      /fetch\(['"]([^'"]*\/api\/[^'"]+)['"]/gi,
      /\.get\(['"]([^'"]*\/api\/[^'"]+)['"]/gi,
      /\.post\(['"]([^'"]*\/api\/[^'"]+)['"]/gi,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(jsContent)) !== null) {
        const endpoint = match[1];
        if (endpoint && !endpoints.find(e => e.url === endpoint)) {
          endpoints.push({
            url: endpoint,
            type: this.inferEndpointType(endpoint),
            method: this.inferHttpMethod(endpoint, jsContent)
          });
        }
      }
    });

    return endpoints;
  }

  /**
   * Extract broker data objects from JavaScript
   */
  private static extractBrokerObjects(jsContent: string): any[] {
    const brokers: any[] = [];

    // Look for broker data patterns
    const brokerPatterns = [
      // JSON-like broker objects
      /\{[^}]*"name"[^}]*"rating"[^}]*\}/gi,
      // Broker arrays
      /\[[^\]]*{[^}]*"name"[^}]*"rating"[^}]*}[^\]]*\]/gi,
      // Broker configurations
      /broker[^{]*\{[^}]*name[^}]*\}/gi,
      // Featured brokers
      /featured[^{]*\{[^}]*name[^}]*\}/gi,
    ];

    brokerPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(jsContent)) !== null) {
        try {
          const jsonStr = this.sanitizeJSON(match[0]);
          const brokerData = JSON.parse(jsonStr);

          // If it's an array, process each broker
          if (Array.isArray(brokerData)) {
            brokerData.forEach(broker => {
              if (this.isValidBroker(broker)) {
                brokers.push(this.normalizeBrokerData(broker));
              }
            });
          } else if (this.isValidBroker(brokerData)) {
            brokers.push(this.normalizeBrokerData(brokerData));
          }
        } catch (error) {
          // Invalid JSON, skip this match
          console.warn('Failed to parse broker data:', error);
        }
      }
    });

    return brokers;
  }

  /**
   * Extract configuration data
   */
  private static extractConfiguration(jsContent: string): any {
    const config: any = {};

    // Extract common configuration patterns
    const configPatterns = {
      apiUrl: /ApiEnvHost\s*=\s*['"]([^'"]+)['"]/i,
      clientId: /ClientConfig\s*=\s*\{([^}]+)\}/i,
      pageLanguage: /PageLanguage\s*=\s*['"]([^'"]+)['"]/i,
      pageLanguageId: /PageLanguageId\s*=\s*(\d+)/i,
      country: /country\s*:\s*\{[^}]*id\s*:\s*(\d+)/i,
      assetsPrefix: /AssetsPrefix\s*=\s*['"]([^'"]+)['"]/i,
    };

    Object.entries(configPatterns).forEach(([key, pattern]) => {
      const match = pattern.exec(jsContent);
      if (match) {
        config[key] = match[1];
      }
    });

    // Extract ClientConfig object
    const clientConfigMatch = /ClientConfig\s*=\s*(\{[^}]+\})/i.exec(jsContent);
    if (clientConfigMatch) {
      try {
        config.clientConfig = JSON.parse(clientConfigMatch[1]);
      } catch (error) {
        // Ignore parse errors
      }
    }

    return config;
  }

  /**
   * Infer endpoint type from URL
   */
  private static inferEndpointType(url: string): string {
    if (url.includes('broker')) return 'broker';
    if (url.includes('review')) return 'review';
    if (url.includes('promotion')) return 'promotion';
    if (url.includes('featured')) return 'featured';
    if (url.includes('list')) return 'list';
    if (url.includes('search')) return 'search';
    return 'general';
  }

  /**
   * Infer HTTP method from context
   */
  private static inferHttpMethod(url: string, context: string): string {
    // Look for method hints in the context
    if (context.includes('fetch(\'' + url + '\')') || context.includes('fetch("' + url + '")')) {
      // Look for method options
      const methodMatch = context.match(new RegExp('fetch\\([\'"]' + url + '[\'"][^}]*method\\s*:\\s*[\'"]([^\'"]+)[\'"]'));
      return methodMatch ? methodMatch[1] : 'GET';
    }

    if (context.includes('.get(\'' + url + '\'') || context.includes('.get("' + url + '")')) {
      return 'GET';
    }

    if (context.includes('.post(\'' + url + '\'') || context.includes('.post("' + url + '")')) {
      return 'POST';
    }

    if (context.includes('.put(\'' + url + '\'') || context.includes('.put("' + url + '")')) {
      return 'PUT';
    }

    if (context.includes('.delete(\'' + url + '\'') || context.includes('.delete("' + url + '")')) {
      return 'DELETE';
    }

    return 'GET';
  }

  /**
   * Sanitize JSON string for parsing
   */
  private static sanitizeJSON(jsonStr: string): string {
    // Remove JavaScript syntax that breaks JSON parsing
    let sanitized = jsonStr
      .replace(/(\w+)\s*:/g, '"$1":') // Quote unquoted property names
      .replace(/'([^']+)'/g, '"$1"') // Convert single quotes to double quotes
      .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
      .replace(/\/\*.*?\*\//g, '') // Remove comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .trim();

    // Ensure proper JSON structure
    if (!sanitized.startsWith('{') && !sanitized.startsWith('[')) {
      sanitized = '{' + sanitized + '}';
    }

    return sanitized;
  }

  /**
   * Validate if object contains broker data
   */
  private static isValidBroker(obj: any): boolean {
    return obj && (
      obj.name ||
      obj.brokerName ||
      obj.logo ||
      obj.rating !== undefined
    );
  }

  /**
   * Normalize broker data to consistent format
   */
  private static normalizeBrokerData(rawBroker: any): any {
    const normalized: any = {};

    // Map common field names
    const fieldMappings = {
      name: ['name', 'brokerName', 'title', 'broker_title'],
      logo: ['logo', 'image', 'logo_url', 'image_url', 'img'],
      rating: ['rating', 'rate', 'score', 'stars'],
      description: ['description', 'desc', 'about', 'summary'],
      website: ['website', 'site', 'url', 'website_url'],
      minDeposit: ['minDeposit', 'min_deposit', 'minimum_deposit'],
      spread: ['spread', 'spreads', 'spread_value'],
      leverage: ['leverage', 'max_leverage', 'maxLeverage'],
      regulation: ['regulation', 'regulatory', 'regulated'],
      features: ['features', 'services', 'offerings'],
      accountTypes: ['accountTypes', 'account_types', 'accounts'],
      platforms: ['platforms', 'trading_platforms'],
      paymentMethods: ['paymentMethods', 'payment_methods', 'deposits'],
      support: ['support', 'customer_support', 'help'],
      education: ['education', 'educational', 'learning'],
      reviewCount: ['reviewCount', 'reviews_count', 'num_reviews'],
      established: ['established', 'founded', 'since'],
      headquarters: ['headquarters', 'location', 'office'],
    };

    Object.entries(fieldMappings).forEach(([target, sources]) => {
      for (const source of sources) {
        if (rawBroker[source] !== undefined) {
          normalized[target] = rawBroker[source];
          break;
        }
      }
    });

    // Extract nested data
    if (rawBroker.regulations) {
      normalized.regulations = Array.isArray(rawBroker.regulations) ? rawBroker.regulations : [rawBroker.regulations];
    }

    if (rawBroker.tradingConditions) {
      normalized.tradingConditions = Array.isArray(rawBroker.tradingConditions) ? rawBroker.tradingConditions : [rawBroker.tradingConditions];
    }

    // Generate missing fields
    if (normalized.name && !normalized.slug) {
      normalized.slug = normalized.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return normalized;
  }

  /**
   * Convert extracted broker data to database format
   */
  static convertToDatabaseFormat(extractedData: BrokerDataFromJS): {
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
  } {
    const result = {
      broker: {} as Partial<Broker>,
      regulations: [] as Partial<BrokerRegulation>[],
      features: [] as Partial<BrokerFeature>[],
      tradingConditions: [] as Partial<BrokerTradingCondition>[],
      accountTypes: [] as Partial<BrokerAccountType>[],
      platforms: [] as Partial<BrokerPlatform>[],
      paymentMethods: [] as Partial<BrokerPaymentMethod>[],
      support: [] as Partial<BrokerSupport>[],
      education: [] as Partial<BrokerEducation>[],
      reviews: [] as Partial<BrokerReview>[],
      affiliateLinks: [] as Partial<BrokerAffiliateLink>[],
      promotions: [] as Partial<BrokerPromotion>[],
    };

    // Process each extracted broker
    extractedData.brokers.forEach(broker => {
      // Basic broker info
      if (broker.name) {
        result.broker = {
          name: broker.name,
          slug: broker.slug || broker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          logo_url: broker.logo,
          website_url: broker.website,
          description: broker.description,
          rating: broker.rating || 0,
          review_count: broker.reviewCount || 0,
          min_deposit: broker.minDeposit || 0,
          spread_type: broker.spreadType || 'Variable',
          typical_spread: broker.spread,
          max_leverage: broker.leverage || 0,
          established_year: broker.established,
          headquarters: broker.headquarters,
          status: 'active',
        };
      }

      // Regulations
      if (broker.regulations) {
        broker.regulations.forEach((reg: any) => {
          result.regulations.push({
            regulatory_body: reg.body || reg.regulatoryBody || reg.name,
            license_number: reg.license || reg.licenseNumber,
            regulation_status: reg.status || 'Regulated',
            jurisdiction: reg.jurisdiction || reg.country,
          });
        });
      }

      // Features
      if (broker.features) {
        const features = Array.isArray(broker.features) ? broker.features : Object.values(broker.features);
        features.forEach((feature: any) => {
          if (typeof feature === 'string') {
            result.features.push({
              feature_name: feature,
              feature_type: 'General',
              availability: true,
            });
          } else if (typeof feature === 'object') {
            result.features.push({
              feature_name: feature.name || feature.feature_name,
              feature_type: feature.type || feature.feature_type || 'General',
              description: feature.description,
              availability: feature.available !== false,
            });
          }
        });
      }

      // Account types
      if (broker.accountTypes) {
        const accountTypes = Array.isArray(broker.accountTypes) ? broker.accountTypes : Object.values(broker.accountTypes);
        accountTypes.forEach((account: any) => {
          result.accountTypes.push({
            account_name: account.name || account.account_name,
            account_type: account.type || account.account_type,
            min_deposit: account.minDeposit || account.min_deposit,
            commission: account.commission,
            leverage: account.leverage,
            islamic_account: account.islamic || account.islamic_account,
            demo_available: account.demo !== false,
          });
        });
      }

      // Platforms
      if (broker.platforms) {
        const platforms = Array.isArray(broker.platforms) ? broker.platforms : Object.values(broker.platforms);
        platforms.forEach((platform: any) => {
          result.platforms.push({
            platform_name: platform.name || platform.platform_name,
            platform_type: platform.type || platform.platform_type,
            version: platform.version,
            web_trading: platform.web || platform.web_trading,
            mobile_trading: platform.mobile || platform.mobile_trading,
            desktop_trading: platform.desktop || platform.desktop_trading,
          });
        });
      }

      // Payment methods
      if (broker.paymentMethods) {
        const paymentMethods = Array.isArray(broker.paymentMethods) ? broker.paymentMethods : Object.values(broker.paymentMethods);
        paymentMethods.forEach((payment: any) => {
          result.paymentMethods.push({
            payment_method: payment.name || payment.payment_method,
            currency: payment.currency,
            processing_time: payment.processingTime || payment.processing_time,
            deposit: payment.deposit !== false,
            withdrawal: payment.withdrawal !== false,
          });
        });
      }

      // Support
      if (broker.support) {
        const support = Array.isArray(broker.support) ? broker.support : Object.values(broker.support);
        support.forEach((sup: any) => {
          result.support.push({
            support_type: sup.type || sup.support_type,
            contact_info: sup.contact || sup.contact_info,
            availability: sup.hours || sup.availability,
          });
        });
      }

      // Education
      if (broker.education) {
        const education = Array.isArray(broker.education) ? broker.education : Object.values(broker.education);
        education.forEach((edu: any) => {
          result.education.push({
            resource_type: edu.type || edu.resource_type,
            title: edu.title,
            description: edu.description,
            url: edu.url,
          });
        });
      }

      // Reviews (from rating data)
      if (broker.rating && broker.reviewCount) {
        result.reviews.push({
          rating: broker.rating,
          approved: true,
          helpful_count: broker.reviewCount,
        });
      }

      // Affiliate links
      if (broker.affiliateLink || broker.visitLink) {
        result.affiliateLinks.push({
          link_url: broker.affiliateLink || broker.visitLink,
          active_status: true,
        });
      }

      // Promotions
      if (broker.bonus || broker.promotion) {
        result.promotions.push({
          title: broker.bonus?.title || broker.promotion?.title,
          description: broker.bonus?.description || broker.promotion?.description,
          promotion_type: broker.bonus?.type || broker.promotion?.type,
          active_status: true,
        });
      }
    });

    return result;
  }
}