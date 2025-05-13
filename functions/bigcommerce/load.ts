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
    // verify signed_payload (HMAC)
    const payload = await verifySignedPayload(
      signedPayload,
      env.BIGCOMMERCE_CLIENT_SECRET
    )

    // verify signed_payload_jwt (JWT)
    const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET)
    await jwtVerify(signedPayloadJwt, secret)

    const storeHash = payload.store_hash

    const store = await env.DB.prepare(
      `SELECT * FROM bigcommerce_stores WHERE store_hash = ?`
    )
      .bind(storeHash)
      .first()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Zenobia Pay - BigCommerce Integration</title>
          <script>
            window.BIGCOMMERCE_STORE_CONTEXT = "${storeHash}";
            window.BIGCOMMERCE_ACCESS_TOKEN = "${store.access_token}";
            window.BIGCOMMERCE_USER = ${JSON.stringify(payload.user)};
            window.BIGCOMMERCE_JWT = "${signedPayloadJwt}";
          </script>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    )
  } catch (error) {
    console.error("Load error:", error)
    return new Response("Failed to load app", { status: 500 })
  }
}

async function verifySignedPayload(
  signedPayload: string,
  clientSecret: string
): Promise<SignedPayload> {
  const [encodedData, signature] = signedPayload.split(".")
  if (!encodedData || !signature) throw new Error("Malformed signed_payload")

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(clientSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(signature),
    new TextEncoder().encode(encodedData)
  )

  if (!isValid) throw new Error("Invalid HMAC")

  const json = JSON.parse(atob(encodedData))
  return json
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return new Uint8Array(bytes.buffer.slice(0))
}
