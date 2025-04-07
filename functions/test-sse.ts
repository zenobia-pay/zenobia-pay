import { sendPaymentEvent } from "./payment-events";

export interface Env {
  // Add your environment bindings here
  ZENOBIA_CLIENT_ID?: string;
  ZENOBIA_CLIENT_SECRET?: string;
}

export interface Context {
  env: Env;
  params: Record<string, string>;
  request: Request;
  // Add other properties as needed
}

// Helper function to add CORS headers to a response
function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handleTestSSE(request: Request): Promise<Response> {
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
    });
  }

  // Only allow GET requests for simplicity
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get parameters from URL query string
    const url = new URL(request.url);
    const paymentId = url.searchParams.get("paymentId");
    const status = url.searchParams.get("status") || "completed";

    if (!paymentId) {
      return new Response("Payment ID is required", { status: 400 });
    }

    // Simulate a webhook event
    const eventData = {
      type: "payment_status_update",
      paymentId,
      status,
      timestamp: new Date().toISOString(),
    };

    // Try to send the event
    const sent = sendPaymentEvent(paymentId, eventData);

    // Return the response
    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: sent,
          message: sent
            ? `Event sent to payment ${paymentId}`
            : `No active connection found for payment ${paymentId}`,
          eventData,
        }),
        {
          status: sent ? 200 : 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  } catch (error) {
    console.error("Error sending test event:", error);
    const errorResponse = new Response(
      JSON.stringify({ error: "Failed to send test event" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function onRequest(context: Context): Promise<Response> {
  return await handleTestSSE(context.request);
}
