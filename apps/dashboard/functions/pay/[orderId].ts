import { Env } from "../types"
import { getManualStoreCredentials } from "../utils/manual-store"

interface ManualOrder {
  id: string
  merchant_id: string
  amount: number
  description: string | null
  status: string
  transfer_request_id: string | null
  created_at: string
  updated_at: string
}

interface MerchantConfig {
  merchantDisplayName?: string
  merchantDescription?: string
}

async function getAccessToken(
  env: Env,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
  const audience = env.ACCOUNTS_AUDIENCE || ""

  if (!clientId || !clientSecret) {
    throw new Error("No Auth0 credentials provided")
  }

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

async function getMerchantConfig(
  env: Env,
  merchantId: string
): Promise<MerchantConfig | null> {
  try {
    // Try to get merchant config from the API
    const response = await fetch(`${env.API_BASE_URL}/get-merchant-config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Note: This would need proper authentication in a real implementation
        // For now, we'll use a fallback approach
      },
    })

    if (response.ok) {
      const config = await response.json()
      return config
    }
  } catch (error) {
    console.error("Error fetching merchant config:", error)
  }

  // Fallback: return a default config with merchant ID as display name
  return {
    merchantDisplayName: `Merchant ${merchantId}`,
    merchantDescription: `Merchant ${merchantId}`,
  }
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const orderId = url.pathname.split("/").pop() // Get orderId from the last path segment

  if (!orderId) {
    return new Response("Missing order ID", { status: 400 })
  }

  console.log("Processing payment for order:", orderId)

  // Get order data from database
  const order = await env.MERCHANTS_OAUTH.prepare(
    `SELECT id, merchant_id, amount, description, status, transfer_request_id, created_at, updated_at
     FROM manual_orders
     WHERE id = ?`
  )
    .bind(orderId)
    .first<ManualOrder>()

  if (!order) {
    return new Response("Order not found", { status: 404 })
  }

  console.log("Found order:", order)

  // Check if order is already paid
  if (order.status === "paid") {
    return new Response("Order has already been paid", { status: 400 })
  }

  // Note: We allow overwriting existing transfer requests

  // Get merchant credentials from the merchant_id
  const merchantCredentials = await getManualStoreCredentials(
    env,
    order.merchant_id
  )

  if (!merchantCredentials) {
    return new Response("Merchant not found", { status: 404 })
  }

  // Get merchant config to get display name
  const merchantConfig = await getMerchantConfig(env, order.merchant_id)
  const merchantDisplayName = merchantConfig?.merchantDisplayName || "Store"

  // Get Auth0 access token using merchant-specific credentials
  const zenobiaAccessToken = await getAccessToken(
    env,
    merchantCredentials.clientId,
    merchantCredentials.clientSecret
  )

  const transferRequestBody = {
    amount: order.amount,
    statementItems: [
      {
        name: order.description || "Payment",
        amount: order.amount,
      },
    ],
    transferMetadata: {
      orderId: order.id,
      merchantId: order.merchant_id,
      orderDescription: order.description,
      orderCreatedAt: order.created_at,
    },
  }

  console.log("Creating transfer request:", transferRequestBody)

  // Create transfer request with Zenobia Pay
  const transferResponse = await fetch(
    `${env.API_BASE_URL}/create-transfer-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zenobiaAccessToken}`,
      },
      body: JSON.stringify(transferRequestBody),
    }
  )

  if (!transferResponse.ok) {
    const error = await transferResponse.text()
    console.error("Failed to create transfer:", error)
    return new Response(`Failed to create transfer: ${error}`, {
      status: 500,
    })
  }

  const transferData = await transferResponse.json()
  console.log("Transfer created:", transferData)

  // Update the order with the transfer request ID
  await env.MERCHANTS_OAUTH.prepare(
    `UPDATE manual_orders
     SET transfer_request_id = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(transferData.transferRequestId, new Date().toISOString(), order.id)
    .run()

  // Store the mapping between transfer ID and order ID
  await env.TRANSFER_MAPPINGS.put(transferData.transferRequestId, order.id)

  // Create a session object similar to Shopify for consistency
  const session = {
    shop: merchantDisplayName, // Use merchant display name instead of order ID
    orderId: order.id,
    merchantId: order.merchant_id,
    description: order.description || "Payment",
    amount: (order.amount / 100).toString(),
    currency: "USD",
    createdAt: new Date(order.created_at).getTime(),
    test: false, // You can make this configurable if needed
    returnUrl: `${url.origin}/pay/success/${order.id}`, // Success page with order ID
    cancelUrl: `${url.origin}/pay/cancel`, // Cancel page
  }

  // Fetch the HTML template
  const html = await env.ASSETS.fetch(`${url.origin}/store.html`).then((res) =>
    res.text()
  )

  // Replace placeholders in the template
  const template = html
    .replace("{{shop}}", merchantDisplayName) // Use merchant display name
    .replace("{{session}}", JSON.stringify(session))
    .replace("{{sessionId}}", order.id)
    .replace("{{transferRequestId}}", transferData.transferRequestId)
    .replace("{{amountCents}}", order.amount.toString())
    .replace("{{transferSignature}}", transferData.signature || "")
    .replace("{{transferExpiry}}", transferData.expiry?.toString() || "")
    .replace("{{transferMerchantId}}", transferData.merchantId || "")

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
