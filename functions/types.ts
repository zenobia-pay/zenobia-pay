import { D1Database } from "@cloudflare/workers-types"

export interface Env {
  BIGCOMMERCE_CLIENT_ID: string
  BIGCOMMERCE_CLIENT_SECRET: string
  DB: D1Database
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
