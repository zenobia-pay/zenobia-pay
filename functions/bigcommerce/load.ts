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

    const store = await env.MERCHANTS_OAUTH.prepare(
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

  console.log("🔐 verifying signed_payload")
  console.log("signedPayload:", signedPayload)
  console.log("clientSecret:", clientSecret)
  console.log("encodedData (base64url):", encodedData)
  console.log("signature (base64):", signature)

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(clientSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )

  // Convert double-base64 signature to bytes
  const decodedSignature = atob(signature)
  const sigBytes = Uint8Array.from(decodedSignature, (c) => c.charCodeAt(0))

  // Use the base64url-encoded data for verification
  const dataBytes = new TextEncoder().encode(encodedData)

  console.log("decoded signature:", decodedSignature)
  console.log("sigBytes length:", sigBytes.length)
  console.log("dataBytes length:", dataBytes.length)

  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, dataBytes)

  if (!valid) {
    console.error("❌ Invalid HMAC verification")
    console.error("expected signature:", signature)
    throw new Error("Invalid HMAC signature")
  }

  console.log("✅ HMAC valid")
  const decoded = decodeBase64Url(encodedData)
  console.log("decoded payload:", decoded)
  return JSON.parse(decoded)
}

function decodeBase64Url(input: string): string {
  const base64 =
    input.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((input.length + 3) % 4)
  return atob(base64)
}
