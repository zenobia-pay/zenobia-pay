CREATE TABLE IF NOT EXISTS shopify_stores (
  shop_domain TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shopify_stores_domain ON shopify_stores(shop_domain);

ALTER TABLE shopify_stores
ADD COLUMN zenobia_client_id TEXT,
ADD COLUMN zenobia_client_secret TEXT;