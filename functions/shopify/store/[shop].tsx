import { Env } from "../../types"

interface CheckoutSession {
  shop: string
  returnUrl: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
}

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const shop = url.pathname.split("/").pop() // Get shop from the last path segment

  if (!shop) {
    return new Response("Missing shop parameter", { status: 400 })
  }

  const id = url.searchParams.get("id")

  if (!id) {
    return new Response("Missing session ID", { status: 400 })
  }

  // Get session data from KV
  const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(id)
  if (!sessionData) {
    return new Response("Session not found", { status: 404 })
  }

  const session = JSON.parse(sessionData) as CheckoutSession

  // Fetch the HTML template
  const html = await fetch(`${url.origin}/store.html`).then((res) => res.text())

  // Replace placeholders in the template
  const template = html
    .replace("{{shop}}", shop)
    .replace("{{session}}", JSON.stringify(session))
    .replace("{{sessionId}}", id)

  return new Response(template, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
