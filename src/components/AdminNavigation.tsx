import { Component, createSignal } from "solid-js"
import { useSearchParams } from "@solidjs/router"
import { authService } from "../services/auth"
import { useAdminLayout } from "./AdminLayout"
import { useMerchant } from "../context/MerchantContext"

export const AdminNavigation: Component = () => {
  const [searchParams] = useSearchParams()
  const [loggingOut, setLoggingOut] = createSignal(false)
  const adminLayout = useAdminLayout()
  const merchant = useMerchant()

  // Get current active tab from URL
  const currentTab = () => searchParams.tab || "overview"

  return (
    <div class="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div class="py-4 px-5 h-14 border-b border-gray-200">
        <span class="text-lg font-medium text-gray-900 truncate block">
          {merchant.merchantConfigLoading()
            ? "Loading..."
            : merchant.merchantConfig()?.merchantDisplayName || "Unnamed Store"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <div class="space-y-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            Core
          </div>

          <button
            class={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              currentTab() === "overview"
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={() => adminLayout.navigateToTab("overview")}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                currentTab() === "overview"
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-indigo-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </button>

          <button
            class={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              currentTab() === "transactions"
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={() => adminLayout.navigateToTab("transactions")}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                currentTab() === "transactions"
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-indigo-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Transactions
          </button>
        </div>

        <div class="pt-6 space-y-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            More
          </div>

          <button
            class={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              currentTab() === "developers"
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={() => adminLayout.navigateToTab("developers")}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                currentTab() === "developers"
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-indigo-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Developers
          </button>

          <button
            class={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              currentTab() === "settings"
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={() => adminLayout.navigateToTab("settings")}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                currentTab() === "settings"
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-indigo-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>
        </div>
      </nav>

      {/* User Menu Section */}
      <div class="p-4 border-t border-gray-200">
        <button
          onClick={async () => {
            if (!loggingOut()) {
              setLoggingOut(true)
              try {
                await authService.signOut()
                window.location.href = "/login"
              } catch (error) {
                console.error("Error signing out:", error)
                setLoggingOut(false)
              }
            }
          }}
          class="w-full px-4 py-2 text-center text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loggingOut()}
        >
          {loggingOut() ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  )
}
