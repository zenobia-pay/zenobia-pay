import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { getBlogPosts } from "~/lib/mdx";
import { createResource } from "solid-js";

// Add caching headers
export const route = {
  load: async () => {
    const posts = await getBlogPosts();
    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
      data: posts,
    };
  },
};

export default function BlogIndex() {
  const [posts] = createResource(getBlogPosts);

  return (
    <>
      <Title>Blog - Our Latest Posts</Title>
      <Meta
        name="description"
        content="Discover our latest insights and updates from our team"
      />
      <Meta property="og:title" content="Our Blog" />
      <Meta
        property="og:description"
        content="Discover our latest insights and updates from our team"
      />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Our Blog" />
      <Meta
        name="twitter:description"
        content="Discover our latest insights and updates from our team"
      />

      <main class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Blog
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Latest insights and updates from our team
            </p>
          </div>

          <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.loading && (
              <div class="col-span-full text-center">
                <p class="text-gray-500">Loading posts...</p>
              </div>
            )}

            {posts.error && (
              <div class="col-span-full text-center">
                <p class="text-red-500">
                  Error loading posts. Please try again later.
                </p>
              </div>
            )}

            {posts()?.map((post) => (
              <article class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <svg
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                      <p class="text-sm font-medium text-gray-500">
                        By {post.author}
                      </p>
                    </div>
                  </div>
                  <A href={`/blog/${post.slug}`} class="block mt-4">
                    <h2 class="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                      {post.title}
                    </h2>
                    <p class="mt-3 text-base text-gray-500">
                      {post.description}
                    </p>
                  </A>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
