import { Component, createSignal, Show, onMount } from "solid-js"
import { useParams, useNavigate } from "@solidjs/router"
import { api } from "../../services/api"
import { Order, OrderStatus } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { toast } from "solid-toast"

export const SingleOrderView: Component = () => {
  const params = useParams()
  const navigate = useNavigate()
  const merchant = useMerchant()

  const [order, setOrder] = createSignal<Order | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [isEditing, setIsEditing] = createSignal(false)
  const [isSaving, setIsSaving] = createSignal(false)
  const [editedTitle, setEditedTitle] = createSignal("")
  const [editedAmount, setEditedAmount] = createSignal("")
  const [orderImage, setOrderImage] = createSignal<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = createSignal(false)

  // Load order data
  const loadOrder = async () => {
    if (!params.orderId) return

    setLoading(true)
    setError(null)

    try {
      // For now, we'll find the order from the cached orders
      // In a real app, you'd have a dedicated API endpoint for single order
      const orders = merchant.orders()?.items || []
      const foundOrder = orders.find((o) => o.id === params.orderId)

      if (foundOrder) {
        setOrder(foundOrder)
        setEditedTitle(foundOrder.description || "")
        setEditedAmount((foundOrder.amount / 100).toString())
      } else {
        setError("Order not found")
      }
    } catch (err) {
      console.error("Error loading order:", err)
      setError("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    loadOrder()
  })

  // Save order changes
  const saveOrder = async () => {
    if (!order()) return

    setIsSaving(true)
    try {
      await api.updateOrder(order()!.id, {
        description: editedTitle(),
        amount: Math.round(parseFloat(editedAmount()) * 100),
      })

      toast.success("Order updated successfully")
      setIsEditing(false)

      // Refresh orders data
      await merchant.refetchOrders()

      // Reload current order
      await loadOrder()
    } catch (err) {
      console.error("Error updating order:", err)
      toast.error("Failed to update order")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      // In a real app, you'd upload to your server/CDN
      // For now, we'll create a local URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setOrderImage(e.target?.result as string)
        toast.success("Image uploaded successfully")
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Error uploading image:", err)
      toast.error("Failed to upload image")
    } finally {
      setIsUploadingImage(false)
    }
  }

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
      month: "long",
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

  // Copy payment link
  const copyPaymentLink = async () => {
    if (!order()) return

    try {
      const shareUrl = `${window.location.origin}/pay/${order()!.id}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Payment link copied to clipboard")
    } catch (error) {
      console.error("Error copying link:", error)
      toast.error("Failed to copy link")
    }
  }

  // Share payment link
  const sharePaymentLink = async () => {
    if (!order()) return

    try {
      const shareUrl = `${window.location.origin}/pay/${order()!.id}`

      if (navigator.share) {
        await navigator.share({
          title: "Payment Request",
          text: `Please complete your payment for ${order()!.description || "this order"}`,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Payment link copied to clipboard")
      }
    } catch (error) {
      console.error("Error sharing link:", error)
    }
  }

  return (
    <div class="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin")}
            class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <svg
              class="w-5 h-5"
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
          </button>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Order Details</h1>
            <p class="text-sm text-gray-500">
              View and manage order information
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            onClick={copyPaymentLink}
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              class="w-4 h-4 mr-2"
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
            onClick={sharePaymentLink}
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              class="w-4 h-4 mr-2"
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
            Share
          </button>
        </div>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
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
      </Show>

      {/* Error State */}
      <Show when={error()}>
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
                Error loading order
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{error()}</p>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Order Content */}
      <Show when={order() && !loading()}>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Details */}
          <div class="lg:col-span-2 space-y-6">
            {/* Order Information Card */}
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900">
                    Order Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing())}
                    class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {isEditing() ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>
              <div class="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Show
                    when={!isEditing()}
                    fallback={
                      <input
                        type="text"
                        value={editedTitle()}
                        onInput={(e) => setEditedTitle(e.currentTarget.value)}
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                        placeholder="Enter order title"
                      />
                    }
                  >
                    <p class="text-lg font-medium text-gray-900">
                      {order()?.description || "No title"}
                    </p>
                  </Show>
                </div>

                {/* Amount */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <Show
                    when={!isEditing()}
                    fallback={
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={editedAmount()}
                          onInput={(e) =>
                            setEditedAmount(e.currentTarget.value)
                          }
                          class="block w-full pl-8 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    }
                  >
                    <p class="text-2xl font-bold text-gray-900">
                      {formatCurrency(order()?.amount || 0)}
                    </p>
                  </Show>
                </div>

                {/* Status */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span
                    class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order()?.status || OrderStatus.PENDING)}`}
                  >
                    {getStatusDisplayName(
                      order()?.status || OrderStatus.PENDING
                    )}
                  </span>
                </div>

                {/* Created Date */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Created
                  </label>
                  <p class="text-sm text-gray-900">
                    {formatDate(order()?.createdAt || "")}
                  </p>
                </div>

                {/* Order ID */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <p class="text-sm font-mono text-gray-500">{order()?.id}</p>
                </div>

                {/* Save Button */}
                <Show when={isEditing()}>
                  <div class="pt-4">
                    <button
                      onClick={saveOrder}
                      disabled={isSaving()}
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSaving() ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </Show>
              </div>
            </div>

            {/* Order Image */}
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Order Image</h3>
              </div>
              <div class="p-6">
                <Show
                  when={orderImage()}
                  fallback={
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div class="mt-4">
                        <label for="image-upload" class="cursor-pointer">
                          <span class="mt-2 block text-sm font-medium text-gray-900">
                            Upload an image
                          </span>
                          <span class="mt-1 block text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          class="sr-only"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage()}
                        />
                      </div>
                    </div>
                  }
                >
                  <div class="space-y-4">
                    <img
                      src={orderImage()!}
                      alt="Order"
                      class="w-full h-64 object-cover rounded-lg"
                    />
                    <div class="flex items-center justify-between">
                      <button
                        onClick={() => setOrderImage(null)}
                        class="text-sm text-red-600 hover:text-red-500"
                      >
                        Remove image
                      </button>
                      <label
                        for="image-upload"
                        class="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Replace image
                      </label>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        class="sr-only"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage()}
                      />
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div class="space-y-6">
            {/* Payment Link Card */}
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Payment Link</h3>
              </div>
              <div class="p-6">
                <div class="space-y-3">
                  <button
                    onClick={() => window.open(`/pay/${order()?.id}`, "_blank")}
                    class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Payment Page
                  </button>
                  <button
                    onClick={copyPaymentLink}
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
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
                </div>
              </div>
            </div>

            {/* Merchant Info */}
            <Show when={order()?.merchantDisplayName}>
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-lg font-medium text-gray-900">Merchant</h3>
                </div>
                <div class="p-6">
                  <p class="text-sm text-gray-900">
                    {order()?.merchantDisplayName}
                  </p>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  )
}
