import {
  Component,
  createSignal,
  createResource,
  Show,
  onMount,
} from "solid-js"
import type {
  MerchantTransferResponse,
  UpdateMerchantRequest,
  Location,
  GetMerchantTransferResponse,
} from "../../types/api"
import { TransferStatus } from "../../types/api"
import { api } from "../../services/api"
import { AdminLayout } from "../AdminLayout"
import TransferQRCode from "../TransferQRCode"

const Merchants: Component = () => {
  const [error, setError] = createSignal<string | null>(null)
  const [showMerchantUpdateModal, setShowMerchantUpdateModal] =
    createSignal(false)
  const [merchantUpdate, setMerchantUpdate] =
    createSignal<UpdateMerchantRequest>({
      merchantDisplayName: "",
      merchantDescription: "",
      bankAccountId: "",
      webhookUrl: "",
      merchantLocation: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
    })
  const [transferAmount, setTransferAmount] = createSignal(0)
  const [transferResult, setTransferResult] = createSignal<any>(null)
  const [posActivationCode, setPosActivationCode] = createSignal("")
  const [isTransferLoading, setIsTransferLoading] = createSignal(false)
  const [isMerchantUpdateLoading, setIsMerchantUpdateLoading] =
    createSignal(false)
  const [transferStatus, setTransferStatus] =
    createSignal<TransferStatus | null>(null)

  const connectedPOS = [
    { id: "POS001", name: "Main Register", status: "active" },
    { id: "POS002", name: "Secondary Register", status: "inactive" },
  ]

  // Fetch merchant transactions
  const [transactions] = createResource<MerchantTransferResponse>(async () => {
    const result = await api.listMerchantTransfers()
    return result
  })

  const handleActivatePOS = async () => {
    try {
      if (!posActivationCode()) {
        setError("Please enter a POS activation code")
        return
      }
      // TODO: Implement API call to activate POS
      console.log("Activating POS with code:", posActivationCode())
      setPosActivationCode("")
    } catch (err) {
      setError("Failed to activate POS device")
    }
  }

  const handleCreateTransfer = async () => {
    try {
      if (transferAmount() <= 0) {
        setError("Please enter a valid transfer amount")
        return
      }
      setIsTransferLoading(true)
      const result = await api.createTransferRequest({
        amount: transferAmount(),
        bankAccountId: "bankAccountId",
      })
      setTransferResult(result)
      // Initialize transfer status
      setTransferStatus(TransferStatus.NOT_STARTED)
    } catch (err) {
      console.error("Error creating transfer:", err)
      setError("Failed to create transfer. Please try again.")
    } finally {
      setIsTransferLoading(false)
    }
  }

  const handleUpdateMerchant = async () => {
    try {
      setIsMerchantUpdateLoading(true)
      const update = merchantUpdate()

      // Filter out empty fields to avoid overwriting with empty values
      const filteredUpdate: UpdateMerchantRequest = {}

      if (update.merchantDisplayName)
        filteredUpdate.merchantDisplayName = update.merchantDisplayName
      if (update.merchantDescription)
        filteredUpdate.merchantDescription = update.merchantDescription
      if (update.bankAccountId)
        filteredUpdate.bankAccountId = update.bankAccountId
      if (update.webhookUrl) filteredUpdate.webhookUrl = update.webhookUrl

      // Only include location if at least one field is filled
      if (update.merchantLocation) {
        const location = update.merchantLocation
        if (
          location.latitude !== 0 ||
          location.longitude !== 0 ||
          location.address
        ) {
          filteredUpdate.merchantLocation = location
        }
      }

      // Only make the API call if there's at least one field to update
      if (Object.keys(filteredUpdate).length > 0) {
        await api.updateMerchantConfig(filteredUpdate)
        setShowMerchantUpdateModal(false)
        setError(null)
      } else {
        setError("Please fill at least one field to update")
      }
    } catch (err) {
      console.error("Error updating merchant:", err)
      setError("Failed to update merchant information")
    } finally {
      setIsMerchantUpdateLoading(false)
    }
  }

  // Handle transfer status changes from the QR code component
  const handleTransferStatusChange = (status: TransferStatus) => {
    setTransferStatus(status)
  }

  return (
    <AdminLayout>
      <div>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">
            Merchant Dashboard
          </h1>
          <button
            onClick={() => setShowMerchantUpdateModal(true)}
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Update Merchant Info
          </button>
        </div>

        {/* Transfer Request */}
        <section class="mb-6">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center">
                <h3 class="text-lg font-medium text-gray-900">
                  Transfer Funds
                </h3>
                <svg
                  class="ml-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="mt-4">
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Transfer Amount ($)
                    </label>
                    <input
                      type="number"
                      value={transferAmount()}
                      onInput={(e) =>
                        setTransferAmount(parseFloat(e.target.value))
                      }
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                      disabled={isTransferLoading()}
                    />
                  </div>
                  <div class="flex items-end">
                    <button
                      onClick={handleCreateTransfer}
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed h-[38px]"
                      disabled={isTransferLoading()}
                    >
                      {isTransferLoading()
                        ? "Processing..."
                        : "Create Transfer Request"}
                    </button>
                  </div>
                </div>
              </div>

              <Show
                when={!isTransferLoading() && transferResult()}
                fallback={
                  <Show when={isTransferLoading()}>
                    <div class="mt-4">
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
                        <span>Creating Transfer...</span>
                      </div>
                    </div>
                  </Show>
                }
              >
                <div class="mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    Transfer Result
                  </h4>
                  <div class="flex flex-col md:flex-row gap-4">
                    <div class="bg-gray-50 p-3 rounded-md overflow-auto text-xs font-mono flex-1">
                      {JSON.stringify(transferResult(), null, 2)}
                    </div>
                    <div class="flex flex-col items-center">
                      <Show when={transferResult()}>
                        <TransferQRCode
                          transferRequestId={transferResult().transferRequestId}
                          merchantId={transferResult().merchantId}
                          amount={transferAmount()}
                          initialStatus={transferStatus() as TransferStatus}
                          onStatusChange={handleTransferStatusChange}
                          pollingInterval={5000}
                        />
                      </Show>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </section>

        {/* Merchant Information */}
        <section class="mb-6">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <h3 class="text-lg font-medium text-gray-900">
                    Merchant Information
                  </h3>
                  <svg
                    class="ml-2 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1a1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Update your merchant profile information, including display
                  name, description, location, bank account, and webhook URL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Merchant Update Modal */}
        <Show when={showMerchantUpdateModal()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Update Merchant Information
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Fill in the fields you want to update
                </p>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={merchantUpdate().merchantDisplayName || ""}
                      onInput={(e) =>
                        setMerchantUpdate((prev) => ({
                          ...prev,
                          merchantDisplayName: e.target.value,
                        }))
                      }
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Your business name as shown to customers"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={merchantUpdate().merchantDescription || ""}
                      onInput={(e) =>
                        setMerchantUpdate((prev) => ({
                          ...prev,
                          merchantDescription: e.target.value,
                        }))
                      }
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-24"
                      placeholder="Brief description of your business"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account ID
                    </label>
                    <input
                      type="text"
                      value={merchantUpdate().bankAccountId || ""}
                      onInput={(e) =>
                        setMerchantUpdate((prev) => ({
                          ...prev,
                          bankAccountId: e.target.value,
                        }))
                      }
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Your bank account ID"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value={merchantUpdate().webhookUrl || ""}
                      onInput={(e) =>
                        setMerchantUpdate((prev) => ({
                          ...prev,
                          webhookUrl: e.target.value,
                        }))
                      }
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://your-webhook-endpoint.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={
                            merchantUpdate().merchantLocation?.address || ""
                          }
                          onInput={(e) =>
                            setMerchantUpdate((prev) => ({
                              ...prev,
                              merchantLocation: {
                                ...prev.merchantLocation!,
                                address: e.target.value,
                              },
                            }))
                          }
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          value={
                            merchantUpdate().merchantLocation?.latitude || 0
                          }
                          onInput={(e) =>
                            setMerchantUpdate((prev) => ({
                              ...prev,
                              merchantLocation: {
                                ...prev.merchantLocation!,
                                latitude: parseFloat(e.target.value) || 0,
                              },
                            }))
                          }
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Latitude"
                          step="0.000001"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          value={
                            merchantUpdate().merchantLocation?.longitude || 0
                          }
                          onInput={(e) =>
                            setMerchantUpdate((prev) => ({
                              ...prev,
                              merchantLocation: {
                                ...prev.merchantLocation!,
                                longitude: parseFloat(e.target.value) || 0,
                              },
                            }))
                          }
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Longitude"
                          step="0.000001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowMerchantUpdateModal(false)}
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMerchant}
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isMerchantUpdateLoading()}
                >
                  {isMerchantUpdateLoading()
                    ? "Updating..."
                    : "Update Merchant"}
                </button>
              </div>
            </div>
          </div>
        </Show>

        {/* Error Display */}
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
    </AdminLayout>
  )
}

export default Merchants
