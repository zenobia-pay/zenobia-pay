import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import SectionCard from "~/components/SectionCard";
import Footer from "~/components/Footer";
import { createSignal, For } from "solid-js";
import BottomCurvedBlock from "../components/BottomCurvedBlock";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Header */}

      {/* Content */}
      <main class="flex-grow">
        {/* Hero Section */}
        <section class="h-screen relative text-white overflow-hidden">
          {/* Video Background */}
          <div class="absolute inset-0 w-full h-full">
            <style>
              {`
                @media (max-aspect-ratio: 3/2) {
                  .video-container video {
                    display: none;
                  }
                  .video-container::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: black;
                  }
                }
              `}
            </style>
            <div class="video-container absolute inset-0">
              <video
                class="absolute min-w-full min-h-full object-cover"
                autoplay
                muted
                loop
                playsinline
                poster="/video-poster.jpg"
              >
                <source src="/hero-300kb.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Overlay to ensure text readability */}
          </div>

          {/* Top padding block */}
          <div
            class="flex flex-col items-center justify-center px-6 relative z-10 bg-none"
            style={{
              height: `calc(100vh - var(--hero-bottom-height))`,
              "padding-top": `calc(var(--nav-height) + 2rem)`,
              "padding-bottom": "var(--hero-bottom-height)",
            }}
          ></div>

          {/* Bottom curved block */}
          <BottomCurvedBlock
            leftText="Payments software for luxury"
            rightText="3x cheaper payments"
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
          <div class="max-w-7xl mx-auto px-4 py-50 max-w-[900px]">
            <h2 class="text-6xl font-bold mb-8 tracking-tight">
              Zenobia Pay enables luxury brands and jewelers to accept
              pay-by-bank.
            </h2>
            <p class="text-2xl text-neutral-500 mb-12">
              We've built an instant clearing pay-by-bank network with bundled
              fraud insurance that costs 3 times less in fees than credit card
              processing.
            </p>
          </div>
          <BottomCurvedBlock
            leftText=""
            rightText=""
            background="var(--brand-green)"
          />
        </section>

        {/* Green Section */}
        <section
          class="relative"
          style={{ "background-color": "var(--brand-green)" }}
        >
          {/* Content block */}
          <div class="py-40 px-6">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12">
              {/* Left: Header */}
              <div class="md:w-1/3 w-full">
                <h2 class="text-4xl font-bold mb-4 text-white tracking-tight md:mb-0">
                  Why Choose Zenobia?
                </h2>
              </div>
              {/* Right: Features Grid */}
              <div class="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <BottomCurvedBlock
            leftText=""
            rightText=""
            background="rgb(var(--bg-light))"
          />
        </section>
      </main>
      {/* FAQ Section */}
      <section class="relative" style={{ background: "rgb(var(--bg-light))" }}>
        <div class="max-w-3xl mx-auto my-24 px-4">
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
                <span class="text-xl font-semibold text-black">
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
