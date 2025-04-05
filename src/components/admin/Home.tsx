import { createMemo, createResource, createSignal } from "solid-js"

import { Show } from "solid-js"
import { api } from "../../services/api"
import { TransferStatus } from "../../types/api"

export const Home = () => {
  // Create data resources used in the overview tab
  const [period, setPeriod] = createSignal("Last 30 days")
  const [timeframe, setTimeframe] = createSignal("This month")
  const [showPeriodDropdown, setShowPeriodDropdown] = createSignal(false)
  const [showTimeframeDropdown, setShowTimeframeDropdown] = createSignal(false)
  const periodOptions = createMemo(() => [
    "Last 30 days",
    "Last 7 days",
    "Last 90 days",
    "Year to date",
    "All time",
  ])
  const timeframeOptions = createMemo(() => [
    "This month",
    "This week",
    "This quarter",
    "This year",
  ])

  // Fetch merchant transfers for overview tab
  const [merchantTransfers] = createResource(async () => {
    try {
      const response = await api.listMerchantTransfers()
      return response
    } catch (error) {
      console.error("Error fetching merchant transfers:", error)
      return { items: [] }
    }
  })

  // Filter transfers based on period for overview tab
  const filteredTransfers = createMemo(() => {
    if (!merchantTransfers() || !merchantTransfers()?.items) {
      return []
    }

    const transfers = merchantTransfers()?.items ?? []

    // Filter based on the selected period
    const today = new Date()
    let startDate: Date

    switch (period()) {
      case "Last 7 days":
        startDate = new Date(today.setDate(today.getDate() - 7))
        break
      case "Last 90 days":
        startDate = new Date(today.setDate(today.getDate() - 90))
        break
      case "Year to date":
        startDate = new Date(today.getFullYear(), 0, 1) // January 1st of current year
        break
      case "All time":
        return transfers
      case "Last 30 days":
      default:
        startDate = new Date(today.setDate(today.getDate() - 30))
        break
    }

    return transfers.filter((transfer) => {
      return transfer
      // const transferObject = await api.getMerchantTransfer(
      //   transfer.transferRequestId
      // )
      // const transferDate = new Date(transferObject.)
      // return transferDate >= startDate
    })
  })

  // Metrics calculations for overview tab
  const metrics = createMemo(() => {
    if (merchantTransfers.loading || !merchantTransfers()) {
      return {
        totalRevenue: 0,
        processingVolume: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        topTransactions: [],
        failedPayments: [],
        revenueChange: 0,
        volumeChange: 0,
      }
    }

    const transfers = filteredTransfers()

    // Calculate total revenue (just a simplified example)
    // In a real app, you'd calculate based on fee structure
    const totalRevenue = transfers.reduce(
      (sum: number, transfer) => sum + transfer.amount * 0.01, // 1% of transaction amount as revenue
      0
    )

    // Calculate processing volume
    const processingVolume = transfers.reduce(
      (sum: number, transfer) => sum + transfer.amount,
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
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Get failed payments
    const failedPayments = transfers.filter(
      (transfer) => transfer.status === TransferStatus.FAILED
    )

    // Calculate changes (mock data for now as we don't have previous period)
    // In a real app, you would compare with previous period data
    const revenueChange = totalRevenue > 0 ? 5.2 : 0 // 5.2% increase
    const volumeChange = processingVolume > 0 ? 3.8 : 0 // 3.8% increase

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get current time for "Updated at" text
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }
  return (
    <div class="space-y-8">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Your overview</h1>
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

            <span class="text-sm text-gray-500">compared to</span>

            <button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Previous period
            </button>

            <div class="relative">
              <button
                onClick={() =>
                  setShowTimeframeDropdown(!showTimeframeDropdown())
                }
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {timeframe()}
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

              {showTimeframeDropdown() && (
                <div class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    {timeframeOptions().map((option) => (
                      <button
                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setTimeframe(option)
                          setShowTimeframeDropdown(false)
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

          <button class="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
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
              <div
                class="ml-2"
                title="Estimated revenue from payment processing fees"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
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
              <div class="ml-auto">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{metrics().revenueChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div class="mt-2">
              <Show
                when={!merchantTransfers.loading}
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
                  <span class="ml-2 text-sm text-gray-500">
                    {formatCurrency(0)} previous period
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
              <div
                class="ml-2"
                title="Total volume of all transactions processed"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
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
              <div class="ml-auto">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{metrics().volumeChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div class="mt-2">
              <Show
                when={!merchantTransfers.loading}
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
                  <span class="ml-2 text-sm text-gray-500">
                    {formatCurrency(0)} previous period
                  </span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Transaction Success Rate */}
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex items-center">
              <h3 class="text-sm font-medium text-gray-900">
                Transaction Success
              </h3>
              <div
                class="ml-2"
                title="Successful transactions vs failed transactions"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
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
              <div class="ml-auto">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  0.0%
                </span>
              </div>
            </div>

            <div class="mt-2">
              <Show
                when={!merchantTransfers.loading}
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
                    {metrics().successfulTransactions}
                    <span class="text-lg font-normal text-gray-500">
                      {" "}
                      /{" "}
                      {metrics().successfulTransactions +
                        metrics().failedTransactions}
                    </span>
                  </span>
                  <span class="ml-2 text-sm text-gray-500">
                    {metrics().successfulTransactions > 0 &&
                    metrics().successfulTransactions +
                      metrics().failedTransactions >
                      0
                      ? (
                          (metrics().successfulTransactions /
                            (metrics().successfulTransactions +
                              metrics().failedTransactions)) *
                          100
                        ).toFixed(1) + "%"
                      : "0%"}{" "}
                    success rate
                  </span>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Top Transactions */}
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <h3 class="text-sm font-medium text-gray-900">
                  Top Transactions
                </h3>
                <div
                  class="ml-2"
                  title="Largest transactions in the selected period"
                >
                  <svg
                    class="w-4 h-4 text-gray-400"
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
              </div>
              <div class="text-xs text-gray-500">{period()}</div>
            </div>

            <Show
              when={metrics().topTransactions.length > 0}
              fallback={
                <div class="mt-4 flex items-center justify-center h-16 opacity-50 text-sm">
                  No transactions yet
                </div>
              }
            >
              <div class="mt-4 space-y-3">
                {metrics().topTransactions.map((transaction) => (
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900">
                      {transaction.transferRequestId.substring(0, 8)}...
                    </span>
                    <span class="text-sm text-gray-500">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
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
                {metrics().failedPayments.map((payment) => (
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {payment.transferRequestId.substring(0, 8)}...
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">
                        {/* Since MerchantTransfer doesn't have creationTime, use a placeholder */}
                        N/A
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Show>
      </div>

      {/* Footer with update information */}
      <div class="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
        <span>Last updated at {getCurrentTime()}</span>
        <div class="flex gap-4">
          <a href="#" class="text-indigo-600 hover:text-indigo-900">
            View all transactions
          </a>
          <a href="#" class="text-indigo-600 hover:text-indigo-900">
            Export data
          </a>
        </div>
      </div>
    </div>
  )
}
