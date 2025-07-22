import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main class="min-h-screen bg-white">
      <Title>Verified - Zenobia Pay</Title>

      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Verified
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Your verification platform powered by Zenobia Pay
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 class="text-lg font-semibold text-green-800 mb-2">
              Project Setup Complete
            </h2>
            <p class="text-green-700">
              Your SolidStart project is ready for development and deployment to
              Cloudflare Workers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
