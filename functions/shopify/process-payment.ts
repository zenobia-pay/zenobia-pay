import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"
import { decrypt } from "../../utils/encryption"

interface PaymentRequest {
  sessionId: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export async function onRequestPost(
  context: EventContext<Env, string, unknown>
) {
  const { request, env } = context

  try {
    const body = (await request.json()) as PaymentRequest
    const { sessionId, cardNumber, expiryMonth, expiryYear, cvv } = body

    // Get session data from KV
    const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(sessionId)
    if (!sessionData) {
      return new Response("Session not found", { status: 404 })
    }

    const session = JSON.parse(sessionData)
    const { shop, returnUrl } = session

    // Get the store's access token
    const row = await env.MERCHANTS_OAUTH.prepare(
      "SELECT access_token FROM shopify_stores WHERE shop_domain = ?"
    )
      .bind(shop)
      .first()

    if (!row) {
      return new Response("Store not found", { status: 404 })
    }

    const accessToken = await decrypt(
      row.access_token as string,
      env.SHOPIFY_ENCRYPTION_KEY
    )

    // Process the payment with Shopify
    const response = await fetch(
      `https://${shop}/payments_apps/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: `
            mutation processPayment($input: PaymentSessionProcessInput!) {
              paymentSessionProcess(input: $input) {
                paymentSession {
                  id
                  state
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              id: sessionId,
              paymentMethod: {
                type: "CREDIT_CARD",
                gateway: "zenobia-pay",
                data: {
                  number: cardNumber,
                  expiryMonth,
                  expiryYear,
                  verificationCode: cvv,
                },
              },
            },
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to process payment")
    }

    const data = await response.json()
    const paymentSession = data.data?.paymentSessionProcess?.paymentSession

    if (!paymentSession) {
      throw new Error("Failed to process payment")
    }

    // Return the redirect URL
    return new Response(
      JSON.stringify({
        redirectUrl: returnUrl,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return new Response("Error processing payment", { status: 500 })
  }
}
