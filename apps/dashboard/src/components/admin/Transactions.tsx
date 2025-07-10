import {
  Component,
  For,
  Show,
  createMemo,
  createSignal,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js"
import { TransferStatus, GetMerchantTransferResponse } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { api } from "../../services/api"
import { useLocation, useNavigate } from "@solidjs/router"

interface OrderDetails {
  orderId: string
  merchantId: string
  amount: number
  description: string | null
  status: string
  transferRequestId: string | null
  merchantDisplayName: string | null
  createdAt: string
  updatedAt: string
}

const Transactions: Component = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const merchant = useMerchant()
  const [selectedTransaction, setSelectedTransaction] =
    createSignal<GetMerchantTransferResponse | null>(null)
  const [loadingTransaction, setLoadingTransaction] = createSignal(false)
  const [includeNotStarted, setIncludeNotStarted] = createSignal(false)
  const [orderDetails, setOrderDetails] = createSignal<OrderDetails | null>(
    null
  )
  const [loadingOrderDetails, setLoadingOrderDetails] = createSignal(false)

  // Date filter state
  const [dateFilter, setDateFilter] = createSignal("last30days")
  const [showDateDropdown, setShowDateDropdown] = createSignal(false)
  const [customStartDate, setCustomStartDate] = createSignal("")
  const [customEndDate, setCustomEndDate] = createSignal("")

  const dateFilterOptions = createMemo(() => [
    "All Time",
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "Custom Range",
  ])

  // Auto-load more on scroll
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (
      merchant.hasMoreTransfers() &&
      !merchant.merchantTransfersLoading() &&
      activeSubtab() === "list"
    ) {
      const scrollTop = target.scrollTop
      const clientHeight = target.clientHeight
      const scrollHeight = target.scrollHeight

      // Load more when user is within 200px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        merchant.loadMoreTransfers()
      }
    }
  }

  // Add scroll listener on mount, remove on cleanup
  onMount(() => {
    // Find the main content element that has overflow-y-auto
    const mainElement = document.querySelector('main[class*="overflow-y-auto"]')
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll)
    }
  })

  onCleanup(() => {
    const mainElement = document.querySelector('main[class*="overflow-y-auto"]')
    if (mainElement) {
      mainElement.removeEventListener("scroll", handleScroll)
    }
  })

  const activeSubtab = () => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get("tab")
    if (tab !== "transactions") return "list"

    const subtab = searchParams.get("subtab")
    if (subtab === "details") return "details"
    return "list"
  }

  // Load transaction details when URL changes
  createEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const transactionId = searchParams.get("transactionId")

    if (transactionId && activeSubtab() === "details") {
      setLoadingTransaction(true)
      setLoadingOrderDetails(true)

      // Load transaction details first (this is the main content)
      api
        .getMerchantTransfer(transactionId)
        .then((response) => {
          setSelectedTransaction(response)
          setLoadingTransaction(false)
        })
        .catch((error) => {
          console.error("Error loading transaction:", error)
          setLoadingTransaction(false)
        })

      // Load order details in parallel (this is supplementary information)
      api
        .getOrderDetailsForTransaction(transactionId)
        .then((response) => {
          setOrderDetails(response)
        })
        .catch((error) => {
          console.error("Error loading order details:", error)
          // Don't set error state if order details fail to load, as not all transactions have orders
        })
        .finally(() => {
          setLoadingOrderDetails(false)
        })
    } else {
      setSelectedTransaction(null)
      setOrderDetails(null)
    }
  })

  // Convert cents to dollars
  const centsToDollars = (cents: number) => {
    return cents / 100
  }

  // Get user-friendly status display
  const getStatusDisplay = (status: TransferStatus) => {
    switch (status) {
      case TransferStatus.PAID:
        return "PAID"
      case TransferStatus.SETTLED:
        return "SETTLED"
      case TransferStatus.FAILED:
        return "FAILED"
      case TransferStatus.CANCELLED:
        return "CANCELLED"
      case TransferStatus.NOT_STARTED:
        return "NOT STARTED"
      default:
        return status
    }
  }

  // Get status badge styling
  const getStatusBadgeClass = (status: TransferStatus) => {
    switch (status) {
      case TransferStatus.PAID:
        return "bg-green-100 text-green-800"
      case TransferStatus.SETTLED:
        return "bg-blue-100 text-blue-800"
      case TransferStatus.FAILED:
        return "bg-red-100 text-red-800"
      case TransferStatus.CANCELLED:
        return "bg-gray-100 text-gray-800"
      case TransferStatus.NOT_STARTED:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter transfers based on includeNotStarted setting
  const filteredTransfers = createMemo(() => {
    if (
      merchant.merchantTransfersLoading() ||
      !merchant.allMerchantTransfers() ||
      merchant.allMerchantTransfers().length === 0
    ) {
      return []
    }

    const transfers = merchant.allMerchantTransfers()

    if (includeNotStarted()) {
      return transfers
    }

    return transfers.filter(
      (transfer) => transfer.status !== TransferStatus.NOT_STARTED
    )
  })

  // Get date range based on filter
  const getDateRange = () => {
    const now = new Date()
    const startDate = new Date()

    switch (dateFilter()) {
      case "today": {
        startDate.setHours(0, 0, 0, 0)
        return { start: startDate, end: now }
      }
      case "yesterday": {
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        return { start: startDate, end: endDate }
      }
      case "last7days": {
        startDate.setDate(startDate.getDate() - 7)
        return { start: startDate, end: now }
      }
      case "last30days": {
        startDate.setDate(startDate.getDate() - 30)
        return { start: startDate, end: now }
      }
      case "last90days": {
        startDate.setDate(startDate.getDate() - 90)
        return { start: startDate, end: now }
      }
      case "custom": {
        const customStart = customStartDate()
          ? new Date(customStartDate())
          : null
        const customEnd = customEndDate() ? new Date(customEndDate()) : null
        return { start: customStart, end: customEnd }
      }
      default:
        return { start: null, end: null }
    }
  }

  // Filter transfers based on date range
  const dateFilteredTransfers = createMemo(() => {
    const transfers = filteredTransfers()
    const { start, end } = getDateRange()

    if (!start && !end) return transfers

    return transfers.filter(() => {
      // For now, we'll use a simple approach since we don't have creation dates
      // In a real implementation, you'd filter by actual transfer creation dates
      // This is a placeholder that shows all transfers when date filtering is applied
      return true
    })
  })

  // Calculate stats from filtered transfers data
  const stats = createMemo(() => {
    if (
      merchant.merchantTransfersLoading() ||
      !merchant.allMerchantTransfers() ||
      merchant.allMerchantTransfers().length === 0
    ) {
      return {
        totalGrossAmount: 0,
        totalNetAmount: 0,
        pendingGrossAmount: 0,
        pendingNetAmount: 0,
        completedGrossAmount: 0,
        completedNetAmount: 0,
        pendingCount: 0,
        completedCount: 0,
        totalFees: 0,
      }
    }

    const transfers = dateFilteredTransfers()

    // Calculate amounts
    let totalGrossAmount = 0
    let totalNetAmount = 0
    let pendingGrossAmount = 0
    let pendingNetAmount = 0
    let completedGrossAmount = 0
    let completedNetAmount = 0
    let pendingCount = 0
    let completedCount = 0
    let totalFees = 0

    transfers.forEach((transfer) => {
      const grossAmount = centsToDollars(transfer.amount || 0)
      const fee =
        transfer.fee !== null && transfer.fee !== undefined
          ? centsToDollars(transfer.fee)
          : 0
      const netAmount = grossAmount - fee

      // Add to totals
      totalGrossAmount += grossAmount
      totalNetAmount += netAmount

      // Add fees if they exist
      if (transfer.fee !== null && transfer.fee !== undefined) {
        totalFees += fee
      }

      if (transfer.status === TransferStatus.PAID) {
        pendingGrossAmount += grossAmount
        pendingNetAmount += netAmount
        pendingCount++
      } else if (transfer.status === TransferStatus.SETTLED) {
        completedGrossAmount += grossAmount
        completedNetAmount += netAmount
        completedCount++
      }
    })

    return {
      totalGrossAmount,
      totalNetAmount,
      pendingGrossAmount,
      pendingNetAmount,
      completedGrossAmount,
      completedNetAmount,
      pendingCount,
      completedCount,
      totalFees,
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      {/* Transaction Details View */}
      <Show when={activeSubtab() === "details"}>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                Transaction Details
              </h3>
              <button
                onClick={() => navigate("?tab=transactions")}
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  class="h-4 w-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Back to Transactions
              </button>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <Show
              when={!loadingTransaction()}
              fallback={
                <div class="flex justify-center items-center py-8">
                  <div class="text-center">
                    <svg
                      class="animate-spin h-8 w-8 text-indigo-600 mx-auto"
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
                    <p class="mt-2 text-sm text-gray-500">
                      Loading transaction details...
                    </p>
                  </div>
                </div>
              }
            >
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Transfer ID</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {selectedTransaction()?.transferRequestId}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1">
                    <span
                      class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        selectedTransaction()?.status ||
                          TransferStatus.NOT_STARTED
                      )}`}
                    >
                      {getStatusDisplay(
                        selectedTransaction()?.status ||
                          TransferStatus.NOT_STARTED
                      )}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Total Amount
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {selectedTransaction()?.statementItems &&
                    selectedTransaction()!.statementItems.length > 0
                      ? formatCurrency(
                          centsToDollars(
                            selectedTransaction()!.statementItems.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            )
                          )
                        )
                      : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Merchant</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {selectedTransaction()?.merchant?.name || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Fee</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {selectedTransaction()?.fee !== null &&
                    selectedTransaction()?.fee !== undefined
                      ? formatCurrency(
                          centsToDollars(selectedTransaction()!.fee!)
                        )
                      : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Creation Time
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {selectedTransaction()?.creationTime
                      ? formatDate(selectedTransaction()!.creationTime)
                      : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Payout Time</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {(() => {
                      const payoutTime = selectedTransaction()?.payoutTime
                      return payoutTime && typeof payoutTime === "string"
                        ? formatDate(payoutTime)
                        : "N/A"
                    })()}
                  </dd>
                </div>
              </dl>

              {/* Statement Items Section */}
              <Show
                when={
                  selectedTransaction()?.statementItems &&
                  selectedTransaction()!.statementItems.length > 0
                }
              >
                <div class="mt-8 border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-medium text-gray-900 mb-4">
                    Statement Items
                  </h4>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="space-y-3">
                      <For each={selectedTransaction()?.statementItems}>
                        {(item) => (
                          <div class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                            <div class="flex-1">
                              <div class="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <Show when={item.itemId}>
                                <div class="text-xs text-gray-500">
                                  ID: {item.itemId}
                                </div>
                              </Show>
                            </div>
                            <div class="text-sm font-medium text-gray-900">
                              {formatCurrency(centsToDollars(item.amount))}
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </Show>

              {/* Order Details Section */}
              <Show when={orderDetails()}>
                <div class="mt-8 border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-medium text-gray-900 mb-4">
                    Associated Order
                  </h4>
                  <Show
                    when={!loadingOrderDetails()}
                    fallback={
                      <div class="flex justify-center items-center py-4">
                        <div class="text-center">
                          <svg
                            class="animate-spin h-5 w-5 text-indigo-600 mx-auto"
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
                          <p class="mt-1 text-sm text-gray-500">
                            Loading order details...
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <div class="bg-gray-50 rounded-lg p-4">
                      <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-2">
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Order ID
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.orderId}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Order Status
                          </dt>
                          <dd class="mt-1">
                            <span
                              class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                orderDetails()?.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : orderDetails()?.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : orderDetails()?.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {orderDetails()?.status?.toUpperCase()}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Amount
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {formatCurrency(
                              centsToDollars(orderDetails()?.amount || 0)
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Merchant
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.merchantDisplayName || "N/A"}
                          </dd>
                        </div>
                        <div class="sm:col-span-2">
                          <dt class="text-sm font-medium text-gray-500">
                            Description
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.description || "No description"}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Created
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.createdAt
                              ? formatDate(orderDetails()!.createdAt)
                              : "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Updated
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.updatedAt
                              ? formatDate(orderDetails()!.updatedAt)
                              : "N/A"}
                          </dd>
                        </div>
                      </dl>
                      <div class="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={`/?tab=manual-orders&subtab=details&orderId=${orderDetails()?.orderId}`}
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Order Details
                          <svg
                            class="ml-2 -mr-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </Show>
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </Show>

      {/* Transactions List View */}
      <Show when={activeSubtab() === "list"}>
        <div class="pt-6 sm:pt-0">
          {/* Header */}
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Transactions</h1>
              <p class="mt-1 text-sm text-gray-500">
                View and manage your payment transactions
              </p>
            </div>
            <button
              onClick={() => merchant.refetchMerchantTransfers()}
              disabled={merchant.merchantTransfersLoading()}
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg
                class={`mr-2 h-4 w-4 ${merchant.merchantTransfersLoading() ? "animate-spin" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Include Not Started Checkbox */}
          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                checked={includeNotStarted()}
                onChange={(e) => setIncludeNotStarted(e.target.checked)}
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">
                Include "Not Started" transfers
              </span>
            </label>
          </div>

          {/* Date Filter */}
          <div class="mb-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="w-64">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div class="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown())}
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full justify-between"
                  >
                    {dateFilterOptions().find((option, index) => {
                      const values = [
                        "all",
                        "today",
                        "yesterday",
                        "last7days",
                        "last30days",
                        "last90days",
                        "custom",
                      ]
                      return values[index] === dateFilter()
                    }) || "All Time"}
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

                  {showDateDropdown() && (
                    <div class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        {dateFilterOptions().map((option, index) => {
                          const values = [
                            "all",
                            "today",
                            "yesterday",
                            "last7days",
                            "last30days",
                            "last90days",
                            "custom",
                          ]
                          return (
                            <button
                              class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setDateFilter(values[index])
                                setShowDateDropdown(false)
                              }}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Show when={dateFilter() === "custom"}>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate()}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate()}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </Show>
            </div>
          </div>

          {/* Stats Overview */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-5">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Settled</h3>
                <Show
                  when={!merchant.merchantTransfersLoading()}
                  fallback={
                    <p class="text-2xl font-semibold text-gray-900">
                      Loading...
                    </p>
                  }
                >
                  <p class="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats().completedNetAmount)}
                  </p>
                  <p class="text-sm text-blue-600 mt-2">
                    {stats().completedCount}{" "}
                    {stats().completedCount === 1 ? "transfer" : "transfers"}{" "}
                    settled
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Gross: {formatCurrency(stats().completedGrossAmount)}
                  </p>
                </Show>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-5">
                <h3 class="text-sm font-medium text-gray-500 mb-2">
                  Pending Payout
                </h3>
                <Show
                  when={!merchant.merchantTransfersLoading()}
                  fallback={
                    <p class="text-2xl font-semibold text-gray-900">
                      Loading...
                    </p>
                  }
                >
                  <p class="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats().pendingNetAmount)}
                  </p>
                  <p class="text-sm text-green-600 mt-2">
                    {stats().pendingCount}{" "}
                    {stats().pendingCount === 1 ? "transfer" : "transfers"}{" "}
                    pending
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Gross: {formatCurrency(stats().pendingGrossAmount)}
                  </p>
                </Show>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-5">
                <h3 class="text-sm font-medium text-gray-500 mb-2">
                  Total Net
                </h3>
                <Show
                  when={!merchant.merchantTransfersLoading()}
                  fallback={
                    <p class="text-2xl font-semibold text-gray-900">
                      Loading...
                    </p>
                  }
                >
                  <p class="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats().totalNetAmount)}
                  </p>
                  <p class="text-sm text-indigo-600 mt-2">
                    Net amount after fees
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Gross: {formatCurrency(stats().totalGrossAmount)}
                  </p>
                </Show>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-5">
                <h3 class="text-sm font-medium text-gray-500 mb-2">
                  Total Fees
                </h3>
                <Show
                  when={!merchant.merchantTransfersLoading()}
                  fallback={
                    <p class="text-2xl font-semibold text-gray-900">
                      Loading...
                    </p>
                  }
                >
                  <p class="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats().totalFees)}
                  </p>
                  <p class="text-sm text-purple-600 mt-2">
                    Across all transfers
                  </p>
                </Show>
              </div>
            </div>
          </div>

          {/* Merchant Transactions Table */}
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <Show
              when={!merchant.merchantTransfersLoading()}
              fallback={
                <div class="flex justify-center items-center py-12">
                  <svg
                    class="animate-spin h-8 w-8 text-indigo-600"
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
              <Show
                when={filteredTransfers().length > 0}
                fallback={
                  <div class="text-center py-12">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">
                      No transactions
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Transactions will appear here once payments are processed.
                    </p>
                  </div>
                }
              >
                {/* Desktop Table View */}
                <div class="hidden lg:block">
                  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gross Amount
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payout
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <For each={filteredTransfers()}>
                          {(transaction) => (
                            <tr class="hover:bg-gray-50">
                              <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <svg
                                      class="h-6 w-6 text-indigo-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                  </div>
                                  <div class="ml-4">
                                    <div
                                      class="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline"
                                      onClick={() =>
                                        navigate(
                                          `?tab=transactions&subtab=details&transactionId=${transaction.transferRequestId}`
                                        )
                                      }
                                    >
                                      {transaction.customerName ||
                                        "Unknown Customer"}
                                    </div>
                                    <div class="text-xs text-gray-400">
                                      {transaction.transferRequestId}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                  class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                    transaction.status
                                  )}`}
                                >
                                  {getStatusDisplay(transaction.status)}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(
                                  centsToDollars(transaction.amount)
                                )}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.fee !== null &&
                                transaction.fee !== undefined
                                  ? formatCurrency(
                                      centsToDollars(transaction.fee)
                                    )
                                  : "N/A"}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.creationTime
                                  ? formatDate(transaction.creationTime)
                                  : "N/A"}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.payoutTime &&
                                typeof transaction.payoutTime === "string"
                                  ? formatDate(transaction.payoutTime)
                                  : "N/A"}
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div class="lg:hidden space-y-4">
                  <For each={filteredTransfers()}>
                    {(transaction) => (
                      <div class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div class="flex items-start justify-between">
                          <div class="flex items-center flex-1 min-w-0">
                            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <svg
                                class="h-6 w-6 text-indigo-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div class="ml-3 flex-1 min-w-0">
                              <div
                                class="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline truncate"
                                onClick={() =>
                                  navigate(
                                    `?tab=transactions&subtab=details&transactionId=${transaction.transferRequestId}`
                                  )
                                }
                              >
                                {transaction.customerName || "Unknown Customer"}
                              </div>
                              <div class="text-xs text-gray-400 truncate">
                                {transaction.transferRequestId}
                              </div>
                            </div>
                          </div>
                          <div class="ml-4 flex flex-col items-end">
                            <span
                              class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                transaction.status
                              )}`}
                            >
                              {getStatusDisplay(transaction.status)}
                            </span>
                            <div class="mt-1 text-sm font-medium text-gray-900">
                              {formatCurrency(
                                centsToDollars(transaction.amount)
                              )}
                            </div>
                            <div class="text-xs text-gray-500">
                              {transaction.fee !== null &&
                              transaction.fee !== undefined
                                ? `Fee: ${formatCurrency(centsToDollars(transaction.fee))}`
                                : ""}
                            </div>
                            <div class="text-xs text-gray-500">
                              {transaction.creationTime
                                ? formatDate(transaction.creationTime)
                                : "N/A"}
                            </div>
                            <div class="text-xs text-gray-500">
                              {transaction.payoutTime &&
                              typeof transaction.payoutTime === "string"
                                ? `Payout: ${formatDate(transaction.payoutTime)}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </div>

          {/* Loading indicator for auto-load */}
          <Show
            when={
              merchant.merchantTransfersLoading() && merchant.hasMoreTransfers()
            }
          >
            <div class="mt-6 flex justify-center">
              <div class="inline-flex items-center px-4 py-2 text-sm text-gray-500">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
                Loading more transfers...
              </div>
            </div>
          </Show>

          {/* End of transfers indicator */}
          <Show
            when={
              !merchant.hasMoreTransfers() && filteredTransfers().length > 0
            }
          >
            <div class="mt-6 flex justify-center">
              <div class="text-sm text-gray-500">No more transfers to load</div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default Transactions
