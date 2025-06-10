import { Title } from "@solidjs/meta";
import { createEffect, onMount } from "solid-js";
import Footer from "~/components/Footer";

export default function AppClip() {
  let currentUrl = "";

  onMount(() => {
    currentUrl = window.location.href;
  });

  return (
    <div class="min-h-screen flex flex-col">
      {/* Content */}
      <main class="flex-grow">
        {/* Hero Section */}
        <section class="relative bg-black text-white">
          {/* Top padding block */}
          <div class="flex justify-center">
            <div
              class="flex flex-col justify-center px-6 max-w-[2000px] w-full"
              style={{
                "padding-top": `calc(var(--nav-height) + 4rem)`,
                "padding-bottom": "var(--hero-bottom-height)",
              }}
            >
              <h2 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                <span class="text-white drop-shadow-lg">
                  Download Zenobia Pay on your iPhone to continue
                  <br />
                  <br />
                  <a
                    href="https://apps.apple.com/us/app/zenobia-pay/id6744233333"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-block"
                  >
                    <img
                      src="/app_store_badge.svg"
                      alt="Download on the App Store"
                      class="h-24 md:h-32"
                    />
                  </a>
                  <br />
                  <a
                    href={currentUrl}
                    class="text-white hover:text-neutral-300 transition-colors underline text-2xl md:text-4xl tracking-wider"
                  >
                    Open in app →
                  </a>
                </span>
              </h2>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
