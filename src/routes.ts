import type { RouteDefinition } from "@solidjs/router"

import Login from "./components/auth/Login"
import { SignUp } from "./components/auth/SignUp"
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
import Admin404 from "./pages/errors/Admin404"

const ProtectedDashboard = () => {
  return ProtectedRoute({ children: Dashboard })
}

const ProtectedAdminCards = () => {
  return ProtectedRoute({ children: Cards })
}

const ProtectedAdminPayments = () => {
  return ProtectedRoute({ children: Payments })
}

const ProtectedAdminSettings = () => {
  return ProtectedRoute({ children: Settings })
}

const ProtectedAdminMerchants = () => {
  return ProtectedRoute({ children: Merchants })
}

const ProtectedAdminDevelopers = () => {
  return ProtectedRoute({ children: Developers })
}

const ProtectedTerms = () => {
  return ProtectedRoute({ children: Terms })
}

const ProtectedPrivacy = () => {
  return ProtectedRoute({ children: Privacy })
}

const ProtectedDocs = () => {
  return ProtectedRoute({ children: Docs })
}

const ProtectedNotFound = () => {
  return ProtectedRoute({ children: Admin404 })
}

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
    path: "/signup",
    component: SignUp,
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
