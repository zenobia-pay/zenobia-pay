import type { ExecutionContext } from "@cloudflare/workers-types"

interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>
  }
}

const VITE_DEV_SERVER = "http://localhost:5173"

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    console.log("got request", path)
    // Handle API routes
    if (path.startsWith("/api/")) {
      try {
        // Import the function dynamically based on the path
        const module = await import(`../functions${path}.ts`)
        return module.default(request, env, ctx)
      } catch (e) {
        console.error("API route error:", e)
        return new Response("Not Found", { status: 404 })
      }
    }

    // In development, proxy to Vite dev server
    if (!env.ASSETS) {
      const viteUrl = new URL(path, VITE_DEV_SERVER)
      return fetch(viteUrl.toString(), request)
    }

    // In production, serve static assets
    try {
      console.log("serving static assets")
      const response = await env.ASSETS.fetch(request)
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      console.error("Static asset error:", e)
    }

    // For GET requests, fallback to index.html for SPA routing
    if (request.method === "GET") {
      console.log("serving index.html")
      if (env.ASSETS) {
        return env.ASSETS.fetch(new Request(new URL("/index.html", url)))
      } else {
        // In development, proxy to Vite dev server
        return fetch(VITE_DEV_SERVER, request)
      }
    }

    return new Response("Not Found", { status: 404 })
  },
}
