export async function resolvePaymentSession({
  shop,
  accessToken,
  proxySecret,
  sessionId,
  amount,
}: {
  shop: string
  accessToken: string
  proxySecret: string
  sessionId: string
  amount: number
}) {
  const authExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const response = await fetch(
    "https://v0-simple-proxy-server.vercel.app/api/proxy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        Authorization: `Bearer ${proxySecret}`,
        "x-target-url": `https://${shop}/payments_apps/api/2025-04/graphql.json`,
      },
      body: JSON.stringify({
        query: `
          mutation ResolvePaymentSession(
            $id: ID!
            $authorizationExpiresAt: DateTime!
            $paymentDetails: PaymentSessionDetailsInput!
          ) {
            paymentSessionResolve(
              id: $id
              authorizationExpiresAt: $authorizationExpiresAt
              paymentDetails: $paymentDetails
            ) {
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
          authorizationExpiresAt: authExpiry,
          paymentDetails: {
            amount: amount.toFixed(2),
            currencyCode: "USD",
            paymentMethodName: "Bank Transfer",
          },
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("resolvePaymentSession failed:", error)
    throw new Error("Failed to resolve payment session")
  }

  const data = await response.json()
  return data.data?.paymentSessionResolve
}
