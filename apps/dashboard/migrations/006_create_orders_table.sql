CREATE TABLE IF NOT EXISTS manual_orders (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  transfer_request_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_manual_orders_merchant_id ON manual_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_manual_orders_status ON manual_orders(status);
CREATE INDEX IF NOT EXISTS idx_manual_orders_created_at ON manual_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_manual_orders_transfer_request_id ON manual_orders(transfer_request_id);