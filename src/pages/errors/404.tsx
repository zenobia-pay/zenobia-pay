export default function NotFound() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-900">404</h1>
        <p class="text-xl text-gray-600 mt-4">Page not found</p>
        <a
          href="/"
          class="mt-8 inline-flex items-center px-4 py-2 rounded-full bg-secondary text-white hover:bg-[#6bbeb1] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
