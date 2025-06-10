import { Title, Meta } from "@solidjs/meta";
import { useParams, A } from "@solidjs/router";
import { getBlogPost } from "~/lib/mdx";
import { Show, createResource } from "solid-js";
import { marked } from "marked";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "~/components/BottomCurvedBlock";

// Configure marked to use synchronous mode
marked.setOptions({
  async: false,
  gfm: true,
  breaks: true,
});

// Add Cloudflare caching
export const route = {
  load: async ({ params }: { params: { slug: string } }) => {
    const post = await getBlogPost(params.slug);
    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "CDN-Cache-Control": "public, max-age=86400",
        "Vercel-CDN-Cache-Control": "public, max-age=86400",
      },
      data: post,
    };
  },
};

export default function BlogPost() {
  const params = useParams();
  const [post] = createResource(() => params.slug, getBlogPost);

  return (
    <Show
      when={post()}
      fallback={
        <div class="min-h-screen bg-[rgb(var(--bg-light))] flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-black">Post not found</h1>
            <A
              href="/blog"
              class="mt-4 text-[var(--brand-green)] hover:text-[var(--brand-green-dark)]"
            >
              Return to blog
            </A>
          </div>
        </div>
      }
    >
      {(post) => (
        <>
          <Title>{post().title} - Our Blog</Title>
          <Meta name="description" content={post().description} />
          <Meta name="author" content={post().author} />
          <Meta property="article:published_time" content={post().date} />
          <Meta property="og:title" content={post().title} />
          <Meta property="og:description" content={post().description} />
          <Meta property="og:type" content="article" />
          <Meta name="twitter:card" content="summary" />
          <Meta name="twitter:title" content={post().title} />
          <Meta name="twitter:description" content={post().description} />

          <main class="min-h-screen bg-white">
            {/* Hero Section */}
            <section class="h-[60vh] relative bg-black text-white flex flex-col">
              {/* Top padding block */}
              <div
                class="flex-grow px-6"
                style={{
                  "padding-top": `calc(var(--nav-height) + 4rem)`,
                }}
              >
                <div class="max-w-7xl mx-auto w-full h-full flex flex-col">
                  {/* Title and metadata */}
                  <div class="flex-grow flex flex-col">
                    <h1 class="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
                      {post().title}
                    </h1>
                    <div class="flex items-center text-neutral-400 text-lg">
                      <span>{new Date(post().date).toLocaleDateString()}</span>
                      <span class="mx-2">•</span>
                      <span>By {post().author}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom curved block */}
              <div class="flex-shrink-0">
                <BottomCurvedBlock
                  background="rgb(var(--bg-light))"
                  leftText=""
                  rightText=""
                />
              </div>
            </section>

            {/* Content Section */}
            <section class="bg-[rgb(var(--bg-light))] pt-12 pb-120">
              <div class="max-w-[1400px] mx-auto px-4 md:px-12">
                <div class="max-w-3xl">
                  <div
                    class="prose prose-xl prose-neutral max-w-none font-large
                      prose-headings:font-bold prose-headings:text-black prose-headings:mb-4 prose-headings:mt-10
                      prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:text-neutral-700
                      prose-a:text-[var(--brand-green)] prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-2xl prose-img:shadow-sm
                      prose-blockquote:border-l-[var(--brand-green)] prose-blockquote:bg-neutral-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-neutral-700
                      prose-strong:text-black prose-strong:font-bold
                      prose-code:text-[var(--brand-green)] prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-neutral-900 prose-pre:text-white prose-pre:rounded-2xl prose-pre:shadow-sm
                      prose-hr:border-neutral-200
                      prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-neutral-400 prose-li:text-neutral-600 prose-li:leading-relaxed prose-li:mb-2"
                    innerHTML={marked(post().content) as string}
                  />
                  <div class="mt-12 pt-8 border-t border-neutral-200">
                    <A
                      href="/blog"
                      class="inline-flex items-center text-[var(--brand-green)] hover:text-[var(--brand-green-dark)] font-medium"
                    >
                      ← Back to blog
                    </A>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </Show>
  );
}
