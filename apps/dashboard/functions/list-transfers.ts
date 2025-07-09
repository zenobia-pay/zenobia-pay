import { Env } from "./types"
import { createAuth0Middleware, type Auth0Context } from "./utils/auth0"

interface TransferWithOrder {
  transferRequestId: string
  amount: number
  status: string
  customerName?: string
  orderId?: string
  orderDetails?: {
    orderId: string
    merchantId: string
    amount: number
    description: string | null
    status: string
    transferRequestId: string | null
    merchantDisplayName: string | null
    createdAt: string
    updatedAt: string
  }
}

interface ManualOrder {
  id: string
  merchant_id: string
  amount: number
  description: string | null
  status: string
  transfer_request_id: string | null
  merchant_display_name: string | null
  created_at: string
  updated_at: string
}

export async function onRequest(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "*"

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      const body = await request.json()
      const continuationToken = body.continuationToken

      console.log("Listing transfers for merchant:", context.user.sub)

      // Get Auth0 access token for the merchant
      const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
      const audience = env.ACCOUNTS_AUDIENCE || ""

      // Get merchant credentials from the merchant_id
      const merchantCredentials = await env.MERCHANTS_OAUTH.prepare(
        `SELECT zenobia_client_id, zenobia_client_secret FROM manual_stores WHERE merchant_id = ?`
      )
        .bind(context.user.sub)
        .first<{ zenobia_client_id: string; zenobia_client_secret: string }>()

      if (
        !merchantCredentials?.zenobia_client_id ||
        !merchantCredentials?.zenobia_client_secret
      ) {
        return new Response(
          JSON.stringify({
            error: "Merchant not configured with Zenobia credentials",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Get Auth0 access token using merchant-specific credentials
      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: merchantCredentials.zenobia_client_id,
          client_secret: merchantCredentials.zenobia_client_secret,
          audience: audience,
          grant_type: "client_credentials",
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error("Failed to get access token:", errorText)
        return new Response(
          JSON.stringify({ error: "Failed to authenticate with Zenobia" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const tokenData = await tokenResponse.json()
      const zenobiaAccessToken = tokenData.access_token

      // Call the Zenobia API to get merchant transfers
      const url = new URL(`${env.API_BASE_URL}/list-merchant-transfers`)
      if (continuationToken) {
        url.searchParams.append("continuationToken", continuationToken)
      }

      const transferResponse = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${zenobiaAccessToken}`,
        },
        body: JSON.stringify({}),
      })

      if (!transferResponse.ok) {
        const error = await transferResponse.text()
        console.error("Failed to fetch transfers:", error)
        return new Response(
          JSON.stringify({ error: "Failed to fetch transfers" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const transferData = await transferResponse.json()
      console.log("Raw transfer data:", transferData)

      // Enrich transfers with order details
      const enrichedTransfers: TransferWithOrder[] = []

      for (const transfer of transferData.items || []) {
        const enrichedTransfer: TransferWithOrder = {
          transferRequestId: transfer.transferRequestId,
          amount: transfer.amount,
          status: transfer.status,
        }

        // Check if there's an order associated with this transfer
        const orderId = await env.TRANSFER_MAPPINGS.get(
          transfer.transferRequestId
        )
        if (orderId) {
          enrichedTransfer.orderId = orderId

          // Fetch order details from database
          const order = await env.MERCHANTS_OAUTH.prepare(
            `SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
             FROM manual_orders
             WHERE id = ?`
          )
            .bind(orderId)
            .first<ManualOrder>()

          if (order) {
            enrichedTransfer.orderDetails = {
              orderId: order.id,
              merchantId: order.merchant_id,
              amount: order.amount,
              description: order.description,
              status: order.status,
              transferRequestId: order.transfer_request_id,
              merchantDisplayName: order.merchant_display_name,
              createdAt: order.created_at,
              updatedAt: order.updated_at,
            }
            // Use the order description as customer name if available
            if (order.description) {
              enrichedTransfer.customerName = order.description
            }
          }
        }

        enrichedTransfers.push(enrichedTransfer)
      }

      const response = {
        items: enrichedTransfers,
        continuationToken: transferData.continuationToken,
      }

      console.log("Returning enriched transfers:", response)

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
        },
      })
    }
  )(request, env)
}
