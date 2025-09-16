-- Create broker data tables for BrokerAnalysis.com

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main broker information table
CREATE TABLE brokers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  short_description TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  featured_status BOOLEAN DEFAULT FALSE,
  min_deposit DECIMAL(15,2) DEFAULT 0.00,
  min_deposit_currency VARCHAR(3) DEFAULT 'USD',
  spread_type VARCHAR(50) DEFAULT 'Variable',
  typical_spread DECIMAL(10,4),
  max_leverage INTEGER DEFAULT 0,
  established_year INTEGER,
  headquarters VARCHAR(255),
  company_size VARCHAR(100),
  total_assets DECIMAL(20,2),
  active_traders INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  affiliate_link TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker regulatory information
CREATE TABLE broker_regulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  regulatory_body VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  regulation_status VARCHAR(50) DEFAULT 'Regulated',
  verification_date DATE,
  jurisdiction VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, regulatory_body, jurisdiction)
);

-- Broker features and services
CREATE TABLE broker_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  feature_name VARCHAR(255) NOT NULL,
  feature_type VARCHAR(100) NOT NULL,
  description TEXT,
  availability BOOLEAN DEFAULT TRUE,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, feature_name)
);

-- Broker trading conditions
CREATE TABLE broker_trading_conditions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  instrument_type VARCHAR(100) NOT NULL,
  min_spread DECIMAL(10,4),
  typical_spread DECIMAL(10,4),
  max_leverage INTEGER,
  commission_rate DECIMAL(10,4),
  commission_type VARCHAR(50) DEFAULT 'per_lot',
  min_trade_size DECIMAL(15,2),
  swap_rates TEXT, -- JSON for long/short swap rates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, instrument_type)
);

-- Broker account types
CREATE TABLE broker_account_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(100),
  min_deposit DECIMAL(15,2),
  min_deposit_currency VARCHAR(3) DEFAULT 'USD',
  spread_type VARCHAR(50),
  commission DECIMAL(10,4),
  leverage INTEGER,
  islamic_account BOOLEAN DEFAULT FALSE,
  demo_available BOOLEAN DEFAULT TRUE,
  features TEXT, -- JSON array of features
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, account_name)
);

-- Broker trading platforms
CREATE TABLE broker_platforms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  platform_name VARCHAR(255) NOT NULL,
  platform_type VARCHAR(100),
  version VARCHAR(50),
  web_trading BOOLEAN DEFAULT FALSE,
  mobile_trading BOOLEAN DEFAULT FALSE,
  desktop_trading BOOLEAN DEFAULT FALSE,
  features TEXT, -- JSON array of features
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, platform_name)
);

-- Broker payment methods
CREATE TABLE broker_payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  payment_method VARCHAR(255) NOT NULL,
  currency VARCHAR(10),
  min_amount DECIMAL(15,2),
  max_amount DECIMAL(15,2),
  processing_time VARCHAR(100),
  fees TEXT, -- JSON for fee structure
  deposit BOOLEAN DEFAULT TRUE,
  withdrawal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, payment_method, currency)
);

-- Broker customer support
CREATE TABLE broker_support (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  support_type VARCHAR(100) NOT NULL, -- 'phone', 'email', 'live_chat', 'ticket'
  contact_info VARCHAR(255),
  availability VARCHAR(100),
  languages TEXT, -- JSON array of supported languages
  response_time VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, support_type)
);

-- Broker educational resources
CREATE TABLE broker_education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  resource_type VARCHAR(100) NOT NULL, -- 'webinar', 'course', 'article', 'video', 'ebook'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT,
  difficulty_level VARCHAR(50),
  duration VARCHAR(100),
  language VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reviews
CREATE TABLE broker_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  user_id UUID, -- Will reference Clerk users when implemented
  username VARCHAR(255),
  email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  trading_experience INTEGER CHECK (trading_experience >= 0 AND trading_experience <= 20),
  account_type VARCHAR(100),
  verified_status BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate links and tracking
CREATE TABLE broker_affiliate_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  link_url TEXT NOT NULL,
  tracking_code VARCHAR(255),
  commission_rate DECIMAL(10,4),
  commission_type VARCHAR(50) DEFAULT 'cpa',
  active_status BOOLEAN DEFAULT TRUE,
  geo_targeting TEXT, -- JSON for geo-specific targeting
  device_targeting TEXT, -- JSON for device-specific targeting
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker promotions and bonuses
CREATE TABLE broker_promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  promotion_type VARCHAR(100),
  bonus_amount DECIMAL(15,2),
  bonus_currency VARCHAR(3) DEFAULT 'USD',
  min_deposit DECIMAL(15,2),
  wagering_requirement INTEGER,
  start_date DATE,
  end_date DATE,
  terms_conditions TEXT,
  active_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_brokers_rating ON brokers(rating DESC);
CREATE INDEX idx_brokers_featured ON brokers(featured_status, status);
CREATE INDEX idx_brokers_name ON brokers(name);
CREATE INDEX idx_brokers_slug ON brokers(slug);
CREATE INDEX idx_regulations_broker ON broker_regulations(broker_id);
CREATE INDEX idx_features_broker ON broker_features(broker_id);
CREATE INDEX idx_conditions_broker ON broker_trading_conditions(broker_id);
CREATE INDEX idx_reviews_broker ON broker_reviews(broker_id, approved, created_at DESC);
CREATE INDEX idx_reviews_rating ON broker_reviews(rating);
CREATE INDEX idx_affiliate_broker ON broker_affiliate_links(broker_id, active_status);
CREATE INDEX idx_promotions_broker ON broker_promotions(broker_id, active_status, start_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON brokers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON broker_affiliate_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON broker_promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON broker_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();