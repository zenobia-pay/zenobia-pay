import { useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const [isAtTop, setIsAtTop] = createSignal(true);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const checkScroll = () => {
    setIsAtTop(window.scrollY < 100);
  };

  onMount(() => {
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  });

  const active = (path: string) => {
    return path === location.pathname ? "underline" : "";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  return (
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-200 max-w-[1920px] mx-auto"
      classList={{
        "bg-white": !isAtTop() || isMenuOpen(),
        "shadow-lg": isMenuOpen(),
      }}
    >
      <div class="mx-auto px-6 h-16">
        <div class="flex items-center justify-between h-full">
          {/* Logo/Home Link */}
          <a
            class={`px-4 py-2 text-2xl font-extrabold tracking-tight transition-all duration-300 ease-in-out hover:scale-105 ${
              isAtTop()
                ? "text-white hover:text-gray-200"
                : "text-black hover:text-gray-700"
            }`}
            href="/"
          >
            Verified
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
              stroke={
                isMenuOpen()
                  ? "currentColor"
                  : isAtTop()
                  ? "white"
                  : "currentColor"
              }
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
                "/"
              )} ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/"
            >
              Home
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                isAtTop()
                  ? "text-white hover:text-gray-200"
                  : "text-black hover:text-gray-700"
              }`}
              href="/dashboard"
            >
              Dashboard
            </a>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          class={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen() ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            top: "4rem",
          }}
        >
          <div class="flex flex-col p-4 space-y-2">
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${active(
                "/"
              )} text-black hover:text-gray-700`}
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              class={`px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 text-black hover:text-gray-700`}
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
