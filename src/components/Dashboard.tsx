import { Component } from "solid-js"
import { AdminLayout } from "./AdminLayout"
import { useSearchParams } from "@solidjs/router"
import Transactions from "./admin/Transactions"
import Settings from "./admin/Settings"
import Developers from "./admin/Developers"
import { Home } from "./admin/Home"

// Tab definitions
const TABS = {
  OVERVIEW: "overview",
  TRANSACTIONS: "transactions",
  DEVELOPERS: "developers",
  SETTINGS: "settings",
}

export const Dashboard: Component = () => {
  // Use search params to handle tab navigation
  const [searchParams] = useSearchParams()

  // Get current active tab from URL or default to overview
  const currentTab = () => searchParams.tab || TABS.OVERVIEW

  // Render the active tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab()) {
      case TABS.TRANSACTIONS:
        return <Transactions />
      case TABS.DEVELOPERS:
        return <Developers />
      case TABS.SETTINGS:
        return <Settings />
      case TABS.OVERVIEW:
      default:
        return <Home />
    }
  }

  return <AdminLayout>{renderTabContent()}</AdminLayout>
}
