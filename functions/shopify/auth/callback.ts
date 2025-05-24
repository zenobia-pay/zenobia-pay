import { Env } from "../../types"
import { EventContext } from "@cloudflare/workers-types"
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

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)

  const { code, hmac, shop, host, timestamp } = params

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

    // Return success response instead of redirecting
    return new Response(JSON.stringify({ success: true, shop }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error during OAuth callback:", error)
    return new Response("Error processing OAuth callback", { status: 500 })
  }
}
