-- Add Zenobia credentials columns to bigcommerce_stores table
ALTER TABLE bigcommerce_stores
ADD COLUMN zenobia_client_id TEXT,
ADD COLUMN zenobia_client_secret TEXT;