import { Title, Meta } from "@solidjs/meta";
import { createResource } from "solid-js";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "~/components/BottomCurvedBlock";
import { getLegalContent } from "~/lib/mdx";

export const route = {
  load: async () => {
    const content = await getLegalContent("debit-auth");
    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
      data: content,
    };
  },
};

export default function DebitAuth() {
  const [content] = createResource(() => getLegalContent("debit-auth"));

  return (
    <>
      <Title>Debit Authorization - Zenobia Pay</Title>
      <Meta
        name="description"
        content="Debit Authorization Agreement for Zenobia Pay services"
      />
      <Meta property="og:title" content="Debit Authorization" />
      <Meta
        property="og:description"
        content="Debit Authorization Agreement for Zenobia Pay services"
      />
      <Meta property="og:type" content="website" />

      <main class="min-h-screen bg-white">
        {/* Hero Section */}
        <section class="relative bg-black text-white">
          <div
            class="flex flex-col items-start justify-center px-6"
            style={{
              "padding-top": `calc(var(--nav-height) + 4rem)`,
              "padding-bottom": "var(--hero-bottom-height)",
            }}
          >
            <div class="max-w-7xl mx-auto w-full">
              <div class="flex flex-col">
                <h2 class="text-4xl md:text-7xl font-bold leading-tight tracking-tight">
                  Debit Authorization
                </h2>
              </div>
            </div>
          </div>

          <BottomCurvedBlock
            leftText="Payment"
            rightText="Authorization"
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

        {/* Content Section */}
        <section class="bg-[rgb(var(--bg-light))] pt-12 pb-64">
          <div class="max-w-[1400px] mx-auto px-4">
            {content.loading && (
              <div class="text-center">
                <p class="text-neutral-400 font-medium">Loading content...</p>
              </div>
            )}
            {content.error && (
              <div class="text-center">
                <p class="text-red-500 font-medium">
                  Error loading content. Please try again later.
                </p>
              </div>
            )}
            {content() && (
              <div class="bg-white rounded-3xl p-8 shadow-sm max-w-4xl mx-auto">
                <div class="prose prose-lg max-w-none">{content()}</div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
