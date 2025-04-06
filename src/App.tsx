import type { Component } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./routes";

const App: Component = () => {
  return <Router>{routes}</Router>;
};

export default App;
