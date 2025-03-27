import { Component, createSignal, onMount } from "solid-js"
import { useNavigate, useLocation } from "@solidjs/router"
import { authService } from "../services/auth"

interface ProtectedRouteProps {
  children: any
}

const ProtectedRoute: Component<ProtectedRouteProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(async () => {
    try {
      // Check if this is a callback URL - if so, redirect to login page to handle the callback
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        navigate("/login", { replace: true })
        return
      }

      const user = await authService.getCurrentUser()
      if (user) {
        setIsAuthenticated(true)
      } else {
        // Store the current path so we can redirect back after login
        sessionStorage.setItem("redirectPath", location.pathname)
        navigate("/login", { replace: true })
      }
    } catch (error) {
      console.error("Auth error in protected route:", error)
      navigate("/login", { replace: true })
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
        isAuthenticated() && props.children
      )}
    </>
  )
}

export default ProtectedRoute
