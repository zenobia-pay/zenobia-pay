import { createSignal, Show } from "solid-js";
import { api, type MarkInDisputeRequest } from "../services/api";

export default function MarkInDispute() {
  const [transferId, setTransferId] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [isError, setIsError] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!transferId().trim()) {
      setMessage("Transfer ID is required");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const request: MarkInDisputeRequest = {
        transferRequestId: transferId().trim(),
      };

      await api.markInDispute(request);
      setMessage("Transfer marked as disputed successfully");
      setIsError(false);

      // Reset form
      setTransferId("");
    } catch (error) {
      console.error("Error marking transfer in dispute:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to mark transfer in dispute"
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-6">
      <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
        Mark Transfer in Dispute
      </h3>

      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label
            for="transferId"
            class="block text-sm font-medium text-gray-400 mb-2"
          >
            Transfer Request ID *
          </label>
          <input
            id="transferId"
            type="text"
            value={transferId()}
            onInput={(e) => setTransferId(e.currentTarget.value)}
            class="w-full bg-black border border-gray-700 text-white px-3 py-2 focus:border-gray-500 focus:outline-none"
            placeholder="Enter transfer request ID"
            disabled={isLoading()}
          />
        </div>

        <div class="bg-yellow-900 border border-yellow-700 p-3 rounded">
          <p class="text-yellow-300 text-sm">
            ⚠️ This action will mark the transfer as disputed. This is typically
            used for handling chargebacks or customer disputes.
          </p>
        </div>

        <Show when={message()}>
          <div
            class={`p-3 rounded ${
              isError()
                ? "bg-red-900 border border-red-700"
                : "bg-green-900 border border-green-700"
            }`}
          >
            <p
              class={`text-sm ${isError() ? "text-red-300" : "text-green-300"}`}
            >
              {message()}
            </p>
          </div>
        </Show>

        <button
          type="submit"
          disabled={isLoading()}
          class="w-full bg-yellow-600 text-white px-4 py-3 font-medium tracking-wide uppercase hover:bg-yellow-700 transition-all duration-300 border border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading() ? "Processing..." : "Mark in Dispute"}
        </button>
      </form>
    </div>
  );
}
