import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface CreateTransferRequest {
  sessionId: string
}

interface ShopifyStore {
  shop: string
  access_token: string
  zenobia_client_id: string
  zenobia_client_secret: string
}

interface CheckoutSession {
  shop: string
  returnUrl: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
}

async function getAccessToken(
  env: Env,
  clientId: string,
  clientSecret: string
): Promise<string> {
  try {
    const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
    const audience = env.ACCOUNTS_AUDIENCE || ""

    if (!clientId || !clientSecret) {
      console.warn("No Auth0 credentials provided, using test mode")
      return "test_token"
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to get access token: ${response.status} ${errorText}`
      )
    }

    const data = await response.json()
    return data.access_token
  } catch (err) {
    console.error("Auth0 authentication error:", err)
    throw new Error("Failed to authenticate with Auth0")
  }
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
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

  try {
    // Parse the request body
    const body = (await request.json()) as CreateTransferRequest
    const { sessionId } = body

    if (!sessionId) {
      return new Response("Missing sessionId in request body", { status: 400 })
    }

    // Get session data from KV
    const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(sessionId)
    if (!sessionData) {
      return new Response("Session not found", { status: 404 })
    }

    const session = JSON.parse(sessionData) as CheckoutSession

    // Get the store based on the shop domain
    const store = await env.MERCHANTS_OAUTH.prepare(
      `SELECT * FROM shopify_stores WHERE shop = ?`
    )
      .bind(session.shop)
      .first<ShopifyStore>()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    if (!store.zenobia_client_id || !store.zenobia_client_secret) {
      return new Response("Store not configured with Zenobia credentials", {
        status: 400,
      })
    }

    // Get Auth0 access token using store-specific credentials
    const accessToken = await getAccessToken(
      env,
      store.zenobia_client_id,
      store.zenobia_client_secret
    )

    const transferRequestBody = {
      amount: Math.round(parseFloat(session.amount || "0") * 100),
      statementItems: [
        {
          name: "Payment",
          amount: Math.round(parseFloat(session.amount || "0") * 100),
        },
      ],
      metadata: {
        sessionId: sessionId,
        shop: session.shop,
        email: session.email,
        currency: session.currency,
      },
    }

    console.log("Creating transfer request with body:", transferRequestBody)

    // Create transfer request with Zenobia Pay
    const transferResponse = await fetch(
      `${env.API_BASE_URL}/create-transfer-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(transferRequestBody),
      }
    )

    if (!transferResponse.ok) {
      const error = await transferResponse.text()
      console.error("Failed to create transfer:", error)
      return new Response("Failed to create transfer", { status: 500 })
    }

    const transferData = await transferResponse.json()

    // Store the mapping between transfer ID and session ID
    await env.TRANSFER_MAPPINGS.put(transferData.transferRequestId, sessionId)

    return new Response(JSON.stringify(transferData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Create transfer error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
