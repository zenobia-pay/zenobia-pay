import { KVNamespace, D1Database } from "@cloudflare/workers-types"

export interface Env {
  SHOPIFY_CHECKOUT_SESSION_KV: KVNamespace
  MERCHANTS_OAUTH: D1Database
  TRANSFER_MAPPINGS: KVNamespace
  ACCOUNTS_DOMAIN: string
  ACCOUNTS_AUDIENCE: string
  API_BASE_URL: string
}
