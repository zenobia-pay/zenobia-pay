import { Component, createSignal, Show } from "solid-js"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"

export const ManualOrdersConfiguration: Component = () => {
  const merchant = useMerchant()
  const [isConfiguring, setIsConfiguring] = createSignal(false)

  // Configure manual orders
  const configureManualOrders = async () => {
    setIsConfiguring(true)
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
      setIsConfiguring(false)
    }
  }

  return (
    <Show when={!merchant.manualOrdersConfigLoading()}>
      <Show when={!merchant.manualOrdersConfig()?.isConfigured}>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Manual Orders Not Configured
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>
                  You need to configure manual orders before you can view them.
                  This will generate the necessary API credentials for
                  processing payments.
                </p>
              </div>
              <div class="mt-4">
                <button
                  onClick={configureManualOrders}
                  disabled={isConfiguring()}
                  class="bg-yellow-100 text-yellow-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Show
                    when={!isConfiguring()}
                    fallback={
                      <>
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800"
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
                    Configure Manual Orders
                  </Show>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  )
}
