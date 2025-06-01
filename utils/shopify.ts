// utils/shopify.ts
import { GraphQLClient, gql } from "graphql-request"

export async function updatePaymentSession(
  shop: string,
  accessToken: string,
  sessionId: string,
  state: "AUTHORIZED" | "COMPLETED"
) {
  const client = new GraphQLClient(
    `https://${shop}/payments_apps/api/2025-04/graphql.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    }
  )

  const mutation = gql`
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
  `

  const result = await client.request(mutation, { id: sessionId, state })
  console.log(`shopify update ${state}:`, JSON.stringify(result))
  return result
}
