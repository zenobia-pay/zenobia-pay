import { Env } from "./types"

export async function onRequest(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "*"

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await request.text()
    const auth = request.headers.get("Authorization")

    const resp = await fetch(`${env.API_BASE_URL}/create-transfer-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body,
    })

    const respBody = await resp.text()
    return new Response(respBody, {
      status: resp.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    })
  } catch (err) {
    console.error("Error creating transfer:", err)
    return new Response("Internal server error", { status: 500 })
  }
}
