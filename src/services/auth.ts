import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js"
import { auth0Config } from "../config/auth0"

export interface SignUpParams {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInParams {
  email: string
  password: string
}

let auth0Client: Auth0Client | null = null

const getAuth0Client = async (): Promise<Auth0Client> => {
  if (auth0Client === null) {
    auth0Client = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      },
      cacheLocation: "localstorage",
      useRefreshTokens: true,
    })
  }
  return auth0Client
}

// Reset the auth0 client to force a new instance
const resetAuth0Client = () => {
  auth0Client = null

  // Clear specific Auth0 items when resetting client
  // This ensures a completely fresh state before attempting new auth actions
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith("auth0") || key.includes("@@auth0spajs@@"))) {
      keysToRemove.push(key)
    }
  }

  // Remove keys in a separate loop to avoid index issues
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

export const authService = {
  async signUp(): Promise<any> {
    const auth0 = await getAuth0Client()
    await auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    })

    // This won't actually execute due to the redirect
    return null
  },

  async confirmSignUp(): Promise<void> {
    console.log("Email verification is handled by Auth0")
  },

  async signIn(): Promise<any> {
    try {
      // Reset client to ensure a fresh authentication attempt
      resetAuth0Client()
      const auth0 = await getAuth0Client()

      console.log(
        "Starting Auth0 login with redirect to:",
        auth0Config.redirectUri
      )
      await auth0.loginWithRedirect()
      // This won't actually execute due to the redirect
      return null
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  },

  async signOut(): Promise<void> {
    try {
      // First reset the client to clear cached tokens
      resetAuth0Client()

      // Get a fresh client to perform the logout
      const auth0 = await getAuth0Client()

      // Call Auth0 logout with proper parameters
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
          // Setting clientId explicitly can help with complete logout
          clientId: auth0Config.clientId,
        },
      })

      // The above call will redirect to Auth0 and then back to the origin
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      const auth0 = await getAuth0Client()
      const isAuthenticated = await auth0.isAuthenticated()

      if (!isAuthenticated) {
        return null
      }

      return await auth0.getUser()
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  async handleAuthCallback(): Promise<void> {
    try {
      // Reset client to ensure we have a fresh instance for the callback processing
      resetAuth0Client()
      const auth0 = await getAuth0Client()

      // Log the current URL to help with debugging
      console.log("Processing Auth0 callback URL:", window.location.href)
      console.log("Using redirect URI:", auth0Config.redirectUri)

      // Check for Auth0 errors first
      if (window.location.search.includes("error=")) {
        const errorParams = new URLSearchParams(window.location.search)
        const errorMessage =
          errorParams.get("error_description") ||
          "An error occurred during login"
        const errorType = errorParams.get("error") || "unknown"
        console.error(`Auth0 error (${errorType}):`, errorMessage)
        throw new Error(errorMessage)
      }

      // Make sure we have both code and state parameters
      if (
        !location.search.includes("code=") ||
        !location.search.includes("state=")
      ) {
        console.error("Missing required parameters in callback URL")
        throw new Error("Invalid callback URL: missing code or state parameter")
      }

      try {
        console.log("Attempting to handle redirect callback...")

        // Process the authentication callback
        const result = await auth0.handleRedirectCallback()
        console.log("Redirect callback processed successfully:", result)

        // Verify authentication worked after callback
        const isAuthenticated = await auth0.isAuthenticated()
        console.log("Is authenticated after callback:", isAuthenticated)

        if (!isAuthenticated) {
          throw new Error("Authentication failed after processing callback")
        }
      } catch (callbackError) {
        console.error("Error in handleRedirectCallback:", callbackError)

        // Log detailed error information
        if (callbackError instanceof Error) {
          console.error("Error name:", callbackError.name)
          console.error("Error message:", callbackError.message)
          console.error("Error stack:", callbackError.stack)
        }

        // Clear and reset Auth0 state
        resetAuth0Client()
        throw callbackError
      }

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error) {
      console.error("Error handling auth callback:", error)
      throw error
    }
  },
}
