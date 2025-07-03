import { Env } from "../types"

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
    const body = await request.json()
    console.log("Manual order webhook received:", body)

    const { transferRequestId, status } = body

    if (!transferRequestId || !status) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Update the order status based on the transfer status
    let orderStatus = "pending"

    switch (status) {
      case "COMPLETED":
        orderStatus = "paid"
        break
      case "FAILED":
        orderStatus = "failed"
        break
      case "EXPIRED":
        orderStatus = "expired"
        break
      case "CANCELLED":
        orderStatus = "cancelled"
        break
      default:
        orderStatus = "pending"
    }

    // Update the order in the database
    await env.MERCHANTS_OAUTH.prepare(
      `UPDATE manual_orders
       SET status = ?, updated_at = ?
       WHERE transfer_request_id = ?`
    )
      .bind(orderStatus, new Date().toISOString(), transferRequestId)
      .run()

    console.log(
      `Updated order with transfer request ${transferRequestId} to status: ${orderStatus}`
    )

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    })
  } catch (error) {
    console.error("Error processing manual order webhook:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process webhook" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
        },
      }
    )
  }
}
