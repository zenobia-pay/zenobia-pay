import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav";
import SmoothScroll from "~/components/SmoothScroll";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <div style={{ "max-width": "1920px", margin: "0 auto" }}>
        <Router
          root={(props) => (
            <>
              <SmoothScroll />
              <Nav />
              <Suspense>{props.children}</Suspense>
            </>
          )}
        >
          <FileRoutes />
        </Router>
      </div>
    </MetaProvider>
  );
}
