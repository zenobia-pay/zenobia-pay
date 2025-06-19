import type {
  Request as CFRequest,
  Response as CFResponse,
} from "@cloudflare/workers-types"
import { onRequest as bigcommerceOAuth } from "../functions/bigcommerce/oauth"
import { onRequest as bigcommerceLoad } from "../functions/bigcommerce/load"
import { onRequest as bigcommerceCheckoutDetails } from "../functions/bigcommerce/checkout-details"
import { onRequest as bigcommerceCreateTransfer } from "../functions/bigcommerce/create-transfer"
import { onRequest as bigcommerceWebhooks } from "../functions/bigcommerce/webhooks/[storeId]"
import { onRequest as shopifyIndex } from "../functions/shopify/index"
import { onRequest as shopifyWebhooks } from "../functions/shopify/webhooks/[shop]"
import { onRequest as shopifyAuthCallback } from "../functions/shopify/auth/callback"
import { onRequest as shopifyCreateTransfer } from "../functions/shopify/create-transfer"
import { onRequestPost as shopifyCheckout } from "../functions/shopify/checkout"
import { onRequest as shopifyStore } from "../functions/shopify/store/[shop]"
import { onRequest as shopifyShopErasure } from "../functions/shopify/shop-erasure"
import { onRequest as shopifyCustomerErasure } from "../functions/shopify/customer-erasure"
import { onRequest as shopifyCustomerData } from "../functions/shopify/customer-data"

const VITE_DEV_SERVER = "http://localhost:8787"

// Define route patterns and their handlers
const ROUTE_PATTERNS = [
  { pattern: /^\/bigcommerce\/oauth$/, handler: bigcommerceOAuth },
  { pattern: /^\/bigcommerce\/load$/, handler: bigcommerceLoad },
  {
    pattern: /^\/bigcommerce\/checkout-details$/,
    handler: bigcommerceCheckoutDetails,
  },
  {
    pattern: /^\/bigcommerce\/create-transfer$/,
    handler: bigcommerceCreateTransfer,
  },
  { pattern: /^\/bigcommerce\/webhooks\/[^/]+$/, handler: bigcommerceWebhooks },
  { pattern: /^\/shopify$/, handler: shopifyIndex },
  { pattern: /^\/shopify\/store\/[^/]+$/, handler: shopifyStore },
  { pattern: /^\/shopify\/webhooks\/[^/]+$/, handler: shopifyWebhooks },
  { pattern: /^\/shopify\/auth\/callback$/, handler: shopifyAuthCallback },
  { pattern: /^\/shopify\/create-transfer$/, handler: shopifyCreateTransfer },
  { pattern: /^\/shopify\/checkout$/, handler: shopifyCheckout },
  { pattern: /^\/shopify\/shop-erasure$/, handler: shopifyShopErasure },
  { pattern: /^\/shopify\/customer-erasure$/, handler: shopifyCustomerErasure },
  { pattern: /^\/shopify\/customer-data$/, handler: shopifyCustomerData },
]

export default {
  async fetch(request: CFRequest, env: Env): Promise<CFResponse> {
    const url = new URL(request.url)
    const path = url.pathname

    console.log(`[Request] ${request.method} ${path}`)

    // Find matching route pattern
    const matchingRoute = ROUTE_PATTERNS.find((route) =>
      route.pattern.test(path)
    )

    if (matchingRoute) {
      try {
        const response = await matchingRoute.handler(
          request as unknown as Request,
          env
        )
        console.log(`[Response] ${path} - Status: ${response.status}`)

        // Only log response body for non-streaming responses
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const clonedResponse = response.clone()
          const body = await clonedResponse.text()
          console.log(`Response body: ${body}`)
        }

        return response as unknown as CFResponse
      } catch (e) {
        console.error("Route error:", e)
        const errorResponse = new Response("Not Found", {
          status: 500,
        })
        console.log(`[Response] ${path} - Status: 500 (Error)`)
        return errorResponse as unknown as CFResponse
      }
    }

    const isDev = url.hostname === "localhost" || url.hostname === "127.0.0.1"

    if (!matchingRoute && isDev) {
      console.log(`[Request] Dev server - ${path}`)
      const viteUrl = new URL(path, VITE_DEV_SERVER)
      const response = await fetch(
        viteUrl.toString(),
        request as unknown as RequestInit
      )
      console.log(
        `[Response] Dev server - ${path} - Status: ${response.status}`
      )
      return response as unknown as CFResponse
    }

    console.log(`[Request] Assets - ${path}`)
    const response = await env.ASSETS.fetch(request)
    console.log(`[Response] Assets - ${path} - Status: ${response.status}`)
    return response as unknown as CFResponse
  },
}
