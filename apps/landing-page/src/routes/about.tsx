import { Title, Meta } from "@solidjs/meta";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function About() {
  return (
    <>
      <Title>About - Zenobia Pay</Title>
      <Meta
        name="description"
        content="Zenobia Pay enables luxury brands and jewelers to accept pay-by-bank."
      />
      <Meta property="og:title" content="About Zenobia Pay" />
      <Meta
        property="og:description"
        content="We've built an instant clearing pay-by-bank network with bundled fraud insurance that costs 3 times less in fees than credit card processing."
      />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content="https://zenobiapay.com/hero.png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content="About Zenobia Pay" />
      <Meta
        name="twitter:description"
        content="We've built an instant clearing pay-by-bank network with bundled fraud insurance that costs 3 times less in fees than credit card processing."
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
                // height: `calc(100vh - var(--hero-bottom-height))`,
                "padding-top": `calc(var(--nav-height) + 4rem)`,
                "padding-bottom": "var(--hero-bottom-height)",
              }}
            >
              <h2 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                <span class="text-white drop-shadow-lg">
                  Zenobia Pay enables luxury brands and jewelers to accept
                  pay-by-bank.
                  <br />
                  <br />
                  We've built an instant clearing pay-by-bank network with
                  bundled fraud insurance that costs 3 times less in fees than
                  credit card processing.
                  <br />
                  <br />
                  We are building Zenobia Pay specifically for expensive goods.
                  Items are high intentionality, so we can actually convert
                  customers at checkout. Payments go through your phone without
                  you having to download an app.
                  <br />
                  <br />
                  Soon, we'll use purchase metadata to provide a digital proof
                  of purchase for the entire lifespan of luxury goods, so that
                  brands can earn verification fees on the $39B resale market,
                  which is growing 3 times faster than new sales.
                  <br />
                  <br />
                  Zenobia Pay is a branded pay-by-bank rewards network that is
                  the default payment mechanism for all purchases over $200.
                </span>
              </h2>
            </div>

            {/* Bottom curved block */}
          </section>

          {/* First Content Section */}

          {/* Green Section */}
        </main>
        <Footer />
      </div>
    </>
  );
}
