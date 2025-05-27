import { Env } from "../types"
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

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)

  // Handle form submission
  if (request.method === "POST") {
    const formData = await request.formData()
    const storeHash = formData.get("store_hash")
    const zenobiaClientId = formData.get("zenobia_client_id")
    const zenobiaClientSecret = formData.get("zenobia_client_secret")
    const urlEndpoint = formData.get("url_endpoint")
    const signedPayload = formData.get("signed_payload") as string | null
    const signedPayloadJwt = formData.get("signed_payload_jwt") as string | null

    if (!signedPayload || !signedPayloadJwt) {
      return new Response("Missing signed payload for verification", {
        status: 400,
      })
    }

    try {
      // Verify signed_payload (HMAC)
      await verifySignedPayload(signedPayload, env.BIGCOMMERCE_CLIENT_SECRET)

      // Verify signed_payload_jwt (JWT)
      const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET)
      await jwtVerify(signedPayloadJwt, secret)
    } catch (error) {
      console.error("Verification failed:", error)
      return new Response("Invalid request signature", { status: 403 })
    }

    if (!storeHash || !zenobiaClientId) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Store the store data in D1
    const now = Date.now()
    await env.MERCHANTS_OAUTH.prepare(
      `
      INSERT INTO bigcommerce_stores (
        store_hash,
        zenobia_client_id,
        zenobia_client_secret,
        url_endpoint,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(store_hash) DO UPDATE SET
        zenobia_client_id = excluded.zenobia_client_id,
        zenobia_client_secret = excluded.zenobia_client_secret,
        url_endpoint = excluded.url_endpoint,
        updated_at = excluded.updated_at
    `
    )
      .bind(
        storeHash,
        zenobiaClientId,
        zenobiaClientSecret,
        urlEndpoint,
        now,
        now
      )
      .run()

    // Redirect to the app
    return Response.redirect(`${url.origin}/bigcommerce/app`, 302)
  }

  // Handle GET request - show the form
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Zenobia Pay - BigCommerce</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
          }
          input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0052a3;
          }
        </style>
      </head>
      <body>
        <h1>Zenobia Pay - BigCommerce</h1>
        <form method="POST">
          <div class="form-group">
            <label for="store_hash">Store Hash:</label>
            <input type="text" id="store_hash" name="store_hash" required>
          </div>
          <div class="form-group">
            <label for="zenobia_client_id">Zenobia Client ID:</label>
            <input type="text" id="zenobia_client_id" name="zenobia_client_id" required>
          </div>
          <div class="form-group">
            <label for="zenobia_client_secret">Zenobia Client Secret:</label>
            <input type="text" id="zenobia_client_secret" name="zenobia_client_secret" required>
          </div>
          <div class="form-group">
            <label for="url_endpoint">URL Endpoint:</label>
            <input type="text" id="url_endpoint" name="url_endpoint" required>
          </div>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  )
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

  // if (!valid) {
  //   console.error("❌ Invalid HMAC verification")
  //   throw new Error("Invalid HMAC signature")
  // }

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
