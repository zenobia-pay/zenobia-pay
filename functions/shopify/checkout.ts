import { Env } from "../types"

interface PaymentSessionBody {
  id: string
  return_url?: string
  cancel_url?: string
  customer?: {
    email?: string
  }
  amount?: string
  currency?: string
  test?: boolean
}

export async function onRequestPost(request: Request, env: Env) {
  try {
    const body = (await request.json()) as PaymentSessionBody
    console.log("body", body)
    const shop = request.headers.get("shopify-shop-domain")
    const paymentSessionId = body.id
    const returnUrl = body.return_url ?? body.cancel_url

    console.log("shop", shop)
    console.log("paymentSessionId", paymentSessionId)
    console.log("returnUrl", returnUrl)

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

    await env.SHOPIFY_CHECKOUT_SESSION_KV.put(
      paymentSessionId,
      JSON.stringify({
        shop,
        returnUrl,
        cancelUrl: body.cancel_url,
        email: body.customer?.email,
        amount: body.amount,
        currency: body.currency,
        createdAt: Date.now(),
        test: body.test ?? false,
      })
    )

    console.log("shop", shop)
    const redirectUrl = `https://dashboard.zenobiapay.com/shopify/store/${shop}?id=${encodeURIComponent(paymentSessionId)}`

    return new Response(JSON.stringify({ redirect_url: redirectUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (err) {
    console.error("error handling session init:", err)
    return new Response("internal error", { status: 500 })
  }
}
