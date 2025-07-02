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

// Type definition for our event connection
interface PaymentConnection {
  id: string;
  controller: ReadableStreamDefaultController;
}

// In-memory store for active connections (in production, use KV or Durable Objects)
const paymentConnections = new Map<string, PaymentConnection>();

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

// Create a TextEncoder for converting strings to Uint8Array
const encoder = new TextEncoder();

// Function to establish an SSE connection
async function handleEventStream(request: Request): Promise<Response> {
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

  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Get the payment ID from the URL query parameters
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("paymentId");

  if (!paymentId) {
    return new Response("Payment ID is required", { status: 400 });
  }

  // Set up Server-Sent Events stream
  const stream = new ReadableStream({
    start(controller) {
      // Store the connection
      const connectionId = crypto.randomUUID();
      paymentConnections.set(paymentId, {
        id: connectionId,
        controller,
      });

      // Send an initial connection established message
      const event = `data: ${JSON.stringify({
        type: "connection_established",
      })}\n\n`;
      controller.enqueue(encoder.encode(event));

      console.log(
        `SSE connection established for payment ${paymentId} with connection ID ${connectionId}`
      );
    },
    cancel() {
      // Remove the connection when client disconnects
      paymentConnections.delete(paymentId);
      console.log(`SSE connection closed for payment ${paymentId}`);
    },
  });

  // Return the SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// Function to send an event to a specific payment connection
export function sendPaymentEvent(paymentId: string, eventData: any): boolean {
  const connection = paymentConnections.get(paymentId);
  if (!connection) {
    console.log(`No active connection found for payment ${paymentId}`);
    return false;
  }

  try {
    const event = `data: ${JSON.stringify(eventData)}\n\n`;
    connection.controller.enqueue(encoder.encode(event));
    console.log(`Event sent to payment ${paymentId}:`, eventData);
    return true;
  } catch (error) {
    console.error(`Error sending event to payment ${paymentId}:`, error);
    return false;
  }
}

export async function onRequest(context: Context): Promise<Response> {
  return await handleEventStream(context.request);
}
