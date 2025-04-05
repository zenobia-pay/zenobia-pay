import {
  Component,
  createSignal,
  createResource,
  createMemo,
  Show,
} from "solid-js"
import { AdminLayout } from "./AdminLayout"
import { useSearchParams } from "@solidjs/router"
import { api } from "../services/api"
import { Transfer, TransferStatus } from "../types/api"
import Accounts from "./admin/Accounts"
import Payments from "./admin/Payments"
import Settings from "./admin/Settings"
import Merchants from "./admin/Merchants"
import Developers from "./admin/Developers"
import { Home } from "./admin/Home"

// Tab definitions
const TABS = {
  OVERVIEW: "overview",
  MERCHANTS: "merchants",
  ACCOUNTS: "accounts",
  PAYMENTS: "payments",
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
      case TABS.MERCHANTS:
        return <Merchants />
      case TABS.ACCOUNTS:
        return <Accounts />
      case TABS.PAYMENTS:
        return <Payments />
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
