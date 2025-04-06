import {
  Component,
  createResource,
  For,
  Show,
  createSignal,
  createMemo,
} from "solid-js"
import { api } from "../../services/api"
import type { MerchantTransferResponse } from "../../types/api"
import { TransferStatus } from "../../types/api"

const Transactions: Component = () => {
  const [error, setError] = createSignal<string | null>(null)

  // Convert cents to dollars
  const centsToDollars = (cents: number) => {
    return cents / 100
  }

  // Create resource for merchant transactions
  const [merchantTransactions] = createResource<MerchantTransferResponse>(
    async () => {
      try {
        const result = await api.listMerchantTransfers()
        return result
      } catch (err) {
        console.error("Error fetching merchant transfers:", err)
        setError("Failed to load merchant transfers")
        return { items: [] } as MerchantTransferResponse
      }
    }
  )

  // Calculate stats from merchant transfers data
  const stats = createMemo(() => {
    if (
      merchantTransactions.loading ||
      !merchantTransactions() ||
      !merchantTransactions()?.items
    ) {
      return {
        totalAmount: 0,
        pendingAmount: 0,
        completedAmount: 0,
        pendingCount: 0,
        completedCount: 0,
      }
    }

    const transfers = merchantTransactions()!.items

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
        <h1 class="text-2xl font-semibold text-gray-900">Merchant Transfers</h1>
        <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          + New Transfer
        </button>
      </div>

      {/* Stats Overview */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <h3 class="text-sm font-medium text-gray-500 mb-2">
              Total Amount Requested
            </h3>
            <Show
              when={!merchantTransactions.loading}
              fallback={
                <p class="text-2xl font-semibold text-gray-900">Loading...</p>
              }
            >
              <p class="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats().totalAmount)}
              </p>
              <p class="text-sm text-blue-600 mt-2">
                {merchantTransactions()?.items?.length || 0} total transfers
              </p>
            </Show>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Pending</h3>
            <Show
              when={!merchantTransactions.loading}
              fallback={
                <p class="text-2xl font-semibold text-gray-900">Loading...</p>
              }
            >
              <p class="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats().pendingAmount)}
              </p>
              <p class="text-sm text-yellow-600 mt-2">
                {stats().pendingCount}{" "}
                {stats().pendingCount === 1 ? "transfer" : "transfers"} pending
              </p>
            </Show>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Completed</h3>
            <Show
              when={!merchantTransactions.loading}
              fallback={
                <p class="text-2xl font-semibold text-gray-900">Loading...</p>
              }
            >
              <p class="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats().completedAmount)}
              </p>
              <p class="text-sm text-green-600 mt-2">
                {stats().completedCount}{" "}
                {stats().completedCount === 1 ? "transfer" : "transfers"}{" "}
                completed
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
              when={!merchantTransactions.loading}
              fallback={
                <tr>
                  <td
                    colSpan={5}
                    class="px-6 py-4 text-center text-sm text-gray-500"
                  >
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
                      <span>Loading merchant transfers...</span>
                    </div>
                  </td>
                </tr>
              }
            >
              <For each={merchantTransactions()?.items || []}>
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
                        class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === TransferStatus.COMPLETED
                            ? "bg-green-100 text-green-800"
                            : transaction.status === TransferStatus.IN_FLIGHT
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button class="text-blue-600 hover:text-blue-900">
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

      {/* Empty State */}
      <Show
        when={
          !merchantTransactions.loading &&
          (!merchantTransactions()?.items ||
            merchantTransactions()?.items.length === 0)
        }
      >
        <div class="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div class="p-8 text-center">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No transfers</h3>
            <p class="mt-1 text-sm text-gray-500">
              You haven't made any transfer requests yet.
            </p>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                New Transfer
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
  )
}

export default Transactions
