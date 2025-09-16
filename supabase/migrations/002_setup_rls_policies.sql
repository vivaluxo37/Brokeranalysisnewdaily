-- Row Level Security (RLS) Policies for BrokerAnalysis.com

-- Enable RLS on all tables
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_trading_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_promotions ENABLE ROW LEVEL SECURITY;

-- Create roles for different access levels
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'broker_readonly') THEN
        CREATE ROLE broker_readonly;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'broker_editor') THEN
        CREATE ROLE broker_editor;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'broker_admin') THEN
        CREATE ROLE broker_admin;
    END IF;
END $$;

-- Grant role hierarchy
GRANT broker_readonly TO broker_editor;
GRANT broker_editor TO broker_admin;

-- Public read-only access for active brokers
CREATE POLICY "Allow public read access to active brokers" ON brokers
    FOR SELECT
    USING (status = 'active');

-- Allow authenticated users to read all brokers
CREATE POLICY "Allow authenticated users to read all brokers" ON brokers
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow editors to insert/update brokers
CREATE POLICY "Allow editors to insert brokers" ON brokers
    FOR INSERT
    TO broker_editor
    WITH CHECK (true);

CREATE POLICY "Allow editors to update brokers" ON brokers
    FOR UPDATE
    TO broker_editor
    USING (true)
    WITH CHECK (true);

-- Allow admins to delete brokers
CREATE POLICY "Allow admins to delete brokers" ON brokers
    FOR DELETE
    TO broker_admin
    USING (true);

-- Regulations policies
CREATE POLICY "Public read access to regulations" ON broker_regulations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_regulations.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage regulations" ON broker_regulations
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_regulations.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Features policies
CREATE POLICY "Public read access to features" ON broker_features
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_features.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage features" ON broker_features
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_features.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Trading conditions policies
CREATE POLICY "Public read access to trading conditions" ON broker_trading_conditions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_trading_conditions.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage trading conditions" ON broker_trading_conditions
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_trading_conditions.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Account types policies
CREATE POLICY "Public read access to account types" ON broker_account_types
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_account_types.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage account types" ON broker_account_types
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_account_types.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Platforms policies
CREATE POLICY "Public read access to platforms" ON broker_platforms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_platforms.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage platforms" ON broker_platforms
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_platforms.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Payment methods policies
CREATE POLICY "Public read access to payment methods" ON broker_payment_methods
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_payment_methods.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage payment methods" ON broker_payment_methods
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_payment_methods.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Support policies
CREATE POLICY "Public read access to support" ON broker_support
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_support.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage support" ON broker_support
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_support.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Education policies
CREATE POLICY "Public read access to education" ON broker_education
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_education.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage education" ON broker_education
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_education.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Reviews policies - more complex due to approval system
CREATE POLICY "Public read access to approved reviews" ON broker_reviews
    FOR SELECT
    USING (
        approved = true AND
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_reviews.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Users can read their own reviews" ON broker_reviews
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_reviews.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Users can create reviews" ON broker_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_reviews.broker_id
            AND brokers.status = 'active'
        ) AND
        user_id = auth.uid() AND
        approved = false -- New reviews require approval
    );

CREATE POLICY "Users can update their own reviews" ON broker_reviews
    FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_reviews.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (
        user_id = auth.uid() AND
        approved = false -- Keep unapproved for re-approval
    );

CREATE POLICY "Editors can approve reviews" ON broker_reviews
    FOR UPDATE
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_reviews.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Affiliate links policies - restricted access
CREATE POLICY "Public read access to active affiliate links" ON broker_affiliate_links
    FOR SELECT
    USING (
        active_status = true AND
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_affiliate_links.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage affiliate links" ON broker_affiliate_links
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_affiliate_links.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Promotions policies
CREATE POLICY "Public read access to active promotions" ON broker_promotions
    FOR SELECT
    USING (
        active_status = true AND
        (end_date IS NULL OR end_date >= CURRENT_DATE) AND
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_promotions.broker_id
            AND brokers.status = 'active'
        )
    );

CREATE POLICY "Editors can manage promotions" ON broker_promotions
    FOR ALL
    TO broker_editor
    USING (
        EXISTS (
            SELECT 1 FROM brokers
            WHERE brokers.id = broker_promotions.broker_id
            AND brokers.status = 'active'
        )
    )
    WITH CHECK (true);

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM pg_roles r
        JOIN pg_auth_members m ON m.roleid = r.oid
        JOIN pg_user u ON u.usesysid = m.member
        WHERE r.rolname = role_name
        AND u.usename = current_user
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access broker
CREATE OR REPLACE FUNCTION can_access_broker(broker_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admins can access all brokers
    IF has_role('broker_admin') THEN
        RETURN true;
    END IF;

    -- Editors can access active brokers
    IF has_role('broker_editor') THEN
        RETURN EXISTS (
            SELECT 1 FROM brokers
            WHERE id = broker_id AND status = 'active'
        );
    END IF;

    -- Public can only access active brokers
    RETURN EXISTS (
        SELECT 1 FROM brokers
        WHERE id = broker_id AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically set timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_brokers_updated_at
    BEFORE UPDATE ON brokers
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_affiliate_links_updated_at
    BEFORE UPDATE ON broker_affiliate_links
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_promotions_updated_at
    BEFORE UPDATE ON broker_promotions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_reviews_updated_at
    BEFORE UPDATE ON broker_reviews
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Grant necessary permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read access to anon role for public data
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON brokers TO anon;
GRANT SELECT ON broker_regulations TO anon;
GRANT SELECT ON broker_features TO anon;
GRANT SELECT ON broker_trading_conditions TO anon;
GRANT SELECT ON broker_account_types TO anon;
GRANT SELECT ON broker_platforms TO anon;
GRANT SELECT ON broker_payment_methods TO anon;
GRANT SELECT ON broker_support TO anon;
GRANT SELECT ON broker_education TO anon;
GRANT SELECT ON broker_reviews TO anon;
GRANT SELECT ON broker_affiliate_links TO anon;
GRANT SELECT ON broker_promotions TO anon;

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON broker_reviews TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;