import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface CreateTransferRequest {
  checkoutId: string
}

interface BigCommerceStore {
  store_hash: string
  access_token: string
  url_endpoint: string
  zenobia_client_id: string
  zenobia_client_secret: string
}

interface CheckoutData {
  id: string
  cart: {
    id: string
    currency: {
      code: string
    }
    line_items: {
      physical_items: Array<{
        id: string
        quantity: number
        list_price: number
      }>
      digital_items: Array<{
        id: string
        quantity: number
        list_price: number
      }>
    }
  }
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

function normalizeHostname(origin: string): string {
  // Remove protocol and www
  let hostname = origin.replace(/^https?:\/\//, "").toLowerCase()
  if (hostname.startsWith("www.")) {
    hostname = hostname.substring(4)
  }
  return hostname
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

    // Get the store based on the origin hostname
    const normalizedHostname = normalizeHostname(origin)
    console.log("Looking up store with hostname:", normalizedHostname)

    const store = await env.MERCHANTS_OAUTH.prepare(
      `SELECT * FROM bigcommerce_stores WHERE url_endpoint = ?`
    )
      .bind(normalizedHostname)
      .first<BigCommerceStore>()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    if (!store.zenobia_client_id || !store.zenobia_client_secret) {
      return new Response("Store not configured with Zenobia credentials", {
        status: 400,
      })
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

    const checkoutData = (await checkoutResponse.json()) as CheckoutData
    console.log("Checkout data:", checkoutData)

    // Calculate total amount from line items
    const totalAmount = [
      ...checkoutData.cart.line_items.physical_items,
      ...checkoutData.cart.line_items.digital_items,
    ].reduce((sum, item) => sum + item.list_price * item.quantity, 0)

    // Create transfer request with Zenobia Pay
    const transferResponse = await fetch(
      "https://api.zenobiapay.com/create-transfer-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${store.zenobia_client_id}:${store.zenobia_client_secret}`)}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: checkoutData.cart.currency.code,
          metadata: {
            checkoutId: checkoutData.id,
            cartId: checkoutData.cart.id,
            storeHash: store.store_hash,
          },
        }),
      }
    )

    if (!transferResponse.ok) {
      const error = await transferResponse.text()
      console.error("Failed to create transfer:", error)
      return new Response("Failed to create transfer", { status: 500 })
    }

    const transferData = await transferResponse.json()

    return new Response(JSON.stringify(transferData), {
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
