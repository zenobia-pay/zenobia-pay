import { Component, createSignal, Show, createEffect } from "solid-js"
import { Order } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"
import { useLocation, useNavigate } from "@solidjs/router"
import { ManualOrdersList } from "./ManualOrdersList"
import { ManualOrderDetails } from "./ManualOrderDetails"
import { ManualOrdersConfiguration } from "./ManualOrdersConfiguration"

export const ManualOrders: Component = () => {
  const merchant = useMerchant()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = createSignal<Order | null>(null)
  const [loadingOrder, setLoadingOrder] = createSignal(false)

  const activeSubtab = () => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get("tab")
    if (tab !== "manual-orders") return "list"

    const subtab = searchParams.get("subtab")
    if (subtab === "details") return "details"
    return "list"
  }

  // Load order details when URL changes
  createEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const orderId = searchParams.get("orderId")

    if (orderId && activeSubtab() === "details") {
      setLoadingOrder(true)
      // Find the order in the cached data
      const order = merchant.orders()?.items?.find((o) => o.id === orderId)
      if (order) {
        setSelectedOrder(order)
        setLoadingOrder(false)
      } else {
        // If order not found in cache, we could fetch it individually
        // For now, just set loading to false and show error
        setLoadingOrder(false)
        setSelectedOrder(null)
      }
    } else {
      setSelectedOrder(null)
    }
  })

  // Navigate to order details
  const openOrderDetails = (orderId: string) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set("tab", "manual-orders")
    searchParams.set("subtab", "details")
    searchParams.set("orderId", orderId)
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  // Close order details
  const closeOrderDetails = () => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete("subtab")
    searchParams.delete("orderId")
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  return (
    <div class="space-y-6">
      {/* Order Details View */}
      <Show when={activeSubtab() === "details"}>
        <Show
          when={!loadingOrder() && selectedOrder()}
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
          <ManualOrderDetails
            order={selectedOrder()!}
            onClose={closeOrderDetails}
          />
        </Show>
      </Show>

      {/* Orders List View */}
      <Show when={activeSubtab() === "list"}>
        <div>
          {/* Manual Orders Configuration Check */}
          <ManualOrdersConfiguration />

          {/* Orders List - Only show when manual orders are configured */}
          <Show
            when={
              !merchant.manualOrdersConfigLoading() &&
              merchant.manualOrdersConfig()?.isConfigured
            }
          >
            <ManualOrdersList onOrderClick={openOrderDetails} />
          </Show>
        </div>
      </Show>
    </div>
  )
}
