import { useSearchParams } from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { useAuth } from "../context/AuthContext";
import { useEnvironment } from "../context/EnvironmentContext";
import { api, type ListMerchantsResponse } from "../services/api";
import MerchantTransfers from "../components/MerchantTransfers";
import EnvironmentToggle from "../components/EnvironmentToggle";

export default function MerchantPage() {
  const auth = useAuth();
  const { environment, onEnvironmentChange } = useEnvironment();
  const [searchParams] = useSearchParams();
  const merchantSub = searchParams.sub;
  const [merchantName, setMerchantName] = createSignal<string>("");
  const [isLoadingMerchant, setIsLoadingMerchant] = createSignal(false);

  const getHomeUrl = () => {
    const envParam = environment() === "BETA" ? "?env=beta" : "";
    return `/${envParam}`;
  };

  const loadMerchantName = async () => {
    if (!merchantSub || typeof merchantSub !== "string") return;

    setIsLoadingMerchant(true);
    try {
      const response = await api.listMerchants();
      const merchant = response.merchants.find((m) => m.id === merchantSub);
      if (merchant) {
        setMerchantName(merchant.name);
      }
    } catch (err) {
      console.error("Error fetching merchant name:", err);
    } finally {
      setIsLoadingMerchant(false);
    }
  };

  onMount(() => {
    loadMerchantName();

    // Register callback to refetch data when environment changes
    onEnvironmentChange(() => {
      loadMerchantName();
    });
  });

  return (
    <Show
      when={auth.user()}
      fallback={
        <div class="min-h-screen flex items-center justify-center bg-black px-4">
          <div class="text-center max-w-md mx-auto">
            <div class="mb-8">
              <h1 class="text-4xl sm:text-6xl font-light tracking-wider text-white mb-4">
                ZENOBIA
              </h1>
              <div class="w-24 h-1 bg-white mx-auto"></div>
            </div>
            <p class="text-gray-400 text-base sm:text-lg mb-8 font-light">
              Access restricted. Authentication required.
            </p>
            <a
              href="/login"
              class="inline-block bg-white text-black px-6 sm:px-8 py-3 font-medium tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 border border-white rounded"
            >
              Authenticate
            </a>
          </div>
        </div>
      }
    >
      <div class="container mx-auto px-2 sm:px-6 py-4 sm:py-12">
        {/* Header Section */}
        <div class="mb-6 sm:mb-12">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 space-y-3 sm:space-y-0">
            <div>
              <a
                href={getHomeUrl()}
                class="block hover:opacity-80 transition-opacity duration-300"
              >
                <h1 class="text-2xl sm:text-5xl font-light tracking-wider text-white mb-2 cursor-pointer">
                  ZENOBIA PAY
                </h1>
                <div class="w-12 sm:w-16 h-0.5 bg-white mb-2 sm:mb-4"></div>
                <p class="text-gray-400 font-light tracking-wide uppercase text-xs sm:text-sm">
                  Admin Console
                </p>
              </a>
            </div>
            <div class="text-center sm:text-right">
              <p class="text-gray-400 text-xs sm:text-sm font-light uppercase tracking-wide truncate">
                {auth.user()?.name || auth.user()?.nickname || "Unknown"}
              </p>
              <p class="text-gray-500 text-xs font-light truncate">
                {auth.user()?.email}
              </p>
              <div class="mt-2 sm:mt-2 flex flex-col sm:flex-row items-center justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <EnvironmentToggle />
                <button
                  onClick={() => auth.signOut()}
                  class="bg-transparent text-gray-400 px-2 sm:px-3 py-1 sm:py-2 text-xs font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 border border-gray-700 rounded w-full sm:w-auto"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Show
          when={merchantSub && typeof merchantSub === "string"}
          fallback={
            <div class="text-center py-8">
              <p class="text-gray-400 text-sm">No merchant selected.</p>
              <a
                href="/"
                class="text-blue-400 hover:text-blue-300 mt-2 inline-block"
              >
                Back to Merchants
              </a>
            </div>
          }
        >
          {/* Merchant Name Display */}
          <Show when={merchantName() || isLoadingMerchant()}>
            <div class="mb-6 bg-gray-800 border border-gray-700 p-4 rounded">
              <div>
                <h2 class="text-xl sm:text-2xl font-medium text-white mb-1">
                  {isLoadingMerchant() ? "Loading..." : merchantName()}
                </h2>
                <p class="text-gray-400 text-sm font-mono">{merchantSub}</p>
              </div>
            </div>
          </Show>

          <MerchantTransfers merchantSub={merchantSub as string} />
        </Show>
      </div>
    </Show>
  );
}
