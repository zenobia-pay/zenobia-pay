import { createSignal, Show, For, onMount } from "solid-js";
import { api, type ListMerchantsResponse } from "../services/api";
import { useEnvironment } from "../context/EnvironmentContext";

export default function MerchantsList() {
  const { onEnvironmentChange, environment } = useEnvironment();
  const [merchants, setMerchants] = createSignal<ListMerchantsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const loadMerchants = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.listMerchants();
      setMerchants(response);
    } catch (err) {
      console.error("Error fetching merchants:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch merchants"
      );
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadMerchants();

    // Register callback to refetch data when environment changes
    onEnvironmentChange(() => {
      loadMerchants();
    });
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleMerchantClick = (merchantId: string) => {
    const envParam = environment() === "BETA" ? "&env=beta" : "";
    window.location.href = `/merchant?sub=${merchantId}${envParam}`;
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-2 sm:p-6 rounded">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 class="text-lg font-medium text-white tracking-wide uppercase">
          Merchants
        </h3>
        <button
          onClick={loadMerchants}
          disabled={isLoading()}
          class="bg-blue-600 text-white px-3 sm:px-4 py-2 text-xs font-medium tracking-wide uppercase hover:bg-blue-700 transition-all duration-300 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded w-full sm:w-auto"
        >
          {isLoading() ? "Loading..." : "Refresh"}
        </button>
      </div>

      <Show when={error()}>
        <div class="bg-red-900 border border-red-700 p-3 rounded mb-4">
          <p class="text-red-300 text-sm">{error()}</p>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-400 text-sm">Loading merchants...</p>
        </div>
      </Show>

      <Show when={!isLoading() && merchants()}>
        <div class="space-y-2 sm:space-y-3">
          <For each={merchants()?.merchants}>
            {(merchant) => (
              <div
                class="bg-black border border-gray-700 p-3 sm:p-4 rounded hover:border-gray-600 transition-all duration-300 cursor-pointer"
                onClick={() => handleMerchantClick(merchant.id)}
              >
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                  <div class="flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                      <h4 class="text-white font-medium text-sm sm:text-lg">
                        {merchant.name}
                      </h4>
                      <span
                        class={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full border ${
                          merchant.approved
                            ? "bg-green-900 text-green-300 border-green-700"
                            : "bg-red-900 text-red-300 border-red-700"
                        }`}
                      >
                        {merchant.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                      <div>
                        <p class="text-gray-400 uppercase tracking-wide text-xs">
                          ID
                        </p>
                        <p class="text-white font-mono text-xs break-all">
                          {merchant.id}
                        </p>
                      </div>
                      <div>
                        <p class="text-gray-400 uppercase tracking-wide text-xs">
                          Created
                        </p>
                        <p class="text-white text-xs">
                          {formatDate(merchant.creationTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-center sm:justify-end">
                    <div class="text-gray-500 text-xs">
                      <svg
                        class="w-4 sm:w-5 h-4 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        <Show
          when={!merchants()?.merchants || merchants()?.merchants.length === 0}
        >
          <div class="text-center py-8">
            <p class="text-gray-400 text-sm">No merchants found.</p>
          </div>
        </Show>
      </Show>
    </div>
  );
}
