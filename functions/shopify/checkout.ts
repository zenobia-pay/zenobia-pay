import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface PaymentSessionBody {
  id: string
  return_url?: string
  cancel_url?: string
  customer?: {
    email?: string
  }
  amount?: string
  currency?: string
}

export async function onRequestPost(
  context: EventContext<Env, string, unknown>
) {
  const { request, env } = context

  try {
    const body = (await request.json()) as PaymentSessionBody
    console.log("body", body)
    const shop = request.headers.get("shopify-shop-domain")
    const paymentSessionId = body.id
    const returnUrl = body.return_url ?? body.cancel_url

    if (!shop || !paymentSessionId || !returnUrl) {
      console.log("missing required params", {
        shop,
        paymentSessionId,
        returnUrl,
      })
      return new Response("missing required params", { status: 400 })
    }

    // fetch + decrypt access token
    const row = await env.MERCHANTS_OAUTH.prepare(
      "SELECT access_token FROM shopify_stores WHERE shop_domain = ?"
    )
      .bind(shop)
      .first()

    if (!row) {
      return new Response("Store not found", { status: 404 })
    }

    // optionally store metadata but not the token
    await env.SHOPIFY_CHECKOUT_SESSION_KV.put(
      paymentSessionId,
      JSON.stringify({
        shop,
        returnUrl,
        email: body.customer?.email,
        amount: body.amount,
        currency: body.currency,
        createdAt: Date.now(),
      })
    )

    const redirectUrl = `https://dashboard.zenobiapay.com/shopify/store?id=${encodeURIComponent(paymentSessionId)}`

    return Response.redirect(redirectUrl, 302)
  } catch (err) {
    console.error("error handling session init:", err)
    return new Response("internal error", { status: 500 })
  }
}
