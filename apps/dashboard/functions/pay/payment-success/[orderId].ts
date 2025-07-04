import { Env } from "../../types"

interface ManualOrder {
  id: string
  merchant_id: string
  amount: number
  description: string | null
  status: string
  transfer_request_id: string | null
  created_at: string
  updated_at: string
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const orderId = url.pathname.split("/").pop() // Get orderId from the last path segment

  if (!orderId) {
    return new Response("Missing order ID", { status: 400 })
  }

  console.log("Showing success page for order:", orderId)

  // Get order data from database
  const order = await env.MERCHANTS_OAUTH.prepare(
    `SELECT id, merchant_id, amount, description, status, transfer_request_id, created_at, updated_at
     FROM manual_orders
     WHERE id = ?`
  )
    .bind(orderId)
    .first<ManualOrder>()

  if (!order) {
    return new Response("Order not found", { status: 404 })
  }

  console.log("Found order:", order)

  // Create the success page HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .success-card {
            background: white;
            border-radius: 12px;
            padding: 3rem 2rem;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            width: 100%;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background-color: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
        }

        .success-icon svg {
            width: 40px;
            height: 40px;
            color: white;
        }

        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #111827;
        }

        .amount {
            font-size: 1.5rem;
            font-weight: 600;
            color: #059669;
            margin-bottom: 1rem;
        }

        .description {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .order-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
        }

        .order-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .order-detail:last-child {
            margin-bottom: 0;
        }

        .order-detail span:first-child {
            font-weight: 500;
            color: #374151;
        }

        .order-detail span:last-child {
            color: #6b7280;
            font-family: monospace;
        }

        .close-button {
            background-color: #1f2937;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .close-button:hover {
            background-color: #111827;
        }

        @media (max-width: 640px) {
            .container {
                padding: 1rem;
            }

            .success-card {
                padding: 2rem 1.5rem;
            }

            h1 {
                font-size: 1.75rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-card">
            <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1>Payment Successful!</h1>
            <div class="amount">$${(order.amount / 100).toFixed(2)}</div>
            <div class="description">${order.description || "Payment completed successfully"}</div>

            <div class="order-details">
                <div class="order-detail">
                    <span>Order ID:</span>
                    <span>${order.id}</span>
                </div>
                <div class="order-detail">
                    <span>Date:</span>
                    <span>${new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div class="order-detail">
                    <span>Time:</span>
                    <span>${new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
            </div>

            <button class="close-button" onclick="window.close()">
                Close
            </button>
        </div>
    </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      Vary: "*",
    },
  })
}
