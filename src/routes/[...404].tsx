import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div class="max-w-2xl text-center">
        <h1 class="text-7xl font-bold mb-8 tracking-tight">404</h1>
        <p class="text-2xl text-neutral-600 mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex gap-6 justify-center">
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
    </main>
  );
}
