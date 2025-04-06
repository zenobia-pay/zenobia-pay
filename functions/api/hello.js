export function onRequest(context) {
  return new Response(
    JSON.stringify({
      message: "Hello from Cloudflare Pages Functions!",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
