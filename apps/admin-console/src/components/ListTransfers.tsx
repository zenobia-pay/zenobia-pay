import { createSignal, Show, For } from "solid-js";
import { api, type ListAdminTransfersResponse } from "../services/api";

export default function ListTransfers() {
  const [merchantSub, setMerchantSub] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [transfersData, setTransfersData] =
    createSignal<ListAdminTransfersResponse | null>(null);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!merchantSub().trim()) {
      setError("Merchant Sub is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setTransfersData(null);

    try {
      const response = await api.listAdminTransfers({
        sub: merchantSub().trim(),
      });
      setTransfersData(response);
    } catch (err) {
      console.error("Error fetching transfers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transfers"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!transfersData()?.continuationToken) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await api.listAdminTransfers({
        sub: merchantSub().trim(),
        continuationToken: transfersData()?.continuationToken,
      });

      // Merge the new items with existing ones
      setTransfersData({
        continuationToken: response.continuationToken,
        items: [...(transfersData()?.items || []), ...response.items],
      });
    } catch (err) {
      console.error("Error loading more transfers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load more transfers"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-6">
      <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
        List Merchant Transfers
      </h3>

      <form onSubmit={handleSubmit} class="space-y-4 mb-6">
        <div>
          <label
            for="merchantSub"
            class="block text-sm font-medium text-gray-400 mb-2"
          >
            Merchant Auth0 Sub *
          </label>
          <div class="flex space-x-2">
            <input
              id="merchantSub"
              type="text"
              value={merchantSub()}
              onInput={(e) => setMerchantSub(e.currentTarget.value)}
              class="flex-1 bg-black border border-gray-700 text-white px-3 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Enter merchant Auth0 sub"
              disabled={isLoading()}
            />
            <button
              type="submit"
              disabled={isLoading()}
              class="bg-blue-600 text-white px-4 py-2 font-medium tracking-wide uppercase hover:bg-blue-700 transition-all duration-300 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading() ? "Loading..." : "Fetch"}
            </button>
          </div>
        </div>

        <Show when={error()}>
          <div class="bg-red-900 border border-red-700 p-3 rounded">
            <p class="text-red-300 text-sm">{error()}</p>
          </div>
        </Show>
      </form>

      <Show when={transfersData()}>
        <div class="bg-black border border-gray-800 p-4">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-white font-medium text-sm tracking-wide uppercase">
              Transfers ({transfersData()?.items?.length || 0})
            </h4>
            <Show when={transfersData()?.continuationToken}>
              <button
                onClick={loadMore}
                disabled={isLoading()}
                class="bg-gray-700 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase hover:bg-gray-600 transition-all duration-300 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading() ? "Loading..." : "Load More"}
              </button>
            </Show>
          </div>

          <Show
            when={transfersData()?.items && transfersData()?.items.length > 0}
          >
            <div class="space-y-3">
              <For each={transfersData()?.items}>
                {(transfer) => (
                  <div class="bg-gray-800 p-3 rounded border border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Transfer ID
                        </p>
                        <p class="text-white font-mono">
                          {transfer.transferRequestId}
                        </p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Customer
                        </p>
                        <p class="text-white">{transfer.customerName}</p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Amount
                        </p>
                        <p class="text-white font-medium">
                          {formatAmount(transfer.amount)}
                        </p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Status
                        </p>
                        <p
                          class={`font-medium ${getStatusColor(
                            transfer.status
                          )}`}
                        >
                          {transfer.status}
                        </p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">Fee</p>
                        <p class="text-white">{formatAmount(transfer.fee)}</p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Created
                        </p>
                        <p class="text-white">
                          {formatDate(transfer.creationTime)}
                        </p>
                      </div>

                      <div>
                        <p class="text-gray-400 uppercase tracking-wide">
                          Payout Time
                        </p>
                        <p class="text-white">
                          {transfer.payoutTime
                            ? formatDate(transfer.payoutTime)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show
            when={
              !transfersData()?.items || transfersData()?.items.length === 0
            }
          >
            <div class="text-center py-8">
              <p class="text-gray-400 text-sm">
                No transfers found for this merchant.
              </p>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
