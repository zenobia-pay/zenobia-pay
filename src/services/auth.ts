import { auth0Config } from "../config/auth0"
import { auth0Utils } from "./api"

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

// Define a type for Auth0 user profile
export interface UserData {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
  [key: string]: unknown // Allow for other properties that may exist
}

// Use the shared Auth0 client and utilities from the API service
const { getAuth0Client, resetAuth0Client } = auth0Utils

export const authService = {
  async signUp(): Promise<void> {
    const auth0 = await getAuth0Client()
    await auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    })

    // This won't actually execute due to the redirect
    return
  },

  async confirmSignUp(): Promise<void> {
    console.log("Email verification is handled by Auth0")
  },

  async signIn(): Promise<void> {
    try {
      // Reset client to ensure a fresh authentication attempt
      resetAuth0Client()
      const auth0 = await getAuth0Client()

      // Get the current path from sessionStorage if available
      const redirectPath = sessionStorage.getItem("redirectPath")

      // Construct appState to pass through the login flow
      const appState = redirectPath ? { returnTo: redirectPath } : {}

      console.log(
        "Starting Auth0 login with redirect to:",
        auth0Config.redirectUri,
        "and appState:",
        appState
      )

      await auth0.loginWithRedirect({
        appState,
        authorizationParams: {
          prompt: "login",
        },
      })

      // This won't actually execute due to the redirect
      return
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
      sessionStorage.setItem("redirectPath", window.location.pathname)

      // Call Auth0 logout with proper parameters
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
          clientId: auth0Config.clientId,
        },
      })

      // The above call will redirect to Auth0 and then back to the origin
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  },

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const auth0 = await getAuth0Client()
      const isAuthenticated = await auth0.isAuthenticated()

      if (!isAuthenticated) {
        return null
      }

      const user = await auth0.getUser<UserData>()
      return user || null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  async silentlyRefreshToken(): Promise<void> {
    const auth0 = await getAuth0Client()
    try {
      await auth0.getTokenSilently()
      console.log("Token refreshed")
    } catch (error) {
      console.error("Error refreshing token:", error)
    }
  },

  async silentLogin(): Promise<UserData | null> {
    try {
      // Reset client to ensure we're not using cached data
      resetAuth0Client()

      const auth0 = await getAuth0Client()

      // Use checkSession or getTokenSilently with prompt=none
      await auth0.loginWithRedirect({
        authorizationParams: {
          prompt: "none",
        },
      })

      // Get the fresh user data
      const user = await auth0.getUser<UserData>()

      console.log(
        "Silent login successful, user verified status:",
        user?.email_verified
      )
      return user || null
    } catch (error) {
      console.error("Silent login failed:", error)
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

      let redirectResult
      try {
        console.log("Attempting to handle redirect callback...")

        // Process the authentication callback
        redirectResult = await auth0.handleRedirectCallback()
        console.log("Redirect callback processed successfully:", redirectResult)

        // Verify authentication worked after callback
        const isAuthenticated = await auth0.isAuthenticated()
        console.log("Is authenticated after callback:", isAuthenticated)

        if (!isAuthenticated) {
          throw new Error("Authentication failed after processing callback")
        }

        // Check if we have a returnTo path from appState
        if (redirectResult?.appState?.returnTo) {
          console.log("Found returnTo path:", redirectResult.appState.returnTo)
          // Set redirectPath in sessionStorage to be used after login completes
          sessionStorage.setItem(
            "redirectPath",
            redirectResult.appState.returnTo
          )
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

  async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      // Auth0 doesn't provide a direct method in the SPA SDK to resend verification emails
      // We need to make a direct request to the Auth0 Management API
      const auth0 = await getAuth0Client()

      // Get the token with proper scopes to call Auth0 Management API
      const token = await auth0.getTokenSilently({
        authorizationParams: {
          audience: `https://${auth0Config.domain}/api/v2/`,
          scope: "read:users update:users",
        },
      })

      // Make request to the Auth0 Management API to resend verification email
      const response = await fetch(
        `https://${auth0Config.domain}/api/v2/jobs/verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: email,
            client_id: auth0Config.clientId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error resending verification email:", errorData)
        return false
      }

      return true
    } catch (error) {
      console.error("Error resending verification email:", error)
      return false
    }
  },
}
