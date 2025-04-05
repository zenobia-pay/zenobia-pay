import { Component, createSignal, createResource, Show } from "solid-js"
import { api } from "../../services/api"
import type {
  GetMerchantConfigResponse,
  UpdateMerchantRequest,
  Location,
} from "../../types/api"

const Settings: Component = () => {
  const [notificationsEnabled, setNotificationsEnabled] = createSignal(true)
  const [emailNotifications, setEmailNotifications] = createSignal(true)
  const [smsNotifications, setSmsNotifications] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [success, setSuccess] = createSignal<string | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)

  // Form state for merchant config
  const [merchantDisplayName, setMerchantDisplayName] = createSignal("")
  const [merchantDescription, setMerchantDescription] = createSignal("")
  const [webhookUrl, setWebhookUrl] = createSignal("")
  const [bankAccountId, setBankAccountId] = createSignal("")
  const [address, setAddress] = createSignal("")
  const [latitude, setLatitude] = createSignal(0)
  const [longitude, setLongitude] = createSignal(0)

  // Fetch merchant config
  const [merchantConfig] = createResource<GetMerchantConfigResponse>(
    async () => {
      try {
        const result = await api.getMerchantConfig()

        // Update form state with fetched data
        if (result.merchantDisplayName)
          setMerchantDisplayName(result.merchantDisplayName)
        if (result.merchantDescription)
          setMerchantDescription(result.merchantDescription)
        if (result.webhookUrl) setWebhookUrl(result.webhookUrl)
        if (result.bankAccountId) setBankAccountId(result.bankAccountId)

        if (result.merchantLocation) {
          if (result.merchantLocation.address)
            setAddress(result.merchantLocation.address)
          if (result.merchantLocation.latitude)
            setLatitude(result.merchantLocation.latitude)
          if (result.merchantLocation.longitude)
            setLongitude(result.merchantLocation.longitude)
        }

        return result
      } catch (err) {
        console.error("Error fetching merchant config:", err)
        setError("Failed to load merchant configuration")
        return {} as GetMerchantConfigResponse
      }
    }
  )

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const updateRequest: UpdateMerchantRequest = {}

      // Only include fields that have values
      if (merchantDisplayName())
        updateRequest.merchantDisplayName = merchantDisplayName()
      if (merchantDescription())
        updateRequest.merchantDescription = merchantDescription()
      if (webhookUrl()) updateRequest.webhookUrl = webhookUrl()
      if (bankAccountId()) updateRequest.bankAccountId = bankAccountId()

      // Only include location if at least one field has a value
      if (address() || latitude() !== 0 || longitude() !== 0) {
        const location: Location = {
          latitude: latitude(),
          longitude: longitude(),
        }

        if (address()) location.address = address()
        updateRequest.merchantLocation = location
      }

      // Only make the API call if there's at least one field to update
      if (Object.keys(updateRequest).length > 0) {
        await api.updateMerchantConfig(updateRequest)
        setSuccess("Merchant configuration updated successfully")
      } else {
        setError("No changes to save")
      }
    } catch (err) {
      console.error("Error updating merchant config:", err)
      setError("Failed to update merchant configuration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div class="space-y-6 max-w-3xl">
        {/* Merchant Profile Section */}
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Merchant Profile
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Update your merchant profile information
            </p>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <Show when={merchantConfig.loading}>
              <div class="text-center py-4">
                <div class="flex justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span>Loading merchant configuration...</span>
                </div>
              </div>
            </Show>

            <Show when={!merchantConfig.loading}>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={merchantDisplayName()}
                    onInput={(e) =>
                      setMerchantDisplayName(e.currentTarget.value)
                    }
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={merchantDescription()}
                    onInput={(e) =>
                      setMerchantDescription(e.currentTarget.value)
                    }
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={webhookUrl()}
                    onInput={(e) => setWebhookUrl(e.currentTarget.value)}
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account ID
                  </label>
                  <input
                    type="text"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={bankAccountId()}
                    onInput={(e) => setBankAccountId(e.currentTarget.value)}
                  />
                </div>

                <div class="border-t border-gray-200 pt-4 mt-4">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Location
                  </h3>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={address()}
                      onInput={(e) => setAddress(e.currentTarget.value)}
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={latitude()}
                        onInput={(e) =>
                          setLatitude(parseFloat(e.currentTarget.value))
                        }
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={longitude()}
                        onInput={(e) =>
                          setLongitude(parseFloat(e.currentTarget.value))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Notifications Section */}
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Notifications
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Manage your notification preferences
            </p>
          </div>
          <div class="px-4 py-5 sm:p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-700">
                  Enable Notifications
                </h3>
                <p class="text-sm text-gray-500">
                  Receive notifications about your account activity
                </p>
              </div>
              <button
                type="button"
                class={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled() ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled())}
              >
                <span class="sr-only">Toggle notifications</span>
                <span
                  class={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled() ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div class="space-y-4 pl-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={emailNotifications()}
                  onChange={(e) =>
                    setEmailNotifications(e.currentTarget.checked)
                  }
                />
                <label class="ml-2 text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={smsNotifications()}
                  onChange={(e) => setSmsNotifications(e.currentTarget.checked)}
                />
                <label class="ml-2 text-sm text-gray-700">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div class="flex justify-end">
          <button
            class={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading() ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSaveChanges}
            disabled={isLoading()}
          >
            {isLoading() ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Success Message */}
        <Show when={success()}>
          <div class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm">{success()}</p>
              </div>
            </div>
          </div>
        </Show>

        {/* Error Message */}
        <Show when={error()}>
          <div class="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm">{error()}</p>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Settings
