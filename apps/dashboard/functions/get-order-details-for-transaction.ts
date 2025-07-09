import { Env } from "./types"
import { createAuth0Middleware, type Auth0Context } from "./utils/auth0"

interface ManualOrder {
  id: string
  merchant_id: string
  amount: number
  description: string | null
  status: string
  transfer_request_id: string | null
  merchant_display_name: string | null
  created_at: string
  updated_at: string
}

export async function onRequest(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "*"

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      const url = new URL(request.url)
      const transactionId = url.searchParams.get("transactionId")

      if (!transactionId) {
        return new Response(
          JSON.stringify({ error: "Missing transactionId parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      console.log("Getting order details for transaction:", transactionId)

      // Get the order ID from KV storage using transfer request ID
      const orderId = await env.TRANSFER_MAPPINGS.get(transactionId)
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: "No order found for this transaction" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      console.log("Found order ID from transfer mappings:", orderId)

      // Get order data from database
      const order = await env.MERCHANTS_OAUTH.prepare(
        `SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
         FROM manual_orders
         WHERE id = ?`
      )
        .bind(orderId)
        .first<ManualOrder>()

      if (!order) {
        return new Response(
          JSON.stringify({ error: "Order not found in database" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Verify the merchant owns this order
      if (order.merchant_id !== context.user.sub) {
        return new Response(
          JSON.stringify({ error: "Unauthorized access to order" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const response = {
        orderId: order.id,
        merchantId: order.merchant_id,
        amount: order.amount,
        description: order.description,
        status: order.status,
        transferRequestId: order.transfer_request_id,
        merchantDisplayName: order.merchant_display_name,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }

      console.log("Returning order details:", response)

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
        },
      })
    }
  )(request, env)
}
