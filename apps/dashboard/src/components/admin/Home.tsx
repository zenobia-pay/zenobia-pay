import { createMemo, createSignal } from "solid-js"
import { Show } from "solid-js"
import { TransferStatus, CreateOrderResponse } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { useAdminLayout } from "../AdminLayout"
import { api } from "../../services/api"
import { toast } from "solid-toast"

// Add chevron icon SVG for collapse/expand
const ChevronIcon = (props: { open: boolean }) => (
  <svg
    class={`w-5 h-5 ml-2 transition-transform duration-200 ${props.open ? "rotate-90" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 5l7 7-7 7"
    />
  </svg>
)

export const Home = () => {
  const merchant = useMerchant()
  const adminLayout = useAdminLayout()

  // Create order section state
  const [orderAmount, setOrderAmount] = createSignal("")
  const [orderTitle, setOrderTitle] = createSignal("")
  const [orderSuccess, setOrderSuccess] = createSignal(false)
  const [createdOrder, setCreatedOrder] =
    createSignal<CreateOrderResponse | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = createSignal(false)
  const [orderError, setOrderError] = createSignal<string | null>(null)

  // Create data resources used in the overview tab
  const [period, setPeriod] = createSignal("Last 30 days")
  const [showPeriodDropdown, setShowPeriodDropdown] = createSignal(false)
  const periodOptions = createMemo(() => [
    "Last 30 days",
    "Last 7 days",
    "Last 90 days",
    "Year to date",
    "All time",
  ])

  // Convert cents to dollars
  const centsToDollars = (cents: number) => {
    return cents / 100
  }

  // Convert dollars to cents
  const dollarsToCents = (dollars: number) => {
    return Math.round(dollars * 100)
  }

  // Function to handle order creation
  const handleCreateOrder = async () => {
    if (!orderAmount() || parseFloat(orderAmount()) <= 0) {
      setOrderError("Please enter a valid amount")
      return
    }

    // Check if merchant config is loaded and has display name
    if (
      merchant.merchantConfigLoading() ||
      !merchant.merchantConfig()?.merchantDisplayName
    ) {
      setOrderError(
        "Merchant configuration not loaded. Please refresh the page and try again."
      )
      return
    }

    setIsCreatingOrder(true)
    setOrderError(null)

    try {
      const orderData = {
        amount: dollarsToCents(parseFloat(orderAmount())),
        description: orderTitle() || undefined,
        merchantDisplayName: merchant.merchantConfig()?.merchantDisplayName,
      }

      const response = await api.createOrder(orderData)
      setCreatedOrder(response)
      setOrderSuccess(true)

      // Refresh the orders list after successful creation
      await merchant.refetchOrders()
    } catch (error) {
      console.error("Error creating order:", error)
      setOrderError(
        error instanceof Error ? error.message : "Failed to create order"
      )
    } finally {
      setIsCreatingOrder(false)
    }
  }

  // Function to reset the form
  const resetForm = () => {
    setOrderSuccess(false)
    setCreatedOrder(null)
    setOrderAmount("")
    setOrderTitle("")
    setOrderError(null)
  }

  // Filter transfers based on period for overview tab
  const filteredTransfers = createMemo(() => {
    if (!merchant.merchantTransfers() || !merchant.merchantTransfers()?.items) {
      return []
    }

    const transfers = merchant.merchantTransfers()?.items ?? []

    // If "All time" is selected, return all transfers
    if (period() === "All time") {
      return transfers
    }

    // For other period options, apply client-side filtering based on creation date
    // Since we don't have direct creation dates in the MerchantTransfer objects,
    // we'll use a date estimate based on the transferRequestId
    // In a real implementation, you would fetch full transfer details or ensure the API returns creation dates

    const today = new Date()
    let startDate: Date

    switch (period()) {
      case "Last 7 days":
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        break
      case "Last 90 days":
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 90)
        break
      case "Year to date":
        startDate = new Date(today.getFullYear(), 0, 1) // January 1st of current year
        break
      case "Last 30 days":
      default:
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 30)
        break
    }

    // For demo/simulation purposes, we'll use the index of the array as a rough time indicator
    // In a real app, you would use actual transfer creation dates
    return transfers.filter((_, index) => {
      // Simulate dates - newer items are at the start of the array
      const estimatedCreationDate = new Date()
      estimatedCreationDate.setDate(today.getDate() - index * 2) // Each transfer is ~2 days apart
      return estimatedCreationDate >= startDate
    })
  })

  // Metrics calculations for overview tab
  const metrics = createMemo(() => {
    if (merchant.merchantTransfersLoading() || !merchant.merchantTransfers()) {
      return {
        totalRevenue: 0,
        processingVolume: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        topTransactions: [],
        failedPayments: [],
        revenueChange: undefined as number | undefined,
        volumeChange: undefined as number | undefined,
      }
    }

    const transfers = filteredTransfers()

    // Calculate total revenue (just a simplified example)
    // In a real app, you'd calculate based on fee structure
    const totalRevenue = transfers.reduce(
      (sum: number, transfer) => sum + centsToDollars(transfer.amount), // 1% of transaction amount as revenue
      0
    )

    // Calculate processing volume
    const processingVolume = transfers.reduce(
      (sum: number, transfer) => sum + centsToDollars(transfer.amount),
      0
    )

    // Calculate transaction counts
    const successfulTransactions = transfers.filter(
      (transfer) => transfer.status === TransferStatus.COMPLETED
    ).length
    const failedTransactions = transfers.filter(
      (transfer) => transfer.status === TransferStatus.FAILED
    ).length

    // Get top 5 largest transactions
    const topTransactions = [...transfers]
      .sort((a, b) => centsToDollars(b.amount) - centsToDollars(a.amount))
      .slice(0, 5)

    // Get failed payments
    const failedPayments = transfers.filter(
      (transfer) => transfer.status === TransferStatus.FAILED
    )

    // Calculate changes - only show if we have data
    const revenueChange = undefined as number | undefined // We don't have previous period data yet
    const volumeChange = undefined as number | undefined // We don't have previous period data yet

    return {
      totalRevenue,
      processingVolume,
      successfulTransactions,
      failedTransactions,
      topTransactions,
      failedPayments,
      revenueChange,
      volumeChange,
    }
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date - used for displaying dates in the UI
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const [collapseManualOrder, setCollapseManualOrder] = createSignal(false)

  return (
    <div class="space-y-8">
      {/* Create Order Section - Collapsible */}
      <Show when={!merchant.manualOrdersConfigLoading()}>
        <Show when={!merchant.manualOrdersConfig()?.isConfigured}>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="h-5 w-5 text-gray-400 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-600">
                  Manual orders need to be configured before you can create
                  them.
                </span>
              </div>
              <button
                onClick={() => adminLayout.navigateToTab("manual-orders")}
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Configure now →
              </button>
            </div>
          </div>
        </Show>
      </Show>
      <Show when={merchant.manualOrdersConfig()?.isConfigured}>
        <div class="bg-white rounded-lg shadow">
          <div
            class="px-6 py-5 border-b border-gray-200 flex items-center cursor-pointer select-none"
            onClick={() => setCollapseManualOrder(!collapseManualOrder())}
          >
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              Create manual order
              <ChevronIcon open={!collapseManualOrder()} />
            </h2>
            <span class="ml-4 text-sm text-gray-500 hidden sm:inline">
              Create a manual order for a customer to pay
            </span>
          </div>
          <Show when={!collapseManualOrder()}>
            <div class="p-6">
              <Show when={!orderSuccess()}>
                <div class="space-y-6">
                  <div>
                    <label
                      for="orderAmount"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Order Amount ($)
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="orderAmount"
                        value={orderAmount()}
                        onInput={(e) => setOrderAmount(e.currentTarget.value)}
                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      for="orderTitle"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Order Title
                    </label>
                    <input
                      type="text"
                      id="orderTitle"
                      value={orderTitle()}
                      onInput={(e) => setOrderTitle(e.currentTarget.value)}
                      class="mt-1 block w-full border-gray-300 rounded-md py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter order title"
                    />
                  </div>

                  <Show when={orderAmount() && parseFloat(orderAmount()) > 0}>
                    <button
                      onClick={handleCreateOrder}
                      disabled={isCreatingOrder()}
                      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingOrder() ? (
                        <div class="flex items-center justify-center">
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
                          Creating order...
                        </div>
                      ) : (
                        "Create Order"
                      )}
                    </button>
                  </Show>

                  <Show when={orderError()}>
                    <div class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p class="text-sm text-red-600">{orderError()}</p>
                    </div>
                  </Show>
                </div>
              </Show>
              <Show when={orderSuccess()}>
                <div class="w-full max-w-lg bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col gap-6 shadow-md relative">
                  {/* Close button */}
                  <button
                    onClick={resetForm}
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                      {/* Large modern checkmark icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-2xl font-semibold text-green-900 mb-1">
                        Order Created Successfully!
                      </h3>
                      <p class="text-gray-700">
                        Your order for{" "}
                        <span class="font-semibold">${orderAmount()}</span> has
                        been created.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons in a grid */}
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/pay/${createdOrder()?.id}`
                        navigator.clipboard.writeText(shareUrl)
                        toast.success("Payment link copied to clipboard")
                      }}
                      class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {/* Copy icon */}
                      <svg
                        class="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Link
                    </button>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/pay/${createdOrder()?.id}`
                        if (navigator.share) {
                          navigator.share({
                            title: "Payment Request",
                            text: `Please complete your payment of $${orderAmount()}`,
                            url: shareUrl,
                          })
                        } else {
                          navigator.clipboard.writeText(shareUrl)
                          toast.success("Payment link copied to clipboard")
                        }
                      }}
                      class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {/* Share icon */}
                      <svg
                        class="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      Share Link
                    </button>
                    <button
                      onClick={() => {
                        window.open(`/pay/${createdOrder()?.id}`, "_blank")
                      }}
                      class="flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 col-span-1 sm:col-span-2"
                    >
                      {/* QR icon */}
                      <svg
                        class="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      Show Payment QR
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </Show>

      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Overview</h1>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative">
              <button
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown())}
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {period()}
                <svg
                  class="w-5 h-5 ml-2 -mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              {showPeriodDropdown() && (
                <div class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    {periodOptions().map((option) => (
                      <button
                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPeriod(option)
                          setShowPeriodDropdown(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => merchant.refetchMerchantTransfers()}
            class="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Refresh data"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Total Revenue */}
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex items-center">
              <h3 class="text-sm font-medium text-gray-900">Total Revenue</h3>
              <Show when={metrics().revenueChange !== undefined}>
                <div class="ml-auto">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{metrics().revenueChange?.toFixed(1)}%
                  </span>
                </div>
              </Show>
            </div>

            <div class="mt-2">
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <div class="flex justify-center items-center py-4">
                    <svg
                      class="animate-spin h-5 w-5 text-indigo-600"
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
                  </div>
                }
              >
                <div class="flex items-baseline">
                  <span class="text-3xl font-semibold text-gray-900">
                    {formatCurrency(metrics().totalRevenue)}
                  </span>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Processing Volume */}
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex items-center">
              <h3 class="text-sm font-medium text-gray-900">
                Processing Volume
              </h3>
              <Show when={metrics().volumeChange !== undefined}>
                <div class="ml-auto">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{metrics().volumeChange?.toFixed(1)}%
                  </span>
                </div>
              </Show>
            </div>

            <div class="mt-2">
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <div class="flex justify-center items-center py-4">
                    <svg
                      class="animate-spin h-5 w-5 text-indigo-600"
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
                  </div>
                }
              >
                <div class="flex items-baseline">
                  <span class="text-3xl font-semibold text-gray-900">
                    {formatCurrency(metrics().processingVolume)}
                  </span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-1">
        {/* Top Transactions */}
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="border-b border-gray-200 pb-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-medium text-gray-900">
                      Top Transactions
                    </h3>
                  </div>
                  <a
                    href="?tab=transactions"
                    class="mt-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    View all transactions
                  </a>
                </div>
              </div>
            </div>

            <Show
              when={metrics().topTransactions.length > 0}
              fallback={
                <div class="mt-4 flex items-center justify-center h-16 opacity-50 text-sm">
                  No transactions yet
                </div>
              }
            >
              <div class="mt-4 divide-y divide-gray-200">
                {metrics().topTransactions.map((transaction, index) => {
                  // Create estimated creation date for display purposes
                  const today = new Date()
                  const estimatedDate = new Date()
                  estimatedDate.setDate(today.getDate() - index * 2)

                  return (
                    <div class="py-3 first:pt-0 last:pb-0">
                      <div class="flex items-center justify-between">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {transaction.transferRequestId}
                            </p>
                            <div class="ml-4 flex-shrink-0 flex items-center gap-4">
                              <span class="text-sm text-gray-500">
                                {formatCurrency(
                                  centsToDollars(transaction.amount)
                                )}
                              </span>
                              <a
                                href={`?tab=transactions&subtab=details&transactionId=${transaction.transferRequestId}`}
                                class="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                              >
                                View details
                              </a>
                            </div>
                          </div>
                          <p class="mt-1 text-xs text-gray-500">
                            {formatDate(estimatedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Failed Payments */}
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="px-6 py-5 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-900">Failed Transactions</h3>
        </div>

        <Show
          when={metrics().failedPayments.length > 0}
          fallback={
            <div class="p-6">
              <div class="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                  <svg
                    class="w-6 h-6 text-green-600"
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
                </div>
                <h3 class="text-sm font-medium text-gray-900">All good</h3>
                <p class="mt-1 text-sm text-gray-500">No failed transactions</p>
              </div>
            </div>
          }
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {metrics().failedPayments.map((payment, index) => {
                  // Create estimated creation date for display purposes
                  const today = new Date()
                  const estimatedDate = new Date()
                  estimatedDate.setDate(today.getDate() - index * 2)

                  return (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          {payment.transferRequestId.substring(0, 8)}...
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                          {formatCurrency(centsToDollars(payment.amount))}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">
                          {formatDate(estimatedDate)}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right">
                        <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          Retry
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Show>
      </div>

      {/* Footer with update information */}
      <div class="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
        <span></span>
        <div class="flex gap-4">
          {/* <a href="#" class="text-indigo-600 hover:text-indigo-900">
            Export data
          </a> */}
        </div>
      </div>
    </div>
  )
}
