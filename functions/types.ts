import { D1Database } from "@cloudflare/workers-types"

export interface Env {
  BIGCOMMERCE_CLIENT_ID: string
  BIGCOMMERCE_CLIENT_SECRET: string
  MERCHANTS_OAUTH: D1Database
  ACCOUNTS_DOMAIN: string
  ZENOBIA_CLIENT_ID: string
  ZENOBIA_CLIENT_SECRET: string
  ACCOUNTS_AUDIENCE: string
  API_DOMAIN: string
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
