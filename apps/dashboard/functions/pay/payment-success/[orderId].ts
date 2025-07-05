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
    `SELECT id, merchant_id, amount, description, status, transfer_request_id, merchant_display_name, created_at, updated_at
     FROM manual_orders
     WHERE id = ?`
  )
    .bind(orderId)
    .first<ManualOrder & { merchant_display_name: string | null }>()

  if (!order) {
    return new Response("Order not found", { status: 404 })
  }

  console.log("Found order:", order)

  const merchantName = order.merchant_display_name || "Store"

  // Create the success page HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        html, body {
            height: 100%;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%);
            color: #1f2937;
            min-height: 100vh;
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1rem;
            min-height: 100vh;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .success-card {
            background: rgba(255,255,255,0.97);
            border-radius: 16px;
            padding: 2.5rem 2rem 2rem 2rem;
            text-align: center;
            box-shadow: 0 4px 24px 0 rgba(31,41,55,0.10);
            width: 100%;
            max-width: 400px;
            position: relative;
            animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
            width: 80px;
            height: 80px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            box-shadow: 0 2px 8px 0 rgba(16,185,129,0.10);
            position: relative;
            animation: popIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        .success-icon svg {
            width: 40px;
            height: 40px;
            color: white;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: checkmark 0.7s 0.2s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes checkmark {
            to { stroke-dashoffset: 0; }
        }
        h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #111827;
            letter-spacing: -1px;
        }
        .merchant-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 1.2rem;
            letter-spacing: 0.01em;
        }
        .amount {
            font-size: 1.7rem;
            font-weight: 700;
            color: #059669;
            margin-bottom: 0.5rem;
        }
        .description {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 1.08rem;
        }
        .order-details {
            background: #f3f4f6;
            border-radius: 10px;
            padding: 1.1rem 1.3rem;
            margin-bottom: 2rem;
            text-align: left;
            box-shadow: 0 1px 4px 0 rgba(99,102,241,0.03);
        }
        .order-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.6rem;
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
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.8rem 2.2rem;
            border-radius: 8px;
            font-size: 1.08rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 1px 4px 0 rgba(37,99,235,0.08);
            transition: background 0.18s, transform 0.1s;
        }
        .close-button:hover {
            background: #1d4ed8;
            transform: translateY(-1px) scale(1.02);
        }
        @media (max-width: 640px) {
            .container {
                padding: 1rem;
            }
            .success-card {
                padding: 1.5rem 0.5rem;
            }
            h1 {
                font-size: 1.3rem;
            }
            .amount {
                font-size: 1.1rem;
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
            <div class="merchant-name">${merchantName}</div>
            <div class="description">${order.description || "Payment completed successfully"}</div>
            <div class="order-details">
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
