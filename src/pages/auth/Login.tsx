import { onMount, createSignal } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { useAuth } from "../../context/AuthContext"
import { authService } from "../../services/auth"

export default function Login() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [error, setError] = createSignal("")
  const [isProcessing, setIsProcessing] = createSignal(true)
  const [isLoggingOut, setIsLoggingOut] = createSignal(false)
  const [isResendingEmail, setIsResendingEmail] = createSignal(false)
  const [resendSuccess, setResendSuccess] = createSignal(false)
  const [userEmail, setUserEmail] = createSignal("")

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
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred"
          setError(`Authentication error: ${errorMessage}`)

          // Extract email from error message if it contains one
          if (
            typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("email")
          ) {
            const emailMatch = errorMessage.match(
              /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
            )
            if (emailMatch && emailMatch[0]) {
              setUserEmail(emailMatch[0])
            }
          }

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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await authService.signOut()
      // The user will be redirected to Auth0 logout page
    } catch (err: unknown) {
      console.error("Logout error:", err)
      setError(err instanceof Error ? err.message : "Failed to log out")
      setIsLoggingOut(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    if (!userEmail()) {
      setError("No email available to resend verification")
      return
    }

    try {
      setIsResendingEmail(true)
      const success = await authService.resendVerificationEmail(userEmail())

      if (success) {
        setResendSuccess(true)
        // Reset success message after 5 seconds
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        setError("Failed to resend verification email. Please try again later.")
      }
    } catch (err) {
      console.error("Error resending verification email:", err)
      setError("Failed to resend verification email. Please try again later.")
    } finally {
      setIsResendingEmail(false)
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
        <div class="max-w-md w-full mx-auto space-y-6 bg-white p-10 rounded-2xl shadow-lg">
          {error().toLowerCase().includes("email") ? (
            <>
              <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900">
                  Email Verification Required
                </h2>
                <p class="mt-3 text-base text-gray-600">
                  You need to verify your email to continue
                </p>
                {resendSuccess() && (
                  <p class="mt-2 text-sm text-green-600 font-medium">
                    Verification email has been sent!
                  </p>
                )}
              </div>

              <button
                onClick={handleResendVerificationEmail}
                class="w-full py-4 px-4 border border-transparent rounded-xl
                      font-medium text-white bg-indigo-600 hover:bg-indigo-700
                      transition-colors duration-200 text-base"
                disabled={isResendingEmail()}
              >
                {isResendingEmail()
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>

              <button
                onClick={handleLogout}
                class="w-full flex items-center justify-center text-indigo-600
                      hover:text-indigo-800 font-medium transition-colors duration-200 text-base mt-2"
                disabled={isLoggingOut()}
              >
                {isLoggingOut() ? "Logging out..." : "Log in again →"}
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 class="mt-2 text-3xl font-bold text-gray-900 text-center">
                  Authentication Error
                </h2>
                <p class="mt-2 text-base text-gray-600 text-center">
                  {error() || "An unknown error occurred"}
                </p>
              </div>

              <button
                onClick={initiateAuth0Login}
                class="w-full py-4 px-4 border border-transparent rounded-xl
                      font-medium text-white bg-indigo-600 hover:bg-indigo-700
                      transition-colors duration-200 text-base"
                disabled={isLoggingOut()}
              >
                Try Again
              </button>

              <button
                onClick={handleLogout}
                class="w-full py-4 px-4 border border-transparent rounded-xl
                     font-medium text-white bg-red-600 hover:bg-red-700
                     transition-colors duration-200 text-base"
                disabled={isLoggingOut()}
              >
                {isLoggingOut() ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
