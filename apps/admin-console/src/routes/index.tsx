import { Show } from "solid-js";
import { useAuth } from "../context/AuthContext";
import EditTransfer from "../components/EditTransfer";
import MarkInDispute from "../components/MarkInDispute";

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
                  Admin Console
                </p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 text-sm font-light uppercase tracking-wide">
                  {auth.user()?.name || auth.user()?.nickname || "Unknown"}
                </p>
                <p class="text-gray-500 text-xs font-light">
                  {auth.user()?.email}
                </p>
                <button
                  onClick={() => auth.signOut()}
                  class="mt-2 bg-transparent text-gray-400 px-3 py-1 text-xs font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 border border-gray-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EditTransfer />
            <MarkInDispute />
          </div>

          {/* Future Features Placeholder */}
          <div class="mt-12 bg-gray-900 border border-gray-800 p-8">
            <h2 class="text-2xl font-light text-white mb-6 tracking-wide uppercase">
              Coming Soon
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-black border border-gray-800 p-4 text-center">
                <div class="text-3xl mb-2">👥</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Merchant List
                </h4>
                <p class="text-gray-400 text-xs mt-1">
                  View and manage merchants
                </p>
              </div>
              <div class="bg-black border border-gray-800 p-4 text-center">
                <div class="text-3xl mb-2">💳</div>
                <h4 class="text-white font-medium text-sm tracking-wide uppercase">
                  Transfer List
                </h4>
                <p class="text-gray-400 text-xs mt-1">
                  View and search transfers
                </p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </main>
  );
}
