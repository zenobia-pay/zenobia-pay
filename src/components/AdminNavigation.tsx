import { Component, createSignal, Show, createMemo } from "solid-js"
import { A, useNavigate, useLocation } from "@solidjs/router"
import { authService } from "../services/auth"
import { useAdminLayout } from "./AdminLayout"

export const AdminNavigation: Component = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = createSignal(false)
  const adminLayout = useAdminLayout()

  // Create a memo to check if a path is active
  const isActive = createMemo(() => (path: string) => {
    if (path === "/admin") {
      // Exact match for dashboard
      return location.pathname === "/admin"
    }
    // For other pages, check if the pathname starts with the path
    return location.pathname.startsWith(path)
  })

  // Close drawer after navigation on mobile
  const handleNavigation = (path: string) => {
    if (window.innerWidth < 1024) {
      adminLayout.setDrawerOpen(false)
    }
    navigate(path)
  }

  return (
    <div class="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div class="py-6 px-5 border-b border-gray-200">
        <A
          href="/"
          class="text-lg font-medium text-gray-900 flex items-center"
        >
          <span>Zenobia Pay</span>
        </A>
      </div>

      {/* Navigation Links */}
      <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <div class="space-y-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            Core
          </div>

          <A
            href="/admin"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin")
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
          </A>

          <A
            href="/admin/transactions"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin/transactions")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin/transactions")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin/transactions")
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
            Payments
          </A>

          <A
            href="/admin/merchants"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin/merchants")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin/merchants")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin/merchants")
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
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
            Merchants
          </A>

          <A
            href="/admin/accounts"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin/accounts")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin/accounts")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin/accounts")
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Accounts
          </A>
        </div>

        <div class="pt-6 space-y-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            More
          </div>

          <A
            href="/admin/developers"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin/developers")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin/developers")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin/developers")
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
          </A>

          <A
            href="/admin/settings"
            class={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
              isActive()("/admin/settings")
                ? "text-indigo-700 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/admin/settings")
            }}
          >
            <svg
              class={`mr-3 h-5 w-5 transition-colors ${
                isActive()("/admin/settings")
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
          </A>
        </div>
      </nav>

      {/* User Section */}
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center">
          <div class="relative flex-shrink-0">
            <div class="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              AU
            </div>
            <div class="absolute bottom-0 right-0 rounded-full w-2.5 h-2.5 bg-green-400 border border-white"></div>
          </div>
          <div class="ml-3 min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <Show
              when={!loggingOut()}
              fallback={<p class="text-xs text-gray-500">Signing out...</p>}
            >
              <button
                onClick={async () => {
                  setLoggingOut(true)
                  await authService.signOut()
                  navigate("/")
                  setLoggingOut(false)
                }}
                class="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                disabled={loggingOut()}
              >
                Sign out
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}
