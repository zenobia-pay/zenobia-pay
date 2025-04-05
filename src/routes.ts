import type { RouteDefinition } from "@solidjs/router"

import Login from "./components/auth/Login"
import { Dashboard } from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Docs from "./pages/Docs"
import Onboarding from "./pages/Onboarding"
import Admin404 from "./pages/errors/Admin404"

// Helper functions to wrap components with ProtectedRoute
const ProtectedDashboard = () => ProtectedRoute({ children: Dashboard })
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
