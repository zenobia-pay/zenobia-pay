import { Component, createSignal, Show, createEffect } from "solid-js"
import { api } from "../../services/api"
import type { UpdateMerchantRequest } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"

const Settings: Component = () => {
  const merchant = useMerchant()
  const [error, setError] = createSignal<string | null>(null)
  const [success, setSuccess] = createSignal<string | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)
  const [isDisablingManualOrders, setIsDisablingManualOrders] =
    createSignal(false)
  const [isConfiguringManualOrders, setIsConfiguringManualOrders] =
    createSignal(false)

  // Form state for merchant config
  const [merchantDescription, setMerchantDescription] = createSignal("")
  const [webhookUrl, setWebhookUrl] = createSignal("")
  const [editingWebhook, setEditingWebhook] = createSignal(false)
  const [merchantDisplayName, setMerchantDisplayName] = createSignal("")

  // Update form state when merchant config changes
  const updateFormState = () => {
    const config = merchant.merchantConfig()
    if (config) {
      if (config.merchantDescription)
        setMerchantDescription(config.merchantDescription)
      if (config.webhookUrl) setWebhookUrl(config.webhookUrl)
      if (config.merchantDisplayName)
        setMerchantDisplayName(config.merchantDisplayName)
    }
  }

  // Update form state when merchant config is loaded
  createEffect(() => {
    if (!merchant.merchantConfigLoading()) {
      updateFormState()
    }
  })

  const handleWebhookSave = () => {
    setEditingWebhook(false)
  }

  const handleDisableManualOrders = async () => {
    if (
      !confirm(
        "Are you sure you want to disable manual orders? This will remove your API credentials and you'll need to reconfigure them to use manual orders again."
      )
    ) {
      return
    }

    setIsDisablingManualOrders(true)
    try {
      // Call the disable endpoint
      await api.disableManualOrders()
      toast.success("Manual orders disabled successfully")
      await merchant.refetchManualOrdersConfig()
    } catch (error) {
      console.error("Error disabling manual orders:", error)
      toast.error("Failed to disable manual orders")
    } finally {
      setIsDisablingManualOrders(false)
    }
  }

  const handleConfigureManualOrders = async () => {
    setIsConfiguringManualOrders(true)
    try {
      const result = await merchant.setupManualOrders()
      if (result.success) {
        toast.success("Manual orders configured successfully!")
        await merchant.refetchManualOrdersConfig()
      } else {
        toast.error(result.error || "Failed to configure manual orders")
      }
    } catch (error) {
      console.error("Error setting up manual orders:", error)
      toast.error("Failed to configure manual orders")
    } finally {
      setIsConfiguringManualOrders(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const updateRequest: UpdateMerchantRequest = {}

      // Only include fields that have values
      if (merchantDescription())
        updateRequest.merchantDescription = merchantDescription()
      if (webhookUrl()) updateRequest.webhookUrl = webhookUrl()

      // Only make the API call if there's at least one field to update
      if (Object.keys(updateRequest).length > 0) {
        await api.updateMerchantConfig(updateRequest)
        setSuccess("Merchant configuration updated successfully")
        // Refetch merchant config to get latest data
        await merchant.refetchMerchantConfig()
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
          Manage your merchant profile and webhook settings
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

      <h2 class="text-xl font-semibold text-gray-800 mb-4 w-full">
        Merchant Profile
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div class="md:col-span-2 space-y-6">
          {/* Merchant Profile Section */}
          <section id="profile">
            <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div class="px-6 py-6">
                <Show when={merchant.merchantConfigLoading()}>
                  <div class="flex justify-center py-8">
                    <div class="animate-pulse flex space-x-4 items-center">
                      <div class="rounded-full bg-blue-100 h-10 w-10"></div>
                      <div class="h-4 bg-blue-100 rounded w-48"></div>
                    </div>
                  </div>
                </Show>

                <Show when={!merchant.merchantConfigLoading()}>
                  <div class="space-y-6">
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        class="form-input shadow-sm bg-gray-50 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        value={merchantDisplayName()}
                        disabled
                        placeholder="Your business name"
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        Display name cannot be modified.
                      </p>
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
                        placeholder="Description"
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

                    {/* Manual Orders Configuration Section */}
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        <div class="flex items-center">
                          <span>Manual Orders</span>
                          <span class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            API
                          </span>
                        </div>
                      </label>
                      <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <Show when={!merchant.manualOrdersConfigLoading()}>
                          <Show
                            when={merchant.manualOrdersConfig()?.isConfigured}
                          >
                            <div class="flex items-center justify-between">
                              <div class="flex items-center">
                                <div class="ml-3">
                                  <p class="text-sm font-medium text-gray-900">
                                    Manual orders are configured
                                  </p>
                                  <p class="text-sm text-gray-500">
                                    You can create and manage orders through the
                                    dashboard.
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={handleDisableManualOrders}
                                disabled={isDisablingManualOrders()}
                                class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Show
                                  when={!isDisablingManualOrders()}
                                  fallback={
                                    <svg
                                      class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                  }
                                >
                                  <svg
                                    class="-ml-1 mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </Show>
                                Disable
                              </button>
                            </div>
                          </Show>
                          <Show
                            when={!merchant.manualOrdersConfig()?.isConfigured}
                          >
                            <div class="flex items-center justify-between">
                              <div class="flex items-center">
                                <div class="flex-shrink-0">
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
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                  </svg>
                                </div>
                                <div class="ml-3">
                                  <p class="text-sm font-medium text-gray-900">
                                    Manual orders not configured
                                  </p>
                                  <p class="text-sm text-gray-500">
                                    Configure manual orders to create orders via
                                    API
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={handleConfigureManualOrders}
                                disabled={
                                  isConfiguringManualOrders() ||
                                  merchant.merchantConfigLoading() ||
                                  !merchant.merchantConfig()
                                    ?.merchantDisplayName
                                }
                                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Show
                                  when={!isConfiguringManualOrders()}
                                  fallback={
                                    <>
                                      <svg
                                        class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                      Configuring...
                                    </>
                                  }
                                >
                                  Configure
                                </Show>
                              </button>
                            </div>
                          </Show>
                        </Show>
                        <Show when={merchant.manualOrdersConfigLoading()}>
                          <div class="flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span class="ml-2 text-sm text-gray-500">
                              Loading...
                            </span>
                          </div>
                        </Show>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Manage API credentials for creating manual orders
                      </p>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </section>
        </div>

        <div class="md:col-span-1">
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
          <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-6 sticky top-6 mt-6">
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
