-- Create the bigcommerce_stores table
CREATE TABLE IF NOT EXISTS bigcommerce_stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_hash TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  scope TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  account_uuid TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Create an index on store_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_bigcommerce_stores_hash ON bigcommerce_stores(store_hash);

-- Create an index on account_uuid for faster lookups
CREATE INDEX IF NOT EXISTS idx_bigcommerce_stores_account ON bigcommerce_stores(account_uuid);