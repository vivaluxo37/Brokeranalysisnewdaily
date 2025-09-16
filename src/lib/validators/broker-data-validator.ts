import { Broker, BrokerRegulation, BrokerFeature, BrokerTradingCondition, BrokerAccountType, BrokerPlatform, BrokerPaymentMethod, BrokerSupport, BrokerEducation, BrokerReview, BrokerAffiliateLink, BrokerPromotion } from '@/lib/db/schema';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: any;
}

export class BrokerDataValidator {
  /**
   * Validate broker data
   */
  static validateBroker(data: Partial<Broker>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Broker name is required');
    }

    if (!data.slug || data.slug.trim().length === 0) {
      errors.push('Broker slug is required');
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Broker slug must contain only lowercase letters, numbers, and hyphens');
    }

    // Validation rules
    if (data.rating !== undefined) {
      if (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5) {
        errors.push('Rating must be a number between 0 and 5');
      }
    }

    if (data.min_deposit !== undefined) {
      if (typeof data.min_deposit !== 'number' || data.min_deposit < 0) {
        errors.push('Minimum deposit must be a positive number');
      }
    }

    if (data.max_leverage !== undefined) {
      if (typeof data.max_leverage !== 'number' || data.max_leverage < 0) {
        errors.push('Maximum leverage must be a positive number');
      }
    }

    if (data.established_year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (typeof data.established_year !== 'number' || data.established_year < 1900 || data.established_year > currentYear) {
        errors.push('Established year must be between 1900 and current year');
      }
    }

    // Warnings
    if (!data.website_url) {
      warnings.push('Website URL is recommended');
    }

    if (!data.description) {
      warnings.push('Description is recommended for better SEO');
    }

