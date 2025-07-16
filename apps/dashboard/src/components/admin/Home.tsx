import { createMemo, createSignal, createEffect, on } from "solid-js"
import { Show } from "solid-js"
import { CreateOrderResponse, OrderStatus } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
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

  // Fetch transfer statistics when period changes
  createEffect(
    on(
      () => period(),
      () => {
        // Map period names to filter types
        let filterType: string
        switch (period()) {
          case "Last 7 days":
            filterType = "last7days"
            break
          case "Last 30 days":
            filterType = "last30days"
            break
          case "Last 90 days":
            filterType = "last90days"
            break
          case "Year to date":
            filterType = "yeartodate"
            break
          case "All time":
          default:
            filterType = "all"
            break
        }

        const filterParams = {
          filterType,
          customStartDate: undefined,
          customEndDate: undefined,
        }
        merchant.fetchTransferStatistics(filterParams)
      }
    )
  )

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

  // Metrics calculations for overview tab
  const metrics = createMemo(() => {
    if (
      merchant.transferStatisticsLoading() ||
      !merchant.transferStatistics()
    ) {
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

    const stats = merchant.transferStatistics()!

    // Calculate metrics from API statistics
    const totalRevenue = centsToDollars(stats.amountSettled) // Revenue from settled transfers
    const processingVolume = centsToDollars(stats.amountPaid) // Total processing volume (total amount paid)
    const successfulTransactions = stats.transferCount // Total transfer count from API
    const failedTransactions = 0 // API doesn't provide failed count yet, could be added later

    // For now, we'll use empty arrays for top transactions and failed payments
    // These could be enhanced with additional API endpoints if needed
    const topTransactions: Array<{ amount: number; id: string }> = []
    const failedPayments: Array<{ amount: number; id: string }> = []

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
    <Show
      when={!merchant.manualOrdersConfigLoading()}
      fallback={
        merchant.manualOrdersConfig()?.isConfigured ? (
          <div class="space-y-8">
            {/* Create Manual Order Skeleton */}
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-5 border-b border-gray-200 flex items-center">
                <div class="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div class="ml-4 h-4 bg-gray-200 rounded w-64 animate-pulse hidden sm:block"></div>
              </div>
              <div class="p-6">
                <div class="space-y-6">
                  <div>
                    <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Page Header Skeleton */}
            <div>
              <div class="h-8 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div class="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Metrics Grid Skeleton */}
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="overflow-hidden bg-white rounded-lg shadow">
                <div class="p-6">
                  <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div class="overflow-hidden bg-white rounded-lg shadow">
                <div class="p-6">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Recent Orders Skeleton */}
            <div class="overflow-hidden bg-white rounded-lg shadow">
              <div class="p-6">
                <div class="border-b border-gray-200 pb-4">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div class="mt-4 space-y-3">
                  {Array.from({ length: 3 }).map(() => (
                    <div class="flex items-center justify-between py-3">
                      <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div class="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div class="overflow-hidden bg-white rounded-lg shadow">
              <div class="px-6 py-5 border-b border-gray-200">
                <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 4 }).map(() => (
                    <div class="flex items-center p-4 border border-gray-200 rounded-lg">
                      <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                      <div class="ml-3">
                        <div class="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                        <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div class="space-y-8">
            {/* Page Header Skeleton */}
            <div>
              <div class="h-8 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div class="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Metrics Grid Skeleton */}
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="overflow-hidden bg-white rounded-lg shadow">
                <div class="p-6">
                  <div class="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div class="overflow-hidden bg-white rounded-lg shadow">
                <div class="p-6">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Recent Orders Skeleton */}
            <div class="overflow-hidden bg-white rounded-lg shadow">
              <div class="p-6">
                <div class="border-b border-gray-200 pb-4">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div class="mt-4 space-y-3">
                  {Array.from({ length: 3 }).map(() => (
                    <div class="flex items-center justify-between py-3">
                      <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div class="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div class="overflow-hidden bg-white rounded-lg shadow">
              <div class="px-6 py-5 border-b border-gray-200">
                <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 4 }).map(() => (
                    <div class="flex items-center p-4 border border-gray-200 rounded-lg">
                      <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                      <div class="ml-3">
                        <div class="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                        <div class="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <>
        <div class="space-y-8">
          {/* Create Order Section - Collapsible */}

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
                            onInput={(e) =>
                              setOrderAmount(e.currentTarget.value)
                            }
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

                      <Show
                        when={orderAmount() && parseFloat(orderAmount()) > 0}
                      >
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
                            <span class="font-semibold">${orderAmount()}</span>{" "}
                            has been created.
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
                  <h3 class="text-sm font-medium text-gray-900">
                    Total Revenue
                  </h3>
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
                    when={!merchant.transferStatisticsLoading()}
                    fallback={
                      <div class="flex items-center">
                        <svg
                          class="animate-spin h-6 w-6 text-indigo-600 mr-2"
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
                        <span class="text-3xl font-semibold text-gray-300">
                          $0.00
                        </span>
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
                    when={!merchant.transferStatisticsLoading()}
                    fallback={
                      <div class="flex items-center">
                        <svg
                          class="animate-spin h-6 w-6 text-indigo-600 mr-2"
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
                        <span class="text-3xl font-semibold text-gray-300">
                          $0.00
                        </span>
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
          <Show when={merchant.manualOrdersConfig()?.isConfigured}>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-1">
              {/* Recent Orders */}
              <div class="overflow-hidden bg-white rounded-lg shadow">
                <div class="p-6">
                  <div class="border-b border-gray-200 pb-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-sm font-medium text-gray-900">
                            Recent Orders
                          </h3>
                        </div>
                        <a
                          href="?tab=manual-orders"
                          class="mt-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          View all orders
                        </a>
                      </div>
                    </div>
                  </div>

                  <Show
                    when={
                      !merchant.ordersLoading() &&
                      (merchant.orders()?.items?.length || 0) > 0
                    }
                    fallback={
                      <div class="mt-4">
                        <Show when={merchant.ordersLoading()}>
                          <div class="space-y-3">
                            {Array.from({ length: 3 }).map(() => (
                              <div class="flex items-center justify-between py-3">
                                <div class="flex-1">
                                  <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                  <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>
                                <div class="flex items-center gap-4">
                                  <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                  <div class="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                  <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Show>
                        <Show when={!merchant.ordersLoading()}>
                          <div class="flex items-center justify-center h-16 opacity-50 text-sm">
                            No orders yet
                          </div>
                        </Show>
                      </div>
                    }
                  >
                    <div class="mt-4 divide-y divide-gray-200">
                      {(merchant.orders()?.items || [])
                        .slice(0, 5)
                        .map((order) => {
                          const orderDate = new Date(order.createdAt)
                          return (
                            <div class="py-3 first:pt-0 last:pb-0">
                              <div class="flex items-center justify-between">
                                <div class="min-w-0 flex-1">
                                  <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium text-gray-900 truncate">
                                      {order.description ||
                                        `Order ${order.id.substring(0, 8)}`}
                                    </p>
                                    <div class="ml-4 flex-shrink-0 flex items-center gap-4">
                                      <span class="text-sm text-gray-500">
                                        {formatCurrency(
                                          centsToDollars(order.amount)
                                        )}
                                      </span>
                                      <span
                                        class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          order.status === OrderStatus.PAID
                                            ? "bg-green-100 text-green-800"
                                            : order.status ===
                                                OrderStatus.PENDING
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {order.status}
                                      </span>
                                      <a
                                        href={`?tab=manual-orders&subtab=details&orderId=${order.id}`}
                                        class="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                      >
                                        View details
                                      </a>
                                    </div>
                                  </div>
                                  <p class="mt-1 text-xs text-gray-500">
                                    {formatDate(orderDate)}
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
          </Show>

          {/* Quick Actions */}
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="px-6 py-5 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Quick Actions</h3>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Show when={merchant.manualOrdersConfig()?.isConfigured}>
                  <a
                    href="?tab=manual-orders"
                    class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex-shrink-0">
                      <svg
                        class="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        Manual Orders
                      </p>
                      <p class="text-xs text-gray-500">Manage all orders</p>
                    </div>
                  </a>
                </Show>

                <a
                  href="?tab=transactions"
                  class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      Transactions
                    </p>
                    <p class="text-xs text-gray-500">View payment history</p>
                  </div>
                </a>

                <a
                  href="?tab=developers"
                  class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-purple-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Developers</p>
                    <p class="text-xs text-gray-500">API & integrations</p>
                  </div>
                </a>

                <a
                  href="?tab=settings"
                  class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Settings</p>
                    <p class="text-xs text-gray-500">Account preferences</p>
                  </div>
                </a>

                <Show when={!merchant.manualOrdersConfig()?.isConfigured}>
                  <a
                    href="?tab=manual-orders"
                    class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex-shrink-0">
                      <svg
                        class="h-6 w-6 text-orange-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        Setup Manual Orders
                      </p>
                      <p class="text-xs text-gray-500">
                        Configure manual orders
                      </p>
                    </div>
                  </a>
                </Show>
              </div>
            </div>
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
      </>
    </Show>
  )
}
