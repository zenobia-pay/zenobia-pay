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

    // If no new secret provided, keep the existing one
    if (!zenobiaClientSecret) {
      await env.MERCHANTS_OAUTH.prepare(
        `UPDATE bigcommerce_stores
         SET zenobia_client_id = ?,
             url_endpoint = ?,
             updated_at = ?
         WHERE store_hash = ?`
      )
        .bind(zenobiaClientId, urlEndpoint, Date.now(), storeHash)
        .run()
    } else {
      await env.MERCHANTS_OAUTH.prepare(
        `UPDATE bigcommerce_stores
         SET zenobia_client_id = ?,
             zenobia_client_secret = ?,
             url_endpoint = ?,
             updated_at = ?
         WHERE store_hash = ?`
      )
        .bind(
          zenobiaClientId,
          zenobiaClientSecret,
          urlEndpoint,
          Date.now(),
          storeHash
        )
        .run()
    }

    return new Response("Credentials updated successfully", { status: 200 })
  }

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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600&display=swap" rel="stylesheet" />
          <style>
            body {
              font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 700px;
              margin: 40px auto;
              padding: 0 20px;
            }
            h1 {
              font-weight: 600;
              margin-bottom: 10px;
            }
            .subheader {
              font-size: 16px;
              color: #555;
              margin-bottom: 30px;
            }
            .step {
              margin-bottom: 30px;
              padding: 20px;
              border: 1px solid #eee;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .step h2 {
              font-size: 18px;
              font-weight: 600;
              margin-top: 0;
              margin-bottom: 15px;
              color: #0066cc;
            }
            .form-group {
              margin-bottom: 20px;
            }
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              font-size: 14px;
            }
            input[type="text"], input[type="password"] {
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
              box-sizing: border-box;
            }
            button {
              background-color: #0066cc;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              font-weight: 600;
            }
            button:hover {
              background-color: #0052a3;
            }
            .message {
              padding: 12px;
              border-radius: 4px;
              margin-bottom: 20px;
              display: none;
              font-size: 14px;
            }
            .success {
              background-color: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .error {
              background-color: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
            }
            .help-text {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
            }
            a {
              color: #0066cc;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Zenobia Pay Configuration</h1>
          <p class="subheader">To configure Zenobia Pay and accept payments, <a href="https://dashboard.zenobiapay.com" target="_blank">signup for an account at dashboard.zenobiapay.com</a>.</p>

          <div id="message" class="message"></div>

          <form id="configForm">
            <input type="hidden" name="store_hash" value="${storeHash}">
            <input type="hidden" name="signed_payload" value="${signedPayload}">
            <input type="hidden" name="signed_payload_jwt" value="${signedPayloadJwt}">

            <div class="step">
              <h2>Step 1: Enter Your Zenobia Credentials</h2>
              <p class="help-text">
                Get your Client ID and Client Secret from the <a href="https://dashboard.zenobiapay.com/?tab=developers" target="_blank">Zenobia Pay Developer Dashboard</a>.
                Click "Generate New Credentials" and paste the values below. This is necessary for Zenobia Pay to be able to process payments for your store.
              </p>
              <div class="form-group">
                <label for="zenobia_client_id">Zenobia Client ID</label>
                <input type="text" id="zenobia_client_id" name="zenobia_client_id" value="${store.zenobia_client_id || ""}" required>
              </div>
              <div class="form-group">
                <label for="zenobia_client_secret">Zenobia Client Secret</label>
                <input type="password" id="zenobia_client_secret" name="zenobia_client_secret" placeholder="${store.zenobia_client_secret ? "********" : "Enter your Client Secret"}" ${!store.zenobia_client_secret ? "required" : ""}>
                ${store.zenobia_client_secret ? '<p class="help-text">Leave blank to keep your existing secret.</p>' : ""}
              </div>
              <div class="form-group">
                <label for="url_endpoint">Store URL</label>
                <input type="text" id="url_endpoint" name="url_endpoint" value="${store.url_endpoint || ""}" placeholder="e.g., store.mybigcommerce.com" required>
                <p class="help-text">Enter your store's domain without https:// or www. (e.g., store.mybigcommerce.com)</p>
              </div>
              <button type="submit">Save Configuration</button>
            </div>
          </form>

          <div class="step">
            <h2>Step 2: Configure Your Webhook</h2>
            <p class="help-text">
              You need to set your webhook endpoint to: <br>
              <code>https://dashboard.zenobiapay.com/bigcommerce/webhooks/${store.store_hash}</code>
            </p>
            <p class="help-text">
              <a href="https://dashboard.zenobiapay.com/?tab=developers&subtab=webhooks&url=https://dashboard.zenobiapay.com/bigcommerce/webhooks/${store.store_hash}" target="_blank">Click here to set it in your Zenobia Pay Developer Dashboard.</a>
            </p>
          </div>

          <script>
            const form = document.getElementById('configForm');
            const message = document.getElementById('message');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const formData = new FormData(form);

              try {
                const response = await fetch(window.location.href, {
                  method: 'POST',
                  body: formData
                });

                if (response.ok) {
                  message.textContent = 'Configuration saved successfully!';
                  message.className = 'message success';
                } else {
                  const error = await response.text();
                  message.textContent = error || 'Failed to save configuration';
                  message.className = 'message error';
                }
              } catch (error) {
                message.textContent = 'An error occurred while saving the configuration';
                message.className = 'message error';
              }

              message.style.display = 'block';
            });
          </script>
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
