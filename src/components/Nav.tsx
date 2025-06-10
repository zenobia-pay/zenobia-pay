import { useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const [isAtTop, setIsAtTop] = createSignal(true);

  onMount(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const active = (path: string) =>
    path == location.pathname ? "bg-white/90" : "";

  return (
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
      classList={{ "bg-white": !isAtTop() }}
      style={{
        height: "var(--nav-height)",
        "border-bottom-left-radius": "var(--hero-bottom-radius)",
        "border-bottom-right-radius": "var(--hero-bottom-radius)",
      }}
    >
      <ul class="flex items-center justify-between max-w-7xl mx-auto font-sans text-lg font-medium tracking-tight h-full px-6">
        <div class="flex gap-2">
          <li>
            <a
              class={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-white/70 text-black hover:scale-110 hover:shadow-xl hover:bg-white/90 ${active(
                "/"
              )}`}
              href="/"
            >
              Zenobia Home
            </a>
          </li>
          <li>
            <a
              class={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-white/70 text-black hover:scale-110 hover:shadow-xl hover:bg-white/90 ${active(
                "/about"
              )}`}
              href="/about"
            >
              About
            </a>
          </li>
          <li>
            <a
              class={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-white/70 text-black hover:scale-110 hover:shadow-xl hover:bg-white/90 ${active(
                "/contact"
              )}`}
              href="/contact"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              class={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-white/70 text-black hover:scale-110 hover:shadow-xl hover:bg-white/90 ${active(
                "/blog"
              )}`}
              href="/blog"
            >
              Blog
            </a>
          </li>
        </div>
        <div class="flex gap-4">
          <li>
            <a
              class="px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-white/70 text-black hover:scale-110 hover:shadow-xl hover:bg-white/90"
              href="/demo"
            >
              Book a Demo
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
