import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "bg-white text-black"
      : "hover:bg-white/10 text-white";
  return (
    <nav
      class="fixed top-0 left-0 right-0 z-50"
      style={{ height: "var(--nav-height)" }}
    >
      <ul class="flex items-center justify-between max-w-7xl mx-auto font-sans text-lg font-medium tracking-tight h-full px-6">
        <div class="flex gap-8">
          <li>
            <a
              class={`px-4 py-2 rounded-full transition ${active("/")}`}
              href="/"
            >
              Home
            </a>
          </li>
          <li>
            <a
              class={`px-4 py-2 rounded-full transition ${active("/about")}`}
              href="/about"
            >
              About
            </a>
          </li>
        </div>
        <div class="flex gap-4">
          <li>
            <a
              class="px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition"
              href="/login"
            >
              Login
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
