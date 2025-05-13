import { Env } from "../types"
import { EventContext } from "@cloudflare/workers-types"

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)

  const storeContext = url.searchParams.get("context")
  if (!storeContext) {
    return new Response("Missing context parameter", { status: 400 })
  }

  try {
    // Get the stored store data
    const store = await env.DB.prepare(
      `
      SELECT * FROM bigcommerce_stores
      WHERE store_hash = ?
    `
    )
      .bind(storeContext)
      .first()

    if (!store) {
      return new Response("Store not found", { status: 404 })
    }

    // Return the app HTML with the necessary data
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Zenobia Pay - BigCommerce Integration</title>
          <script>
            window.BIGCOMMERCE_STORE_CONTEXT = "${store.store_hash}";
            window.BIGCOMMERCE_ACCESS_TOKEN = "${store.access_token}";
          </script>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    )
  } catch (error) {
    console.error("Load error:", error)
    return new Response("Failed to load app", { status: 500 })
  }
}
