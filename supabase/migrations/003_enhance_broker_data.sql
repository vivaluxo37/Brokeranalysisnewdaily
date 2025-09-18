-- Add comprehensive broker information fields
-- Migration to enhance broker data storage

-- Add contact information fields
ALTER TABLE brokers ADD COLUMN phone VARCHAR(50);
ALTER TABLE brokers ADD COLUMN email VARCHAR(255);
ALTER TABLE brokers ADD COLUMN address TEXT;
ALTER TABLE brokers ADD COLUMN support_languages TEXT[] DEFAULT '{}';

-- Add array fields for quick access
ALTER TABLE brokers ADD COLUMN regulations JSON[] DEFAULT '[]';
ALTER TABLE brokers ADD COLUMN platforms TEXT[] DEFAULT '{}';
ALTER TABLE brokers ADD COLUMN payment_methods TEXT[] DEFAULT '{}';
ALTER TABLE brokers ADD COLUMN account_types JSON[] DEFAULT '[]';

-- Add enhanced leverage information
ALTER TABLE brokers ADD COLUMN leverage_info JSON;

-- Add social media and additional contact
ALTER TABLE brokers ADD COLUMN facebook_url TEXT;
ALTER TABLE brokers ADD COLUMN twitter_url TEXT;
ALTER TABLE brokers ADD COLUMN linkedin_url TEXT;
ALTER TABLE brokers ADD COLUMN youtube_url TEXT;

-- Add trading-related fields
ALTER TABLE brokers ADD COLUMN minimum_trade_size DECIMAL(15,2);
ALTER TABLE brokers ADD COLUMN maximum_trade_size DECIMAL(20,2);
ALTER TABLE brokers ADD COLUMN scalping_allowed BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN hedging_allowed BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN expert_advisors BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN news_trading BOOLEAN DEFAULT true;

-- Add withdrawal fields
ALTER TABLE brokers ADD COLUMN withdrawal_methods TEXT[] DEFAULT '{}';
ALTER TABLE brokers ADD COLUMN withdrawal_time VARCHAR(100);
ALTER TABLE brokers ADD COLUMN withdrawal_fee DECIMAL(10,2) DEFAULT 0.00;

-- Add customer support fields
ALTER TABLE brokers ADD COLUMN support_24_7 BOOLEAN DEFAULT false;
ALTER TABLE brokers ADD COLUMN live_chat BOOLEAN DEFAULT false;
ALTER TABLE brokers ADD COLUMN phone_support BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN ticket_system BOOLEAN DEFAULT false;

-- Add additional company information
ALTER TABLE brokers ADD COLUMN parent_company VARCHAR(255);
ALTER TABLE brokers ADD COLUMN number_of_employees INTEGER;
ALTER TABLE brokers ADD COLUMN countries_served INTEGER;

-- Create indexes for new array fields
CREATE INDEX idx_brokers_platforms ON brokers USING GIN(platforms);
CREATE INDEX idx_brokers_payment_methods ON brokers USING GIN(payment_methods);
CREATE INDEX idx_brokers_regulations ON brokers USING GIN(regulations);

-- Create function to update related tables when array fields change
CREATE OR REPLACE FUNCTION sync_broker_arrays()
RETURNS TRIGGER AS $$
BEGIN
    -- Sync regulations to broker_regulations table
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        DELETE FROM broker_regulations WHERE broker_id = NEW.id;

        IF NEW.regulations IS NOT NULL THEN
            INSERT INTO broker_regulations (broker_id, regulatory_body, regulation_status, jurisdiction)
            SELECT
                NEW.id,
                reg->>'body',
                COALESCE(reg->>'status', 'Regulated'),
                COALESCE(reg->>'jurisdiction', 'Global')
            FROM unnest(NEW.regulations) AS reg;
        END IF;

        -- Sync platforms to broker_platforms table
        DELETE FROM broker_platforms WHERE broker_id = NEW.id;

        IF NEW.platforms IS NOT NULL THEN
            INSERT INTO broker_platforms (broker_id, platform_name, platform_type)
            SELECT
                NEW.id,
                platform,
                'Trading'
            FROM unnest(NEW.platforms) AS platform;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync arrays
CREATE TRIGGER sync_broker_data
    AFTER INSERT OR UPDATE ON brokers
    FOR EACH ROW
    EXECUTE FUNCTION sync_broker_arrays();