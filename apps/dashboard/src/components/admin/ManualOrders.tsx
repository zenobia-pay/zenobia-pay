import { Component, createSignal, Show, For, onMount } from "solid-js"
import { api } from "../../services/api"
import { Order, OrderStatus } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"

export const ManualOrders: Component = () => {
  const merchant = useMerchant()
  const [isLoadingMore, setIsLoadingMore] = createSignal(false)
  const [editingOrder, setEditingOrder] = createSignal<Order | null>(null)
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
      "ManualOrders: Component mounted, checking if orders need to be loaded"
    )
    if (!ordersData()) {
      console.log("ManualOrders: No cached orders, triggering initial load")
      merchant.refetchOrders()
    } else {
      console.log("ManualOrders: Using cached orders data")
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

  // Update order
  const updateOrder = async (order: Order, updates: Partial<Order>) => {
    try {
      await api.updateOrder(order.id, {
        description: updates.description,
        amount: updates.amount,
      })
      toast.success("Order updated successfully")
      setEditingOrder(null)
      await refreshOrders()
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order. Please try again.")
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100) // Convert cents to dollars
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

  // Get status badge color
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
        return "bg-green-100 text-green-800"
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      case OrderStatus.EXPIRED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status display name
  const getStatusDisplayName = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
        return "Paid"
      case OrderStatus.PENDING:
        return "Pending"
      case OrderStatus.CANCELLED:
        return "Cancelled"
      case OrderStatus.EXPIRED:
        return "Expired"
      default:
        return status
    }
  }

  return (
    <div class="space-y-6">
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

      {/* Manual Orders Configuration Check */}
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
                    You need to configure manual orders before you can view
                    them. This will generate the necessary API credentials for
                    processing payments.
                  </p>
                </div>
                <div class="mt-4">
                  <button
                    onClick={async () => {
                      try {
                        const result = await merchant.setupManualOrders()
                        if (result.success) {
                          toast.success(
                            "Manual orders configured successfully!"
                          )
                          await merchant.refetchManualOrdersConfig()
                        } else {
                          toast.error(
                            result.error || "Failed to configure manual orders"
                          )
                        }
                      } catch (error) {
                        console.error("Error setting up manual orders:", error)
                        toast.error("Failed to configure manual orders")
                      }
                    }}
                    class="bg-yellow-100 text-yellow-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Configure Manual Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

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
                                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                  </svg>
                                </div>
                                <div class="ml-4">
                                  <div class="text-sm font-medium text-gray-900">
                                    {order.description || "No description"}
                                  </div>
                                  <div class="text-sm text-gray-500 font-mono">
                                    {order.id.substring(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                  order.status
                                )}`}
                              >
                                {getStatusDisplayName(order.status)}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(order.amount)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div class="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => copyOrderLink(order.id)}
                                  class={`p-2 rounded-md transition-colors ${
                                    copiedOrderId() === order.id
                                      ? "text-green-600 bg-green-50"
                                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                  }`}
                                  title={
                                    copiedOrderId() === order.id
                                      ? "Copied!"
                                      : "Copy payment link"
                                  }
                                >
                                  <Show
                                    when={copiedOrderId() !== order.id}
                                    fallback={
                                      <svg
                                        class="h-4 w-4"
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
                                    }
                                  >
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </Show>
                                </button>
                                <button
                                  onClick={() => shareOrder(order.id)}
                                  disabled={sharingOrder() === order.id}
                                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Share payment link"
                                >
                                  <Show
                                    when={sharingOrder() !== order.id}
                                    fallback={
                                      <svg
                                        class="animate-spin h-4 w-4"
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
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                      />
                                    </svg>
                                  </Show>
                                </button>
                                <button
                                  onClick={() => setEditingOrder(order)}
                                  class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                  title="Edit order"
                                >
                                  <svg
                                    class="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteOrder(order.id)}
                                  disabled={deletingOrder() === order.id}
                                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Delete order"
                                >
                                  <Show
                                    when={deletingOrder() !== order.id}
                                    fallback={
                                      <svg
                                        class="animate-spin h-4 w-4"
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
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </Show>
                                </button>
                              </div>
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
                <For each={ordersData()?.items}>
                  {(order: Order) => (
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      {/* Order Header */}
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center space-x-3 min-w-0 flex-1">
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
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                            </svg>
                          </div>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center space-x-2">
                              <p class="text-sm font-medium text-gray-900 truncate">
                                {order.description || "No description"}
                              </p>
                              <span
                                class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadgeClass(
                                  order.status
                                )}`}
                              >
                                {getStatusDisplayName(order.status)}
                              </span>
                            </div>
                            <p class="text-sm text-gray-500 font-mono truncate">
                              {order.id}
                            </p>
                          </div>
                        </div>
                        <div class="text-right flex-shrink-0 ml-2">
                          <p class="text-lg font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div class="mb-4">
                        <p class="text-sm text-gray-500">
                          Created: {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div class="flex items-center space-x-1">
                          {/* Copy Link Button */}
                          <button
                            onClick={() => copyOrderLink(order.id)}
                            class={`p-2 rounded-md transition-colors ${
                              copiedOrderId() === order.id
                                ? "text-green-600 bg-green-50"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                            title={
                              copiedOrderId() === order.id
                                ? "Copied!"
                                : "Copy payment link"
                            }
                          >
                            <Show
                              when={copiedOrderId() !== order.id}
                              fallback={
                                <svg
                                  class="h-4 w-4"
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
                              }
                            >
                              <svg
                                class="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </Show>
                          </button>

                          {/* Share Button */}
                          <button
                            onClick={() => shareOrder(order.id)}
                            disabled={sharingOrder() === order.id}
                            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Share payment link"
                          >
                            <Show
                              when={sharingOrder() !== order.id}
                              fallback={
                                <svg
                                  class="animate-spin h-4 w-4"
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
                                class="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                />
                              </svg>
                            </Show>
                          </button>
                        </div>

                        <div class="flex items-center space-x-1">
                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingOrder(order)}
                            class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Edit order"
                          >
                            <svg
                              class="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            disabled={deletingOrder() === order.id}
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete order"
                          >
                            <Show
                              when={deletingOrder() !== order.id}
                              fallback={
                                <svg
                                  class="animate-spin h-4 w-4"
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
                                class="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </Show>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </div>

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
      </Show>

      {/* Edit Order Modal */}
      <Show when={editingOrder()}>
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-4 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Order</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingOrder()?.description || ""}
                    onInput={(e) => {
                      const order = editingOrder()
                      if (order) {
                        setEditingOrder({
                          ...order,
                          description: e.currentTarget.value,
                        })
                      }
                    }}
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                    placeholder="Enter order description"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Amount (cents)
                  </label>
                  <input
                    type="number"
                    value={editingOrder()?.amount || 0}
                    onInput={(e) => {
                      const order = editingOrder()
                      if (order) {
                        setEditingOrder({
                          ...order,
                          amount: parseInt(e.currentTarget.value) || 0,
                        })
                      }
                    }}
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                    placeholder="Enter amount in cents"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    Example: 1000 = $10.00
                  </p>
                </div>
                <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => setEditingOrder(null)}
                    class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const order = editingOrder()
                      if (order) {
                        updateOrder(order, {
                          description: order.description,
                          amount: order.amount,
                        })
                      }
                    }}
                    class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
