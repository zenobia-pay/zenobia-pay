import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav";
import SmoothScroll from "~/components/SmoothScroll";
import "./app.css";

function RootComponent(props: any) {
  const location = useLocation();
  const isBlogPost = () =>
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";

  return (
    <>
      <SmoothScroll />
      <Nav />
      <Suspense>{props.children}</Suspense>
      {!isBlogPost() && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            "background-color": "#dc2626",
            color: "white",
            padding: "12px 16px",
            "text-align": "center",
            "font-weight": "bold",
            "z-index": "9999",
            "box-shadow": "0 -2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span style={{ "font-size": "16px" }}>
            ZENOBIA PAY IS NO LONGER ACTIVE
          </span>
          <span style={{ margin: "0 8px", color: "#fca5a5" }}>|</span>
          <a
            href="/blog/open-source-payments"
            style={{
              color: "white",
              "text-decoration": "underline",
              "font-weight": "bold",
            }}
          >
            READ MORE →
          </a>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <MetaProvider>
      <div style={{ "max-width": "1920px", margin: "0 auto" }}>
        <Router root={RootComponent}>
          <FileRoutes />
        </Router>
      </div>
    </MetaProvider>
  );
}
