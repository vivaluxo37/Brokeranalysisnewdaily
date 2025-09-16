// Type definitions for broker data models

export interface Broker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  short_description?: string;
  rating: number;
  review_count: number;
  featured_status: boolean;
  min_deposit: number;
  min_deposit_currency: string;
  spread_type: string;
  typical_spread?: number;
  max_leverage: number;
  established_year?: number;
  headquarters?: string;
  company_size?: string;
  total_assets?: number;
  active_traders?: number;
  meta_title?: string;
  meta_description?: string;
  affiliate_link?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface BrokerRegulation {
  id: string;
  broker_id: string;
  regulatory_body: string;
  license_number?: string;
  regulation_status: string;
  verification_date?: Date;
  jurisdiction?: string;
  created_at: Date;
}

export interface BrokerFeature {
  id: string;
  broker_id: string;
  feature_name: string;
  feature_type: string;
  description?: string;
  availability: boolean;
  category?: string;
  created_at: Date;
}

export interface BrokerTradingCondition {
  id: string;
  broker_id: string;
  instrument_type: string;
  min_spread?: number;
  typical_spread?: number;
  max_leverage?: number;
  commission_rate?: number;
  commission_type: string;
  min_trade_size?: number;
  swap_rates?: string;
  created_at: Date;
}

export interface BrokerAccountType {
  id: string;
  broker_id: string;
  account_name: string;
  account_type?: string;
  min_deposit?: number;
  min_deposit_currency: string;
  spread_type?: string;
  commission?: number;
  leverage?: number;
  islamic_account: boolean;
  demo_available: boolean;
  features?: string;
  created_at: Date;
}

export interface BrokerPlatform {
  id: string;
  broker_id: string;
  platform_name: string;
  platform_type?: string;
  version?: string;
  web_trading: boolean;
  mobile_trading: boolean;
  desktop_trading: boolean;
  features?: string;
  download_url?: string;
  created_at: Date;
}

export interface BrokerPaymentMethod {
  id: string;
  broker_id: string;
  payment_method: string;
  currency?: string;
  min_amount?: number;
  max_amount?: number;
  processing_time?: string;
  fees?: string;
  deposit: boolean;
  withdrawal: boolean;
  created_at: Date;
}

export interface BrokerSupport {
  id: string;
  broker_id: string;
  support_type: string;
  contact_info?: string;
  availability?: string;
  languages?: string;
  response_time?: string;
  created_at: Date;
}

export interface BrokerEducation {
  id: string;
  broker_id: string;
  resource_type: string;
  title: string;
  description?: string;
  url?: string;
  difficulty_level?: string;
  duration?: string;
  language?: string;
  created_at: Date;
}

export interface BrokerReview {
  id: string;
  broker_id: string;
  user_id?: string;
  username?: string;
  email?: string;
  rating: number;
  review_text?: string;
  trading_experience?: number;
  account_type?: string;
  verified_status: boolean;
  approved: boolean;
  helpful_count: number;
  reported_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface BrokerAffiliateLink {
  id: string;
  broker_id: string;
  link_url: string;
  tracking_code?: string;
  commission_rate?: number;
  commission_type: string;
  active_status: boolean;
  geo_targeting?: string;
  device_targeting?: string;
  click_count: number;
  conversion_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface BrokerPromotion {
  id: string;
  broker_id: string;
  title: string;
  description?: string;
  promotion_type?: string;
  bonus_amount?: number;
  bonus_currency: string;
  min_deposit?: number;
  wagering_requirement?: number;
  start_date?: Date;
  end_date?: Date;
  terms_conditions?: string;
  active_status: boolean;
  created_at: Date;
  updated_at: Date;
}