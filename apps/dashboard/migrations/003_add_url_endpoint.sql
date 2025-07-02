-- Add url_endpoint column to bigcommerce_stores table
ALTER TABLE bigcommerce_stores
ADD COLUMN url_endpoint TEXT;

-- Create an index on url_endpoint for faster lookups
CREATE INDEX IF NOT EXISTS idx_bigcommerce_stores_url_endpoint ON bigcommerce_stores(url_endpoint);