import type {
  Request as CFRequest,
  Response as CFResponse,
} from "@cloudflare/workers-types";
import { onRequest as helloApi } from "../functions/api/hello";
import { onRequest as submitApi } from "../functions/api/submit";
import { onRequest as createTransferApi } from "../functions/create-transfer";
import { onRequest as webhooksApi } from "../functions/webhooks";
import { onRequest as testSseApi } from "../functions/test-sse";

// Extend the Env interface to include ASSETS for the worker
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ZENOBIA_CLIENT_ID?: string;
  ZENOBIA_CLIENT_SECRET?: string;
  API_DOMAIN?: string;
  ACCOUNTS_DOMAIN?: string;
  ACCOUNTS_AUDIENCE?: string;
}

const VITE_DEV_SERVER = "http://localhost:8787";

export default {
  async fetch(request: CFRequest, env: Env): Promise<CFResponse> {
    const url = new URL(request.url);
    const path = url.pathname;

    console.log(`[Request] ${request.method} ${path}`);

    // Handle API routes using existing functions
    if (path === "/api/hello" && request.method === "GET") {
      const context = {
        env,
        params: {},
        request: request as unknown as Request,
      };
      const response = await helloApi(context);
      console.log(`[Response] API /api/hello - Status: ${response.status}`);
      return response as unknown as CFResponse;
    }

    if (path === "/api/submit" && request.method === "POST") {
      const context = {
        env,
        params: {},
        request: request as unknown as Request,
      };
      const response = await submitApi(context);
      console.log(`[Response] API /api/submit - Status: ${response.status}`);
      return response as unknown as CFResponse;
    }

    if (path === "/create-transfer" && request.method === "POST") {
      const context = {
        env,
        params: {},
        request: request as unknown as Request,
      };
      const response = await createTransferApi(context);
      console.log(
        `[Response] API /create-transfer - Status: ${response.status}`
      );
      return response as unknown as CFResponse;
    }

    if (path === "/webhooks" && request.method === "POST") {
      const context = {
        env,
        params: {},
        request: request as unknown as Request,
      };
      const response = await webhooksApi(context);
      console.log(`[Response] API /webhooks - Status: ${response.status}`);
      return response as unknown as CFResponse;
    }

    if (path === "/test-sse" && request.method === "GET") {
      const context = {
        env,
        params: {},
        request: request as unknown as Request,
      };
      const response = await testSseApi(context);
      console.log(`[Response] API /test-sse - Status: ${response.status}`);
      return response as unknown as CFResponse;
    }

    const isDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    // In development, proxy to Vite dev server
    if (isDev) {
      console.log(`[Request] Dev server - ${path}`);
      const viteUrl = new URL(path, VITE_DEV_SERVER);
      const response = await fetch(
        viteUrl.toString(),
        request as unknown as RequestInit
      );
      console.log(
        `[Response] Dev server - ${path} - Status: ${response.status}`
      );
      return response as unknown as CFResponse;
    }

    // In production, serve static assets
    console.log(`[Request] Assets - ${path}`);
    const response = await env.ASSETS.fetch(request as unknown as Request);
    console.log(`[Response] Assets - ${path} - Status: ${response.status}`);
    return response as unknown as CFResponse;
  },
};
