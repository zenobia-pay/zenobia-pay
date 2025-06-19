import { Env } from "../types"
import { validateShopifyWebhook } from "../utils/shopify"

export async function onRequest(request: Request, env: Env) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Hmac-SHA256",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    // Validate the webhook HMAC
    const isValid = await validateShopifyWebhook(
      request,
      env.SHOPIFY_CLIENT_SECRET
    )
    if (!isValid) {
      return new Response("Invalid HMAC", { status: 401 })
    }

    // Get the shop domain from the headers
    const shop = request.headers.get("x-shopify-shop-domain")
    if (!shop) {
      return new Response("Missing shop domain", { status: 400 })
    }

    // Get the raw body for processing
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // Log the webhook details
    console.log("===== SHOP ERASURE WEBHOOK RECEIVED =====")
    console.log("Shop:", shop)
    console.log("Body:", body)
    console.log("=====================================")

    // Delete all shop data from your database
    await env.MERCHANTS_OAUTH.prepare(
      "DELETE FROM shopify_stores WHERE shop_domain = ?"
    )
      .bind(shop)
      .run()

    // Return a success response
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
