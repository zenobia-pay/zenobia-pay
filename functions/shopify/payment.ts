import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

interface PaymentRequest {
  sessionId: string
  paymentMethodId: string
}

export async function onRequest(
  context: EventContext<EnvWithStripe, string, unknown>
) {
  const { request, env } = context
  const url = new URL(request.url)
  const sessionId = url.searchParams.get("sessionId")

  if (!sessionId) {
    return new Response("Missing session ID", { status: 400 })
  }

  // For GET requests, serve the payment page
  if (request.method === "GET") {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Zenobia Pay - Payment</title>
          <script src="https://js.stripe.com/v3/"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f7f7f7;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .payment-container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 500px;
            }
            .payment-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .payment-header h1 {
              margin: 0;
              color: #1a1a1a;
              font-size: 24px;
            }
            .payment-form {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .form-row {
              display: flex;
              gap: 10px;
            }
            .form-group {
              flex: 1;
            }
            label {
              display: block;
              margin-bottom: 8px;
              color: #4a4a4a;
              font-size: 14px;
            }
            input {
              width: 100%;
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
              box-sizing: border-box;
            }
            button {
              background: #0066cc;
              color: white;
              border: none;
              padding: 14px;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              width: 100%;
              transition: background 0.2s;
            }
            button:hover {
              background: #0052a3;
            }
            button:disabled {
              background: #ccc;
              cursor: not-allowed;
            }
            .error {
              color: #dc2626;
              font-size: 14px;
              margin-top: 4px;
            }
            #card-element {
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 4px;
              background: white;
            }
          </style>
        </head>
        <body>
          <div class="payment-container">
            <div class="payment-header">
              <h1>Complete Your Payment</h1>
            </div>
            <form id="payment-form" class="payment-form">
              <div id="card-element"></div>
              <div id="card-errors" class="error" role="alert"></div>
              <div class="form-row">
                <div class="form-group">
                  <label for="expiry">Expiry</label>
                  <input type="text" id="expiry" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                  <label for="cvc">CVC</label>
                  <input type="text" id="cvc" placeholder="123" maxlength="3">
                </div>
              </div>
              <button type="submit" id="submit-button">Pay Now</button>
            </form>
          </div>

          <script>
            const stripe = Stripe('${env.STRIPE_PUBLIC_KEY}');
            const elements = stripe.elements();
            const card = elements.create('card', {
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                }
              }
            });
            card.mount('#card-element');

            const form = document.getElementById('payment-form');
            const submitButton = document.getElementById('submit-button');
            const cardErrors = document.getElementById('card-errors');

            card.addEventListener('change', ({error}) => {
              if (error) {
                cardErrors.textContent = error.message;
              } else {
                cardErrors.textContent = '';
              }
            });

            form.addEventListener('submit', async (event) => {
              event.preventDefault();
              submitButton.disabled = true;

              try {
                const {paymentMethod, error} = await stripe.createPaymentMethod({
                  type: 'card',
                  card: card,
                });

                if (error) {
                  cardErrors.textContent = error.message;
                  submitButton.disabled = false;
                  return;
                }

                // Send the payment method ID to your server
                const response = await fetch('/shopify/payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    sessionId: '${sessionId}',
                    paymentMethodId: paymentMethod.id,
                  }),
                });

                const result = await response.json();

                if (result.error) {
                  cardErrors.textContent = result.error;
                  submitButton.disabled = false;
                } else {
                  // Redirect to the return URL
                  window.location.href = result.returnUrl;
                }
              } catch (err) {
                cardErrors.textContent = 'An unexpected error occurred.';
                submitButton.disabled = false;
              }
            });
          </script>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  }

  // For POST requests, handle the payment
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as PaymentRequest
      const { sessionId, paymentMethodId } = body

      if (!sessionId || !paymentMethodId) {
        return new Response(
          JSON.stringify({ error: "Missing required parameters" }),
          { status: 400 }
        )
      }

      // Extract shop domain from session ID
      const shop = sessionId.split("/")[2]

      // Get the store's access token from the database
      const store = await env.MERCHANTS_OAUTH.prepare(
        "SELECT access_token FROM shopify_stores WHERE shop_domain = ?"
      )
        .bind(shop)
        .first()

      if (!store) {
        return new Response("Store not found", { status: 404 })
      }

      // Get the payment session details from Shopify using the proxy
      const sessionResponse = await fetch(
        "https://v0-simple-proxy-server.vercel.app/api/proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": store.access_token as string,
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
                }
              }
            `,
            variables: {
              id: sessionId,
            },
          }),
        }
      )

      if (!sessionResponse.ok) {
        throw new Error("Failed to fetch payment session")
      }

      const sessionData = await sessionResponse.json()
      const paymentSession = sessionData.data?.paymentSession

      if (!paymentSession) {
        throw new Error("Payment session not found")
      }

      // Process the payment with Stripe
      const stripeResponse = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            amount: paymentSession.amount.amount,
            currency: paymentSession.amount.currencyCode.toLowerCase(),
            payment_method: paymentMethodId,
            confirm: "true",
            return_url: paymentSession.returnUrl,
          }).toString(),
        }
      )

      if (!stripeResponse.ok) {
        const error = await stripeResponse.json()
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        })
      }

      // Update the payment session in Shopify using the proxy
      const updateResponse = await fetch(
        "https://v0-simple-proxy-server.vercel.app/api/proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": store.access_token as string,
            Authorization: `Bearer ${env.SHOPIFY_PROXY_SECRET}`,
            "x-target-url": `https://${shop}/payments_apps/api/2025-04/graphql.json`,
          },
          body: JSON.stringify({
            query: `
              mutation updatePaymentSession($id: ID!, $state: PaymentSessionState!) {
                paymentSessionUpdate(id: $id, state: $state) {
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
              id: sessionId,
              state: "COMPLETED",
            },
          }),
        }
      )

      if (!updateResponse.ok) {
        throw new Error("Failed to update payment session")
      }

      // Return success with the return URL
      return new Response(
        JSON.stringify({
          returnUrl: paymentSession.returnUrl,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    } catch (error) {
      console.error("Error processing payment:", error)
      return new Response(
        JSON.stringify({ error: "Error processing payment" }),
        { status: 500 }
      )
    }
  }

  return new Response("Method not allowed", { status: 405 })
}
