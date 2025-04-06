import {
  Component,
  JSX,
  createContext,
  useContext,
  createSignal,
  createResource,
  Show,
} from "solid-js"
import { AdminNavigation } from "./AdminNavigation"
import { AdminTopBar } from "./AdminTopBar"
import { api } from "../services/api"
import { useNavigate, useSearchParams } from "@solidjs/router"

interface AdminLayoutProps {
  children: JSX.Element
}

// Create a context to persist state across navigation
type AdminLayoutContextValue = {
  drawerOpen: () => boolean
  setDrawerOpen: (open: boolean) => void
  isApproved: () => boolean
  navigateToTab: (tabName: string) => void
}

const AdminLayoutContext = createContext<AdminLayoutContextValue>(
  {} as AdminLayoutContextValue
)

export const useAdminLayout = () => useContext(AdminLayoutContext)

/**
 * AdminLayout provides a consistent layout for all admin pages
 * It wraps admin content with navigation and top bar
 * This component is rendered once and only the children change during navigation
 */
export const AdminLayout: Component<AdminLayoutProps> = (props) => {
  // State for the mobile drawer
  const [drawerOpen, setDrawerOpen] = createSignal(false)
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Function to navigate between tabs
  const navigateToTab = (tabName: string) => {
    if (location.pathname !== "/") {
      navigate("/?tab=" + tabName)
    } else {
      setSearchParams({ tab: tabName })
    }
    // Close drawer after navigation on mobile
    if (window.innerWidth < 1024) {
      setDrawerOpen(false)
    }
  }

  // Fetch user profile to determine approval status
  const [userProfile] = createResource(async () => {
    try {
      const response = await api.getUserProfile()
      return response
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return { isApproved: false }
    }
  })

  // Derived state for approval status
  const isApproved = () => userProfile()?.isApproved ?? false

  // Close drawer when screen size changes to desktop
  const handleResize = () => {
    if (window.innerWidth >= 1024 && drawerOpen()) {
      setDrawerOpen(false)
    }
  }

  // Add resize listener
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize)
    // Cleanup function would be: window.removeEventListener('resize', handleResize);
  }

  return (
    <AdminLayoutContext.Provider
      value={{ drawerOpen, setDrawerOpen, isApproved, navigateToTab }}
    >
      <div class="h-screen flex flex-col overflow-hidden">
        {/* Test Mode Banner - Show when not approved */}
        <Show when={!isApproved()}>
          <div class="bg-amber-500 text-white px-4 py-1 z-50">
            <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span class="text-xs font-medium">
                  Your account is under review. Please allow up to 24 hours for
                  approval. For issues, please contact support@zenobiapay.com.
                </span>
              </div>
              <a
                href="mailto:support@zenobiapay.com"
                class="text-xs font-medium text-white hover:underline flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact support
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Show>

        <div class="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Fixed height, always visible on desktop */}
          <div class="hidden lg:flex lg:flex-shrink-0">
            <div class="w-64 flex flex-col">
              {/* Sidebar component */}
              <AdminNavigation />
            </div>
          </div>

          {/* Mobile drawer - Only shown on mobile when open */}
          <div
            class={`lg:hidden fixed inset-0 z-40 flex ${drawerOpen() ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
          >
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
              <AdminNavigation />
            </div>

            {/* Overlay to close drawer */}
            <div
              class="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            ></div>
          </div>

          {/* Main content area */}
          <div class="flex flex-col flex-1 overflow-auto">
            {/* Top Navigation */}
            <AdminTopBar />

            {/* Page content */}
            <main class="flex-1 relative overflow-y-auto focus:outline-none bg-[#f9fafb]">
              <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                {props.children}
              </div>

              {/* Copyright notice at bottom of content */}
              <div class="text-xs text-center text-gray-500 py-4 border-t border-gray-200 mt-6">
                <p>© 2025 Zenobia Pay, Inc. All rights reserved.</p>
                <div class="mt-2 flex justify-center space-x-4">
                  <a
                    href="https://zenobiapay.com/terms"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Terms
                  </a>
                  <a
                    href="https://zenobiapay.com/privacy"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Privacy
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  )
}
