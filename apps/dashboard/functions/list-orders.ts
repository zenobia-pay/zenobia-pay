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
      // Extract merchant ID from the authenticated user
      const merchantId = context.user.sub

      // Debug logging
      console.log("List orders - User context:", {
        sub: context.user.sub,
        merchant_id: context.user.merchant_id,
        finalMerchantId: merchantId,
      })

      // Get query parameters
      const url = new URL(request.url)
      const continuationToken = url.searchParams.get("continuationToken")
      const limit = parseInt(url.searchParams.get("limit") || "50")

      // Build the query
      let query = `
        SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
        FROM manual_orders
        WHERE merchant_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `
      let params = [merchantId, limit]

      // Add continuation token if provided
      if (continuationToken) {
        query = query.replace(
          "WHERE merchant_id = ?",
          "WHERE merchant_id = ? AND created_at < ?"
        )
        params = [merchantId, continuationToken, limit]
      }

      console.log("List orders - Query:", query)
      console.log("List orders - Params:", params)

      // Execute query
      const result = await env.MERCHANTS_OAUTH.prepare(query)
        .bind(...params)
        .all()

      console.log("List orders - Query result:", {
        rowCount: result.results.length,
        results: result.results,
      })

      // Debug: Check if there are any orders at all in the database
      const allOrdersResult = await env.MERCHANTS_OAUTH.prepare(
        "SELECT COUNT(*) as count FROM manual_orders"
      ).all()

      console.log(
        "List orders - Total orders in database:",
        allOrdersResult.results[0]
      )

      const orders = result.results.map((row) => ({
        id: row.id as string,
        merchantId: row.merchant_id as string,
        amount: row.amount as number,
        description: row.description as string | null,
        status: row.status as string,
        transferRequestId: row.transfer_request_id as string | null,
        merchantDisplayName: row.merchant_display_name as string | null,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      }))

      const response = {
        items: orders,
        continuationToken:
          orders.length === limit
            ? orders[orders.length - 1]?.createdAt
            : undefined,
      }

      console.log("List orders - Final response:", response)

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
