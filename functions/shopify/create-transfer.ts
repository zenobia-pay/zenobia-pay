import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"
import { decrypt } from "../../utils/encryption"

interface CreateTransferRequest {
  sessionId: string
}

interface ShopifyStore {
  shop_domain: string
  access_token: string
  zenobia_client_id: string
  zenobia_client_secret: string
}

interface CheckoutSession {
  shop: string
  returnUrl: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
}

async function getAccessToken(
  env: Env,
  clientId: string,
  encryptedClientSecret: string
): Promise<string> {
  try {
    const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
    const audience = env.ACCOUNTS_AUDIENCE || ""

    if (!clientId || !encryptedClientSecret) {
      console.warn("No Auth0 credentials provided, using test mode")
      return "test_token"
    }

    // Decrypt the client secret
    const clientSecret = encryptedClientSecret
    //  await decrypt(
    //   encryptedClientSecret,
    //   env.SHOPIFY_ENCRYPTION_KEY
    // )

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
  } catch (err) {
    console.error("Auth0 authentication error:", err)
    throw new Error("Failed to authenticate with Auth0")
  }
}

async function getOrderDetails(
  env: Env,
  shop: string,
  encryptedAccessToken: string,
  sessionId: string
): Promise<any> {
  // Decrypt the access token
  const accessToken = await decrypt(
    encryptedAccessToken,
    env.SHOPIFY_ENCRYPTION_KEY
  )
  console.log("Decrypted access token:", accessToken)

  const response = await fetch(
    "https://v0-simple-proxy-server.vercel.app/api/proxy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        Authorization: `Bearer ${env.SHOPIFY_PROXY_SECRET}`,
        "x-target-url": `https://${shop}/payments_apps/api/2025-04/graphql.json`,
      },
      body: JSON.stringify({
        query: `
          query getPaymentSession($id: ID!) {
            paymentSession(id: $id) {
              id
              state
              amount {
                amount
                currencyCode
              }
              returnUrl
              paymentSession {
                id
                state
                amount {
                  amount
                  currencyCode
                }
                returnUrl
                order {
                  id
                  name
                  email
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        title
                        quantity
                        variant {
                          price
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: sessionId,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("Failed to fetch order details:", error)
    throw new Error("Failed to fetch order details")
  }

  const data = await response.json()
  console.log("Order details:", JSON.stringify(data, null, 2))
  return data.data?.paymentSession?.paymentSession?.order
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    // Parse the request body
    const body = (await request.json()) as CreateTransferRequest
    const { sessionId } = body

    if (!sessionId) {
      return new Response("Missing sessionId in request body", { status: 400 })
    }

    // Get session data from KV
    const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(sessionId)
    if (!sessionData) {
      return new Response("Session not found", { status: 404 })
    }

    const session = JSON.parse(sessionData) as CheckoutSession

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
    const accessToken = await getAccessToken(
      env,
      store.zenobia_client_id,
      store.zenobia_client_secret
    )

    // Get order details from Shopify
    let orderDetails
    try {
      orderDetails = await getOrderDetails(
        env,
        session.shop,
        store.access_token,
        sessionId
      )
      console.log(
        "Successfully fetched order details:",
        JSON.stringify(orderDetails, null, 2)
      )
    } catch (error) {
      console.error(
        "Failed to fetch order details, continuing with empty details:",
        error
      )
      orderDetails = null
    }

    const transferRequestBody = {
      amount: Math.round(parseFloat(session.amount || "0") * 100),
      statementItems: [
        {
          name: "Payment",
          amount: Math.round(parseFloat(session.amount || "0") * 100),
        },
      ],
      // metadata: {
      //   sessionId: sessionId,
      //   shop: session.shop,
      //   orderId: orderDetails?.id || null,
      //   orderName: orderDetails?.name || null,
      //   orderEmail: orderDetails?.email || null,
      //   orderTotal: orderDetails?.totalPriceSet?.shopMoney?.amount || null,
      //   orderCurrency:
      //     orderDetails?.totalPriceSet?.shopMoney?.currencyCode || null,
      //   lineItems:
      //     orderDetails?.lineItems?.edges?.map((edge: any) => ({
      //       title: edge.node.title,
      //       quantity: edge.node.quantity,
      //       price: edge.node.variant?.price,
      //       variant: edge.node.variant?.title,
      //     })) || [],
      // },
    }

    console.log(
      "Creating transfer request with body:",
      JSON.stringify(transferRequestBody, null, 2)
    )

    // Create transfer request with Zenobia Pay
    const transferResponse = await fetch(
      `${env.API_BASE_URL}/create-transfer-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(transferRequestBody),
      }
    )

    if (!transferResponse.ok) {
      const error = await transferResponse.text()
      console.error("Failed to create transfer:", error)
      return new Response("Failed to create transfer", { status: 500 })
    }

    const transferData = await transferResponse.json()

    // Store the mapping between transfer ID and session ID
    await env.TRANSFER_MAPPINGS.put(transferData.transferRequestId, sessionId)

    return new Response(JSON.stringify(transferData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Create transfer error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
