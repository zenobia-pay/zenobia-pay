import { Env } from "../../types"
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
    console.log("Attempting to verify JWT token...")

    // Create the JWKS client
    const jwksClient = jose.createRemoteJWKSet(
      new URL("https://zenobiapay.com/.well-known/jwks.json")
    )

    // Verify the JWT with detailed error handling
    try {
      const result = await jose.jwtVerify(token, jwksClient, {
        algorithms: ["RS256"],
      })
      console.log("JWT verification successful")
      return result
    } catch (verifyError) {
      console.error("JWT verification failed with error:", verifyError)
      if (verifyError instanceof jose.errors.JWTExpired) {
        console.error("Token has expired")
      } else if (verifyError instanceof jose.errors.JWTInvalid) {
        console.error("Token is invalid")
      } else if (
        verifyError instanceof jose.errors.JWSSignatureVerificationFailed
      ) {
        console.error("Token signature verification failed")
      }
      return null
    }
  } catch (error) {
    console.error("Unexpected error during JWT verification:", error)
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
      body = JSON.parse(bodyText)
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
      console.log(
        "JWT transferRequestId:",
        jwtVerification.payload.transferRequestId
      )
      console.log("Body transferRequestId:", body.transferRequestId)
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

    // In flight means to create the order in BigCommerce
    if (body.status === "IN_FLIGHT") {
      // Get the checkout ID from KV storage
      const checkoutId = await env.TRANSFER_MAPPINGS.get(body.transferRequestId)
      if (!checkoutId) {
        console.error(
          "No checkout ID found for transfer request:",
          body.transferRequestId
        )
        return new Response("Checkout ID not found", { status: 400 })
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

      console.log("orderResponse", orderResponse)

      const orderData = await orderResponse.json()
      console.log("Order created successfully:", orderData)

      // Update the order with payment method and status
      const orderId = orderData.data.id
      const updateOrderResponse = await fetch(
        `https://api.bigcommerce.com/stores/${store.store_hash}/v2/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": store.access_token,
          },
          body: JSON.stringify({
            payment_method: "Zenobia",
            status_id: 7,
          }),
        }
      )

      if (!updateOrderResponse.ok) {
        const error = await updateOrderResponse.text()
        console.error("Failed to update order:", error)
        return new Response("Failed to update order", { status: 500 })
      }

      console.log("Order updated successfully")
    } else if (body.status === "COMPLETED") {
      // TODO: Create the shipment and mark the order as shipped
      console.log("Order completed:", body)
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

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const storeId = url.pathname.split("/").pop()

  if (!storeId) {
    console.error("Store ID is required")
    return new Response("Store ID is required", { status: 400 })
  }

  return await handleWebhook(request, env, storeId)
}
