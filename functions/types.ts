import { D1Database, KVNamespace } from "@cloudflare/workers-types"

export interface Env {
  BIGCOMMERCE_CLIENT_ID: string
  BIGCOMMERCE_CLIENT_SECRET: string
  MERCHANTS_OAUTH: D1Database
  ACCOUNTS_DOMAIN: string
  ZENOBIA_CLIENT_ID: string
  ZENOBIA_CLIENT_SECRET: string
  ACCOUNTS_AUDIENCE: string
  API_DOMAIN: string
  API_BASE_URL: string
  TRANSFER_MAPPINGS: KVNamespace
  SUBSCRIBE_HMAC: string
  SHOPIFY_CLIENT_ID: string
  SHOPIFY_CLIENT_SECRET: string
  SHOPIFY_ENCRYPTION_KEY: string
  SHOPIFY_PROXY_SECRET: string
  SHOPIFY_CHECKOUT_SESSION_KV: KVNamespace
  TESTMODE_API_BASE_URL: string
}

export interface BigCommerceToken {
  access_token: string
  scope: string
  user: {
    id: number
    email: string
  }
  context: string
  created_at: number
}

export interface BigCommerceStore {
  id: number
  store_hash: string
  access_token: string
  scope: string
  user_id: number
  user_email: string
  created_at: number
  updated_at: number
}
