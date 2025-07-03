import { jwtVerify, createRemoteJWKSet } from "jose"
import type { Env } from "../types"

export interface Auth0User {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  nickname?: string
  picture?: string
  merchant_id?: string
  [key: string]: string | boolean | number | undefined
}

export interface Auth0Context {
  user: Auth0User
  token: string
}

/**
 * Auth0 middleware for Cloudflare Workers
 * Validates JWT tokens and extracts user information
 */
export class Auth0Middleware {
  private jwksClient: ReturnType<typeof createRemoteJWKSet>
  private audience: string
  private domain: string

  constructor(env: Env) {
    // Use the environment variable or fallback to the known domain
    this.domain = env.ACCOUNTS_DOMAIN || "https://accounts.zenobiapay.com"
    this.audience = env.ACCOUNTS_AUDIENCE || "https://dashboard.zenobiapay.com"

    // Construct the JWKS URL
    const jwksUrl = `${this.domain}/.well-known/jwks.json`
    console.log(`Initializing Auth0 middleware with JWKS URL: ${jwksUrl}`)

    this.jwksClient = createRemoteJWKSet(new URL(jwksUrl))
  }

  /**
   * Validate and extract user information from JWT token
   */
  async validateToken(token: string): Promise<Auth0User> {
    try {
      console.log(`Validating token with audience: ${this.audience}`)

      const result = await jwtVerify(token, this.jwksClient, {
        audience: this.audience,
        algorithms: ["RS256"],
      })

      console.log("JWT validation successful, extracting user info")

      // Extract user information from the token payload
      const user: Auth0User = {
        sub: result.payload.sub as string,
        email: result.payload.email as string,
        email_verified: result.payload.email_verified as boolean,
        name: result.payload.name as string,
        nickname: result.payload.nickname as string,
        picture: result.payload.picture as string,
        merchant_id: result.payload.merchant_id as string,
      }

      // Add any additional custom claims that might be present
      Object.entries(result.payload).forEach(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "boolean" ||
          typeof value === "number"
        ) {
          user[key] = value
        }
      })

      console.log(`User authenticated: ${user.sub}`)
      return user
    } catch (error) {
      console.error("JWT validation failed:", error)

      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name)
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }

      throw new Error("Invalid authentication token")
    }
  }

  /**
   * Extract token from Authorization header and validate it
   */
  async authenticate(request: Request): Promise<Auth0Context> {
    const auth = request.headers.get("Authorization")

    if (!auth || !auth.startsWith("Bearer ")) {
      throw new Error("Authorization header required")
    }

    const token = auth.replace("Bearer ", "")
    const user = await this.validateToken(token)

    return {
      user,
      token,
    }
  }

  /**
   * Create a middleware function that can be used to wrap handlers
   */
  middleware<T extends unknown[]>(
    handler: (
      request: Request,
      env: Env,
      context: Auth0Context,
      ...args: T
    ) => Promise<Response>
  ) {
    return async (
      request: Request,
      env: Env,
      ...args: T
    ): Promise<Response> => {
      try {
        const context = await this.authenticate(request)
        return await handler(request, env, context, ...args)
      } catch (error) {
        console.error("Authentication error:", error)

        // Handle authentication errors with proper HTTP status codes
        if (error instanceof Error) {
          if (error.message.includes("Authorization header required")) {
            return new Response(
              JSON.stringify({ error: "Authorization header required" }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          if (error.message.includes("Invalid authentication")) {
            return new Response(
              JSON.stringify({ error: "Invalid authentication token" }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              }
            )
          }
        }

        // For any other unexpected errors, return 500
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }
  }
}

/**
 * Helper function to create Auth0 middleware instance
 */
export function createAuth0Middleware(env: Env): Auth0Middleware {
  return new Auth0Middleware(env)
}
