import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <>
      <Title>Welcome to Our Site</Title>
      <main class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section class="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span class="block">Welcome to</span>
              <span class="block text-indigo-600">Our Amazing Platform</span>
            </h1>
            <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover our latest insights and stay updated with our blog posts.
            </p>
            <div class="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
              <div class="rounded-md shadow">
                <A
                  href="/blog"
                  class="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Read Our Blog
                </A>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section class="py-12 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
              <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need
              </p>
            </div>

            <div class="mt-10">
              <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {[
                  {
                    title: "Server-Side Rendering",
                    description:
                      "Optimal SEO performance with server-side rendered content",
                  },
                  {
                    title: "Modern Stack",
                    description:
                      "Built with SolidStart for the best developer experience",
                  },
                  {
                    title: "Markdown Support",
                    description: "Write content in Markdown with MDX support",
                  },
                  {
                    title: "Fast Performance",
                    description:
                      "Lightning-fast page loads and smooth interactions",
                  },
                ].map((feature) => (
                  <div class="relative">
                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div class="ml-16">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p class="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
