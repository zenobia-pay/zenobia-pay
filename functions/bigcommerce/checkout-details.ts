import { Env } from "../types"

interface CheckoutData {
  data: {
    id: string
    cart: {
      id: string
      currency: {
        code: string
      }
      line_items: {
        physical_items: Array<{
          id: string
          quantity: number
          list_price: number
          original_price: number
          sale_price: number
        }>
        digital_items: Array<{
          id: string
          quantity: number
          list_price: number
          original_price: number
          sale_price: number
        }>
      }
      cart_amount_inc_tax: number
      cart_amount_ex_tax: number
    }
    grand_total: number
    subtotal_inc_tax: number
    subtotal_ex_tax: number
  }
}

interface BigCommerceStore {
  store_hash: string
  access_token: string
}

enum HmacType {
  SUBSCRIBE = "SUBSCRIBE",
}

async function verifyPayloadSignature(
  token: string,
  signatureType: HmacType,
  env: Env
): Promise<boolean> {
  try {
    // Split the token into parts
    const [encodedPayload, receivedSignature] = token.split(".")

    if (!encodedPayload || !receivedSignature) {
      console.log("Invalid token format. Expected payload.signature format")
      return false
    }

    const encoder = new TextEncoder()

    const secret = env.SUBSCRIBE_HMAC
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(encodedPayload)

    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    // Generate the signature
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData)
    const signatureArray = new Uint8Array(signatureBuffer)

    // Convert to URL-safe Base64 without padding to match Java's Base64.getUrlEncoder().withoutPadding()
    const expectedSignature = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // Compare the expected signature with the received one
    const signaturesMatch = receivedSignature === expectedSignature

    if (signaturesMatch) {
      console.log("Signature verified successfully")
    } else {
      console.log("Signature verification failed")
      console.log(`Expected signature: ${expectedSignature}`)
      console.log(`Received signature: ${receivedSignature}`)
      console.log(
        `Expected length: ${expectedSignature.length}, Received length: ${receivedSignature.length}`
      )
    }

    return signaturesMatch
  } catch (error) {
    console.error("Error verifying payload signature:", error)
    return false
  }
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    // Get token from query parameters
    const token = url.searchParams.get("token")

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "Authentication required. Missing token.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Verify the signature
    const isValidSignature = await verifyPayloadSignature(
      token,
      HmacType.SUBSCRIBE,
      env
    )

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({
          error: "Invalid signature or expired credentials",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Decode and validate the payload
    try {
      const [encodedPayload] = token.split(".")
      const payloadStr = atob(encodedPayload)
      const payloadData = JSON.parse(payloadStr)

      // Check if payload contains all required fields
      if (
        !payloadData.transferRequestId ||
        !payloadData.merchantId ||
        !payloadData.expiry
      ) {
        return new Response(
          JSON.stringify({
            error: "Invalid payload format",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      console.log("payloadData", payloadData)
      // Get checkout ID from KV storage
      const checkoutId = await env.TRANSFER_MAPPINGS.get(
        payloadData.transferRequestId
      )
      if (!checkoutId) {
        return new Response(
          JSON.stringify({
            error: "Checkout ID not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Get store details from database
      const store = await env.MERCHANTS_OAUTH.prepare(
        `SELECT store_hash, access_token FROM bigcommerce_stores WHERE store_hash = ?`
      )
        .bind(payloadData.merchantId)
        .first<BigCommerceStore>()

      if (!store) {
        return new Response(
          JSON.stringify({
            error: "Store not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Fetch checkout details from BigCommerce
      const checkoutResponse = await fetch(
        `https://api.bigcommerce.com/stores/${store.store_hash}/v3/checkouts/${checkoutId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": store.access_token,
          },
        }
      )

      if (!checkoutResponse.ok) {
        const error = await checkoutResponse.text()
        console.error("Failed to fetch checkout:", error)
        return new Response(
          JSON.stringify({
            error: "Failed to fetch checkout details",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const checkoutData = (await checkoutResponse.json()) as CheckoutData

      return new Response(JSON.stringify(checkoutData), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    } catch (error) {
      console.error("Error processing payload:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to process payload",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
