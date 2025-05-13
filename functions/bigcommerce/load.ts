import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"
import { jwtVerify } from "jose"

interface SignedPayload {
  user: {
    id: number
    email: string
    locale: string
  }
  owner: {
    id: number
    email: string
  }
  context: string
  store_hash: string
  timestamp: number
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)

  const signedPayload = url.searchParams.get("signed_payload")
  const signedPayloadJwt = url.searchParams.get("signed_payload_jwt")

  if (!signedPayload || !signedPayloadJwt) {
    return new Response("Missing required parameters", { status: 400 })
  }

  try {
    // Verify the signed payload JWT
    const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET)
    const { payload: decodedPayload } = await jwtVerify(signedPayload, secret)

    // Verify the JWT token (we don't need the payload, just verifying it's valid)
    await jwtVerify(signedPayloadJwt, secret)

    // Type assertion for the payload
    const storeData = decodedPayload as unknown as SignedPayload

    // Get the store data from our database
    const store = await env.DB.prepare(
      `
      SELECT * FROM bigcommerce_stores
      WHERE store_hash = ?
    `
    )
      .bind(storeData.store_hash)
      .first()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    // Return the app HTML with the necessary data
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Zenobia Pay - BigCommerce Integration</title>
          <script>
            window.BIGCOMMERCE_STORE_CONTEXT = "${storeData.store_hash}";
            window.BIGCOMMERCE_ACCESS_TOKEN = "${store.access_token}";
            window.BIGCOMMERCE_USER = ${JSON.stringify(storeData.user)};
            window.BIGCOMMERCE_JWT = "${signedPayloadJwt}";
          </script>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    )
  } catch (error) {
    console.error("Load error:", error)
    return new Response("Failed to load app", { status: 500 })
  }
}
