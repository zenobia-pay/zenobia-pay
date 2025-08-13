import {
  createAuth0Client,
  Auth0Client,
  GetTokenSilentlyOptions,
} from "@auth0/auth0-spa-js";
import { auth0Config } from "../config/auth0";

// Define a type for Auth0 user profile
export interface UserData {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
  [key: string]: unknown; // Allow for other properties that may exist
}

// Singleton Auth0 client instance
let auth0Client: Auth0Client | null = null;

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Initialize Auth0 client
const getAuth0Client = async (): Promise<Auth0Client> => {
  if (!isBrowser) {
    throw new Error("Auth0 client can only be used in browser environment");
  }

  if (!auth0Client) {
    console.log("Initializing Auth0 client with config:", {
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      redirectUri: auth0Config.redirectUri,
      audience: auth0Config.audience,
    });

    auth0Client = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
        organization: "org_M2WbKRtbA3ml4p8W",
      },
      cacheLocation: "localstorage",
    });
  }
  return auth0Client;
};

// Reset Auth0 client (useful for logout/login flows)
const resetAuth0Client = (): void => {
  auth0Client = null;
};

// Clear Auth0 cache from localStorage
const clearAuth0Cache = (): void => {
  if (!isBrowser) return;

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("auth0.") || key.includes("auth0"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log("Cleared Auth0 cached data");
  } catch (error) {
    console.error("Error clearing Auth0 cache:", error);
  }
};

export const authService = {
  async signIn(): Promise<void> {
    if (!isBrowser) {
      throw new Error("Sign in can only be called in browser environment");
    }

    try {
      console.log("Starting sign in process...");

      // Reset client to ensure a fresh authentication attempt
      resetAuth0Client();
      const auth0 = await getAuth0Client();

      // Get the current path from sessionStorage if available
      const redirectPath = sessionStorage.getItem("redirectPath");

      // Construct appState to pass through the login flow
      const appState = redirectPath ? { returnTo: redirectPath } : {};

      console.log(
        "Starting Auth0 login with redirect to:",
        auth0Config.redirectUri,
        "and appState:",
        appState
      );

      await auth0.loginWithRedirect({
        appState,
        authorizationParams: {
          prompt: "login",
          organization: "org_M2WbKRtbA3ml4p8W",
        },
      });

      console.log("Auth0 loginWithRedirect called successfully");
      // This won't actually execute due to the redirect
      return;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    if (!isBrowser) {
      throw new Error("Sign out can only be called in browser environment");
    }

    try {
      // First reset the client to clear cached tokens
      resetAuth0Client();

      // Get a fresh client to perform the logout
      const auth0 = await getAuth0Client();
      sessionStorage.setItem(
        "redirectPath",
        window.location.pathname + window.location.search
      );

      // Call Auth0 logout with proper parameters
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
          clientId: auth0Config.clientId,
        },
      });

      // The above call will redirect to Auth0 and then back to the origin
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<UserData | null> {
    if (!isBrowser) {
      return null;
    }

    try {
      const auth0 = await getAuth0Client();
      const isAuthenticated = await auth0.isAuthenticated();

      console.log("Checking authentication status:", isAuthenticated);

      if (!isAuthenticated) {
        return null;
      }

      const user = await auth0.getUser<UserData>();
      console.log("Current user:", user);
      return user || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  async getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string> {
    if (!isBrowser) {
      throw new Error(
        "getTokenSilently can only be called in browser environment"
      );
    }

    try {
      const auth0 = await getAuth0Client();
      return await auth0.getTokenSilently(options);
    } catch (error) {
      console.error("Error in getTokenSilently:", error);

      // Check if this is an authentication error (400, 403, etc.)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isAuthError =
        errorMessage.includes("400") ||
        errorMessage.includes("403") ||
        errorMessage.includes("401") ||
        errorMessage.includes("invalid_grant") ||
        errorMessage.includes("missing_refresh_token") ||
        errorMessage.includes("expired");

      if (isAuthError) {
        console.log(
          "Authentication error detected in getTokenSilently, clearing cache and redirecting to login"
        );

        // Clear Auth0 cache
        clearAuth0Cache();
        resetAuth0Client();

        // Save current path for redirect after login
        sessionStorage.setItem(
          "redirectPath",
          window.location.pathname + window.location.search
        );

        // Redirect to login
        window.location.href = "/login";
      }

      throw error;
    }
  },

  async handleAuthCallback(): Promise<void> {
    if (!isBrowser) {
      throw new Error(
        "handleAuthCallback can only be called in browser environment"
      );
    }

    try {
      // Reset client to ensure we have a fresh instance for the callback processing
      resetAuth0Client();
      const auth0 = await getAuth0Client();

      // Log the current URL to help with debugging
      console.log("Processing Auth0 callback URL:", window.location.href);
      console.log("Using redirect URI:", auth0Config.redirectUri);

      // Check for Auth0 errors first
      if (window.location.search.includes("error=")) {
        const errorParams = new URLSearchParams(window.location.search);
        const errorMessage =
          errorParams.get("error_description") ||
          "An error occurred during login";
        const errorType = errorParams.get("error") || "unknown";
        console.error(`Auth0 error (${errorType}):`, errorMessage);
        throw new Error(errorMessage);
      }

      // Make sure we have both code and state parameters
      if (
        !location.search.includes("code=") ||
        !location.search.includes("state=")
      ) {
        console.error("Missing required parameters in callback URL");
        throw new Error(
          "Invalid callback URL: missing code or state parameter"
        );
      }

      let redirectResult;
      try {
        console.log("Attempting to handle redirect callback...");

        // Process the authentication callback
        redirectResult = await auth0.handleRedirectCallback();
        console.log(
          "Redirect callback processed successfully:",
          redirectResult
        );
      } catch (error) {
        console.error("Error handling redirect callback:", error);
        throw error;
      }

      // Check if we have app state with returnTo
      if (redirectResult.appState && redirectResult.appState.returnTo) {
        console.log("Redirecting to:", redirectResult.appState.returnTo);
        window.history.replaceState(
          {},
          document.title,
          redirectResult.appState.returnTo
        );
      }
    } catch (error) {
      console.error("Error in handleAuthCallback:", error);
      throw error;
    }
  },

  async silentlyRefreshToken(): Promise<void> {
    if (!isBrowser) {
      return;
    }

    const auth0 = await getAuth0Client();
    try {
      await auth0.getTokenSilently();
      console.log("Token refreshed");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  },

  async silentLogin(): Promise<UserData | null> {
    if (!isBrowser) {
      return null;
    }

    try {
      // Reset client to ensure we're not using cached data
      resetAuth0Client();

      const auth0 = await getAuth0Client();

      // Use checkSession or getTokenSilently with prompt=none
      await auth0.loginWithRedirect({
        authorizationParams: {
          prompt: "none",
          organization: "org_M2WbKRtbA3ml4p8W",
        },
      });

      // Get the fresh user data
      const user = await auth0.getUser<UserData>();

      console.log(
        "Silent login successful, user verified status:",
        user?.email_verified
      );
      return user || null;
    } catch (error) {
      console.error("Silent login failed:", error);
      return null;
    }
  },

  async resendVerificationEmail(email: string): Promise<boolean> {
    if (!isBrowser) {
      return false;
    }

    try {
      const auth0 = await getAuth0Client();
      await auth0.loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          organization: "org_M2WbKRtbA3ml4p8W",
        },
      });
      return true;
    } catch (error) {
      console.error("Error resending verification email:", error);
      return false;
    }
  },

  clearCache(): void {
    clearAuth0Cache();
    resetAuth0Client();
  },
};
