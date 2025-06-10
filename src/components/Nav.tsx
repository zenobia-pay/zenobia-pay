import { useLocation } from "@solidjs/router";
import { createSignal, onMount, createEffect, untrack } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const [isAtTop, setIsAtTop] = createSignal(true);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const checkScroll = () => {
    setIsAtTop(window.scrollY < 100);
  };

  onMount(() => {
    console.log("Mounting the nav");
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  });

  // Check scroll position when location changes
  createEffect(() => {
    location.pathname;
    checkScroll();
  });

  const active = (path: string) =>
    path == location.pathname ? "underline" : "";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  return (
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      classList={{
        "bg-white": !isAtTop() || isMenuOpen(),
        "shadow-lg": isMenuOpen(),
      }}
      style={{
        height: "var(--nav-height)",
        "border-bottom-left-radius": isMenuOpen()
          ? "0"
          : "var(--hero-bottom-radius)",
        "border-bottom-right-radius": isMenuOpen()
          ? "0"
          : "var(--hero-bottom-radius)",
      }}
    >
      <div class="mx-auto px-6 h-full">
        <div class="flex items-center justify-between h-full">
          {/* Logo/Home Link */}
          <a
            class={`px-4 py-2 text-2xl md:text-4xl font-extrabold tracking-tight transition-all duration-300 ease-in-out hover:scale-105 ${
              isAtTop() && location.pathname === "/"
                ? "invisible pointer-events-none"
                : ""
            } ${
              isAtTop()
                ? "text-white hover:text-gray-200"
                : "text-black hover:text-gray-700"
            }`}
            href="/"
          >
            Zenobia Pay
          </a>

          {/* Mobile Menu Button */}
          <button
            class="md:hidden p-2 rounded-md hover:bg-white/70 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke={isAtTop() && !isMenuOpen() ? "white" : "currentColor"}
              viewBox="0 0 24 24"
            >
              {isMenuOpen() ? (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center gap-6">
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/about"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/about"
            >
              About
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/contact"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/contact"
            >
              Contact
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/blog"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/blog"
            >
              Blog
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="https://calendly.com/rprendergast1121/zenobia-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Demo →
            </a>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          class={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen() ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            top: "var(--nav-height)",
            "border-bottom-left-radius": "var(--hero-bottom-radius)",
            "border-bottom-right-radius": "var(--hero-bottom-radius)",
          }}
        >
          <div class="flex flex-col p-4 space-y-2">
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/about"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/contact"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/blog"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/demo"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
