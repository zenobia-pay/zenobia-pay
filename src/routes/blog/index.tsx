import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { getBlogPosts } from "~/lib/mdx";
import { createResource, createSignal, For } from "solid-js";
import Footer from "~/components/Footer";

const topics = [
  { label: "All Posts", value: "all" },
  { label: "Insights", value: "insights" },
];

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
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    question: "UI Design",
    answer:
      "UI Design is about creating visually appealing and user-friendly interfaces for digital products.",
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    question: "Development",
    answer:
      "Development involves building and maintaining the codebase for web and mobile applications.",
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 7h10v10H7z" />
      </svg>
    ),
    question: "Branding",
    answer:
      "Branding is the process of creating a unique identity and image for a product or company.",
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    question: "Animation",
    answer:
      "Animation brings interfaces to life and improves user experience through motion.",
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    question: "Motion",
    answer:
      "Motion design uses animation and movement to communicate and guide users.",
  },
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
    return allPosts.filter(
      (post) => (post as any).category === selectedTopic()
    );
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

      <main class="min-h-screen bg-white pt-[calc(var(--nav-height)+2rem)] pb-0">
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
          <section
            class="flex-1 min-w-0 relative"
            style={{
              "border-radius":
                "0 0 var(--hero-bottom-radius) var(--hero-bottom-radius)",
            }}
          >
            <h1 class="text-5xl font-bold mb-8 tracking-tight">Blog</h1>
            <div class="border-b border-dashed border-neutral-200 mb-10"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                  <div class="aspect-[4/3] bg-neutral-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        (post as any).image ||
                        "https://placehold.co/600x450/000/fff?text=Post+Image"
                      }
                      alt={post.title}
                      class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div class="p-6">
                    <div class="text-neutral-400 text-sm font-medium mb-1">
                      {(post as any).category || "Uncategorized"}
                    </div>
                    <h2 class="text-2xl font-bold text-black group-hover:text-[var(--brand-green)] tracking-tight mb-2">
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
        <div
          style={{
            height: "var(--hero-bottom-height)",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "calc(var(--hero-bottom-height) * -1)",
            width: "100%",
            "background-color": "white",
            "border-radius":
              "0 0 var(--hero-bottom-radius) var(--hero-bottom-radius)",
            "z-index": 2,
            "pointer-events": "none",
          }}
        ></div>
      </main>

      <Footer />
    </>
  );
}
