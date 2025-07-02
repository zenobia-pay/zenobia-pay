import { Title, Meta } from "@solidjs/meta";
import { createResource } from "solid-js";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "~/components/BottomCurvedBlock";
import { getLegalContent } from "~/lib/mdx";
import { marked } from "marked";

// Configure marked to use synchronous mode
marked.setOptions({
  async: false,
  gfm: true,
  breaks: true,
});

export const route = {
  load: async () => {
    const content = await getLegalContent("terms");
    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
      data: content,
    };
  },
};

export default function Terms() {
  const [content] = createResource(() => getLegalContent("terms"));

  return (
    <>
      <Title>Terms of Service - Zenobia Pay</Title>
      <Meta
        name="description"
        content="Terms of Service for Zenobia Pay services"
      />
      <Meta property="og:title" content="Terms of Service" />
      <Meta
        property="og:description"
        content="Terms of Service for Zenobia Pay services"
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
                <h1 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
                  Terms of Service
                </h1>
              </div>
            </div>
          </div>

          <BottomCurvedBlock
            background="rgb(var(--bg-light))"
            leftText=""
            rightText=""
          />
        </section>

        {/* Content Section */}
        <section
          class="pt-16 pb-32"
          style={{ background: "rgb(var(--bg-light))" }}
        >
          <div class="max-w-4xl px-4 md:px-0">
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
              <div class="py-8 md:p-12">
                <div
                  class="prose prose-lg max-w-none prose-headings:text-black prose-h1:text-3xl md:prose-h1:text-5xl prose-a:text-[var(--brand-green)] hover:prose-a:text-[var(--brand-green-dark)] prose-img:rounded-2xl prose-img:shadow-sm prose-blockquote:border-l-[var(--brand-green)] prose-blockquote:bg-neutral-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-neutral-700 prose-code:text-[var(--brand-green)] prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-900 prose-pre:text-white prose-pre:rounded-2xl prose-pre:shadow-sm"
                  innerHTML={marked(content()) as string}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
