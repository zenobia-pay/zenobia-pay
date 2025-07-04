import { Component, createSignal, Show, onMount } from "solid-js"
import { Order, OrderStatus } from "../../types/api"
import { api } from "../../services/api"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"

interface ManualOrderDetailsProps {
  order: Order
  onClose: () => void
}

export const ManualOrderDetails: Component<ManualOrderDetailsProps> = (
  props
) => {
  const merchant = useMerchant()
  const [editTitle, setEditTitle] = createSignal("")
  const [editAmount, setEditAmount] = createSignal("")
  const [isSaving, setIsSaving] = createSignal(false)

  // Initialize edit fields when order changes
  onMount(() => {
    setEditTitle(props.order?.description || "")
    setEditAmount(((props.order?.amount || 0) / 100).toString())
  })

  // Save order edits
  const saveOrder = async () => {
    if (!props.order) return
    setIsSaving(true)
    try {
      await api.updateOrder(props.order.id, {
        description: editTitle(),
        amount: Math.round(parseFloat(editAmount()) * 100),
      })
      toast.success("Order updated successfully")
      await merchant.refetchOrders()
      props.onClose()
    } catch {
      toast.error("Failed to update order")
    } finally {
      setIsSaving(false)
    }
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
        return "bg-green-100 text-green-800 border-green-300"
      case OrderStatus.PENDING:
        return "bg-yellow-50 text-yellow-800 border-yellow-300"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-300"
      case OrderStatus.EXPIRED:
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
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
    <div class="max-w-2xl mx-auto py-10">
      <div class="flex items-center mb-8">
        <button
          onClick={props.onClose}
          class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-base px-2 py-1 rounded transition-colors"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </button>
      </div>
      <div class="bg-white shadow-lg rounded-xl p-8 space-y-8 border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Order Details</h2>
        <div class="space-y-6">
          {/* Title */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              value={editTitle()}
              onInput={(e) => setEditTitle(e.currentTarget.value)}
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 text-base"
              placeholder="Enter order title"
            />
          </div>
          {/* Amount */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Amount ($)
            </label>
            <input
              type="number"
              value={editAmount()}
              onInput={(e) => setEditAmount(e.currentTarget.value)}
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 text-base"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
          {/* Status */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Status
            </label>
            <span
              class={`inline-flex items-center px-3 py-1 border text-sm font-semibold rounded-full shadow-sm ${getStatusBadgeClass(props.order.status)}`}
            >
              {getStatusDisplayName(props.order.status)}
            </span>
          </div>
          {/* Created Date */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Created
            </label>
            <p class="text-base text-gray-900 font-mono">
              {formatDate(props.order.createdAt)}
            </p>
          </div>
          {/* Order ID */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Order ID
            </label>
            <p class="text-base font-mono text-gray-500 break-all">
              {props.order.id}
            </p>
          </div>
          {/* Merchant Display Name */}
          <Show when={props.order.merchantDisplayName}>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Merchant
              </label>
              <p class="text-base text-gray-900">
                {props.order.merchantDisplayName}
              </p>
            </div>
          </Show>
        </div>
        {/* Payment Link Actions */}
        <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={async () => {
              const shareUrl = `${window.location.origin}/pay/${props.order.id}`
              await navigator.clipboard.writeText(shareUrl)
              toast.success("Payment link copied to clipboard")
            }}
            class="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Copy Payment Link
          </button>
          <button
            onClick={async () => {
              const shareUrl = `${window.location.origin}/pay/${props.order.id}`
              if (navigator.share) {
                await navigator.share({
                  title: "Payment Request",
                  text: `Please complete your payment for ${props.order.description || "this order"}`,
                  url: shareUrl,
                })
              } else {
                await navigator.clipboard.writeText(shareUrl)
                toast.success("Payment link copied to clipboard")
              }
            }}
            class="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Share Payment Link
          </button>
          <button
            onClick={() => window.open(`/pay/${props.order.id}`, "_blank")}
            class="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Payment Page
          </button>
        </div>
        {/* Save button */}
        <div class="pt-6 flex justify-end">
          <button
            onClick={saveOrder}
            disabled={isSaving()}
            class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-semibold text-base shadow"
          >
            {isSaving() ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