    if (!data.logo_url) {
      warnings.push('Logo URL is recommended for better user experience');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate regulation data
   */
  static validateRegulation(data: Partial<BrokerRegulation>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.regulatory_body || data.regulatory_body.trim().length === 0) {
      errors.push('Regulatory body is required');
    }

    // Validation rules
    const validStatuses = ['Regulated', 'Unregulated', 'Pending', 'Suspended'];
    if (data.regulation_status && !validStatuses.includes(data.regulation_status)) {
      errors.push(`Regulation status must be one of: ${validStatuses.join(', ')}`);
    }

    if (data.verification_date) {
      const date = new Date(data.verification_date);
      if (isNaN(date.getTime())) {
        errors.push('Verification date must be a valid date');
      }
    }

    // Warnings
    if (!data.license_number) {
      warnings.push('License number is recommended for regulated brokers');
    }

    if (!data.jurisdiction) {
      warnings.push('Jurisdiction is recommended for better accuracy');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate feature data
   */
  static validateFeature(data: Partial<BrokerFeature>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.feature_name || data.feature_name.trim().length === 0) {
      errors.push('Feature name is required');
    }

    if (!data.feature_type || data.feature_type.trim().length === 0) {
      errors.push('Feature type is required');
    }

    // Validation rules
    const validTypes = ['Platform', 'Trading Tool', 'Research', 'Account Feature', 'General', 'Education'];
    if (data.feature_type && !validTypes.includes(data.feature_type)) {
      errors.push(`Feature type must be one of: ${validTypes.join(', ')}`);
    }

    if (data.description && data.description.length > 1000) {
      warnings.push('Feature description is very long, consider shortening');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate trading condition data
   */
  static validateTradingCondition(data: Partial<BrokerTradingCondition>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.instrument_type || data.instrument_type.trim().length === 0) {
      errors.push('Instrument type is required');
    }

    // Validation rules
    const validInstruments = ['Forex', 'Indices', 'Commodities', 'Stocks', 'Cryptocurrencies', 'ETFs', 'Bonds'];
    if (data.instrument_type && !validInstruments.includes(data.instrument_type)) {
      errors.push(`Instrument type must be one of: ${validInstruments.join(', ')}`);
    }

    if (data.min_spread !== undefined && (typeof data.min_spread !== 'number' || data.min_spread < 0)) {
      errors.push('Minimum spread must be a positive number');
    }

    if (data.typical_spread !== undefined && (typeof data.typical_spread !== 'number' || data.typical_spread < 0)) {
      errors.push('Typical spread must be a positive number');
    }

    if (data.max_leverage !== undefined && (typeof data.max_leverage !== 'number' || data.max_leverage < 0)) {
      errors.push('Maximum leverage must be a positive number');
    }

    if (data.commission_rate !== undefined && (typeof data.commission_rate !== 'number' || data.commission_rate < 0)) {
      errors.push('Commission rate must be a positive number');
    }

    if (data.min_trade_size !== undefined && (typeof data.min_trade_size !== 'number' || data.min_trade_size <= 0)) {
      errors.push('Minimum trade size must be a positive number');
    }

    const validCommissionTypes = ['per_lot', 'per_share', 'percentage', 'fixed'];
    if (data.commission_type && !validCommissionTypes.includes(data.commission_type)) {
      errors.push(`Commission type must be one of: ${validCommissionTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate account type data
   */
  static validateAccountType(data: Partial<BrokerAccountType>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.account_name || data.account_name.trim().length === 0) {
      errors.push('Account name is required');
    }

    // Validation rules
    if (data.min_deposit !== undefined && (typeof data.min_deposit !== 'number' || data.min_deposit < 0)) {
      errors.push('Minimum deposit must be a positive number');
    }

    if (data.commission !== undefined && (typeof data.commission !== 'number' || data.commission < 0)) {
      errors.push('Commission must be a positive number');
    }

    if (data.leverage !== undefined && (typeof data.leverage !== 'number' || data.leverage < 0)) {
      errors.push('Leverage must be a positive number');
    }

    if (typeof data.islamic_account !== 'boolean') {
      errors.push('Islamic account must be a boolean');
    }

    if (typeof data.demo_available !== 'boolean') {
      errors.push('Demo available must be a boolean');
    }

    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    if (data.min_deposit_currency && !validCurrencies.includes(data.min_deposit_currency)) {
      warnings.push(`Currency code may not be standard: ${data.min_deposit_currency}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate platform data
   */
  static validatePlatform(data: Partial<BrokerPlatform>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.platform_name || data.platform_name.trim().length === 0) {
      errors.push('Platform name is required');
    }

    // Validation rules
    if (typeof data.web_trading !== 'boolean') {
      errors.push('Web trading must be a boolean');
    }

    if (typeof data.mobile_trading !== 'boolean') {
      errors.push('Mobile trading must be a boolean');
    }

    if (typeof data.desktop_trading !== 'boolean') {
      errors.push('Desktop trading must be a boolean');
    }

    // Warnings
    if (!data.platform_type) {
      warnings.push('Platform type is recommended');
    }

    if (!data.version) {
      warnings.push('Platform version is recommended');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate payment method data
   */
  static validatePaymentMethod(data: Partial<BrokerPaymentMethod>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.payment_method || data.payment_method.trim().length === 0) {
      errors.push('Payment method is required');
    }

    // Validation rules
    if (typeof data.deposit !== 'boolean') {
      errors.push('Deposit must be a boolean');
    }

    if (typeof data.withdrawal !== 'boolean') {
      errors.push('Withdrawal must be a boolean');
    }

    if (data.min_amount !== undefined && (typeof data.min_amount !== 'number' || data.min_amount < 0)) {
      errors.push('Minimum amount must be a positive number');
    }

    if (data.max_amount !== undefined && (typeof data.max_amount !== 'number' || data.max_amount < 0)) {
      errors.push('Maximum amount must be a positive number');
    }

    // Warnings
    if (!data.currency) {
      warnings.push('Currency is recommended for payment methods');
    }

    if (!data.processing_time) {
      warnings.push('Processing time is recommended');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate support data
   */
  static validateSupport(data: Partial<BrokerSupport>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.support_type || data.support_type.trim().length === 0) {
      errors.push('Support type is required');
    }

    // Validation rules
    const validTypes = ['phone', 'email', 'live_chat', 'ticket'];
    if (data.support_type && !validTypes.includes(data.support_type)) {
      errors.push(`Support type must be one of: ${validTypes.join(', ')}`);
    }

    // Warnings
    if (!data.contact_info) {
      warnings.push('Contact information is recommended');
    }

    if (!data.availability) {
      warnings.push('Availability information is recommended');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate education data
   */
  static validateEducation(data: Partial<BrokerEducation>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.resource_type || data.resource_type.trim().length === 0) {
      errors.push('Resource type is required');
    }

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    // Validation rules
    const validTypes = ['webinar', 'course', 'article', 'video', 'ebook'];
    if (data.resource_type && !validTypes.includes(data.resource_type)) {
      errors.push(`Resource type must be one of: ${validTypes.join(', ')}`);
    }

    // URL validation
    if (data.url) {
      try {
        new URL(data.url);
      } catch {
        errors.push('URL must be a valid URL');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate review data
   */
  static validateReview(data: Partial<BrokerReview>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (data.rating === undefined) {
      errors.push('Rating is required');
    }

    // Validation rules
    if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5)) {
      errors.push('Rating must be a number between 1 and 5');
    }

    if (data.trading_experience !== undefined && (typeof data.trading_experience !== 'number' || data.trading_experience < 0 || data.trading_experience > 20)) {
      errors.push('Trading experience must be a number between 0 and 20');
    }

    if (typeof data.verified_status !== 'boolean') {
      errors.push('Verified status must be a boolean');
    }

    if (typeof data.approved !== 'boolean') {
      errors.push('Approved must be a boolean');
    }

    if (data.helpful_count !== undefined && (typeof data.helpful_count !== 'number' || data.helpful_count < 0)) {
      errors.push('Helpful count must be a positive number');
    }

    if (data.reported_count !== undefined && (typeof data.reported_count !== 'number' || data.reported_count < 0)) {
      errors.push('Reported count must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate affiliate link data
   */
  static validateAffiliateLink(data: Partial<BrokerAffiliateLink>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.link_url || data.link_url.trim().length === 0) {
      errors.push('Link URL is required');
    }

    // URL validation
    if (data.link_url) {
      try {
        new URL(data.link_url);
      } catch {
        errors.push('Link URL must be a valid URL');
      }
    }

    // Validation rules
    const validCommissionTypes = ['cpa', 'revshare', 'hybrid'];
    if (data.commission_type && !validCommissionTypes.includes(data.commission_type)) {
      errors.push(`Commission type must be one of: ${validCommissionTypes.join(', ')}`);
    }

    if (typeof data.active_status !== 'boolean') {
      errors.push('Active status must be a boolean');
    }

    if (data.click_count !== undefined && (typeof data.click_count !== 'number' || data.click_count < 0)) {
      errors.push('Click count must be a positive number');
    }

    if (data.conversion_count !== undefined && (typeof data.conversion_count !== 'number' || data.conversion_count < 0)) {
      errors.push('Conversion count must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate promotion data
   */
  static validatePromotion(data: Partial<BrokerPromotion>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    // Validation rules
    if (typeof data.active_status !== 'boolean') {
      errors.push('Active status must be a boolean');
    }

    if (data.bonus_amount !== undefined && (typeof data.bonus_amount !== 'number' || data.bonus_amount < 0)) {
      errors.push('Bonus amount must be a positive number');
    }

    if (data.min_deposit !== undefined && (typeof data.min_deposit !== 'number' || data.min_deposit < 0)) {
      errors.push('Minimum deposit must be a positive number');
    }

    if (data.wagering_requirement !== undefined && (typeof data.wagering_requirement !== 'number' || data.wagering_requirement < 0)) {
      errors.push('Wagering requirement must be a positive number');
    }

    // Date validation
    if (data.start_date) {
      const startDate = new Date(data.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push('Start date must be a valid date');
      }
    }

    if (data.end_date) {
      const endDate = new Date(data.end_date);
      if (isNaN(endDate.getTime())) {
        errors.push('End date must be a valid date');
      }
    }

    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }
    }

    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    if (data.bonus_currency && !validCurrencies.includes(data.bonus_currency)) {
      warnings.push(`Bonus currency code may not be standard: ${data.bonus_currency}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }

  /**
   * Validate complete broker data set
   */
  static validateCompleteBrokerData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate broker
    const brokerResult = this.validateBroker(data.broker || {});
    errors.push(...brokerResult.errors);
    warnings.push(...brokerResult.warnings);

    // Validate regulations
    if (data.regulations && Array.isArray(data.regulations)) {
      data.regulations.forEach((reg: any, index: number) => {
        const regResult = this.validateRegulation(reg);
        errors.push(...regResult.errors.map(e => `Regulation ${index}: ${e}`));
        warnings.push(...regResult.warnings.map(w => `Regulation ${index}: ${w}`));
      });
    }

    // Validate features
    if (data.features && Array.isArray(data.features)) {
      data.features.forEach((feature: any, index: number) => {
        const featureResult = this.validateFeature(feature);
        errors.push(...featureResult.errors.map(e => `Feature ${index}: ${e}`));
        warnings.push(...featureResult.warnings.map(w => `Feature ${index}: ${w}`));
      });
    }

    // Validate other arrays
    const arrayFields = [
      { name: 'tradingConditions', validator: this.validateTradingCondition },
      { name: 'accountTypes', validator: this.validateAccountType },
      { name: 'platforms', validator: this.validatePlatform },
      { name: 'paymentMethods', validator: this.validatePaymentMethod },
      { name: 'support', validator: this.validateSupport },
      { name: 'education', validator: this.validateEducation },
      { name: 'reviews', validator: this.validateReview },
      { name: 'affiliateLinks', validator: this.validateAffiliateLink },
      { name: 'promotions', validator: this.validatePromotion },
    ];

    arrayFields.forEach(({ name, validator }) => {
      if (data[name] && Array.isArray(data[name])) {
        data[name].forEach((item: any, index: number) => {
          const itemResult = validator(item);
          errors.push(...itemResult.errors.map(e => `${name} ${index}: ${e}`));
          warnings.push(...itemResult.warnings.map(w => `${name} ${index}: ${w}`));
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };
  }
}