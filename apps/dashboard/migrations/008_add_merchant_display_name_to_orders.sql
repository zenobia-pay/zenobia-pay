-- Add merchant_display_name column to manual_orders table
ALTER TABLE manual_orders ADD COLUMN merchant_display_name TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_manual_orders_merchant_display_name ON manual_orders(merchant_display_name);