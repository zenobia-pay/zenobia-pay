import { Title, Meta } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Contact() {
  return (
    <>
      <Title>Contact - Zenobia Pay</Title>
      <Meta
        name="description"
        content="Contact Zenobia Pay for support or general inquiries."
      />
      <Meta property="og:title" content="Contact Zenobia Pay" />
      <Meta
        property="og:description"
        content="Contact us for support or general inquiries about our payment solutions."
      />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content="https://zenobiapay.com/hero.png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content="Contact Zenobia Pay" />
      <Meta
        name="twitter:description"
        content="Contact us for support or general inquiries about our payment solutions."
      />
      <Meta name="twitter:image" content="https://zenobiapay.com/hero.png" />
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
                  Get in touch with us
                  <br />
                  <br />
                  For support inquiries:
                  <br />
                  <a
                    href="mailto:support@zenobiapay.com"
                    class="text-white hover:text-neutral-300 transition-colors underline text-2xl md:text-7xl"
                  >
                    support@zenobiapay.com
                  </a>
                  <br />
                  <br />
                  For general inquiries:
                  <br />
                  <a
                    href="mailto:info@zenobiapay.com"
                    class="text-white hover:text-neutral-300 transition-colors underline text-2xl md:text-7xl"
                  >
                    info@zenobiapay.com
                  </a>
                  <br />
                  <br />
                  Phone:
                  <br />
                  <a
                    href="tel:+16468479305"
                    class="text-white hover:text-neutral-300 transition-colors underline text-2xl md:text-7xl"
                  >
                    +1 (646) 847-9305
                  </a>
                  <br />
                  <br />
                  To support Zenobia Pay at your store, book a demo at the top
                  bar or email us at:
                  <br />
                  <a
                    href="mailto:support@zenobiapay.com"
                    class="text-white hover:text-neutral-300 transition-colors underline text-2xl md:text-7xl"
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
    </>
  );
}
