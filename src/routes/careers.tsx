import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Careers() {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Content */}
      <main class="flex-grow">
        {/* Hero Section */}
        <section class="relative bg-black text-white">
          {/* Top padding block */}
          <div
            class="flex flex-col items-center justify-center px-6"
            style={{
              "padding-top": `calc(var(--nav-height) + 4rem)`,
              "padding-bottom": "var(--hero-bottom-height)",
            }}
          >
            <div class="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span class="text-white drop-shadow-lg">
                While we don't have any open positions at the moment, we're
                always interested in connecting with exceptional people.
                <br />
                <br />
                For career opportunities, contact us at:
                <br />
                <br />
                <a
                  href="mailto:info@zenobiapay.com"
                  class="text-white hover:text-neutral-300 transition-colors underline"
                >
                  info@zenobiapay.com
                </a>
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
