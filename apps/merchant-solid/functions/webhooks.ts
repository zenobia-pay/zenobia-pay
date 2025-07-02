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

// Import the sendPaymentEvent function
import { sendPaymentEvent } from "./payment-events";
import * as jose from "jose";

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

// Function to verify JWT token from Authorization header
async function verifyJWT(
  authHeader: string | null
): Promise<jose.JWTVerifyResult | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Invalid or missing Authorization header");
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];

    const jwksResponse = await fetch(
      "https://zenobiapay.com/.well-known/jwks.json"
    );
    if (!jwksResponse.ok) {
      throw new Error(`Failed to fetch JWKS: ${jwksResponse.status}`);
    }

    const keyStore = jose.createRemoteJWKSet(
      new URL("https://zenobiapay.com/.well-known/jwks.json")
    );

    // Verify the JWT
    const result = await jose.jwtVerify(token, keyStore, {
      algorithms: ["RS256"],
    });

    return result;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No content
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  // We'll accept POST requests for webhooks
  if (request.method !== "POST") {
    const errorResponse = new Response("Method not allowed", { status: 405 });
    return addCorsHeaders(errorResponse);
  }

  try {
    // Clone the request for logging
    const clonedRequest = request.clone();

    // Get request details
    const headers = Object.fromEntries(clonedRequest.headers.entries());
    const url = clonedRequest.url;
    const method = clonedRequest.method;
    const authHeader = clonedRequest.headers.get("authorization");

    // Get the request body as text and try to parse it as JSON
    let body;
    const contentType = clonedRequest.headers.get("content-type");
    const bodyText = await clonedRequest.text();

    try {
      if (contentType && contentType.includes("application/json")) {
        body = JSON.parse(bodyText);
      } else {
        body = bodyText;
      }
    } catch (e) {
      body = bodyText; // If JSON parsing fails, use the text
    }

    // Log the webhook details
    console.log("===== WEBHOOK RECEIVED =====");
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Headers:", headers);
    console.log("Body:", body);
    console.log("============================");

    // Verify the JWT token
    const jwtVerification = await verifyJWT(authHeader);

    if (!jwtVerification) {
      console.error("JWT verification failed - unauthorized request");
      const errorResponse = new Response(
        JSON.stringify({ error: "Unauthorized - invalid signature" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      return addCorsHeaders(errorResponse);
    }

    console.log("JWT verified successfully:", jwtVerification.payload);

    // Verify that the JWT payload matches the body content (transferRequestId)
    if (
      typeof body === "object" &&
      body !== null &&
      body.transferRequestId &&
      jwtVerification.payload.transferRequestId !== body.transferRequestId
    ) {
      console.error(
        "JWT transferRequestId doesn't match body transferRequestId"
      );
      const errorResponse = new Response(
        JSON.stringify({
          error: "Bad Request - token payload doesn't match body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
      return addCorsHeaders(errorResponse);
    }

    console.log("body", body);
    // Process payment status update if applicable
    if (typeof body === "object" && body !== null) {
      // Check if this is a transfer request status update webhook
      if (body.transferRequestId && body.status) {
        const transferRequestId = body.transferRequestId.toString();
        const status = body.status;
        const amount = body.amount;

        console.log(
          `Transfer request status update received: ${transferRequestId} is now ${status} for amount ${amount}`
        );

        // Notify any connected clients waiting for this transfer update
        sendPaymentEvent(transferRequestId, {
          type: "transfer_status_update",
          transferRequestId,
          status,
          amount,
          timestamp: new Date().toISOString(),
        });
      }
      // Original payment update handling (keeping for backward compatibility)
      else if (body.type === "payment.updated" && body.paymentId) {
        const paymentId = body.paymentId.toString();
        const status = body.status;

        console.log(
          `Payment status update received: Payment ${paymentId} is now ${status}`
        );

        // Notify any connected clients waiting for this payment update
        sendPaymentEvent(paymentId, {
          type: "payment_status_update",
          paymentId,
          status,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Return a success response
    const response = new Response(
      JSON.stringify({
        status: "success",
        message: "Webhook received and processed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    return addCorsHeaders(response);
  } catch (error) {
    console.error("Error processing webhook:", error);
    const errorResponse = new Response(
      JSON.stringify({ error: "Failed to process webhook" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function onRequest(context: Context): Promise<Response> {
  return await handleWebhook(context.request, context.env);
}
