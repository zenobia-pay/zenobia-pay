import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { getBlogPosts } from "~/lib/mdx";
import { createResource, createSignal, For } from "solid-js";
import Footer from "~/components/Footer";
import BottomCurvedBlock from "~/components/BottomCurvedBlock";

const topics = [
  { label: "All Posts", value: "all" },
  { label: "Chargebacks", value: "chargebacks" },
];

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
  const [selectedTopic, setSelectedTopic] = createSignal("all");

  const filteredPosts = () => {
    const allPosts = posts();
    if (!allPosts) return [];
    if (selectedTopic() === "all") return allPosts;

    const selectedCategories = selectedTopic().split(",");
    return allPosts.filter((post) => {
      if (!post.category) return false;
      const postCategories = post.category.split(",");
      return selectedCategories.some((cat) => postCategories.includes(cat));
    });
  };

  return (
    <>
      <Title>Blog - Zenobia Pay</Title>
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
              {/* BLOG text and statements */}
              <div class="flex flex-col">
                <h2 class="text-4xl md:text-7xl font-bold leading-tight tracking-tight">
                  Follow our blog
                </h2>
              </div>
            </div>
          </div>

          {/* Bottom curved block */}
          <BottomCurvedBlock
            leftText=""
            rightText=""
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

        {/* Blog Content */}
        <section class="bg-[rgb(var(--bg-light))] pt-12 pb-64">
          <div class="max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside class="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
              {/* Filter Card */}
              <div class="rounded-3xl bg-neutral-100 p-6">
                <h2 class="text-2xl font-bold mb-4 tracking-tight">Filter</h2>
                <div class="border-b border-neutral-200 mb-4"></div>
                <div class="text-neutral-500 text-sm mb-2">By topic</div>
                <ul class="space-y-1">
                  {topics.map((topic) => (
                    <li
                      class={
                        selectedTopic() === topic.value
                          ? "font-bold text-black"
                          : "text-neutral-400 font-medium hover:text-black transition cursor-pointer"
                      }
                      onClick={() => setSelectedTopic(topic.value)}
                    >
                      {selectedTopic() === topic.value ? "• " : ""}
                      {topic.label}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Feed/Main Content */}
            <section class="flex-1 min-w-0">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.loading && (
                  <div class="col-span-full text-center">
                    <p class="text-neutral-400 font-medium">Loading posts...</p>
                  </div>
                )}
                {posts.error && (
                  <div class="col-span-full text-center">
                    <p class="text-red-500 font-medium">
                      Error loading posts. Please try again later.
                    </p>
                  </div>
                )}
                {filteredPosts().map((post) => (
                  <A
                    href={`/blog/${post.slug}`}
                    class="block group rounded-3xl overflow-hidden bg-neutral-50 hover:bg-neutral-100 transition shadow-sm"
                  >
                    <div class="p-8">
                      <div class="flex items-center gap-2 text-neutral-400 text-sm font-medium mb-2">
                        <span>{post.category || "Uncategorized"}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <h2 class="text-2xl font-bold text-black group-hover:text-[var(--brand-green)] tracking-tight mb-3">
                        {post.title}
                      </h2>
                      <p class="text-neutral-500 font-medium line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </A>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
