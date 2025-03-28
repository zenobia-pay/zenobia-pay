import { Component, createSignal, onMount, JSX } from "solid-js"
import { useLocation } from "@solidjs/router"
import { authService } from "../services/auth"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  children: JSX.Element | Component
}

const ProtectedRoute: Component<ProtectedRouteProps> = (props) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(true)
  const auth = useAuth()

  onMount(async () => {
    try {
      // Check if this is a callback URL - if so, redirect to login page to handle the callback
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        // Redirect to the login route to handle callback
        window.location.href = "/login" + window.location.search
        return
      }

      // Use the checkAuthStatus function from AuthContext
      const isAuthValid = await auth.checkAuthStatus()

      if (isAuthValid) {
        setIsAuthenticated(true)
      } else {
        // Store the current path so we can redirect back after login
        sessionStorage.setItem("redirectPath", location.pathname)

        // Redirect directly to Auth0 for authentication
        await authService.signIn()
        // The page will redirect to Auth0's login page
      }
    } catch (error) {
      console.error("Auth error in protected route:", error)
      // Store the current path and redirect to Auth0
      sessionStorage.setItem("redirectPath", location.pathname)
      try {
        await authService.signIn()
      } catch (err) {
        console.error("Failed to redirect to Auth0:", err)
        // As a fallback, redirect to login page
        window.location.href = "/login"
      }
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <>
      {isLoading() ? (
        <div class="min-h-screen flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        isAuthenticated() &&
        (typeof props.children === "function"
          ? props.children({})
          : props.children)
      )}
    </>
  )
}

export default ProtectedRoute
