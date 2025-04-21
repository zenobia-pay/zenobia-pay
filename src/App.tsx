import type { Component } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./routes";
import { CartProvider } from "./context/CartContext";

const App: Component = () => {
  return (
    <CartProvider>
      <Router>{routes}</Router>
    </CartProvider>
  );
};

export default App;
