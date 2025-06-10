import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import SectionCard from "~/components/SectionCard";
import Footer from "~/components/Footer";
import { createSignal, For, onMount, onCleanup } from "solid-js";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Home() {
  let videoRef: HTMLVideoElement | undefined;
  const [isVideoVisible, setIsVideoVisible] = createSignal(false);

  onMount(() => {
    const handleScroll = () => {
      if (!videoRef) return;

      const rect = videoRef.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setIsVideoVisible(isVisible);

      if (isVisible) {
        const scrollProgress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const videoDuration = videoRef.duration;
        videoRef.currentTime = Math.max(
          0,
          Math.min(videoDuration, scrollProgress * videoDuration)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <Title>
        Zenobia Pay - Instant Bank Transfer Payments for Luxury Brands
      </Title>
      <Meta
        name="description"
        content="Zenobia Pay enables luxury brands and jewelers to accept pay-by-bank.."
      />
      <Meta property="og:title" content="Zenobia Pay" />
      <Meta
        property="og:description"
        content="Zenobia Pay enables luxury brands and jewelers to accept pay-by-bank."
      />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content="https://zenobiapay.com/hero.png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content="Zenobia Pay" />
      <Meta
        name="twitter:description"
        content="Zenobia Pay enables luxury brands and jewelers to accept pay-by-bank."
      />
      <Meta name="twitter:image" content="https://zenobiapay.com/hero.png" />

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/hero-200kb.webm"
        as="video"
        type="video/webm"
      />
      <link rel="preload" href="/hero-200kb.mp4" as="video" type="video/mp4" />

      <div class="min-h-screen flex flex-col">
        {/* Header */}

        {/* Content */}
        <main class="flex-grow">
          {/* Hero Section */}
          <section class="h-screen relative text-white overflow-hidden">
            {/* Video Background */}
            <div class="absolute inset-0 w-full h-full overflow-hidden">
              <div class="video-container absolute inset-0 w-full h-full">
                <video
                  class="absolute w-full h-full object-cover"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="auto"
                >
                  <source src="/hero-200kb.webm" type="video/webm" />
                  <source src="/hero-200kb.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Overlay to ensure text readability */}
            </div>

            {/* Top padding block */}
            <div
              class="flex flex-col items-start justify-center px-6 relative z-10 bg-none w-full"
              style={{
                height: `calc(100vh - var(--hero-bottom-height))`,
                "padding-top": `calc(var(--nav-height) - 2rem)`,
                "padding-bottom": "var(--hero-bottom-height)",
              }}
            >
              <h1 class="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-black text-white tracking-[-0.02em] leading-[0.9]">
                ZENOBIA PAY
              </h1>
            </div>

            {/* Bottom curved block */}
            <BottomCurvedBlock
              leftText="Payments software for luxury."
              rightText="3x cheaper payments."
              background="rgb(var(--bg-light))"
              showButton={true}
              buttonOnClick={() =>
                document
                  .querySelector("section:nth-of-type(2)")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              buttonText=""
            />
          </section>

          {/* First Content Section */}
          <section style={{ background: "rgb(var(--bg-light))" }}>
            <div class="max-w-7xl mx-auto px-4 py-24 md:py-50 max-w-[900px]">
              <h2 class="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                Zenobia Pay enables luxury brands and jewelers to accept
                pay-by-bank.
              </h2>
              <p class="text-2xl text-neutral-500 mb-12 max-w-[700px]">
                We've built an instant clearing pay-by-bank network with bundled
                fraud insurance that costs 3 times less in fees than credit card
                processing.
              </p>
            </div>
            <BottomCurvedBlock leftText="" rightText="" background="black" />
          </section>

          <section class="relative" style={{ "background-color": "black" }}>
            {/* Content block */}
            <div class="py-24 md:py-40 px-6">
              <div class="mx-auto">
                {/* Header */}
                <div class="mb-12">
                  <h2 class="text-6xl font-bold text-white tracking-tight">
                    What We Are
                  </h2>
                </div>
                {/* Features Grid */}
                <div class="grid md:grid-cols-3 gap-8">
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      A new payment option
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      Zenobia Pay is a new payment flow. Accept bank transfers
                      as payments without dealing with bank account numbers.
                    </p>
                  </div>
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      Mobile flow
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      Zenobia Pay is already available on your iPhone, no app
                      download required. Point your camera at your laptop screen
                      to pay directly from your bank account.
                    </p>
                  </div>
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      Pay With Zenobia button
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      A 'Pay With Zenobia' button to add to the checkout flow of
                      your merchant site.
                    </p>
                  </div>
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      Secure payments for luxury merchants
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      Zenobia Pay's mobile flow stops fraud at the source. We
                      shift the liability and provide a fraud chargeback
                      guarantee.
                    </p>
                  </div>
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      3x cheaper payments
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      Credit card processing fees average 3% of transaction
                      value. Zenobia Pay charges 1%.
                    </p>
                  </div>
                  <div class="p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold mb-4 text-white tracking-tight">
                      Eliminate friendly fraud
                    </h3>
                    <p class="text-white/80 text-lg font-medium">
                      Zenobia Pay helps merchants accept pay-by-bank,
                      independent of card networks. We manually review every
                      dispute case to eliminate friendly fraud.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <BottomCurvedBlock leftText="" rightText="" background="black" />
          </section>

          {/* How It Works Section */}
          <section class="relative" style={{ background: "black" }}>
            <div class="max-w-7xl mx-auto px-6 py-24">
              <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="order-2 md:order-1">
                  <video
                    ref={videoRef}
                    class="w-full rounded-lg shadow-lg"
                    muted
                    playsinline
                    preload="auto"
                    width="1280"
                    height="720"
                  >
                    <source src="/linkpaydone.webm" type="video/webm" />
                    <source src="/linkpaydone.mp4" type="video/mp4" />
                  </video>
                </div>
                <div class="space-y-6 order-1 md:order-2 flex flex-col items-center">
                  <div class="w-full">
                    <h2 class="text-4xl font-bold mb-12 tracking-tight text-white text-left">
                      HOW IT WORKS
                    </h2>
                  </div>
                  <div class="w-full">
                    <ul class="space-y-6">
                      <li
                        class="text-2xl"
                        style={{ color: "rgb(var(--text-off-white))" }}
                      >
                        No app download required
                      </li>
                      <li
                        class="text-2xl"
                        style={{ color: "rgb(var(--text-off-white))" }}
                      >
                        No signup
                      </li>
                      <li
                        class="text-2xl"
                        style={{ color: "rgb(var(--text-off-white))" }}
                      >
                        Link your bank account, hit pay, and you're done.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <BottomCurvedBlock
              leftText=""
              rightText=""
              background="rgb(var(--bg-light))"
            />
          </section>
        </main>
        {/* FAQ Section */}
        <section
          class="relative py-24 md:py-40"
          style={{ background: "rgb(var(--bg-light))" }}
        >
          <div class="max-w-3xl mx-auto px-4">
            <h2 class="text-4xl font-bold mb-10 tracking-tight">FAQ</h2>
            <FAQList />
            <div
              style={{
                height: "var(--hero-bottom-height)",
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "calc(var(--hero-bottom-height) * -1)",
                width: "100%",
                "background-color": "rgb(var(--bg-light))",
                "border-radius":
                  "0 0 var(--hero-bottom-radius) var(--hero-bottom-radius)",
                "z-index": 2,
                "pointer-events": "none",
              }}
            ></div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

const faqs = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 10l9-7 9 7" />
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 21h8" />
      </svg>
    ),
    question: "How does Zenobia Pay work?",
    answer: `Zenobia Pay works by allowing luxury merchants to accept pay-by-bank.<br/><br/>
Our platform uses <a href=\"https://www.nacha.org/ach-network\" target=\"_blank\" rel=\"noopener noreferrer\">ACH</a> to pull funds out of the customer's account.<br/>
These funds are sent to a <a href=\"https://www.moderntreasury.com/learn/what-is-an-fbo-account\" target=\"_blank\" rel=\"noopener noreferrer\">beneficiary account</a> for the merchant.<br/>
We push the funds using <a href=\"https://www.frbservices.org/financial-services/fednow/about.html\" target=\"_blank\" rel=\"noopener noreferrer\">FedNow</a> with T+2 settlement to your payout account.<br/><br/>
Our platform provides instant clearance on ACH bank transfers without merchants having to worry about ACH returns or fraud.<br/>
This eliminates credit card processing fees, while providing a seamless checkout experience for high-value transactions.`,
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12v-2a3 3 0 0 1 6 0v2" />
      </svg>
    ),
    question: "Is Zenobia Pay secure?",
    answer: `Absolutely. Zenobia Pay uses Plaid to connect bank details using OAuth, and refresh tokens are stored in a secure enclave on the device itself.<br/><br/>Zenobia Pay also uses device hardware signing and biometric authentication to ensure that payments are authorized from the same device.<br/><br/>We regularly conduct penetration tests to ensure that your data remains secure. We follow security best practices and encrypt all data at rest and in transit.`,
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    question: "What is Zenobia Pay's fraud guarantee to merchants?",
    answer: `Customer initiated returns for reasons "account stolen", "transaction not authorized", or "fraud" are covered by Zenobia Pay. Merchants are not liable for these tyypes of fraud or their related ACH-returns.<br/><br/>Fraud guarantee does not cover disputes for the following reasons:<br/><br/>
• Item did not arrive<br/>
• Item arrived damaged or defective<br/>
• Wrong item received (e.g. wrong size, color, or product)<br/>
• Item not as described (e.g. materially different from listing/photos)<br/>
• Merchandise or service not rendered as promised (e.g. service canceled or incomplete)<br/><br/>
Zenobia Pay also works to eliminate friendly fraud. We partner with a small group of high-end merchants, and we know that false chargebacks are a huge problem. Unlike credit card processors who have millions of merchants, we manually review every dispute and promise sane resolution for merchants on Zenobia Pay.`,
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 4v6h6" />
        <path d="M20 20v-6h-6" />
        <path d="M4 10c1.38-4.36 7.24-6.36 10.36-2.36L20 10" />
        <path d="M20 14c-1.38 4.36-7.24 6.36-10.36 2.36L4 14" />
      </svg>
    ),
    question: "Does Zenobia Pay have a refund mechanism?",
    answer: `Yes! Merchants can easily refund customers from the Zenobia Pay dashboard. Customers will receive a refund within 3 days.`,
  },
];

function FAQList() {
  const [openIndices, setOpenIndices] = createSignal<number[]>([]);
  function toggleIndex(idx: number) {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }
  return (
    <ul class="divide-y divide-neutral-300">
      <For each={faqs}>
        {(faq, i) => (
          <li>
            <button
              class="w-full flex items-center justify-between py-6 focus:outline-none group"
              onClick={() => toggleIndex(i())}
            >
              <span class="flex items-center gap-4">
                <span class="text-2xl">{faq.icon}</span>
                <span class="text-xl font-semibold text-black text-left">
                  {faq.question}
                </span>
              </span>
              <span
                class="transition-transform duration-200 text-3xl text-neutral-500 group-hover:text-black"
                style={{
                  transform: openIndices().includes(i())
                    ? "rotate(45deg)"
                    : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>
            <div
              class="overflow-hidden transition-all duration-300"
              style={{
                "max-height": openIndices().includes(i()) ? "1000px" : "0",
                opacity: openIndices().includes(i()) ? 1 : 0,
                "padding-bottom": openIndices().includes(i()) ? "1.5rem" : "0",
              }}
            >
              <div class="text-neutral-600 text-lg pr-12">
                <span innerHTML={faq.answer} />
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
}
