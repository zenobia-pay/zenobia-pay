import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import Footer from "~/components/Footer";

export default function NotFound() {
  return (
    <>
      <Title>404 - Zenobia Pay</Title>
      <Meta
        name="description"
        content="The page you're looking for doesn't exist or has been moved."
      />
      <Meta property="og:title" content="Page Not Found" />
      <Meta
        property="og:description"
        content="The page you're looking for doesn't exist or has been moved."
      />
      <Meta property="og:type" content="website" />
      <Meta name="robots" content="noindex, follow" />
      <div class="min-h-screen flex flex-col">
        <main class="flex-grow">
          <section class="relative bg-black text-white">
            <div
              class="flex flex-col justify-center px-6"
              style={{
                "padding-top": `calc(var(--nav-height) + 4rem)`,
                "padding-bottom": "var(--hero-bottom-height)",
              }}
            >
              <div class="max-w-2xl ">
                <h1 class="text-7xl font-bold mb-8 tracking-tight text-white drop-shadow-lg">
                  404
                </h1>
                <p class="text-2xl text-white/90 mb-12">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <div class="flex gap-6 ">
                  <A
                    href="/"
                    class="px-6 py-3 rounded-full transition-all duration-300 ease-in-out bg-white/90 text-black hover:scale-110 hover:shadow-xl hover:bg-white border-2 border-black"
                  >
                    Return Home
                  </A>
                  <A
                    href="/contact"
                    class="px-6 py-3 rounded-full transition-all duration-300 ease-in-out bg-white/90 text-black hover:scale-110 hover:shadow-xl hover:bg-white"
                  >
                    Contact Us
                  </A>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
