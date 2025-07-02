import { Component, createSignal } from "solid-js"
import { AdminLayout } from "../components/AdminLayout"

const WrongAccountType: Component = () => {
  const [countdown, setCountdown] = createSignal(10)

  // Automatic redirect to main website after 10 seconds
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = "https://zenobiapay.com"
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
          <div class="bg-red-100 text-red-600 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 class="mt-6 text-3xl font-bold text-gray-900">
            Incorrect Account Type
          </h1>
          <div class="mt-4 text-base text-gray-600">
            <p>
              You're trying to access the Zenobia Pay Merchant Dashboard with a
              non-merchant account.
            </p>
            <p class="mt-2">
              This dashboard is exclusively for merchant accounts.
            </p>
            <p class="mt-4 font-medium">
              You'll be redirected to the Zenobia Pay website in {countdown()}{" "}
              seconds.
            </p>
          </div>
          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="https://zenobiapay.com/merchants/signup"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up for a Merchant Account
            </a>
            <a
              href="https://zenobiapay.com"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Zenobia Pay
            </a>
          </div>
        </div>

        {/* Help Section */}
        <div class="mt-16 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-gray-900">Need Help?</h2>
          <p class="mt-2 text-sm text-gray-600">
            If you believe this is an error or need assistance with your
            account, please contact our support team.
          </p>
          <div class="mt-4 flex flex-col items-center gap-3">
            <a
              href="mailto:merchants@zenobiapay.com"
              class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
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
              merchants@zenobiapay.com
            </a>
            <a
              href="tel:+18005551234"
              class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              1-800-555-1234
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default WrongAccountType
