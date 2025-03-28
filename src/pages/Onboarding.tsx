import { Component, createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { api } from "../services/api"
import { UserType } from "../types/api"

const Onboarding: Component = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = createSignal("")
  const [lastName, setLastName] = createSignal("")
  const [merchantDisplayName, setMerchantDisplayName] = createSignal("")
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError(null)

    if (!firstName() || !lastName()) {
      setError("First name and last name are required")
      return
    }

    if (!merchantDisplayName()) {
      setError("Business name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const onboardingData = {
        firstName: firstName(),
        lastName: lastName(),
        userType: UserType.MERCHANT,
        merchantDisplayName: merchantDisplayName(),
      }

      await api.submitOnboarding(onboardingData)
      console.log("Onboarding submitted successfully")
      // Redirect to dashboard after successful onboarding
      navigate("/")
    } catch (err) {
      console.error("Failed to submit onboarding:", err)
      setError("Failed to complete onboarding. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Onboarding
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please provide the following information to set up your merchant
          account.
          <br />
          <span class="mt-1 inline-block text-gray-500 group relative cursor-help">
            Why do we need this?
            <span class="invisible group-hover:visible absolute bg-gray-800 text-white text-xs rounded p-2 shadow-lg left-1/2 top-6 w-64">
              We're required to collect this information to keep your account
              compliant with legal and regulatory requirements.
            </span>
          </span>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <div class="flex items-center">
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div class="relative ml-2 group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5 text-gray-500 cursor-help"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                    First name, as it appears on your ID
                  </div>
                </div>
              </div>
              <div class="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName()}
                  onInput={(e) => setFirstName(e.currentTarget.value)}
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <div class="flex items-center">
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div class="relative ml-2 group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5 text-gray-500 cursor-help"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                    Last name, as it appears on your ID
                  </div>
                </div>
              </div>
              <div class="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName()}
                  onInput={(e) => setLastName(e.currentTarget.value)}
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <div class="flex items-center">
                <label
                  for="merchantDisplayName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Legal Entity Name
                </label>
                <div class="relative ml-2 group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5 text-gray-500 cursor-help"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 shadow-lg -left-6 -top-14 w-48">
                    Your full legal business name, e.g. "Zenobia Pay, Inc."
                  </div>
                </div>
              </div>
              <div class="mt-1">
                <input
                  id="merchantDisplayName"
                  name="merchantDisplayName"
                  type="text"
                  required
                  value={merchantDisplayName()}
                  onInput={(e) => setMerchantDisplayName(e.currentTarget.value)}
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Error message */}
            <Show when={error()}>
              <div class="text-red-600 text-sm">{error()}</div>
            </Show>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting()}
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting() ? "Submitting..." : "Complete Onboarding"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
