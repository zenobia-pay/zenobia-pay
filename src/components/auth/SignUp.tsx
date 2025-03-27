import { createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { authService } from "../../services/auth"

export function SignUp() {
  const navigate = useNavigate()
  const [error, setError] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)

  onMount(async () => {
    try {
      const user = await authService.getCurrentUser()
      if (user) {
        navigate("/", { replace: true })
      }
    } catch (err) {
      // User is not logged in, continue showing signup form
    }
  })

  const handleSignUp = async () => {
    setError("")
    setIsLoading(true)

    try {
      await authService.signUp()
      // The page will redirect to Auth0's signup page
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
      setIsLoading(false)
    }
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div class="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 text-center">
            Create an Account
          </h2>
          <p class="mt-2 text-sm text-gray-600 text-center">
            Sign up to get started
          </p>
        </div>

        <div class="mt-8 space-y-6">
          {error() && (
            <div class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-700">{error()}</p>
            </div>
          )}

          <button
            onClick={handleSignUp}
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
              "Sign up with Auth0"
            )}
          </button>
        </div>

        <div class="mt-6">
          <p class="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
