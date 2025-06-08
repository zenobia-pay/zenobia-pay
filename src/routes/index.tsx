import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import SectionCard from "~/components/SectionCard";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Header */}

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
              <span class="text-white drop-shadow-lg">Zenobia Pay</span>
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
                Payments software for luxury
              </span>
              <span class="text-black/60 text-lg font-medium md:hidden block">
                Payments software for luxury
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
                3x cheaper payments
              </span>
            </div>
          </div>
        </section>

        {/* First Content Section */}
        <section class="bg-white">
          <div class="max-w-7xl mx-auto px-4 py-50 max-w-[900px]">
            <h2 class="text-4xl font-bold mb-4 tracking-tight">
              Zenobia Pay enables luxury brands and jewelers to accept
              pay-by-bank.
            </h2>
            <p class="text-xl text-neutral-600 mb-12">
              We've built an instant clearing pay-by-bank network with bundled
              fraud insurance that costs 3 times less in fees than credit card
              processing.
            </p>
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

        {/* Green Section */}
        <section
          class="relative"
          style={{ "background-color": "var(--brand-green)" }}
        >
          {/* Content block */}
          <div class="py-20 px-6">
            <div class="max-w-7xl mx-auto">
              <h2 class="text-4xl font-bold mb-12 text-white tracking-tight">
                Why Choose Zenobia?
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    Direct Bank Integration
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Seamlessly connect with your customers' banks for instant,
                    secure transactions without the traditional payment
                    processing delays.
                  </p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    Lower Transaction Fees
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Cut costs with our competitive fee structure, designed
                    specifically for high-value transactions in the luxury
                    market.
                  </p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    Enhanced Security
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Bank-level security protocols ensure your transactions are
                    protected at every step, with real-time fraud detection.
                  </p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    24/7 Support
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Our dedicated support team is always available to assist you
                    with any questions or concerns about your transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom curved block (absolutely positioned) */}
          <div
            style={{
              height: "var(--hero-bottom-height)",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "calc(var(--hero-bottom-height) * -1)",
              width: "100%",
              "background-color": "var(--brand-green)",
              "border-radius":
                "0 0 var(--hero-bottom-radius) var(--hero-bottom-radius)",
              "z-index": 2,
              "pointer-events": "none",
            }}
          ></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
