import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"
import crypto from "crypto"

// These will be replaced with actual values
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || ""
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || ""

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request } = context
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)

  const { hmac, shop, host, timestamp } = params

  // Check if all required parameters are present
  if (!hmac || !shop || !host || !timestamp) {
    return new Response("Missing required parameters", { status: 400 })
  }

  // Verify HMAC
  const queryParams = new URLSearchParams(params)
  queryParams.delete("hmac") // Remove hmac from the parameters

  // Sort parameters alphabetically
  const sortedParams = Array.from(queryParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  // Create HMAC
  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest("hex")

  // Compare HMACs
  if (generatedHmac !== hmac) {
    return new Response("Invalid HMAC", { status: 401 })
  }

  // Construct OAuth URL
  const redirectUrl =
    `https://${shop}/admin/oauth/authorize?` +
    new URLSearchParams({
      client_id: SHOPIFY_API_KEY,
      scope: "write_payment_sessions,read_payment_sessions",
      redirect_uri: "https://dashboard.zenobiapay.com/shopify/auth/callback",
    }).toString()

  // Redirect to Shopify OAuth
  return Response.redirect(redirectUrl)
}
