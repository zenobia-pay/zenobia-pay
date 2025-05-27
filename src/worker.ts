import type {
  Request as CFRequest,
  Response as CFResponse,
} from "@cloudflare/workers-types"
import type { Env as FunctionsEnv } from "../functions/types"
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

const VITE_DEV_SERVER = "http://localhost:5173"

// Define route handlers mapping (no /api prefix)
const API_ROUTES: Record<
  string,
  (request: Request, env: FunctionsEnv) => Promise<Response>
> = {
  "/bigcommerce/oauth": bigcommerceOAuth,
  "/bigcommerce/load": bigcommerceLoad,
  "/bigcommerce/checkout-details": bigcommerceCheckoutDetails,
  "/bigcommerce/create-transfer": bigcommerceCreateTransfer,
  "/bigcommerce/webhooks": bigcommerceWebhooks,
  "/shopify": shopifyIndex,
  "/shopify/webhooks": shopifyWebhooks,
  "/shopify/auth/callback": shopifyAuthCallback,
  "/shopify/create-transfer": shopifyCreateTransfer,
  "/shopify/checkout": shopifyCheckout,
}

export default {
  async fetch(request: CFRequest, env: FunctionsEnv): Promise<CFResponse> {
    const url = new URL(request.url)
    const path = url.pathname

    console.log("got request", path)
    // Route all paths directly
    const handler = API_ROUTES[path]
    if (handler) {
      try {
        return handler(
          request as unknown as Request,
          env
        ) as unknown as Promise<CFResponse>
      } catch (e) {
        console.error("Route error:", e)
        return new Response("Not Found", {
          status: 404,
        }) as unknown as CFResponse
      }
    }

    // Proxy to Vite dev server for all other requests
    const viteUrl = new URL(path, VITE_DEV_SERVER)
    return fetch(
      viteUrl.toString(),
      request as unknown as Request
    ) as unknown as Promise<CFResponse>
  },
}
