import { Component, createSignal, onMount, JSX, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { authService } from "../services/auth";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

const ProtectedRoute: Component<ProtectedRouteProps> = (props) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);
  const [isRedirecting, setIsRedirecting] = createSignal(false);
  const auth = useAuth();

  onMount(async () => {
    if (!isBrowser) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if this is a callback URL - if so, redirect to login page to handle the callback
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        // Redirect to the login route to handle callback
        window.location.href = "/login" + window.location.search;
        return;
      }

      // Use the checkAuthStatus function from AuthContext
      const isAuthValid = await auth.checkAuthStatus();

      if (isAuthValid) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // Store the current path with search parameters so we can redirect back after login
        const fullPath = location.pathname + location.search;
        sessionStorage.setItem("redirectPath", fullPath);

        // Set redirecting state to show appropriate UI
        setIsRedirecting(true);

        // Redirect directly to Auth0 for authentication
        try {
          await authService.signIn();
          // The page will redirect to Auth0's login page
          // We don't need to set isLoading(false) here because the page will redirect
        } catch (error) {
          console.error("Failed to redirect to Auth0:", error);
          // If redirect fails, show error and allow manual retry
          setIsRedirecting(false);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Auth error in protected route:", error);
      // Store the current path with search parameters and redirect to Auth0
      const fullPath = location.pathname + location.search;
      sessionStorage.setItem("redirectPath", fullPath);

      setIsRedirecting(true);
      try {
        await authService.signIn();
        // The page will redirect to Auth0's login page
      } catch (err) {
        console.error("Failed to redirect to Auth0:", err);
        // As a fallback, redirect to login page
        window.location.href = "/login";
      }
    }
  });

  return (
    <Show
      when={isLoading()}
      fallback={
        <Show
          when={isRedirecting()}
          fallback={
            <Show
              when={isAuthenticated()}
              fallback={
                <div class="min-h-screen flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-gray-600">Authentication required</p>
                    <button
                      onClick={() => (window.location.href = "/login")}
                      class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              }
            >
              <>{props.children}</>
            </Show>
          }
        >
          <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        </Show>
      }
    >
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    </Show>
  );
};

export default ProtectedRoute;
