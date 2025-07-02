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
  const [isCheckingVerification, setIsCheckingVerification] =
    createSignal(false)
  const [isConsentRequired, setIsConsentRequired] = createSignal(false)

  onMount(async () => {
    try {
      // Handle Auth0 redirect callback if code parameter is present
      if (
        window.location.search.includes("code=") ||
        window.location.search.includes("error=")
      ) {
        try {
          // Check if the URL contains consent_required error
          if (window.location.search.includes("error=consent_required")) {
            console.error("Consent required error detected")
            setError(
              "Authorization required: You need to grant permission to access this application."
            )
            setIsConsentRequired(true)
            setIsProcessing(false)
            return
          }

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

          // Check if error message contains consent_required
          if (
            typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("consent_required")
          ) {
            setError(
              "Authorization required: You need to grant permission to access this application."
            )
            setIsConsentRequired(true)
          } else {
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

  const checkVerificationStatus = async () => {
    try {
      setIsCheckingVerification(true)

      // Instead of logging out, we'll use silent login to check email verification
      const user = await authService.silentLogin()

      console.log("Silent login User:", user)
      if (user && user.email_verified) {
        // If email is verified, set the user and navigate
        auth.setUser(user)
        navigate("/", { replace: true })
      } else if (user && !user.email_verified) {
        // User exists but email is still not verified
        setError(
          "Your email is not verified yet. Please check your inbox or request a new verification email."
        )
        setIsCheckingVerification(false)
      } else {
        // If no user at all, something went wrong
        setError("Failed to verify status. Please try logging in again.")
        setIsCheckingVerification(false)
      }
    } catch (err) {
      console.error("Error checking verification status:", err)
      setError("Failed to check verification status. Please try again later.")
      setIsCheckingVerification(false)
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
          {isConsentRequired() ? (
            <>
              <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
                  Authorization Required
                </h2>
                <div class="mt-3 text-base text-gray-600">
                  <p>
                    You need to authorize access to this application to
                    continue. Please grant the requested permissions on the next
                    screen.
                  </p>
                </div>
              </div>

              <button
                onClick={initiateAuth0Login}
                class="w-full py-4 px-4 border border-transparent rounded-xl
                     font-medium text-white bg-green-600 hover:bg-green-700
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                     transition-all duration-200 text-base"
              >
                <span class="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Authorize Access
                </span>
              </button>
            </>
          ) : error().toLowerCase().includes("email") ? (
            <>
              <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
                  Email Verification Required
                </h2>
                <div class="mt-3 text-base text-gray-600 flex flex-col items-center">
                  <p class="mb-2">
                    You need to verify your email to continue
                    <span class="relative inline-block ml-1 group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-indigo-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 shadow-lg z-10">
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
                        We've sent a verification email to your inbox. Click the
                        link in that email to verify your account. If you don't
                        see it, check your spam folder.
                      </div>
                    </span>
                  </p>
                  {resendSuccess() && (
                    <div class="mt-2 text-sm font-medium px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 inline mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verification email has been sent successfully!
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={checkVerificationStatus}
                class="mx-auto block py-2 px-5 border border-transparent rounded-lg
                      font-medium text-white bg-green-600 hover:bg-green-700
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                      shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                      transition-all duration-200 text-sm"
                disabled={isCheckingVerification()}
              >
                {isCheckingVerification() ? (
                  <span class="flex items-center justify-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </span>
                ) : (
                  <span class="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Check Verification Status
                  </span>
                )}
              </button>

              <div class="flex justify-between mt-4">
                <button
                  onClick={handleResendVerificationEmail}
                  class="flex items-center justify-center text-indigo-600
                        hover:text-indigo-800 font-medium transition-colors duration-200
                        focus:outline-none text-sm"
                  disabled={isResendingEmail()}
                >
                  {isResendingEmail() ? (
                    <span class="flex items-center">
                      <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600"
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
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Resend Email
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  class="flex items-center justify-center text-indigo-600
                        hover:text-indigo-800 font-medium transition-colors duration-200
                        focus:outline-none text-sm"
                  disabled={isLoggingOut()}
                >
                  {isLoggingOut() ? (
                    <span class="flex items-center">
                      <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600"
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
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging out...
                    </span>
                  ) : (
                    <span class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </span>
                  )}
                </button>
              </div>
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
