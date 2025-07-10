import { Show } from "solid-js";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const auth = useAuth();

  return (
    <main class="min-h-screen bg-black text-white">
      <Show
        when={auth.user()}
        fallback={
          <div class="min-h-screen flex items-center justify-center bg-black">
            <div class="text-center max-w-md mx-auto px-6">
              <div class="mb-8">
                <h1 class="text-6xl font-light tracking-wider text-white mb-4">
                  ZENOBIA
                </h1>
                <div class="w-24 h-1 bg-white mx-auto"></div>
              </div>
              <p class="text-gray-400 text-lg mb-8 font-light">
                Access restricted. Authentication required.
              </p>
              <a
                href="/login"
                class="inline-block bg-white text-black px-8 py-3 font-medium tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 border border-white"
              >
                Authenticate
              </a>
            </div>
          </div>
        }
      >
        <div class="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div class="mb-12">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h1 class="text-5xl font-light tracking-wider text-white mb-2">
                  ZENOBIA PAY
                </h1>
                <div class="w-16 h-0.5 bg-white mb-4"></div>
                <p class="text-gray-400 font-light tracking-wide uppercase text-sm">
                  God Mode / Admin Console
                </p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 text-sm font-light uppercase tracking-wide">
                  {auth.user()?.name || auth.user()?.nickname || "Unknown"}
                </p>
                <p class="text-gray-500 text-xs font-light">
                  {auth.user()?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div class="bg-gray-900 border border-gray-800 p-6">
              <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
                Agent Profile
              </h3>
              <div class="space-y-4">
                <Show when={auth.user()?.picture}>
                  <div class="flex justify-center mb-4">
                    <img
                      src={auth.user()?.picture}
                      alt="Profile"
                      class="w-20 h-20 rounded-full border-2 border-gray-700"
                    />
                  </div>
                </Show>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Identity:</span>
                    <span class="text-white">
                      {auth.user()?.name || "Classified"}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Code Name:</span>
                    <span class="text-white">
                      {auth.user()?.nickname || "N/A"}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Clearance:</span>
                    <span
                      class={
                        auth.user()?.email_verified
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {auth.user()?.email_verified ? "VERIFIED" : "PENDING"}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Last Access:</span>
                    <span class="text-white text-xs">
                      {auth.user()?.updated_at
                        ? new Date(auth.user()!.updated_at).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div class="bg-gray-900 border border-gray-800 p-6">
              <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
                System Status
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Core Systems</span>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span class="text-green-400 text-sm">ONLINE</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Database</span>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span class="text-green-400 text-sm">SECURE</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Encryption</span>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span class="text-green-400 text-sm">ACTIVE</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Firewall</span>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span class="text-green-400 text-sm">ENABLED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div class="bg-gray-900 border border-gray-800 p-6">
              <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
                Quick Actions
              </h3>
              <div class="space-y-3">
                <button
                  onClick={() => auth.signOut()}
                  class="w-full bg-white text-black px-4 py-3 font-medium tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 border border-white text-sm"
                >
                  Terminate Session
                </button>
                <button class="w-full bg-transparent text-white px-4 py-3 font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 border border-gray-700 text-sm">
                  System Logs
                </button>
                <button class="w-full bg-transparent text-white px-4 py-3 font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 border border-gray-700 text-sm">
                  Security Audit
                </button>
              </div>
            </div>
          </div>

          {/* Main Control Panel */}
          <div class="mt-12 bg-gray-900 border border-gray-800 p-8">
            <h2 class="text-2xl font-light text-white mb-6 tracking-wide uppercase">
              Control Panel
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-black border border-gray-800 p-4 text-center hover:border-gray-600 transition-all duration-300 cursor-pointer">
                <div class="text-3xl mb-2">🔐</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Access Control
                </h4>
                <p class="text-gray-400 text-xs mt-1">Manage permissions</p>
              </div>
              <div class="bg-black border border-gray-800 p-4 text-center hover:border-gray-600 transition-all duration-300 cursor-pointer">
                <div class="text-3xl mb-2">💳</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Transactions
                </h4>
                <p class="text-gray-400 text-xs mt-1">Monitor payments</p>
              </div>
              <div class="bg-black border border-gray-800 p-4 text-center hover:border-gray-600 transition-all duration-300 cursor-pointer">
                <div class="text-3xl mb-2">👥</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Merchants
                </h4>
                <p class="text-gray-400 text-xs mt-1">Manage accounts</p>
              </div>
              <div class="bg-black border border-gray-800 p-4 text-center hover:border-gray-600 transition-all duration-300 cursor-pointer">
                <div class="text-3xl mb-2">📊</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Analytics
                </h4>
                <p class="text-gray-400 text-xs mt-1">View reports</p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </main>
  );
}
