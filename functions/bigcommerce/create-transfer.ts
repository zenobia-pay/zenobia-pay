import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface CreateTransferRequest {
  checkoutId: string
}

interface BigCommerceStore {
  store_hash: string
  access_token: string
  url_endpoint: string
  zenobia_client_id: string
  zenobia_client_secret: string
}

interface CheckoutData {
  data: {
    id: string
    cart: {
      id: string
      currency: {
        code: string
      }
      line_items: {
        physical_items: Array<{
          id: string
          quantity: number
          list_price: number
          original_price: number
          sale_price: number
        }>
        digital_items: Array<{
          id: string
          quantity: number
          list_price: number
          original_price: number
          sale_price: number
        }>
      }
      cart_amount_inc_tax: number
      cart_amount_ex_tax: number
    }
    grand_total: number
    subtotal_inc_tax: number
    subtotal_ex_tax: number
  }
}

// List of allowed BigCommerce domains
const ALLOWED_ORIGINS = [
  "https://*.mybigcommerce.com",
  "https://*.bigcommerce.com",
]

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$")
    return regex.test(origin)
  })
}

function normalizeHostname(origin: string): string {
  // Remove protocol and www
  let hostname = origin.replace(/^https?:\/\//, "").toLowerCase()
  if (hostname.startsWith("www.")) {
    hostname = hostname.substring(4)
  }
  return hostname
}

async function getAccessToken(
  env: Env,
  clientId: string,
  clientSecret: string
): Promise<string> {
  try {
    const tokenUrl = `${env.ACCOUNTS_DOMAIN}/oauth/token`
    const audience = env.ACCOUNTS_AUDIENCE || ""

    if (!clientId || !clientSecret) {
      console.warn("No Auth0 credentials provided, using test mode")
      return "test_token"
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
  } catch (err) {
    console.error("Auth0 authentication error:", err)
    throw new Error("Failed to authenticate with Auth0")
  }
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const origin = request.headers.get("Origin")

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    if (!origin || !isAllowedOrigin(origin)) {
      return new Response(null, { status: 403 })
    }

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

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  // Check origin for actual requests
  if (!origin || !isAllowedOrigin(origin)) {
    return new Response("Forbidden", { status: 403 })
  }

  try {
    // Parse the request body
    const body = (await request.json()) as CreateTransferRequest
    const { checkoutId } = body

    if (!checkoutId) {
      return new Response("Missing checkoutId in request body", { status: 400 })
    }

    // Get the store based on the origin hostname
    const normalizedHostname = normalizeHostname(origin)
    console.log("Looking up store with hostname:", normalizedHostname)

    const store = await env.MERCHANTS_OAUTH.prepare(
      `SELECT * FROM bigcommerce_stores WHERE url_endpoint = ?`
    )
      .bind(normalizedHostname)
      .first<BigCommerceStore>()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    if (!store.zenobia_client_id || !store.zenobia_client_secret) {
      return new Response("Store not configured with Zenobia credentials", {
        status: 400,
      })
    }

    // Fetch checkout details from BigCommerce
    const checkoutResponse = await fetch(
      `https://api.bigcommerce.com/stores/${store.store_hash}/v3/checkouts/${checkoutId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-Token": store.access_token,
        },
      }
    )

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text()
      console.error("Failed to fetch checkout:", error)
      return new Response("Failed to fetch checkout details", { status: 500 })
    }

    const checkoutData = (await checkoutResponse.json()) as CheckoutData
    console.log("Checkout data:", checkoutData)

    // Get Auth0 access token using store-specific credentials
    const accessToken = await getAccessToken(
      env,
      store.zenobia_client_id,
      store.zenobia_client_secret
    )

    // Create statement items from cart items
    const statementItems = [
      // Add physical items
      ...checkoutData.data.cart.line_items.physical_items.map((item) => ({
        name: `Item #${item.id}`,
        amount: Math.round(item.sale_price * item.quantity * 100),
      })),
      // Add digital items
      ...checkoutData.data.cart.line_items.digital_items.map((item) => ({
        name: `Digital Item #${item.id}`,
        amount: Math.round(item.sale_price * item.quantity * 100),
      })),
      // Add tax as a separate item
      {
        name: "Tax",
        amount: Math.round(
          (checkoutData.data.grand_total - checkoutData.data.subtotal_ex_tax) *
            100
        ),
      },
    ]

    // Create transfer request with Zenobia Pay
    const transferResponse = await fetch(
      `${env.API_BASE_URL}/create-transfer-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: Math.round(checkoutData.data.grand_total * 100),
          statementItems,
          // metadata: {
          //   checkoutId: checkoutData.data.id,
          //   cartId: checkoutData.data.cart.id,
          //   storeHash: store.store_hash,
          //   subtotal: checkoutData.data.subtotal_inc_tax,
          //   tax:
          //     checkoutData.data.grand_total - checkoutData.data.subtotal_ex_tax,
          // },
        }),
      }
    )

    if (!transferResponse.ok) {
      const error = await transferResponse.text()
      console.error("Failed to create transfer:", error)
      return new Response("Failed to create transfer", { status: 500 })
    }

    const transferData = await transferResponse.json()

    return new Response(JSON.stringify(transferData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    })
  } catch (error) {
    console.error("Create transfer error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
