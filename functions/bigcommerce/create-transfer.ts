import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface CreateTransferRequest {
  checkoutId: string
}

interface BigCommerceStore {
  store_hash: string
  access_token: string
  url_endpoint: string
}

// List of allowed BigCommerce domains
const ALLOWED_ORIGINS = [
  "https://*.mybigcommerce.com",
  "https://*.bigcommerce.com",
]

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$")
    return regex.test(origin)
  })
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const origin = request.headers.get("Origin")

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    if (!origin || !isAllowedOrigin(origin)) {
      return new Response(null, { status: 403 })
    }

    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Check origin for actual requests
  if (!origin || !isAllowedOrigin(origin)) {
    return new Response("Forbidden", { status: 403 })
  }

  try {
    // Parse the request body
    const body = (await request.json()) as CreateTransferRequest
    const { checkoutId } = body

    if (!checkoutId) {
      return new Response("Missing checkoutId in request body", { status: 400 })
    }

    // Get the store based on the URL endpoint
    const url = new URL(request.url)
    const store = await env.MERCHANTS_OAUTH.prepare(
      `SELECT * FROM bigcommerce_stores WHERE url_endpoint = ?`
    )
      .bind(url.hostname)
      .first<BigCommerceStore>()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    // Fetch checkout details from BigCommerce
    const checkoutResponse = await fetch(
      `https://api.bigcommerce.com/stores/${store.store_hash}/v3/checkouts/${checkoutId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-Token": store.access_token,
        },
      }
    )

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text()
      console.error("Failed to fetch checkout:", error)
      return new Response("Failed to fetch checkout details", { status: 500 })
    }

    const checkoutData = await checkoutResponse.json()
    console.log("Checkout data:", checkoutData)

    // TODO: Process the checkout data and create the transfer
    // This will depend on your specific requirements for creating transfers

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    })
  } catch (error) {
    console.error("Create transfer error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
