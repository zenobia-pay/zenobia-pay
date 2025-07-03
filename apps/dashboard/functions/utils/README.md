# Auth0 Middleware for Cloudflare Workers

This directory contains utilities for handling Auth0 authentication in Cloudflare Workers functions.

## Auth0 Middleware

The `auth0.ts` file provides a reusable middleware for validating Auth0 JWT tokens and extracting user information in server-side functions.

### Features

- **Automatic JWT validation** using Auth0's JWKS endpoint
- **User information extraction** from JWT payload
- **Error handling** with proper HTTP status codes
- **TypeScript support** with full type safety
- **Middleware pattern** for easy integration

### Usage

#### Basic Usage

```typescript
import { createAuth0Middleware, type Auth0Context } from "./utils/auth0"

export async function onRequest(request: Request, env: Env) {
  // Create Auth0 middleware
  const auth0 = createAuth0Middleware(env)

  // Use the middleware to handle authentication
  return auth0.middleware(
    async (request: Request, env: Env, context: Auth0Context) => {
      // Your protected route logic here
      // context.user contains the authenticated user information
      // context.token contains the raw JWT token

      const merchantId = context.user.merchant_id || context.user.sub

      // ... your business logic
    }
  )(request, env)
}
```

#### Manual Authentication

If you need more control over the authentication flow:

```typescript
import { createAuth0Middleware } from "./utils/auth0"

export async function onRequest(request: Request, env: Env) {
  const auth0 = createAuth0Middleware(env)

  try {
    const context = await auth0.authenticate(request)
    // context.user and context.token are now available
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
}
```

### User Information

The `Auth0User` interface includes standard Auth0 claims:

```typescript
interface Auth0User {
  sub: string // User ID
  email?: string // User email
  email_verified?: boolean // Email verification status
  name?: string // Full name
  nickname?: string // Nickname
  picture?: string // Profile picture URL
  merchant_id?: string // Custom merchant ID claim
  [key: string]: string | boolean | number | undefined // Additional custom claims
}
```

### Environment Variables

The middleware requires these environment variables:

- `ACCOUNTS_DOMAIN`: Your Auth0 domain (e.g., "accounts.zenobiapay.com")
- `ACCOUNTS_AUDIENCE`: Your Auth0 API audience (e.g., "https://dashboard.zenobiapay.com")

### Error Handling

The middleware automatically handles common authentication errors:

- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Unexpected errors during token validation

### Security

- Uses RS256 algorithm for JWT verification
- Validates token audience
- Fetches public keys from Auth0's JWKS endpoint
- No sensitive information is logged

### Integration with Client-Side

This middleware works seamlessly with the client-side Auth0 SPA SDK. The client sends tokens in the `Authorization: Bearer <token>` header, and the middleware validates them using the same Auth0 configuration.
