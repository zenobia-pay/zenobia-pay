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

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
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
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Create transfer error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
