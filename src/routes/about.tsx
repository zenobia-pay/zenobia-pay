import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function About() {
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
              <span class="text-white drop-shadow-lg">About Zenobia Pay</span>
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
                Our mission
              </span>
              <span class="text-black/60 text-lg font-medium md:hidden block">
                Our mission
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
                Transforming luxury payments
              </span>
            </div>
          </div>
        </section>

        {/* First Content Section */}
        <section class="bg-white">
          <div class="max-w-7xl mx-auto px-4 py-50 max-w-[900px]">
            <h2 class="text-4xl font-bold mb-4 tracking-tight">
              We're revolutionizing how luxury brands handle payments.
            </h2>
            <p class="text-xl text-neutral-600 mb-12">
              Founded with a vision to transform the luxury payment landscape,
              Zenobia Pay combines cutting-edge technology with deep industry
              expertise to deliver a seamless, secure, and cost-effective
              payment solution.
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
                The Zenobia Pay Solution
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    Seamless & Secure
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Zenobia Pay enables seamless, secure bank transfer push
                    without inputting account numbers. Just point your phone at
                    the laptop, and confirm the payment.
                  </p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                    Cost Effective
                  </h3>
                  <p class="text-white/80 text-lg font-medium">
                    Zenobia Pay is ~3x cheaper than credit card processing,
                    helping luxury merchants save significantly on transaction
                    fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BottomCurvedBlock
        leftText="About Zenobia Pay"
        rightText=""
        background="rgb(var(--bg-light))"
      />
    </div>
  );
}
