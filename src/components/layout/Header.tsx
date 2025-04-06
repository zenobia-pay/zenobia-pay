import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

const Header: Component = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <header>
      {/* Top Bar */}
      <div class="border-b border-gray-200 py-2">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center">
            <button class="text-sm flex items-center">
              <span class="mr-1">+</span> Contact Us
            </button>
            <div class="flex items-center space-x-5">
              <a href="#" class="text-sm">
                English
              </a>
              <a href="#" class="text-sm">
                My Account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div class="py-5 border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between">
            {/* Logo */}
            <A
              href="/"
              class="text-3xl font-bold tracking-widest text-center flex-grow md:flex-grow-0"
            >
              <span class="font-serif">ZENOBIA</span>
            </A>

            {/* Icons */}
            <div class="flex items-center space-x-6">
              <A href="/cart" class="relative" aria-label="Shopping Bag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </A>
              <button class="p-1" aria-label="Search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button
                class="p-1 md:hidden"
                aria-label="Menu"
                onClick={() => setIsMenuOpen(!isMenuOpen())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button class="hidden md:block uppercase text-sm p-2 border-0">
                MENU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        class={`md:hidden py-4 border-b border-gray-200 ${
          isMenuOpen() ? "block" : "hidden"
        }`}
      >
        <div class="container mx-auto px-4">
          <nav class="flex flex-col space-y-4">
            <A href="/products" class="text-sm uppercase tracking-wider">
              MEN
            </A>
            <A href="/products" class="text-sm uppercase tracking-wider">
              WOMEN
            </A>
            <A href="/products" class="text-sm uppercase tracking-wider">
              CHILDREN
            </A>
            <A href="/products" class="text-sm uppercase tracking-wider">
              JEWELRY & WATCHES
            </A>
            <A href="/products" class="text-sm uppercase tracking-wider">
              BEAUTY
            </A>
            <A href="/products" class="text-sm uppercase tracking-wider">
              DECOR & LIFESTYLE
            </A>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
