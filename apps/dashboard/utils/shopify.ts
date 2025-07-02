export async function resolvePaymentSession({
  shop,
  accessToken,
  proxySecret,
  sessionId,
}: {
  shop: string
  accessToken: string
  proxySecret: string
  sessionId: string
}) {
  console.log(
    "Attepmting to resolve payment session for the following args:",
    sessionId,
    shop
  )
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
          mutation paymentSessionResolve(
            $authentication: PaymentSessionThreeDSecureAuthentication
            $id: ID!
            $networkTransactionId: String
          ) {
            paymentSessionResolve(
              authentication: $authentication
              id: $id
              networkTransactionId: $networkTransactionId
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
          id: `gid://shopify/PaymentSession/${sessionId}`,
          authentication: null,
          networkTransactionId: null,
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
  console.log("Resolved payment session data:", data)
  return data.data?.paymentSessionResolve
}
