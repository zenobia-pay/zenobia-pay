import { Router, Route } from "@solidjs/router";
import { Suspense, JSX, onMount } from "solid-js";
import { AuthProvider } from "./context/AuthContext";
import {
  EnvironmentProvider,
  useEnvironment,
} from "./context/EnvironmentContext";
import { setApiBaseUrlGetter } from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import EnvironmentSync from "./components/EnvironmentSync";
import Home from "./routes/index";
import MerchantPage from "./routes/merchant";
import TransferPage from "./routes/transfer";
import Login from "./pages/auth/Login";
import NotFound from "./routes/[...404]";
import "./app.css";

// Create a single layout instance that will be reused
const AppLayout = (props: { children: JSX.Element }) => {
  const { getApiBaseUrl } = useEnvironment();

  onMount(() => {
    // Initialize the API base URL getter
    setApiBaseUrlGetter(getApiBaseUrl);
  });

  return (
    <main class="min-h-screen bg-black text-white">
      <EnvironmentSync />
      {props.children}
    </main>
  );
};

// Create a single protected layout instance
const ProtectedAppLayout = (props: { children: JSX.Element }) => (
  <ProtectedRoute>
    <AppLayout>{props.children}</AppLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <EnvironmentProvider>
        <Suspense>
          <Router>
            <Route path="/login" component={Login} />
            <Route
              path="/"
              component={() => (
                <ProtectedAppLayout>
                  <Home />
                </ProtectedAppLayout>
              )}
            />
            <Route
              path="/merchant"
              component={() => (
                <ProtectedAppLayout>
                  <MerchantPage />
                </ProtectedAppLayout>
              )}
            />
            <Route
              path="/transfer"
              component={() => (
                <ProtectedAppLayout>
                  <TransferPage />
                </ProtectedAppLayout>
              )}
            />
            <Route
              path="*"
              component={() => (
                <ProtectedAppLayout>
                  <NotFound />
                </ProtectedAppLayout>
              )}
            />
          </Router>
        </Suspense>
      </EnvironmentProvider>
    </AuthProvider>
  );
}
