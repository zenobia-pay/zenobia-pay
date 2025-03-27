import { createSignal, onMount, Show, createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { useAuth } from "../../context/AuthContext"
import { authService } from "../../services/auth"

export default function Login() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [error, setError] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const [isCheckingAuth, setIsCheckingAuth] = createSignal(true)

  // Watch for auth state changes
  createEffect(() => {
    if (auth.user()) {
      // Check if there's a saved redirect path
      const redirectPath = sessionStorage.getItem("redirectPath")
      if (redirectPath) {
        sessionStorage.removeItem("redirectPath")
        navigate(redirectPath, { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    }
  })

  onMount(async () => {
    try {
      // Set loading state
      setIsCheckingAuth(true)

      // Handle Auth0 redirect callback if code parameter is present
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        setIsLoading(true)
        try {
          await authService.handleAuthCallback()
          const user = await authService.getCurrentUser()
          if (user) {
            auth.setUser(user)
            // Redirect handled by the createEffect above
            return
          }
        } catch (err: any) {
          console.error("Auth callback error:", err)
          setError(
            `Authentication error: ${
              err.message || "An unknown error occurred"
            }`
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        // Check if user is already logged in
        const user = await authService.getCurrentUser()
        if (user) {
          auth.setUser(user)
          // Redirect handled by the createEffect above
          return
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to verify authentication status")
    } finally {
      setIsCheckingAuth(false)
    }
  })

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      await authService.signIn()
      // The page will redirect to Auth0's login page
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError(err.message || "Failed to sign in")
      setIsLoading(false)
    }
  }

  return (
    <Show
      when={!isCheckingAuth()}
      fallback={
        <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
        </div>
      }
    >
      <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div class="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 class="mt-4 text-3xl font-extrabold text-gray-900 text-center">
              Welcome Back
            </h2>
            <p class="mt-2 text-sm text-gray-600 text-center">
              Sign in to your account to continue
            </p>
          </div>

          <div class="mt-8 space-y-6">
            <Show when={error()}>
              <div class="rounded-md bg-red-50 p-4">
                <p class="text-sm text-red-700">{error()}</p>
              </div>
            </Show>

            <button
              onClick={handleLogin}
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                     text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                     transition-colors duration-200"
              disabled={isLoading()}
            >
              {isLoading() ? (
                <span class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Redirecting...
                </span>
              ) : (
                "Sign in with Auth0"
              )}
            </button>
          </div>

          <div class="mt-6">
            <p class="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Show>
  )
}
