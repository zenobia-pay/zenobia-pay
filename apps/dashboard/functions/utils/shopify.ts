// Helper function to validate Shopify webhook HMAC
export async function validateShopifyWebhook(
  request: Request,
  clientSecret: string
): Promise<boolean> {
  const hmac = request.headers.get("x-shopify-hmac-sha256")
  if (!hmac) {
    return false
  }

  // Get the raw body as text
  const rawBody = await request.text()

  // Convert the client secret to a key
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(clientSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  // Calculate HMAC
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  )

  // Convert the signature to base64
  const calculatedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)))

  // Compare HMACs
  return calculatedHmac === hmac
}
