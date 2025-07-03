import { Env } from "./types"
import { createAuth0Middleware, type Auth0Context } from "./utils/auth0"
import { encrypt } from "../utils/encryption"

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
      // Extract merchant ID from the authenticated user
      const merchantId = context.user.merchant_id || context.user.sub

      try {
        // Step 1: Get the user's Auth0 token to call the AWS service
        const token = context.token

        // Step 2: List existing M2M credentials for this merchant
        const listResponse = await fetch(
          `${env.API_BASE_URL}/list-m2m-credentials`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          }
        )

        if (listResponse.ok) {
          const listResult = await listResponse.json()

          // Step 3: Delete each existing credential
          for (const credential of listResult.credentials || []) {
            await fetch(`${env.API_BASE_URL}/delete-m2m-credentials`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ clientId: credential.clientId }),
            })
          }
        }

        // Step 4: Create new M2M credentials via AWS service
        const createResponse = await fetch(
          `${env.API_BASE_URL}/create-m2m-credentials`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!createResponse.ok) {
          throw new Error(
            `Failed to create M2M credentials: ${createResponse.status}`
          )
        }

        const createResult = await createResponse.json()
        const clientId = createResult.clientId
        const clientSecret = createResult.clientSecret

        // Step 5: Encrypt the client secret
        const encryptedSecret = await encrypt(
          clientSecret,
          env.MANUAL_ORDERS_ENCRYPTION_KEY || "default-key-change-in-production"
        )

        // Step 6: Save to manual_stores table with encrypted secret
        const now = Date.now()
        await env.MERCHANTS_OAUTH.prepare(
          `INSERT INTO manual_stores (
            merchant_id,
            zenobia_client_id,
            zenobia_client_secret,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(merchant_id) DO UPDATE SET
            zenobia_client_id = excluded.zenobia_client_id,
            zenobia_client_secret = excluded.zenobia_client_secret,
            updated_at = excluded.updated_at`
        )
          .bind(merchantId, clientId, encryptedSecret, now, now)
          .run()

        const response = {
          success: true,
          clientId,
          clientSecret,
          message: "Manual orders configured successfully",
        }

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        })
      } catch (error) {
        console.error("Error setting up manual orders:", error)
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to setup manual orders",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": origin,
            },
          }
        )
      }
    }
  )(request, env)
}
