import { Component, createSignal, Show, For, onMount } from "solid-js"
import { Order } from "../../types/api"
import { api } from "../../services/api"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"
import { ManualOrderRow } from "./ManualOrderRow"
import { ManualOrderCard } from "./ManualOrderCard"

interface ManualOrdersListProps {
  onOrderClick: (orderId: string) => void
}

export const ManualOrdersList: Component<ManualOrdersListProps> = (props) => {
  const merchant = useMerchant()
  const [isLoadingMore, setIsLoadingMore] = createSignal(false)
  const [deletingOrder, setDeletingOrder] = createSignal<string | null>(null)
  const [sharingOrder, setSharingOrder] = createSignal<string | null>(null)
  const [copiedOrderId, setCopiedOrderId] = createSignal<string | null>(null)

  // Use cached orders data from context
  const ordersData = () => merchant.orders()
  const ordersLoading = () => merchant.ordersLoading()
  const ordersError = () => merchant.ordersError()

  // Ensure orders are loaded when component mounts
  onMount(() => {
    console.log(
      "ManualOrdersList: Component mounted, checking if orders need to be loaded"
    )
    if (!ordersData()) {
      console.log("ManualOrdersList: No cached orders, triggering initial load")
      merchant.refetchOrders()
    } else {
      console.log("ManualOrdersList: Using cached orders data")
    }
  })

  // Load more orders
  const loadMore = async () => {
    if (ordersData()?.continuationToken && !isLoadingMore()) {
      setIsLoadingMore(true)
      try {
        // For now, we'll just refetch all orders since the context doesn't support pagination yet
        // TODO: Add pagination support to the context
        await merchant.refetchOrders()
      } finally {
        setIsLoadingMore(false)
      }
    }
  }

  // Refresh orders
  const refreshOrders = async () => {
    await merchant.refetchOrders()
  }

  // Delete order
  const deleteOrder = async (orderId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      setDeletingOrder(orderId)
      try {
        await api.deleteOrder(orderId)
        toast.success("Order deleted successfully")
        await refreshOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
        toast.error("Failed to delete order. Please try again.")
      } finally {
        setDeletingOrder(null)
      }
    }
  }

  // Share order
  const shareOrder = async (orderId: string) => {
    setSharingOrder(orderId)
    try {
      const shareUrl = `${window.location.origin}/pay/${orderId}`

      if (navigator.share) {
        await navigator.share({
          title: "Payment Request",
          text: "Please complete your payment",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch (error) {
      console.error("Error sharing order:", error)
    } finally {
      setSharingOrder(null)
    }
  }

  // Copy order link
  const copyOrderLink = async (orderId: string) => {
    try {
      const shareUrl = `${window.location.origin}/pay/${orderId}`
      await navigator.clipboard.writeText(shareUrl)
      setCopiedOrderId(orderId)
      toast.success("Payment link copied to clipboard")

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedOrderId(null)
      }, 2000)
    } catch (error) {
      console.error("Error copying order link:", error)
      toast.error("Failed to copy link")
    }
  }

  return (
    <div class="pt-6 sm:pt-0">
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Manual Orders</h1>
          <p class="mt-1 text-sm text-gray-500">
            View and manage your manual orders
          </p>
        </div>
        <button
          onClick={refreshOrders}
          disabled={ordersLoading()}
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <svg
            class={`mr-2 h-4 w-4 ${ordersLoading() ? "animate-spin" : ""}`}
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

      {/* Orders Table - Only show when manual orders are configured */}
      <Show
        when={
          !merchant.manualOrdersConfigLoading() &&
          merchant.manualOrdersConfig()?.isConfigured
        }
      >
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <Show
            when={!ordersLoading()}
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
              when={ordersData()?.items && ordersData()!.items.length > 0}
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
                    No orders
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Get started by creating a new order.
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
                          Order
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th class="relative px-6 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <For each={ordersData()?.items}>
                        {(order: Order) => (
                          <ManualOrderRow
                            order={order}
                            onTitleClick={props.onOrderClick}
                            onCopyLink={copyOrderLink}
                            onShare={shareOrder}
                            onDelete={deleteOrder}
                            copiedOrderId={copiedOrderId()}
                            sharingOrderId={sharingOrder()}
                            deletingOrderId={deletingOrder()}
                          />
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div class="lg:hidden space-y-4">
                <For each={ordersData()?.items}>
                  {(order: Order) => (
                    <ManualOrderCard
                      order={order}
                      onTitleClick={props.onOrderClick}
                      onCopyLink={copyOrderLink}
                      onShare={shareOrder}
                      onDelete={deleteOrder}
                      copiedOrderId={copiedOrderId()}
                      sharingOrderId={sharingOrder()}
                      deletingOrderId={deletingOrder()}
                    />
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </Show>

      {/* Load More Button */}
      <Show when={ordersData()?.continuationToken}>
        <div class="pt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore()}
            class="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Show
              when={!isLoadingMore()}
              fallback={
                <>
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
                  Loading...
                </>
              }
            >
              Load More Orders
            </Show>
          </button>
        </div>
      </Show>

      {/* Error State */}
      <Show when={ordersError()}>
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
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
              <h3 class="text-sm font-medium text-red-800">
                Error loading orders
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>
                  {ordersError() instanceof Error
                    ? ordersError()!.message
                    : "An unexpected error occurred while loading orders."}
                </p>
              </div>
              <div class="mt-4">
                <button
                  onClick={refreshOrders}
                  class="bg-red-100 text-red-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
