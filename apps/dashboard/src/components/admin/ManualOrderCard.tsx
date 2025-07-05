import { Component, Show } from "solid-js"
import { Order, OrderStatus } from "../../types/api"

interface ManualOrderCardProps {
  order: Order
  onTitleClick: (orderId: string) => void
  onCopyLink: (orderId: string) => void
  onShare: (orderId: string) => void
  onDelete: (orderId: string) => void
  copiedOrderId: string | null
  sharingOrderId: string | null
  deletingOrderId: string | null
}

export const ManualOrderCard: Component<ManualOrderCardProps> = (props) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100)
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
    <div class="bg-white border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors shadow-sm">
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
              <p
                class="text-base font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline break-words whitespace-normal"
                onClick={() => props.onTitleClick(props.order.id)}
              >
                {props.order.description || "No title"}
              </p>
              <span
                class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadgeClass(
                  props.order.status
                )}`}
              >
                {getStatusDisplayName(props.order.status)}
              </span>
            </div>
            <Show when={props.order.merchantDisplayName}>
              <p class="text-xs text-gray-400 truncate">
                {props.order.merchantDisplayName}
              </p>
            </Show>
          </div>
        </div>
        <div class="text-right flex-shrink-0 ml-2">
          <p class="text-lg font-semibold text-gray-900">
            {formatCurrency(props.order.amount)}
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div class="mb-4">
        <p class="text-sm text-gray-500">
          Created: {formatDate(props.order.createdAt)}
        </p>
      </div>

      {/* Action Buttons */}
      <Show when={props.order.status !== OrderStatus.PAID}>
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-center space-x-1">
            {/* Copy Link Button */}
            <button
              onClick={() => props.onCopyLink(props.order.id)}
              class={`p-2 rounded-md transition-colors ${
                props.copiedOrderId === props.order.id
                  ? "text-green-600 bg-green-50"
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title={
                props.copiedOrderId === props.order.id
                  ? "Copied!"
                  : "Copy payment link"
              }
            >
              <Show
                when={props.copiedOrderId !== props.order.id}
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

            {/* QR Code Button */}
            <button
              onClick={() => window.open(`/pay/${props.order.id}`, "_blank")}
              class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Open payment QR in new tab"
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
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </button>

            {/* Share Button */}
            <button
              onClick={() => props.onShare(props.order.id)}
              disabled={props.sharingOrderId === props.order.id}
              class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Share payment link"
            >
              <Show
                when={props.sharingOrderId !== props.order.id}
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
            {/* Delete Button */}
            <button
              onClick={() => props.onDelete(props.order.id)}
              disabled={
                props.deletingOrderId === props.order.id ||
                props.order.status !== OrderStatus.PENDING
              }
              class={`p-2 rounded-md transition-colors ${
                props.order.status !== OrderStatus.PENDING
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
              title={
                props.order.status !== OrderStatus.PENDING
                  ? "Cannot delete paid, cancelled, or expired orders"
                  : "Delete order"
              }
            >
              <Show
                when={props.deletingOrderId !== props.order.id}
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
      </Show>
    </div>
  )
}
