import { Env } from "../../types"

interface CheckoutSession {
  shop: string
  returnUrl: string
  cancelUrl?: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
  test?: boolean
}

interface ShopifyStore {
  shop_domain: string
  access_token: string
  zenobia_client_id: string
  zenobia_client_secret: string
}

// Function to escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return text.replace(/[&<>"'/]/g, (m) => map[m])
}

// Function to safely escape JSON for embedding in HTML
function escapeJsonForHtml(obj: Record<string, unknown>): string {
  return JSON.stringify(obj)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/"/g, "\\u0022")
    .replace(/'/g, "\\u0027")
}

async function getAccessToken(
  env: Env,
  clientId: string,
  encryptedClientSecret: string
): Promise<string> {
  const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
  const audience = env.ACCOUNTS_AUDIENCE || ""

  if (!clientId || !encryptedClientSecret) {
    throw new Error("No Auth0 credentials provided")
  }

  // Decrypt the client secret (if needed)
  const clientSecret = encryptedClientSecret
  // await decrypt(encryptedClientSecret, env.SHOPIFY_ENCRYPTION_KEY)

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: "client_credentials",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to get access token: ${response.status} ${errorText}`
    )
  }

  const data = await response.json()
  return data.access_token
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const shop = url.pathname.split("/").pop() // Get shop from the last path segment

  if (!shop) {
    return new Response("Missing shop parameter", { status: 400 })
  }

  const id = url.searchParams.get("id")

  if (!id) {
    return new Response("Missing session ID", { status: 400 })
  }

  // Get session data from KV
  const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(id)
  if (!sessionData) {
    return new Response("Session not found", { status: 404 })
  }

  const session = JSON.parse(sessionData) as CheckoutSession

  console.log("session", session)
  // Get the store based on the shop domain
  const store = await env.MERCHANTS_OAUTH.prepare(
    `SELECT shop_domain, access_token, zenobia_client_id, zenobia_client_secret FROM shopify_stores WHERE shop_domain = ?`
  )
    .bind(session.shop)
    .first<ShopifyStore>()

  if (!store) {
    return new Response("Store not found", { status: 404 })
  }

  if (!store.zenobia_client_id || !store.zenobia_client_secret) {
    return new Response("Store not configured with Zenobia credentials", {
      status: 400,
    })
  }

  // Get Auth0 access token using store-specific credentials
  const zenobiaAccessToken = await getAccessToken(
    env,
    store.zenobia_client_id,
    store.zenobia_client_secret
  )

  const transferRequestBody = {
    amount: Math.round(parseFloat(session.amount || "0") * 100),
    statementItems: [
      {
        name: "Payment",
        amount: Math.round(parseFloat(session.amount || "0") * 100),
      },
    ],
    // Optionally add metadata here
  }

  const apiUrl = session.test ? env.TESTMODE_API_BASE_URL : env.API_BASE_URL
  // Create transfer request with Zenobia Pay
  const transferResponse = await fetch(`${apiUrl}/create-transfer-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${zenobiaAccessToken}`,
    },
    body: JSON.stringify(transferRequestBody),
  })

  if (!transferResponse.ok) {
    const error = await transferResponse.text()
    return new Response(`Failed to create transfer: ${error}`, {
      status: 500,
    })
  }

  const transferData = await transferResponse.json()

  // Store the mapping between transfer ID and session ID
  await env.TRANSFER_MAPPINGS.put(transferData.transferRequestId, id)

  // Calculate amount in cents for the modal
  const amountCents = Math.round(parseFloat(session.amount || "0") * 100)

  // Fetch the HTML template
  const html = await env.ASSETS.fetch(`${url.origin}/store.html`).then((res) =>
    res.text()
  )
  console.log("html", html)
  console.log("transferData", transferData)
  // Replace placeholders in the template
  const template = html
    .replace("{{shop}}", escapeHtml(shop))
    .replace(
      "{{session}}",
      escapeJsonForHtml(session as unknown as Record<string, unknown>)
    )
    .replace("{{sessionId}}", escapeHtml(id))
    .replace(
      "{{transferRequestId}}",
      escapeHtml(transferData.transferRequestId)
    )
    .replace("{{amountCents}}", amountCents.toString())
    .replace("{{transferSignature}}", escapeHtml(transferData.signature || ""))
    .replace("{{transferExpiry}}", transferData.expiry?.toString() || "")
    .replace(
      "{{transferMerchantId}}",
      escapeHtml(transferData.merchantId || "")
    )

  return new Response(template, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      Vary: "*",
    },
  })
}
