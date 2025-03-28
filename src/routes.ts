import type { RouteDefinition } from "@solidjs/router"

import Login from "./components/auth/Login"
import { Dashboard } from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Cards from "./components/admin/Cards"
import Payments from "./components/admin/Payments"
import Settings from "./components/admin/Settings"
import Merchants from "./components/admin/Merchants"
import Developers from "./components/admin/Developers"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Docs from "./pages/Docs"
import Onboarding from "./pages/Onboarding"
import Admin404 from "./pages/errors/Admin404"

// Helper functions to wrap components with ProtectedRoute
const ProtectedDashboard = () => ProtectedRoute({ children: Dashboard })
const ProtectedAdminCards = () => ProtectedRoute({ children: Cards })
const ProtectedAdminPayments = () => ProtectedRoute({ children: Payments })
const ProtectedAdminSettings = () => ProtectedRoute({ children: Settings })
const ProtectedAdminMerchants = () => ProtectedRoute({ children: Merchants })
const ProtectedAdminDevelopers = () => ProtectedRoute({ children: Developers })
const ProtectedTerms = () => ProtectedRoute({ children: Terms })
const ProtectedPrivacy = () => ProtectedRoute({ children: Privacy })
const ProtectedDocs = () => ProtectedRoute({ children: Docs })
const ProtectedOnboarding = () => ProtectedRoute({ children: Onboarding })
const ProtectedNotFound = () => ProtectedRoute({ children: Admin404 })

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: ProtectedDashboard,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/onboarding",
    component: ProtectedOnboarding,
  },
  {
    path: "/merchants",
    component: ProtectedAdminMerchants,
  },
  {
    path: "/accounts",
    component: ProtectedAdminCards,
  },
  {
    path: "/transactions",
    component: ProtectedAdminPayments,
  },
  {
    path: "/developers",
    component: ProtectedAdminDevelopers,
  },
  {
    path: "/settings",
    component: ProtectedAdminSettings,
  },
  {
    path: "/terms",
    component: ProtectedTerms,
  },
  {
    path: "/privacy",
    component: ProtectedPrivacy,
  },
  {
    path: "/docs",
    component: ProtectedDocs,
  },
  {
    path: "/*",
    component: ProtectedNotFound,
  },
]
