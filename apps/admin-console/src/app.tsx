import { Router, Route } from "@solidjs/router";
import { Suspense, JSX } from "solid-js";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "~/components/Nav";
import Home from "./routes/index";
import Login from "./pages/auth/Login";
import NotFound from "./routes/[...404]";
import "./app.css";

function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <Nav />
      {props.children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense>
        <Router>
          <Route path="/login" component={Login} />
          <Route
            path="/"
            component={() => (
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="*"
            component={() => (
              <ProtectedRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </ProtectedRoute>
            )}
          />
        </Router>
      </Suspense>
    </AuthProvider>
  );
}
