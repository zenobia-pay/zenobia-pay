import { Component, createSignal } from "solid-js"
import { A } from "@solidjs/router"
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
        <div class="h-16 px-4 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Mobile Menu Toggle - Only visible on small screens */}
          <div class="lg:hidden">
            <button
              class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => adminLayout.setDrawerOpen(!adminLayout.drawerOpen())}
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
            <div class="hidden md:flex items-center gap-2">
              <span class="text-xs font-medium text-gray-600">Test mode</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  checked={adminLayout.isTestMode()}
                  readOnly
                />
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Notifications */}
            <div class="relative">
              <button
                class="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative"
                onClick={() => setShowNotifications(!showNotifications())}
              >
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              {showNotifications() && (
                <div class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div class="py-2">
                    <div class="px-4 py-2 border-b border-gray-200">
                      <h3 class="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div class="max-h-[60vh] overflow-y-auto">
                      <div class="border-b border-gray-100 hover:bg-gray-50">
                        <a href="#" class="block px-4 py-3">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 pt-0.5">
                              <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                <svg
                                  class="h-4 w-4 text-white"
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
                              </div>
                            </div>
                            <div class="ml-3 w-0 flex-1">
                              <p class="text-sm font-medium text-gray-900">
                                New payment received
                              </p>
                              <p class="text-xs text-gray-500">2 minutes ago</p>
                              <p class="mt-1 text-sm text-gray-600">
                                You received a payment of $240.00 from Acme Inc.
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div class="border-b border-gray-100 hover:bg-gray-50">
                        <a href="#" class="block px-4 py-3">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 pt-0.5">
                              <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                <svg
                                  class="h-4 w-4 text-white"
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
                              </div>
                            </div>
                            <div class="ml-3 w-0 flex-1">
                              <p class="text-sm font-medium text-gray-900">
                                Account setup completed
                              </p>
                              <p class="text-xs text-gray-500">2 hours ago</p>
                              <p class="mt-1 text-sm text-gray-600">
                                Your account setup has been completed
                                successfully.
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div class="hover:bg-gray-50">
                        <a href="#" class="block px-4 py-3">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 pt-0.5">
                              <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg
                                  class="h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div class="ml-3 w-0 flex-1">
                              <p class="text-sm font-medium text-gray-900">
                                New feature available
                              </p>
                              <p class="text-xs text-gray-500">1 day ago</p>
                              <p class="mt-1 text-sm text-gray-600">
                                Try our new analytics dashboard for better
                                insights.
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="px-4 py-2 border-t border-gray-200">
                      <a
                        href="/admin/notifications"
                        class="text-xs font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div class="relative">
              <button class="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

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
                    <A
                      href="/admin/profile"
                      class="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                      <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                        New
                      </span>
                    </A>
                    <A
                      href="/admin/settings"
                      class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block"
                    >
                      Settings
                    </A>
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
