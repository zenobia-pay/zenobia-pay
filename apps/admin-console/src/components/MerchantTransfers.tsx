import { createSignal, Show, For, onMount, onCleanup } from "solid-js";
import { api, type ListAdminTransfersResponse } from "../services/api";
import { useEnvironment } from "../context/EnvironmentContext";

interface MerchantTransfersProps {
  merchantSub: string;
}

export default function MerchantTransfers(props: MerchantTransfersProps) {
  const { onEnvironmentChange, environment } = useEnvironment();
  const [transfersData, setTransfersData] =
    createSignal<ListAdminTransfersResponse | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [isLoadingMore, setIsLoadingMore] = createSignal(false);
  const [error, setError] = createSignal("");
  const [disputingTransfer, setDisputingTransfer] = createSignal<string | null>(
    null
  );

  const loadTransfers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.listAdminTransfers({ sub: props.merchantSub });
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
    if (!transfersData()?.continuationToken || isLoadingMore()) return;

    setIsLoadingMore(true);
    setError("");

    try {
      const response = await api.listAdminTransfers({
        sub: props.merchantSub,
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
      setIsLoadingMore(false);
    }
  };

  const handleMarkInDispute = async (transferId: string) => {
    const confirmed = window.confirm(
      "ARE YOU SURE you want to mark this transfer as IN DISPUTE? This action cannot be undone."
    );
    if (!confirmed) return;
    setDisputingTransfer(transferId);

    try {
      await api.markInDispute({ transferRequestId: transferId });
      // Refresh the transfers list to show updated status
      await loadTransfers();
    } catch (err) {
      console.error("Error marking transfer in dispute:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark transfer in dispute"
      );
    } finally {
      setDisputingTransfer(null);
    }
  };

  const handleTransferClick = (transferId: string) => {
    const envParam = environment() === "BETA" ? "&env=beta" : "";
    window.location.href = `/transfer?sub=${props.merchantSub}&id=${transferId}${envParam}`;
  };

  const getBackToMerchantsUrl = () => {
    const envParam = environment() === "BETA" ? "?env=beta" : "";
    return `/${envParam}`;
  };

  const getStatusPillColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-yellow-600 text-yellow-100 border-yellow-400";
      case "SETTLED":
        return "bg-green-700 text-green-200 border-green-400";
      case "FAILED":
        return "bg-red-700 text-red-200 border-red-400";
      default:
        return "bg-blue-700 text-blue-200 border-blue-400";
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (isLoadingMore() || !transfersData()?.continuationToken) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when user is within 100px of the bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      loadMore();
    }
  };

  onMount(() => {
    loadTransfers();

    // Register callback to refetch data when environment changes
    onEnvironmentChange(() => {
      loadTransfers();
    });

    // Add scroll listener for infinite scroll
    window.addEventListener("scroll", handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-2 sm:p-6 rounded">
      {/* Back to Merchants Button */}
      <div class="mb-4">
        <a
          href={getBackToMerchantsUrl()}
          class="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide uppercase"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Merchants List
        </a>
      </div>

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 class="text-lg font-medium text-white tracking-wide uppercase">
          Merchant Transfers
        </h3>
        <button
          onClick={loadTransfers}
          disabled={isLoading()}
          class="bg-blue-600 text-white px-3 sm:px-4 py-2 text-xs font-medium tracking-wide uppercase hover:bg-blue-700 transition-all duration-300 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {isLoading() ? "Loading..." : "Refresh"}
        </button>
      </div>

      <Show when={error()}>
        <div class="bg-red-900 border border-red-700 p-3 rounded mb-4">
          <p class="text-red-300 text-sm">{error()}</p>
        </div>
      </Show>

      <Show when={isLoading() && !transfersData()}>
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-400 text-sm">Loading transfers...</p>
        </div>
      </Show>

      <Show when={transfersData()}>
        <div class="bg-black border border-gray-800 p-3 sm:p-4 rounded">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-white font-medium text-sm tracking-wide uppercase">
              Transfers ({transfersData()?.items?.length ?? 0})
            </h4>
            <Show when={isLoadingMore()}>
              <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span class="text-gray-400 text-xs">Loading more...</span>
              </div>
            </Show>
          </div>

          <Show
            when={transfersData()?.items && transfersData()?.items.length > 0}
          >
            <div class="space-y-2 sm:space-y-3">
              <For each={transfersData()?.items}>
                {(transfer) => (
                  <div class="bg-gray-800 p-2 sm:p-4 rounded border border-gray-700">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div
                        class="flex-1 cursor-pointer"
                        onClick={() =>
                          handleTransferClick(transfer.transferRequestId)
                        }
                      >
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs">
                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Transfer ID
                            </p>
                            <p class="text-white font-mono text-xs break-all">
                              {transfer.transferRequestId}
                            </p>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Customer
                            </p>
                            <p class="text-white text-xs">
                              {transfer.customerName}
                            </p>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Amount
                            </p>
                            <p class="text-white font-medium text-xs">
                              {formatAmount(transfer.amount)}
                            </p>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Status
                            </p>
                            <span
                              class={`inline-block px-2 py-1 text-xs font-bold rounded border ${getStatusPillColor(
                                transfer.status
                              )}`}
                            >
                              {transfer.status}
                            </span>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Fee
                            </p>
                            <p class="text-white text-xs">
                              {formatAmount(transfer.fee)}
                            </p>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Created
                            </p>
                            <p class="text-white text-xs">
                              {formatDate(transfer.creationTime)}
                            </p>
                          </div>

                          <div>
                            <p class="text-gray-400 uppercase tracking-wide text-xs">
                              Payout Time
                            </p>
                            <p class="text-white text-xs">
                              {transfer.payoutTime
                                ? formatDate(transfer.payoutTime)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="flex justify-center sm:justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkInDispute(transfer.transferRequestId);
                          }}
                          disabled={
                            disputingTransfer() ===
                              transfer.transferRequestId ||
                            transfer.status.toLowerCase() === "disputed"
                          }
                          class="bg-red-800 text-red-100 px-2 sm:px-4 py-2 text-xs font-bold tracking-wide uppercase hover:bg-red-700 transition-all duration-300 border-2 border-red-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          {disputingTransfer() === transfer.transferRequestId
                            ? "Processing..."
                            : "⚠️ Dispute"}
                        </button>
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
