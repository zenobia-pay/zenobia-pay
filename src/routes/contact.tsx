import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Contact() {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Content */}
      <main class="flex-grow">
        {/* Hero Section */}
        <section class="h-screen relative bg-black text-white">
          {/* Top padding block */}
          <div
            class="flex flex-col items-center justify-center px-6"
            style={{
              height: `calc(100vh - var(--hero-bottom-height))`,
              "padding-top": `calc(var(--nav-height) + 2rem)`,
              "padding-bottom": "var(--hero-bottom-height)",
            }}
          >
            <h2 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span class="text-white drop-shadow-lg">Contact Us</span>
            </h2>
          </div>

          {/* Bottom curved block */}
          <div
            style={{
              height: "var(--hero-bottom-height)",
              "border-radius":
                "var(--hero-bottom-radius) var(--hero-bottom-radius) 0 0",
            }}
            class="bg-white relative"
          >
            <div
              class="absolute inset-0 flex items-start justify-between pt-6"
              style={{
                "padding-left": "calc(var(--hero-bottom-radius))",
                "padding-right": "calc(var(--hero-bottom-radius))",
              }}
            >
              <span class="text-black/60 text-lg font-medium md:block hidden">
                Get in touch
              </span>
              <span class="text-black/60 text-lg font-medium md:hidden block">
                Get in touch
              </span>
              <button
                onClick={() =>
                  document
                    .querySelector("section:nth-of-type(2)")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                class="bg-neutral-200 hover:bg-neutral-300 transition-colors px-24 py-1.5 rounded-lg text-black/80 font-medium md:block hidden"
              ></button>
              <span class="text-black/60 text-lg font-medium md:block hidden">
                We're here to help
              </span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section class="bg-white">
          <div class="max-w-7xl mx-auto px-4 py-50 max-w-[900px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="bg-neutral-50 p-8 rounded-2xl">
                <h3 class="text-2xl font-bold mb-4 tracking-tight">
                  Support Inquiries
                </h3>
                <a
                  href="mailto:support@zenobiapay.com"
                  class="text-xl text-neutral-600 hover:text-black transition-colors"
                >
                  support@zenobiapay.com
                </a>
              </div>
              <div class="bg-neutral-50 p-8 rounded-2xl">
                <h3 class="text-2xl font-bold mb-4 tracking-tight">
                  General Inquiries
                </h3>
                <a
                  href="mailto:info@zenobiapay.com"
                  class="text-xl text-neutral-600 hover:text-black transition-colors"
                >
                  info@zenobiapay.com
                </a>
              </div>
              <div class="bg-neutral-50 p-8 rounded-2xl md:col-span-2">
                <h3 class="text-2xl font-bold mb-4 tracking-tight">Phone</h3>
                <a
                  href="tel:+16468479305"
                  class="text-xl text-neutral-600 hover:text-black transition-colors"
                >
                  +1 (646) 847-9305
                </a>
              </div>
            </div>
          </div>
          <div
            style={{
              height: "var(--hero-bottom-height)",
              "border-radius":
                "var(--hero-bottom-radius) var(--hero-bottom-radius) 0 0",
            }}
            class="bg-[var(--brand-green)]"
          ></div>
        </section>
      </main>
      <Footer />
      <BottomCurvedBlock
        leftText="Contact Us"
        rightText=""
        background="rgb(var(--bg-light))"
      />
    </div>
  );
}
