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
        "Access-Control-Allow-Methods": "PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "PUT") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      try {
        const body = await request.json()
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

        // Validate request body
        if (
          body.amount !== undefined &&
          (typeof body.amount !== "number" || body.amount <= 0)
        ) {
          return new Response(JSON.stringify({ error: "Invalid amount" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
        }

        const merchantId = context.user.sub

        // Check if order exists and belongs to the merchant
        const existingOrder = await env.MERCHANTS_OAUTH.prepare(
          `SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
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

        // Only allow updates if order is pending
        if (existingOrder.status !== "pending") {
          return new Response(
            JSON.stringify({
              error: "Cannot update order that is not pending",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        // Build update query dynamically based on provided fields
        const updateFields: string[] = []
        const updateValues: (string | number | null)[] = []

        if (body.description !== undefined) {
          updateFields.push("description = ?")
          updateValues.push(body.description)
        }

        if (body.amount !== undefined) {
          updateFields.push("amount = ?")
          updateValues.push(body.amount)
        }

        if (updateFields.length === 0) {
          return new Response(
            JSON.stringify({ error: "No fields to update" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        updateFields.push("updated_at = ?")
        updateValues.push(new Date().toISOString())
        updateValues.push(orderId, merchantId)

        // Update the order
        await env.MERCHANTS_OAUTH.prepare(
          `UPDATE manual_orders
           SET ${updateFields.join(", ")}
           WHERE id = ? AND merchant_id = ?`
        )
          .bind(...updateValues)
          .run()

        // Fetch the updated order
        const updatedOrder = await env.MERCHANTS_OAUTH.prepare(
          `SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
           FROM manual_orders
           WHERE id = ? AND merchant_id = ?`
        )
          .bind(orderId, merchantId)
          .first()

        if (!updatedOrder) {
          return new Response(
            JSON.stringify({ error: "Failed to fetch updated order" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        const response = {
          id: updatedOrder.id as string,
          merchantId: updatedOrder.merchant_id as string,
          amount: updatedOrder.amount as number,
          description: updatedOrder.description as string | null,
          status: updatedOrder.status as string,
          transferRequestId: updatedOrder.transfer_request_id as string | null,
          merchantDisplayName: updatedOrder.merchant_display_name as
            | string
            | null,
          createdAt: updatedOrder.created_at as string,
          updatedAt: updatedOrder.updated_at as string,
        }

        console.log("Update order - Updated response:", response)

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        })
      } catch (error) {
        console.error("Error updating order:", error)
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
