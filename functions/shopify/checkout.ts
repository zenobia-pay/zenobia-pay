import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"
import { decrypt } from "../../utils/encryption"

interface PaymentSessionRequest {
  shop: string
  paymentSessionId: string
  returnUrl: string
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  console.log("Request", request)
  try {
    const body = (await request.json()) as PaymentSessionRequest
    const { shop, paymentSessionId, returnUrl } = body

    if (!shop || !paymentSessionId || !returnUrl) {
      console.log("Missing required parameters", {
        shop,
        paymentSessionId,
        returnUrl,
      })
      return new Response("Missing required parameters", { status: 400 })
    }

    // Get the store's access token from the database
    const store = await env.MERCHANTS_OAUTH.prepare(
      "SELECT access_token FROM shopify_stores WHERE shop_domain = ?"
    )
      .bind(shop)
      .first()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    // Decrypt the access token
    const accessToken = await decrypt(
      store.access_token as string,
      env.SHOPIFY_ENCRYPTION_KEY
    )

    // Get the payment session details from Shopify
    const sessionResponse = await fetch(
      `https://${shop}/payments_apps/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
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
                paymentMethod {
                  type
                }
                customer {
                  id
                  email
                }
              }
            }
          `,
          variables: {
            id: paymentSessionId,
          },
        }),
      }
    )

    if (!sessionResponse.ok) {
      throw new Error("Failed to fetch payment session")
    }

    const sessionData = await sessionResponse.json()
    const paymentSession = sessionData.data?.paymentSession

    // Validate the payment session state
    if (paymentSession?.state !== "PENDING") {
      return new Response(
        JSON.stringify({
          error: "Invalid payment session state",
          state: paymentSession?.state,
        }),
        { status: 400 }
      )
    }

    // Create a payment session with our gateway
    const gatewayResponse = await fetch(
      `https://${shop}/payments_apps/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: `
            mutation createPaymentSession($input: PaymentSessionCreateInput!) {
              paymentSessionCreate(input: $input) {
                paymentSession {
                  id
                  state
                  nextAction {
                    type
                    context {
                      redirectUrl
                    }
                  }
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
              paymentSessionId,
              amount: paymentSession.amount.amount,
              currencyCode: paymentSession.amount.currencyCode,
              customerId: paymentSession.customer.id,
              returnUrl,
              paymentMethod: {
                type: "CREDIT_CARD",
                gateway: "zenobia-pay",
              },
            },
          },
        }),
      }
    )

    if (!gatewayResponse.ok) {
      throw new Error("Failed to create payment session with gateway")
    }

    const gatewayData = await gatewayResponse.json()
    const redirectUrl =
      gatewayData.data?.paymentSessionCreate?.paymentSession?.nextAction
        ?.context?.redirectUrl

    if (!redirectUrl) {
      throw new Error("No redirect URL provided by gateway")
    }

    // Return the redirect URL
    return new Response(
      JSON.stringify({
        redirectUrl,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error creating payment session:", error)
    return new Response("Error creating payment session", { status: 500 })
  }
}
