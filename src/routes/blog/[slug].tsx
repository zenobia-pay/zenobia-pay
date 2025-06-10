import { Title, Meta } from "@solidjs/meta";
import { useParams, A } from "@solidjs/router";
import { getBlogPost, getBlogPosts } from "~/lib/mdx";
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
  const [allPosts] = createResource(getBlogPosts);

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
            <section class="relative bg-black text-white">
              {/* Top padding block */}
              <div
                class="flex flex-col items-start justify-center px-6"
                style={{
                  "padding-top": `calc(var(--nav-height) + 4rem)`,
                  "padding-bottom": "var(--hero-bottom-height)",
                }}
              >
                <div class="max-w-7xl mx-auto w-full">
                  {/* Title and metadata */}
                  <div class="flex flex-col">
                    <A
                      href="/blog"
                      class="inline-flex items-center text-neutral-400 hover:text-white font-medium text-lg mb-6"
                    >
                      ← Back to blog
                    </A>
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
                <div class="py-8 md:p-12">
                  <div
                    class="prose prose-lg max-w-none prose-headings:text-black prose-h1:text-3xl md:prose-h1:text-5xl prose-a:text-[var(--brand-green)] hover:prose-a:text-[var(--brand-green-dark)] prose-img:rounded-2xl prose-img:shadow-sm prose-blockquote:border-l-[var(--brand-green)] prose-blockquote:bg-neutral-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-neutral-700 prose-code:text-[var(--brand-green)] prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-900 prose-pre:text-white prose-pre:rounded-2xl prose-pre:shadow-sm"
                    innerHTML={marked(post().content) as string}
                  />
                  {post().lastUpdated && post().lastUpdated !== post().date && (
                    <div class="mt-8 text-neutral-500 text-sm">
                      Last updated:{" "}
                      {new Date(
                        post().lastUpdated as string
                      ).toLocaleDateString()}
                    </div>
                  )}
                  <div class="mt-12 pt-8 border-t border-neutral-200">
                    <A
                      href="/blog"
                      class="inline-flex items-center text-neutral-600 hover:text-neutral-800 font-medium text-lg"
                    >
                      ← Back to blog
                    </A>
                  </div>

                  {/* Recommended Articles */}
                  {post().recommendedPosts &&
                    post().recommendedPosts.length > 0 &&
                    allPosts() && (
                      <div class="mt-16">
                        <h2 class="text-2xl font-bold mb-6">
                          Recommended Articles
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {post().recommendedPosts.map((slug) => {
                            const recommendedPost = allPosts()?.find(
                              (p) => p.slug === slug
                            );
                            if (!recommendedPost) return null;
                            return (
                              <A
                                href={`/blog/${recommendedPost.slug}`}
                                class="block group rounded-2xl overflow-hidden bg-neutral-50 hover:bg-neutral-100 transition shadow-sm"
                              >
                                <div class="p-6">
                                  <h3 class="text-xl font-bold text-black group-hover:text-[var(--brand-green)] tracking-tight mb-2">
                                    {recommendedPost.title}
                                  </h3>
                                  <p class="text-neutral-500 font-medium line-clamp-2">
                                    {recommendedPost.description}
                                  </p>
                                </div>
                              </A>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
