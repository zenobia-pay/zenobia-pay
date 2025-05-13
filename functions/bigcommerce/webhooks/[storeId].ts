import { Env } from "../../types"
import { EventContext } from "@cloudflare/workers-types"
import * as jose from "jose"

interface WebhookPayload {
  transferRequestId: string
  status: string
  amount: number
}

interface BigCommerceStore {
  store_hash: string
  access_token: string
}

// Helper function to add CORS headers to a response
function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  headers.set("Access-Control-Max-Age", "86400") // 24 hours

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// Function to verify JWT token from Authorization header
async function verifyJWT(
  authHeader: string | null
): Promise<jose.JWTVerifyResult | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Invalid or missing Authorization header")
    return null
  }

  try {
    const token = authHeader.split(" ")[1]

    const jwksResponse = await fetch(
      "https://zenobiapay.com/.well-known/jwks.json"
    )
    if (!jwksResponse.ok) {
      throw new Error(`Failed to fetch JWKS: ${jwksResponse.status}`)
    }

    const keyStore = jose.createRemoteJWKSet(
      new URL("https://zenobiapay.com/.well-known/jwks.json")
    )

    // Verify the JWT
    const result = await jose.jwtVerify(token, keyStore, {
      algorithms: ["RS256"],
    })

    return result
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

async function handleWebhook(
  request: Request,
  env: Env,
  storeId: string
): Promise<Response> {
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

  if (request.method !== "POST") {
    const errorResponse = new Response("Method not allowed", { status: 405 })
    return addCorsHeaders(errorResponse)
  }

  try {
    // Clone the request for logging
    const clonedRequest = request.clone()

    // Get request details
    const headers = Object.fromEntries(clonedRequest.headers.entries())
    const url = clonedRequest.url
    const method = clonedRequest.method
    const authHeader = clonedRequest.headers.get("authorization")

    // Get the request body as text and try to parse it as JSON
    let body: WebhookPayload
    const contentType = clonedRequest.headers.get("content-type")
    const bodyText = await clonedRequest.text()

    console.log("Content-Type:", contentType)
    console.log("bodyText:", bodyText)

    try {
      if (contentType && contentType.includes("application/json")) {
        body = JSON.parse(bodyText)
      } else {
        body = bodyText as unknown as WebhookPayload
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      body = bodyText as unknown as WebhookPayload
    }

    // Log the webhook details
    console.log("===== WEBHOOK RECEIVED =====")
    console.log("URL:", url)
    console.log("Method:", method)
    console.log("Headers:", headers)
    console.log("Body:", body)
    console.log("============================")

    // Verify the JWT token
    const jwtVerification = await verifyJWT(authHeader)

    if (!jwtVerification) {
      console.error("JWT verification failed - unauthorized request")
      const errorResponse = new Response(
        JSON.stringify({ error: "Unauthorized - invalid signature" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
      return addCorsHeaders(errorResponse)
    }

    console.log("JWT verified successfully:", jwtVerification.payload)

    // Verify that the JWT payload matches the body content (transferRequestId)
    if (jwtVerification.payload.transferRequestId !== body.transferRequestId) {
      console.error(
        "JWT transferRequestId doesn't match body transferRequestId"
      )
      const errorResponse = new Response(
        JSON.stringify({
          error: "Bad Request - token payload doesn't match body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
      return addCorsHeaders(errorResponse)
    }

    // Get store details from database
    const store = await env.MERCHANTS_OAUTH.prepare(
      `SELECT store_hash, access_token FROM bigcommerce_stores WHERE store_hash = ?`
    )
      .bind(storeId)
      .first<BigCommerceStore>()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    // If the transfer is successful, create the order in BigCommerce
    if (body.status === "completed") {
      // Get the checkout ID from the metadata
      const checkoutId = jwtVerification.payload.checkoutId
      if (!checkoutId) {
        return new Response("Missing checkout ID in token", { status: 400 })
      }

      // Create the order from the checkout
      const orderResponse = await fetch(
        `https://api.bigcommerce.com/stores/${store.store_hash}/v3/checkouts/${checkoutId}/orders`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": store.access_token,
          },
        }
      )

      if (!orderResponse.ok) {
        const error = await orderResponse.text()
        console.error("Failed to create order:", error)
        return new Response("Failed to create order", { status: 500 })
      }

      const orderData = await orderResponse.json()
      console.log("Order created successfully:", orderData)
    }

    // Return a success response
    const response = new Response(
      JSON.stringify({
        status: "success",
        message: "Webhook received and processed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )

    return addCorsHeaders(response)
  } catch (error) {
    console.error("Error processing webhook:", error)
    const errorResponse = new Response(
      JSON.stringify({ error: "Failed to process webhook" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
    return addCorsHeaders(errorResponse)
  }
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)
  const storeId = url.pathname.split("/").pop()

  if (!storeId) {
    console.error("Store ID is required")
    return new Response("Store ID is required", { status: 400 })
  }

  return await handleWebhook(request as unknown as Request, env, storeId)
}
