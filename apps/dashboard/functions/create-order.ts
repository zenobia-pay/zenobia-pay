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
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      const body = await request.json()

      // Validate request body
      if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
        return new Response(JSON.stringify({ error: "Invalid amount" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }

      // Validate merchant display name
      if (!body.merchantDisplayName) {
        return new Response(
          JSON.stringify({ error: "Merchant display name is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const merchantId = context.user.sub

      // Debug logging
      console.log("Create order - User context:", {
        sub: context.user.sub,
        merchant_id: context.user.merchant_id,
        finalMerchantId: merchantId,
      })

      // Generate order ID - URL-safe base64 encoding of UUID
      const uuid = crypto.randomUUID()
      const orderId = btoa(uuid.replace(/-/g, ""))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
      const now = new Date().toISOString()

      console.log("Create order - Inserting with params:", {
        orderId,
        merchantId,
        amount: body.amount,
        description: body.description,
        merchantDisplayName: body.merchantDisplayName,
        status: "pending",
        now,
      })

      // Insert order into database
      await env.MERCHANTS_OAUTH.prepare(
        `
        INSERT INTO manual_orders (
          id,
          merchant_id,
          amount,
          description,
          merchant_display_name,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
        .bind(
          orderId,
          merchantId,
          body.amount,
          body.description || null,
          body.merchantDisplayName,
          "pending",
          now,
          now
        )
        .run()

      const response = {
        id: orderId,
        merchantId,
        amount: body.amount,
        description: body.description,
        status: "pending",
        createdAt: now,
      }

      console.log("Create order - Created response:", response)

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
        },
      })
    }
  )(request, env)
}
