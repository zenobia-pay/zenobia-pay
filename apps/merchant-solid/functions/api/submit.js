export async function onRequest(context) {
  // Handle different HTTP methods
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
      },
    });
  }

  try {
    // Parse the request body
    const data = await context.request.json();

    // Process the data (in a real app, you might save to a database, etc.)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Data received successfully",
        receivedData: data,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON data",
        details: error.message,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
