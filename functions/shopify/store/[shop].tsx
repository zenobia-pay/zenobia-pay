import { Env } from "../../types"
import { EventContext } from "@cloudflare/workers-types"

interface CheckoutSession {
  shop: string
  returnUrl: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
}

export async function onRequestGet(
  context: EventContext<Env, string, unknown>
) {
  const { request, env, params } = context
  const shop = params?.shop as string
  const id = new URL(request.url).searchParams.get("id")

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
  const url = new URL(request.url)
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
