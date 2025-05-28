import { Env } from "../types"
import { encrypt } from "../../../utils/encryption"

async function generateHmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  )

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)

  const { code, hmac, shop, host, timestamp } = params

  console.log("shopify auth callback", params)
  // Check if all required parameters are present
  if (!code || !hmac || !shop || !host || !timestamp) {
    return new Response("Missing required parameters", { status: 400 })
  }

  // Verify HMAC
  const queryParams = new URLSearchParams(params)
  queryParams.delete("hmac") // Remove hmac from the parameters

  // Sort parameters alphabetically
  const sortedParams = Array.from(queryParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  // Create HMAC
  const generatedHmac = await generateHmac(
    sortedParams,
    env.SHOPIFY_CLIENT_SECRET
  )

  // Compare HMACs
  if (generatedHmac !== hmac) {
    return new Response("Invalid HMAC", { status: 401 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.SHOPIFY_CLIENT_ID,
          client_secret: env.SHOPIFY_CLIENT_SECRET,
          code,
        }),
      }
    )

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for access token")
    }

    const { access_token } = await tokenResponse.json()

    console.log("Access token:", access_token)
    // Encrypt the access token
    const encryptedToken = await encrypt(
      access_token,
      env.SHOPIFY_ENCRYPTION_KEY
    )

    // Store the store data in D1
    const now = Date.now()
    await env.MERCHANTS_OAUTH.prepare(
      `
      INSERT INTO shopify_stores (
        shop_domain,
        access_token,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?)
      ON CONFLICT(shop_domain) DO UPDATE SET
        access_token = excluded.access_token,
        updated_at = excluded.updated_at
    `
    )
      .bind(shop, encryptedToken, now, now)
      .run()

    // Call paymentsAppConfigure to mark the provider as ready
    console.log("Shop:", shop)
    console.log("Request details:", {
      url: `https://v0-simple-proxy-server.vercel.app/api/proxy`,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token.substring(0, 10) + "...", // Only log part of the token for security
        Authorization: env.SHOPIFY_PROXY_SECRET,
      },
      body: {
        query: `
          mutation paymentsAppConfigure($externalHandle: String, $ready: Boolean!) {
            paymentsAppConfigure(externalHandle: $externalHandle, ready: $ready) {
              paymentsAppConfiguration {
                externalHandle
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          externalHandle: "zenobia-pay",
          ready: true,
        },
      },
    })

    const configureResponse = await fetch(
      "https://v0-simple-proxy-server.vercel.app/api/proxy",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": access_token,
          Authorization: `Bearer ${env.SHOPIFY_PROXY_SECRET}`,
          "x-target-url": `https://${shop}/payments_apps/api/2025-04/graphql.json`,
        },
        body: JSON.stringify({
          query: `
            mutation paymentsAppConfigure($externalHandle: String, $ready: Boolean!) {
              paymentsAppConfigure(externalHandle: $externalHandle, ready: $ready) {
                paymentsAppConfiguration {
                  externalHandle
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            externalHandle: "zenobia-pay",
            ready: true,
          },
        }),
      }
    )

    if (!configureResponse.ok) {
      const errorText = await configureResponse.text()
      console.error("PaymentsAppConfigure failed:", {
        status: configureResponse.status,
        statusText: configureResponse.statusText,
        headers: Object.fromEntries(configureResponse.headers.entries()),
        body: errorText,
      })
      throw new Error(`Failed to configure payments app: ${errorText}`)
    }

    const configureResult = await configureResponse.json()
    console.log("PaymentsAppConfigure Response:", {
      status: configureResponse.status,
      statusText: configureResponse.statusText,
      headers: Object.fromEntries(configureResponse.headers.entries()),
      result: configureResult,
    })

    if (configureResult.data?.paymentsAppConfigure?.userErrors?.length > 0) {
      throw new Error(
        `Configuration errors: ${JSON.stringify(configureResult.data.paymentsAppConfigure.userErrors)}`
      )
    }

    // Redirect back to Shopify admin with the proper payments partner gateway settings URL
    const redirectUrl = `https://${shop}/services/payments_partners/gateways/${env.SHOPIFY_CLIENT_ID}/settings`
    return Response.redirect(redirectUrl)
  } catch (error) {
    console.error("Error during OAuth callback:", error)
    return new Response("Error processing OAuth callback", { status: 500 })
  }
}
