import { Component, createSignal } from "solid-js"
import { useNavigate, A } from "@solidjs/router"
import { AdminLayout } from "../../components/AdminLayout"

const Admin404: Component = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = createSignal(5)

  // Automatic redirect to dashboard after 5 seconds
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start countdown on mount
  if (typeof window !== "undefined") {
    startCountdown()
  }

  return (
    <AdminLayout>
      <div class="text-center py-16 max-w-2xl mx-auto">
        <div class="flex flex-col items-center">
          <div class="text-indigo-600 text-9xl font-bold">404</div>
          <h1 class="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
          <div class="mt-6 text-base text-gray-600">
            <p>Sorry, we couldn't find the page you're looking for.</p>
            <p class="mt-2">
              You'll be redirected to the dashboard in {countdown()} seconds.
            </p>
          </div>
          <div class="mt-10 flex gap-4">
            <A
              href="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </A>
            <button
              onClick={() => window.history.back()}
              class="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div class="mt-16">
          <h2 class="text-lg font-medium text-gray-900">Popular pages</h2>
          <ul class="mt-4 flex flex-col items-center gap-3">
            <li>
              <A
                href="/merchants"
                class="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Merchants
              </A>
            </li>
            <li>
              <A
                href="/transactions"
                class="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Transactions
              </A>
            </li>
            <li>
              <A
                href="/accounts"
                class="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Accounts
              </A>
            </li>
            <li>
              <A
                href="/settings"
                class="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Settings
              </A>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Admin404
