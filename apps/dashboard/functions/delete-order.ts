import { Env } from "./types"
import { createAuth0Middleware, type Auth0Context } from "./utils/auth0"

export async function onRequest(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "*"

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      try {
        const url = new URL(request.url)
        const orderId = url.searchParams.get("orderId")

        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Order ID is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        const merchantId = context.user.sub

        // Check if order exists and belongs to the merchant
        const existingOrder = await env.MERCHANTS_OAUTH.prepare(
          `SELECT id, merchant_id, status
           FROM manual_orders
           WHERE id = ? AND merchant_id = ?`
        )
          .bind(orderId, merchantId)
          .first()

        if (!existingOrder) {
          return new Response(JSON.stringify({ error: "Order not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          })
        }

        // Only allow deletion if order is pending
        if (existingOrder.status !== "pending") {
          return new Response(
            JSON.stringify({
              error: "Cannot delete order that is not pending",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        // Delete the order
        const result = await env.MERCHANTS_OAUTH.prepare(
          `DELETE FROM manual_orders
           WHERE id = ? AND merchant_id = ?`
        )
          .bind(orderId, merchantId)
          .run()

        if (result.meta.changes === 0) {
          return new Response(
            JSON.stringify({ error: "Failed to delete order" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        const response = {
          success: true,
          message: "Order deleted successfully",
        }

        console.log("Delete order - Deleted order:", orderId)

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        })
      } catch (error) {
        console.error("Error deleting order:", error)
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }
  )(request, env)
}
