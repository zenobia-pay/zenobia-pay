import { onMount, createSignal } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { useAuth } from "../../context/AuthContext"
import { authService } from "../../services/auth"

export default function Login() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [error, setError] = createSignal("")
  const [isProcessing, setIsProcessing] = createSignal(true)

  onMount(async () => {
    try {
      // Handle Auth0 redirect callback if code parameter is present
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        try {
          await authService.handleAuthCallback()
          const user = await authService.getCurrentUser()
          if (user) {
            auth.setUser(user)
            // Check if there's a saved redirect path
            const redirectPath = sessionStorage.getItem("redirectPath")
            if (redirectPath) {
              sessionStorage.removeItem("redirectPath")
              navigate(redirectPath, { replace: true })
            } else {
              navigate("/", { replace: true })
            }
          } else {
            // Callback didn't result in a logged in user, redirect to Auth0
            await initiateAuth0Login()
          }
        } catch (err: unknown) {
          console.error("Auth callback error:", err)
          setError(
            `Authentication error: ${err instanceof Error ? err.message : "An unknown error occurred"}`
          )
          setIsProcessing(false)
        }
      } else {
        // Check if user is already logged in
        const user = await authService.getCurrentUser()
        if (user) {
          auth.setUser(user)
          // Check if there's a saved redirect path
          const redirectPath = sessionStorage.getItem("redirectPath")
          if (redirectPath) {
            sessionStorage.removeItem("redirectPath")
            navigate(redirectPath, { replace: true })
          } else {
            navigate("/", { replace: true })
          }
        } else {
          // User is not logged in, redirect to Auth0
          await initiateAuth0Login()
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify authentication status"
      )
      setIsProcessing(false)
    }
  })

  const initiateAuth0Login = async () => {
    try {
      await authService.signIn()
      // The page will redirect to Auth0's login page
    } catch (err: unknown) {
      console.error("Sign in error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign in")
      setIsProcessing(false)
    }
  }

  // Only show error state if something went wrong
  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {isProcessing() ? (
        <div class="animate-spin h-8 w-8">
          <svg class="text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div class="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 class="mt-4 text-3xl font-extrabold text-gray-900 text-center">
              Authentication Error
            </h2>
            <p class="mt-2 text-sm text-gray-600 text-center">
              {error() || "An unknown error occurred"}
            </p>
          </div>
          <button
            onClick={initiateAuth0Login}
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                   text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
