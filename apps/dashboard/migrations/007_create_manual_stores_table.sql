CREATE TABLE IF NOT EXISTS manual_stores (
  merchant_id TEXT PRIMARY KEY,
  zenobia_client_id TEXT NOT NULL,
  zenobia_client_secret TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manual_stores_merchant_id ON manual_stores(merchant_id);