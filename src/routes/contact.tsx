import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Contact() {
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
            <h2 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span class="text-white drop-shadow-lg">
                Get in touch with us:
                <br />
                <br />
                For support inquiries:
                <br />
                <a
                  href="mailto:support@zenobiapay.com"
                  class="text-white hover:text-neutral-300 transition-colors underline"
                >
                  support@zenobiapay.com
                </a>
                <br />
                <br />
                For general inquiries:
                <br />
                <a
                  href="mailto:info@zenobiapay.com"
                  class="text-white hover:text-neutral-300 transition-colors underline"
                >
                  info@zenobiapay.com
                </a>
                <br />
                <br />
                Phone:
                <br />
                <a
                  href="tel:+16468479305"
                  class="text-white hover:text-neutral-300 transition-colors underline"
                >
                  +1 (646) 847-9305
                </a>
                <br />
                <br />
                To support Zenobia Pay at your store, book a demo at the top bar
                or email us at:
                <br />
                <a
                  href="mailto:support@zenobiapay.com"
                  class="text-white hover:text-neutral-300 transition-colors underline"
                >
                  merchants@zenobiapay.com
                </a>
              </span>
            </h2>
          </div>

          {/* Bottom curved block */}
        </section>
      </main>
      <Footer />
    </div>
  );
}
