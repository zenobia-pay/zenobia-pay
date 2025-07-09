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

      // Load transaction details
      api
        .getMerchantTransfer(transactionId)
        .then((response) => {
          setSelectedTransaction(response)
        })
        .catch((error) => {
          console.error("Error loading transaction:", error)
        })
        .finally(() => {
          setLoadingTransaction(false)
        })

      // Load order details for this transaction
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
      case TransferStatus.IN_FLIGHT:
        return "PAID"
      case TransferStatus.COMPLETED:
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
      case TransferStatus.IN_FLIGHT:
        return "bg-green-100 text-green-800"
      case TransferStatus.COMPLETED:
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

  // Calculate stats from filtered transfers data
  const stats = createMemo(() => {
    if (
      merchant.merchantTransfersLoading() ||
      !merchant.allMerchantTransfers() ||
      merchant.allMerchantTransfers().length === 0
    ) {
      return {
        totalAmount: 0,
        pendingAmount: 0,
        completedAmount: 0,
        pendingCount: 0,
        completedCount: 0,
      }
    }

    const transfers = filteredTransfers()

    // Calculate total amounts
    let totalAmount = 0
    let pendingAmount = 0
    let completedAmount = 0
    let pendingCount = 0
    let completedCount = 0

    transfers.forEach((transfer) => {
      const amount = centsToDollars(transfer.amount || 0)
      totalAmount += amount

      if (transfer.status === TransferStatus.IN_FLIGHT) {
        pendingAmount += amount
        pendingCount++
      } else if (transfer.status === TransferStatus.COMPLETED) {
        completedAmount += amount
        completedCount++
      }
    })

    return {
      totalAmount,
      pendingAmount,
      completedAmount,
      pendingCount,
      completedCount,
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

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Transactions List</h1>
        <button
          onClick={() => merchant.refetchMerchantTransfers()}
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
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>

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
                class="text-gray-400 hover:text-gray-500"
              >
                <svg
                  class="h-6 w-6"
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
              </button>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <Show
              when={!loadingTransaction()}
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
              </dl>

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
                        <span class="ml-2 text-sm text-gray-500">
                          Loading order details...
                        </span>
                      </div>
                    }
                  >
                    <div class="bg-gray-50 rounded-lg p-4">
                      <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
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
                              ? new Date(
                                  orderDetails()!.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">
                            Updated
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            {orderDetails()?.updatedAt
                              ? new Date(
                                  orderDetails()!.updatedAt
                                ).toLocaleDateString()
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

        {/* Stats Overview */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Total Amount Requested
              </h3>
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <p class="text-2xl font-semibold text-gray-900">Loading...</p>
                }
              >
                <p class="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats().totalAmount)}
                </p>
                <p class="text-sm text-blue-600 mt-2">
                  {filteredTransfers().length} total transfers
                </p>
              </Show>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Paid</h3>
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <p class="text-2xl font-semibold text-gray-900">Loading...</p>
                }
              >
                <p class="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats().pendingAmount)}
                </p>
                <p class="text-sm text-green-600 mt-2">
                  {stats().pendingCount}{" "}
                  {stats().pendingCount === 1 ? "transfer" : "transfers"} paid
                </p>
              </Show>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Settled</h3>
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <p class="text-2xl font-semibold text-gray-900">Loading...</p>
                }
              >
                <p class="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats().completedAmount)}
                </p>
                <p class="text-sm text-blue-600 mt-2">
                  {stats().completedCount}{" "}
                  {stats().completedCount === 1 ? "transfer" : "transfers"}{" "}
                  settled
                </p>
              </Show>
            </div>
          </div>
        </div>

        {/* Merchant Transactions Table */}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transfer ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <Show
                when={!merchant.merchantTransfersLoading()}
                fallback={
                  <tr>
                    <td
                      colSpan={5}
                      class="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      <div class="flex justify-center">
                        <svg
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
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
                        <span>Loading merchant transfers...</span>
                      </div>
                    </td>
                  </tr>
                }
              >
                <For each={filteredTransfers()}>
                  {(transaction) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transferRequestId || "N/A"}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(centsToDollars(transaction.amount))}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        N/A
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
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            navigate(
                              `?tab=transactions&subtab=details&transactionId=${transaction.transferRequestId}`
                            )
                          }
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
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
          when={!merchant.hasMoreTransfers() && filteredTransfers().length > 0}
        >
          <div class="mt-6 flex justify-center">
            <div class="text-sm text-gray-500">No more transfers to load</div>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default Transactions
