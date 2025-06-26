import { Component, createSignal } from "solid-js"
import { authService } from "../services/auth"
import { GlobalSearch } from "./GlobalSearch"
import { useAdminLayout } from "./AdminLayout"
import { toggleTestMode, getTestMode } from "../services/api"
import { useMerchant } from "../context/MerchantContext"

export const AdminTopBar: Component = () => {
  const [showProfileMenu, setShowProfileMenu] = createSignal(false)
  const [isTestMode, setIsTestMode] = createSignal(getTestMode())
  const adminLayout = useAdminLayout()
  const merchant = useMerchant()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      window.location.href = "/"
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  const handleTestModeToggle = async () => {
    toggleTestMode()
    setIsTestMode(getTestMode())
    // Refresh all merchant data
    await Promise.all([
      merchant.refetchMerchantConfig(),
      merchant.refetchMerchantTransfers(),
      merchant.refetchM2mCredentials(),
    ])
  }

  return (
    <div class="sticky top-0 z-30 w-full shadow-sm">
      {/* Test Mode Banner - Only visible when in test mode */}
      {isTestMode() && (
        <div class="bg-yellow-400 border-b border-yellow-500 px-4 py-2">
          <div class="max-w-screen-2xl mx-auto flex items-center justify-center">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-yellow-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span class="text-sm font-medium text-yellow-800">
                TEST MODE - Using test environment
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div class="bg-white border-b h-14 border-gray-200">
        <div class="px-4 py-2 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Mobile Menu Toggle - Only visible on small screens */}
          <div class="lg:hidden">
            <button
              class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() =>
                adminLayout.setDrawerOpen(!adminLayout.drawerOpen())
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="w-5 h-5 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Left side - Search */}
          <div class="flex-1 px-2 ml-3">
            <GlobalSearch />
          </div>

          {/* Right side - Actions */}
          <div class="flex items-center space-x-4">
            {/* Test Mode Toggle */}
            <button
              onClick={handleTestModeToggle}
              class={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                isTestMode()
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              <div class="flex items-center space-x-1">
                {isTestMode() && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                )}
                <span>
                  {isTestMode() ? "Disable Test Mode" : "Enable Test Mode"}
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            <div class="relative ml-3">
              <button
                type="button"
                class="flex max-w-xs items-center rounded-full text-sm focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu())}
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  ZP
                </div>
              </button>

              {showProfileMenu() && (
                <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div class="py-1">
                    <button
                      onClick={() => adminLayout.navigateToTab("settings")}
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
