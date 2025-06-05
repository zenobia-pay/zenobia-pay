import { Env } from "../types"
import { jwtVerify } from "jose"

interface SignedPayload {
  aud: string
  iss: string
  iat: number
  nbf: number
  exp: number
  jti: string
  sub: string
  user: {
    id: number
    email: string
    locale: string
  }
  owner: {
    id: number
    email: string
  }
  url: string
  channel_id: string | null
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
    const signedPayloadJwt = formData.get("signed_payload_jwt") as string | null

    if (!signedPayloadJwt) {
      return new Response("Missing JWT payload for verification", {
        status: 400,
      })
    }

    try {
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

  const signedPayloadJwt = url.searchParams.get("signed_payload_jwt")

  if (!signedPayloadJwt) {
    // Check if we're in a reload loop (has timestamp param)
    const hasTimestamp = url.searchParams.has("ts")

    if (!hasTimestamp) {
      // First time without JWT - redirect with timestamp
      const newUrl = new URL(url)
      newUrl.searchParams.set("ts", Date.now().toString())
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Zenobia Console - Loading...</title>
            <meta http-equiv="refresh" content="0;url=${newUrl.toString()}" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
              }
              .loading {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <h2>Loading Zenobia Console...</h2>
              <p>If you're not redirected automatically, please refresh the page.</p>
            </div>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      )
    }

    // We have a timestamp but still no JWT - show error
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Zenobia Console - Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .error {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              max-width: 500px;
            }
          </style>
        </head>
        <body>
          <div class="error">
            <h2>Unable to Load Zenobia Console</h2>
            <ol>
              <li>Please refresh the page to finish the installation</li>
            </ol>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    )
  }

  try {
    // verify signed_payload_jwt (JWT)
    const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET)
    const { payload } = await jwtVerify(signedPayloadJwt, secret)
    const storeHash = (payload as unknown as SignedPayload).sub.replace(
      "stores/",
      ""
    )

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
          <title>Zenobia Console - BigCommerce Integration</title>
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
          <h1>Zenobia Console</h1>
          <p class="subheader">The Zenobia Console app is used to sync external orders through Zenobia (like in-person sales) with your BigCommerce store. You'll need an approved merchant account at <a href="https://dashboard.zenobiapay.com" target="_blank">dashboard.zenobiapay.com</a>. Once you do, you need to copy a few configuration variables over to ensure the connection is secure.</p>

          <div id="message" class="message"></div>

          <form id="configForm">
            <input type="hidden" name="store_hash" value="${storeHash}">
            <input type="hidden" name="signed_payload_jwt" value="${signedPayloadJwt}">

            <div class="step">
              <h2>Step 1: Enter Your Zenobia Credentials</h2>
              <p class="help-text">
                Get your Client ID and Client Secret from the <a href="https://dashboard.zenobiapay.com/?tab=developers" target="_blank">Zenobia Developer Dashboard</a>.
                Click "Generate New Credentials" and paste the values below. This is necessary for Zenobia to be able to process payments for your store.
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
              <a href="https://dashboard.zenobiapay.com/?tab=developers&subtab=webhooks&url=https://dashboard.zenobiapay.com/bigcommerce/webhooks/${store.store_hash}" target="_blank">Click here to set it in your Zenobia Developer Dashboard.</a>
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
