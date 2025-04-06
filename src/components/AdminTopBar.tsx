import { Component, createSignal } from "solid-js"
import { authService } from "../services/auth"
import { GlobalSearch } from "./GlobalSearch"
import { useAdminLayout } from "./AdminLayout"

export const AdminTopBar: Component = () => {
  const [showProfileMenu, setShowProfileMenu] = createSignal(false)
  const [showNotifications, setShowNotifications] = createSignal(false)
  const adminLayout = useAdminLayout()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      window.location.href = "/"
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <div class="sticky top-0 z-30 w-full shadow-sm">
      {/* Main Navigation */}
      <div class="bg-white border-b border-gray-200">
        <div class="h-14 px-4 flex items-center justify-between max-w-screen-2xl mx-auto">
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
