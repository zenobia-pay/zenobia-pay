import { Title, Meta } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Careers() {
  return (
    <>
      <Title>Careers - Zenobia Pay</Title>
      <Meta
        name="description"
        content="Join Zenobia Pay's mission to revolutionize luxury payments. We're always looking for exceptional talent to help build the future of secure, instant bank transfers."
      />
      <Meta property="og:title" content="Careers at Zenobia Pay" />
      <Meta
        property="og:description"
        content="Join our mission to revolutionize luxury payments with secure, instant bank transfers."
      />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content="https://zenobiapay.com/hero.png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content="Careers at Zenobia Pay" />
      <Meta
        name="twitter:description"
        content="Join our mission to revolutionize payments."
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
    </>
  );
}
