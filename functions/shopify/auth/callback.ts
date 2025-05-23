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

  if (!code || !hmac || !shop || !host || !timestamp) {
    return new Response("Missing required parameters", { status: 400 })
  }

  const queryParams = new URLSearchParams(params)
  queryParams.delete("hmac")

  const sortedParams = Array.from(queryParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const generatedHmac = await generateHmac(
    sortedParams,
    env.SHOPIFY_CLIENT_SECRET
  )

  if (generatedHmac !== hmac) {
    return new Response("Invalid HMAC", { status: 401 })
  }

  try {
    // exchange code for access token
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.SHOPIFY_CLIENT_ID,
        client_secret: env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    })

    if (!tokenRes.ok) throw new Error("Token exchange failed")

    const { access_token } = await tokenRes.json()
    const encryptedToken = await encrypt(
      access_token,
      env.SHOPIFY_ENCRYPTION_KEY
    )

    // store token
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

    // fetch shop id
    const shopQuery = await fetch(
      `https://${shop}/admin/api/2023-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": access_token,
        },
        body: JSON.stringify({ query: `{ shop { id } }` }),
      }
    )

    const shopData = await shopQuery.json()
    const shopId = shopData?.data?.shop?.id
    if (!shopId) throw new Error("Could not retrieve shop ID")

    // configure payments app
    const configRes = await fetch(
      `https://${shop}/admin/api/2023-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": access_token,
        },
        body: JSON.stringify({
          query: `
          mutation {
            paymentsAppConfigure(
              shopId: "${shopId}"
              configuration: {
                name: "Zenobia Pay",
                url: "https://yourapp.com/api/shopify/payment-session",
                enabled: true,
                ready: true
              }
            ) {
              paymentsAppConfiguration { id }
              userErrors { field message }
            }
          }
        `,
        }),
      }
    )

    const configResult = await configRes.json()
    console.log("paymentsAppConfigure result:", JSON.stringify(configResult))

    // done, redirect merchant to your dashboard
    return Response.redirect(
      `https://dashboard.zenobiapay.com/shopify?shop=${shop}`
    )
  } catch (err) {
    console.error("OAuth flow error:", err)
    return new Response("Internal error", { status: 500 })
  }
}
