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

// Function to get an access token from Auth0
async function getAccessToken(env: Env): Promise<string> {
  try {
    const tokenUrl = "https://zenobia-beta.us.auth0.com/oauth/token";
    const clientId = env.ZENOBIA_CLIENT_ID || "";
    const clientSecret = env.ZENOBIA_CLIENT_SECRET || "";
    const audience = "https://dashboard.zenobiapay.com";

    // If using development/test mode and no credentials are provided
    if (!clientId || !clientSecret) {
      console.warn("No Auth0 credentials provided, using test mode");
      return "test_token";
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to authenticate with Auth0");
  }
}

async function handleCreateTransfer(
  request: Request,
  env: Env
): Promise<Response> {
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

  // Check if it's a POST request
  if (request.method !== "POST") {
    const errorResponse = new Response("Method not allowed", { status: 405 });
    return addCorsHeaders(errorResponse);
  }

  try {
    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.amount || !Array.isArray(body.statementItems)) {
      const errorResponse = new Response(
        "Invalid request: missing required fields",
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
      return addCorsHeaders(errorResponse);
    }

    // Forward the request to the Zenobia Pay API
    try {
      // Get access token from Auth0
      const accessToken = await getAccessToken(env);

      const fetchBody = {
        amount: body.amount,
        statementItems: body.statementItems,
      };

      const apiResponse = await fetch(
        "https://api.zenobiapay.com/create-transfer-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(fetchBody),
        }
      );

      // Check if the response is ok
      if (!apiResponse.ok) {
        // Try to extract error message from response if it's JSON
        let errorMessage = `API returned status ${apiResponse.status}`;
        const contentType = apiResponse.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await apiResponse.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing fails, use the default error message
          }
        }

        throw new Error(errorMessage);
      }

      // Try to parse the JSON response
      let data;
      const contentType = apiResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await apiResponse.json();
      } else {
        throw new Error("API did not return a JSON response");
      }

      // Return the response to the client with CORS headers
      const response = new Response(JSON.stringify(data), {
        status: apiResponse.status,
        headers: { "Content-Type": "application/json" },
      });
      return addCorsHeaders(response);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      const errorResponse = new Response(
        JSON.stringify({ error: apiError.message || "API request failed" }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
      return addCorsHeaders(errorResponse);
    }
  } catch (error) {
    console.error("Error processing transfer request:", error);
    const errorResponse = new Response(
      JSON.stringify({ error: "Failed to process payment" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function onRequest(context: Context): Promise<Response> {
  return await handleCreateTransfer(context.request, context.env);
}
