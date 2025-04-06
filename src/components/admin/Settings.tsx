import { Component, createSignal, createResource, Show, For } from "solid-js"
import { api } from "../../services/api"
import type {
  GetMerchantConfigResponse,
  UpdateMerchantRequest,
  Location,
} from "../../types/api"

// Define BankAccount interface to match API response
interface BankAccount {
  id: string
  bankName: string
  lastFour: string
  accountType: string
  isDefault: boolean
}

const Settings: Component = () => {
  const [error, setError] = createSignal<string | null>(null)
  const [success, setSuccess] = createSignal<string | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)

  // Form state for merchant config
  const [merchantDisplayName, setMerchantDisplayName] = createSignal("")
  const [merchantDescription, setMerchantDescription] = createSignal("")
  const [webhookUrl, setWebhookUrl] = createSignal("")
  const [editingWebhook, setEditingWebhook] = createSignal(false)
  const [bankAccountId, setBankAccountId] = createSignal("")
  const [address, setAddress] = createSignal("")
  const [latitude, setLatitude] = createSignal(0)
  const [longitude, setLongitude] = createSignal(0)

  // Bank accounts state
  const [bankAccounts] = createResource<BankAccount[]>(async () => {
    try {
      // Return type is cast to match our BankAccount interface
      const accounts =
        (await api.listBankAccounts()) as unknown as BankAccount[]
      return accounts
    } catch (err) {
      console.error("Error fetching bank accounts:", err)
      setError("Failed to load bank accounts")
      return []
    }
  })

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

  const handleWebhookSave = () => {
    setEditingWebhook(false)
  }

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
    <div class="max-w-full">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Settings</h1>
        <p class="text-gray-600 mt-1">
          Manage your merchant profile, payment accounts, and location
          information
        </p>
      </div>

      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <a
            href="#profile"
            class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Profile
          </a>
        </nav>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          {/* Merchant Profile Section */}
          <section id="profile">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Merchant Profile
            </h2>

            <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div class="px-6 py-6">
                <Show when={merchantConfig.loading}>
                  <div class="flex justify-center py-8">
                    <div class="animate-pulse flex space-x-4 items-center">
                      <div class="rounded-full bg-blue-100 h-10 w-10"></div>
                      <div class="h-4 bg-blue-100 rounded w-48"></div>
                    </div>
                  </div>
                </Show>

                <Show when={!merchantConfig.loading}>
                  <div class="space-y-6">
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        class="form-input shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition duration-150"
                        value={merchantDisplayName()}
                        onInput={(e) =>
                          setMerchantDisplayName(e.currentTarget.value)
                        }
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        class="form-textarea shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition duration-150"
                        value={merchantDescription()}
                        onInput={(e) =>
                          setMerchantDescription(e.currentTarget.value)
                        }
                        rows={3}
                        placeholder="Describe your business"
                      />
                    </div>

                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        <div class="flex items-center">
                          <span>Webhook URL</span>
                          <span class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Developer
                          </span>
                        </div>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            class="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </div>
                        {editingWebhook() ? (
                          <div class="flex">
                            <input
                              type="url"
                              class="pl-10 form-input shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 transition duration-150"
                              value={webhookUrl()}
                              onInput={(e) =>
                                setWebhookUrl(e.currentTarget.value)
                              }
                              placeholder="https://your-domain.com/webhook"
                            />
                            <button
                              onClick={handleWebhookSave}
                              class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-150"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => setEditingWebhook(true)}
                            class="pl-10 flex items-center w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-pointer hover:bg-gray-100 transition duration-150"
                          >
                            {webhookUrl() || "Click to set webhook URL"}
                            <svg
                              class="ml-auto h-4 w-4 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Receive real-time notifications when events occur
                      </p>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </section>

          {/* Payment Methods Section */}
          <section id="payment" class="mt-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">
                Payment Methods
              </h2>
              <a
                href="/accounts"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-white hover:text-blue-500 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-blue-50 transition ease-in-out duration-150"
              >
                <svg
                  class="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New
              </a>
            </div>

            <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div class="px-6 py-6">
                {/* Bank accounts list */}
                <Show
                  when={!bankAccounts.loading}
                  fallback={
                    <div class="animate-pulse space-y-4">
                      <div class="h-10 bg-gray-100 rounded-md w-full"></div>
                      <div class="h-10 bg-gray-100 rounded-md w-full"></div>
                    </div>
                  }
                >
                  <div class="space-y-3">
                    {/* No bank accounts case */}
                    <Show when={(bankAccounts() || []).length === 0}>
                      <div class="text-center py-10 px-4">
                        <svg
                          class="mx-auto h-12 w-12 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <h3 class="mt-4 text-base font-medium text-gray-900">
                          No payment methods
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                          You haven't added any bank accounts or payment methods
                          yet.
                        </p>
                        <div class="mt-6">
                          <a
                            href="/accounts"
                            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              class="-ml-1 mr-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Payment Method
                          </a>
                        </div>
                      </div>
                    </Show>

                    {/* Has bank accounts case */}
                    <Show when={(bankAccounts() || []).length > 0}>
                      <div class="grid gap-3">
                        <For each={bankAccounts() || []}>
                          {(account) => (
                            <div
                              class={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${
                                bankAccountId() === account.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                              onClick={() => setBankAccountId(account.id)}
                            >
                              <div
                                class={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  bankAccountId() === account.id
                                    ? "border-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {bankAccountId() === account.id && (
                                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                              <div>
                                <div class="font-medium text-gray-800">
                                  {account.bankName}
                                </div>
                                <div class="text-xs text-gray-500">
                                  •••• {account.lastFour} -{" "}
                                  {account.accountType}
                                </div>
                              </div>
                              <div class="ml-auto">
                                <span
                                  class={`px-2 py-1 text-xs rounded-full ${
                                    account.isDefault
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {account.isDefault ? "Default" : "Secondary"}
                                </span>
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                </Show>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section id="location" class="mt-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Location</h2>

            <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div class="px-6 py-6">
                <Show when={!merchantConfig.loading}>
                  <div class="space-y-6">
                    <div class="form-group mb-6">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            class="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1114.314 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          class="pl-10 form-input shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition duration-150"
                          value={address()}
                          onInput={(e) => setAddress(e.currentTarget.value)}
                          placeholder="123 Main St, City, State, Zip"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          class="form-input shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition duration-150"
                          value={latitude()}
                          onInput={(e) =>
                            setLatitude(parseFloat(e.currentTarget.value))
                          }
                          placeholder="37.7749"
                        />
                      </div>
                      <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          class="form-input shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition duration-150"
                          value={longitude()}
                          onInput={(e) =>
                            setLongitude(parseFloat(e.currentTarget.value))
                          }
                          placeholder="-122.4194"
                        />
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </section>
        </div>

        <div class="md:col-span-1 space-y-6">
          {/* Helpful Information */}
          <div class="bg-blue-50 shadow-sm rounded-lg overflow-hidden border border-blue-100 p-4">
            <h4 class="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <svg
                class="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
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
              Need Help?
            </h4>
            <p class="text-xs text-blue-600 mb-3">
              For any issues with your account settings, please contact our
              support team.
            </p>
            <a
              href="mailto:support@zenobiapay.com"
              class="text-xs text-blue-700 font-medium flex items-center hover:underline"
            >
              <svg
                class="mr-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
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
              support@zenobiapay.com
            </a>
          </div>
          {/* Save Changes Section */}
          <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-6 sticky top-6">
            <button
              class={`w-full flex items-center justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ${
                isLoading() ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleSaveChanges}
              disabled={isLoading()}
            >
              {isLoading() ? (
                <span class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Saving...
                </span>
              ) : (
                <span class="flex items-center">
                  <svg
                    class="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Save Changes
                </span>
              )}
            </button>

            <p class="mt-3 text-xs text-center text-gray-500">
              Your changes will be applied immediately
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <Show when={success()}>
        <div class="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg shadow-lg z-50 flex items-center">
          <div class="flex-shrink-0 mr-3">
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
          <div>
            <p class="font-medium">{success()}</p>
          </div>
        </div>
      </Show>

      {/* Error Message */}
      <Show when={error()}>
        <div class="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-lg z-50 flex items-center">
          <div class="flex-shrink-0 mr-3">
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
          <div>
            <p class="font-medium">{error()}</p>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default Settings
