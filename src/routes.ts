import type { RouteDefinition } from "@solidjs/router"

import Login from "./pages/auth/Login"
import { Dashboard } from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Onboarding from "./pages/Onboarding"
import WrongAccountType from "./pages/WrongAccountType"
import Admin404 from "./pages/errors/Admin404"

// Helper functions to wrap components with ProtectedRoute
const ProtectedDashboard = () => ProtectedRoute({ children: Dashboard })
const ProtectedOnboarding = () => ProtectedRoute({ children: Onboarding })
const ProtectedNotFound = () => ProtectedRoute({ children: Admin404 })
const ProtectedWrongAccountType = () =>
  ProtectedRoute({ children: WrongAccountType })

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
    path: "/wrong-account-type",
    component: ProtectedWrongAccountType,
  },
  {
    path: "/*",
    component: ProtectedNotFound,
  },
]
