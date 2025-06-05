import { Env } from "../types"
import { jwtVerify } from "jose"

interface SignedPayload {
  aud: string
  iss: string
  iat: number
  nbf: number
  exp: number
  jti: string
  sub: string
  user: {
    id: number
    email: string
    locale: string
  }
  owner: {
    id: number
    email: string
  }
  url: string
  channel_id: string | null
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const signedPayloadJwt = url.searchParams.get("signed_payload_jwt")

  if (!signedPayloadJwt) {
    return new Response("Missing required parameters", { status: 400 })
  }

  try {
    // Verify signed_payload_jwt (JWT)
    const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET)
    const { payload } = await jwtVerify(signedPayloadJwt, secret)
    const storeHash = (payload as unknown as SignedPayload).sub.replace(
      "stores/",
      ""
    )

    // Delete the store entry
    await env.MERCHANTS_OAUTH.prepare(
      `DELETE FROM bigcommerce_stores WHERE store_hash = ?`
    )
      .bind(storeHash)
      .run()

    return new Response("Store uninstalled successfully", { status: 200 })
  } catch (error) {
    console.error("Uninstall error:", error)
    return new Response("Failed to uninstall store", { status: 500 })
  }
}
