export interface Env {
  // Add your environment bindings here
}

export interface Context {
  env: Env;
  params: Record<string, string>;
  request: Request;
  // Add other properties as needed
}

export function onRequest(context: Context): Response {
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
