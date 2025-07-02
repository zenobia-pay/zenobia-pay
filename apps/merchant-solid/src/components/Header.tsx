import { Component } from "solid-js";
import { A } from "@solidjs/router";
import CartIcon from "./CartIcon";

const Header: Component = () => {
  return (
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <A href="/" class="text-xl font-serif">
            Zenobia
          </A>

          <nav class="hidden md:flex space-x-8">
            <A
              href="/products"
              class="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wider"
            >
              Shop
            </A>
            <A
              href="/about"
              class="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wider"
            >
              About
            </A>
            <A
              href="/contact"
              class="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wider"
            >
              Contact
            </A>
          </nav>

          <div class="flex items-center space-x-4">
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
