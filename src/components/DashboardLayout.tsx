import { Component, JSX, createEffect, onMount } from "solid-js"
import { useLocation } from "@solidjs/router"
import { AdminNavigation } from "./AdminNavigation"
import { AdminTopBar } from "./AdminTopBar"

interface DashboardLayoutProps {
  children: JSX.Element
}

export const DashboardLayout: Component<DashboardLayoutProps> = (props) => {
  const location = useLocation()

  // Keep track of the previous path to detect navigation within admin routes
  let previousPath = location.pathname

  // This effect only runs when route changes, not on every re-render
  createEffect(() => {
    const currentPath = location.pathname

    // Log navigation for debugging
    if (previousPath !== currentPath) {
      console.log(`Navigation: ${previousPath} → ${currentPath}`)
      previousPath = currentPath
    }
  })

  return (
    <div class="drawer lg:drawer-open">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col bg-base-200">
        {/* Top Navigation - Rendered once and persists across admin routes */}
        <AdminTopBar />

        {/* Main Content - This is what changes with each route */}
        <div class="p-6 pt-6">
          <div class="container mx-auto">{props.children}</div>
        </div>
      </div>

      {/* Left Sidebar - Also persists across routes */}
      <AdminNavigation />
    </div>
  )
}
