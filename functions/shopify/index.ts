import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

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

  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function validateJwtToken(
  token: string,
  shop: string,
  clientSecret: string
): Promise<boolean> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".")
    const payload = JSON.parse(atob(payloadB64))

    // Verify the token is for the correct shop
    if (payload.dest !== `https://${shop}`) {
      return false
    }

    // Verify the token hasn't expired
    if (payload.exp < Date.now() / 1000) {
      return false
    }

    // Verify the signature
    const message = `${headerB64}.${payloadB64}`
    const signature = await generateHmac(message, clientSecret)
    return signature === signatureB64
  } catch (error) {
    console.error("JWT validation error:", error)
    return false
  }
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)

  const { hmac, shop, host, timestamp, embedded, id_token, session } = params

  // Check if all required parameters are present
  if (!hmac || !shop || !host || !timestamp) {
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

  // Handle embedded app request
  if (embedded === "1") {
    console.log("Is embedded")
    console.log("Request headers:", Object.fromEntries(request.headers))
    console.log("URL params:", params)

    if (!id_token || !session) {
      return new Response("Missing required embedded parameters", {
        status: 400,
      })
    }

    // Validate JWT token
    // const isValidToken = await validateJwtToken(
    //   id_token,
    //   shop,
    //   env.SHOPIFY_CLIENT_SECRET
    // )
    // if (!isValidToken) {
    //   return new Response("Invalid JWT token", { status: 401 })
    // }

    // Return HTML that will be loaded in the Shopify admin iframe
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Zenobia Pay</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="Content-Security-Policy" content="frame-ancestors https://*.myshopify.com https://admin.shopify.com">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            #app {
              max-width: 1200px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div id="app">
            <h1>Zenobia Pay</h1>
            <p>Loading your payment settings...</p>
            <pre>Debug Info:
              Host: ${host}
              Shop: ${shop}
              Embedded: ${embedded}
            </pre>
          </div>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
          "X-Frame-Options": "ALLOW-FROM https://*.myshopify.com",
          "Content-Security-Policy":
            "frame-ancestors https://*.myshopify.com https://admin.shopify.com",
          "Access-Control-Allow-Origin": "https://*.myshopify.com",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    )
  }

  // Handle regular OAuth flow
  const redirectUrl =
    `https://${shop}/admin/oauth/authorize?` +
    new URLSearchParams({
      client_id: env.SHOPIFY_CLIENT_ID,
      scope: "write_payment_sessions,read_payment_sessions",
      redirect_uri: "https://dashboard.zenobiapay.com/shopify/auth/callback",
    }).toString()

  // Redirect to Shopify OAuth
  return Response.redirect(redirectUrl)
}
