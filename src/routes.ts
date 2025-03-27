import { lazy } from "solid-js"
import type { RouteDefinition } from "@solidjs/router"

import LandingPage from "./pages/LandingPage"
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

const ProtectedAdmin404 = () => {
  return ProtectedRoute({ children: Admin404 })
}

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: LandingPage,
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
    path: "/admin",
    component: ProtectedDashboard,
  },
  {
    path: "/admin/merchants",
    component: ProtectedAdminMerchants,
  },
  {
    path: "/admin/accounts",
    component: ProtectedAdminCards,
  },
  {
    path: "/admin/transactions",
    component: ProtectedAdminPayments,
  },
  {
    path: "/admin/developers",
    component: ProtectedAdminDevelopers,
  },
  {
    path: "/admin/settings",
    component: ProtectedAdminSettings,
  },
  {
    path: "/terms",
    component: Terms,
  },
  {
    path: "/privacy",
    component: Privacy,
  },
  {
    path: "/docs",
    component: Docs,
  },
  {
    path: "/admin/*",
    component: ProtectedAdmin404,
  },
  {
    path: "**",
    component: lazy(() => import("./pages/errors/404")),
  },
]
