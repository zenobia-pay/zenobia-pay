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
        const merchantId = context.user.sub

        // Check if manual orders are configured for this merchant
        const existingConfig = await env.MERCHANTS_OAUTH.prepare(
          `SELECT merchant_id FROM manual_stores WHERE merchant_id = ?`
        )
          .bind(merchantId)
          .first()

        if (!existingConfig) {
          return new Response(
            JSON.stringify({ error: "Manual orders not configured" }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        // Delete the manual orders configuration
        const result = await env.MERCHANTS_OAUTH.prepare(
          `DELETE FROM manual_stores WHERE merchant_id = ?`
        )
          .bind(merchantId)
          .run()

        if (result.meta.changes === 0) {
          return new Response(
            JSON.stringify({ error: "Failed to disable manual orders" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        }

        const response = {
          success: true,
          message: "Manual orders disabled successfully",
        }

        console.log(
          "Disable manual orders - Disabled for merchant:",
          merchantId
        )

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        })
      } catch (error) {
        console.error("Error disabling manual orders:", error)
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
