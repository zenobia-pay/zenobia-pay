import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

async function generateHmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  )

  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
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
  const generatedHmac = await generateHmac(sortedParams, env.SHOPIFY_API_SECRET)

  // Compare HMACs
  if (generatedHmac !== hmac) {
    return new Response("Invalid HMAC", { status: 401 })
  }

  // Construct OAuth URL
  const redirectUrl =
    `https://${shop}/admin/oauth/authorize?` +
    new URLSearchParams({
      client_id: env.SHOPIFY_API_KEY,
      scope: "write_payment_sessions,read_payment_sessions",
      redirect_uri: "https://dashboard.zenobiapay.com/shopify/auth/callback",
    }).toString()

  // Redirect to Shopify OAuth
  return Response.redirect(redirectUrl)
}
