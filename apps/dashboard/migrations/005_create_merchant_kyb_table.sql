CREATE TABLE IF NOT EXISTS merchant_kyb (
  id TEXT PRIMARY KEY,
  legal_name TEXT NOT NULL,
  business_name TEXT,
  entity_type TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  tax_id_type TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  incorporation_date TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  zip5 TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_merchant_kyb_status ON merchant_kyb(status);
CREATE INDEX IF NOT EXISTS idx_merchant_kyb_created_at ON merchant_kyb(created_at);
CREATE INDEX IF NOT EXISTS idx_merchant_kyb_tax_id ON merchant_kyb(tax_id);