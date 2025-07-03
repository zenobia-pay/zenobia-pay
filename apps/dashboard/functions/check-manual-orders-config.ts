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
      const merchantId = context.user.merchant_id || context.user.sub

      // Check if manual orders are configured for this merchant
      const manualStore = await env.MERCHANTS_OAUTH.prepare(
        `SELECT merchant_id FROM manual_stores WHERE merchant_id = ?`
      )
        .bind(merchantId)
        .first()

      const response = {
        isConfigured: !!manualStore,
      }

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
