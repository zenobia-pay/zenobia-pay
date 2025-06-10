import { Title, Meta } from "@solidjs/meta";
import { useParams, A } from "@solidjs/router";
import { getBlogPost } from "~/lib/mdx";
import { Show, createResource } from "solid-js";
import { marked } from "marked";
import Footer from "~/components/Footer";

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
        <div class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900">Post not found</h1>
            <A href="/blog" class="mt-4 text-indigo-600 hover:text-indigo-500">
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

          <main class="min-h-screen bg-gray-50 pt-[calc(var(--nav-height)+2rem)] pb-12">
            <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 py-8">
                  <div class="flex items-center justify-between">
                    <div>
                      <h1 class="text-3xl font-bold text-gray-900">
                        {post().title}
                      </h1>
                      <div class="mt-2 flex items-center text-sm text-gray-500">
                        <span>
                          {new Date(post().date).toLocaleDateString()}
                        </span>
                        <span class="mx-2">•</span>
                        <span>By {post().author}</span>
                      </div>
                    </div>
                    <A
                      href="/blog"
                      class="text-indigo-600 hover:text-indigo-500"
                    >
                      ← Back to blog
                    </A>
                  </div>
                  <div
                    class="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto"
                    innerHTML={marked(post().content) as string}
                  />
                </div>
              </div>
            </article>
          </main>
          <Footer />
        </>
      )}
    </Show>
  );
}
