-- Add display_order column to brokers table
ALTER TABLE brokers
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_brokers_display_order ON brokers(display_order);

-- Update existing brokers with default display order based on name
UPDATE brokers
SET display_order = ROW_NUMBER() OVER (ORDER BY name ASC)
WHERE display_order = 999;