import { createSignal, Show } from "solid-js";
import { api, type GetAdminTransferResponse } from "../services/api";

export default function ViewTransfer() {
  const [transferId, setTransferId] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [transferData, setTransferData] =
    createSignal<GetAdminTransferResponse | null>(null);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!transferId().trim()) {
      setError("Transfer ID is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setTransferData(null);

    try {
      const response = await api.getAdminTransfer({ id: transferId().trim() });
      setTransferData(response);
    } catch (err) {
      console.error("Error fetching transfer:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transfer");
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

  return (
    <div class="bg-gray-900 border border-gray-800 p-6">
      <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
        View Transfer Details
      </h3>

      <form onSubmit={handleSubmit} class="space-y-4 mb-6">
        <div>
          <label
            for="transferId"
            class="block text-sm font-medium text-gray-400 mb-2"
          >
            Transfer Request ID *
          </label>
          <div class="flex space-x-2">
            <input
              id="transferId"
              type="text"
              value={transferId()}
              onInput={(e) => setTransferId(e.currentTarget.value)}
              class="flex-1 bg-black border border-gray-700 text-white px-3 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Enter transfer request ID"
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

      <Show when={transferData()}>
        <div class="bg-black border border-gray-800 p-4 space-y-4">
          <h4 class="text-white font-medium text-sm tracking-wide uppercase border-b border-gray-700 pb-2">
            Transfer Information
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Transfer ID
              </p>
              <p class="text-white text-sm font-mono">
                {transferData()?.transferRequestId}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Customer Name
              </p>
              <p class="text-white text-sm">{transferData()?.customerName}</p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Amount
              </p>
              <p class="text-white text-sm font-medium">
                {formatAmount(transferData()?.amount || 0)}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">Fee</p>
              <p class="text-white text-sm">
                {formatAmount(transferData()?.fee || 0)}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Inbound Status
              </p>
              <p class="text-white text-sm">{transferData()?.inboundStatus}</p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Outbound Status
              </p>
              <p class="text-white text-sm">{transferData()?.outboundStatus}</p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Creation Time
              </p>
              <p class="text-white text-sm">
                {formatDate(transferData()?.creationTime || "")}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Payout Time
              </p>
              <p class="text-white text-sm">
                {transferData()?.payoutTime
                  ? formatDate(transferData()?.payoutTime || "")
                  : "N/A"}
              </p>
            </div>
          </div>

          <Show when={transferData()?.statusMessage}>
            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide">
                Status Message
              </p>
              <p class="text-white text-sm">{transferData()?.statusMessage}</p>
            </div>
          </Show>

          <Show
            when={
              transferData()?.statementItems &&
              transferData()?.statementItems.length > 0
            }
          >
            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wide mb-2">
                Statement Items
              </p>
              <div class="space-y-2">
                {transferData()?.statementItems?.map((item, index) => (
                  <div class="bg-gray-800 p-2 rounded text-xs">
                    <div class="flex justify-between">
                      <span class="text-gray-300">
                        {item?.description || `Item ${index + 1}`}
                      </span>
                      <span class="text-white font-medium">
                        {formatAmount(item?.amount || 0)}
                      </span>
                    </div>
                    {item?.timestamp && (
                      <p class="text-gray-500 text-xs mt-1">
                        {formatDate(item?.timestamp || "")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
