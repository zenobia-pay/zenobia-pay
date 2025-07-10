import { createSignal, Show } from "solid-js";
import { api, type EditTransferRequest } from "../services/api";

export default function EditTransfer() {
  const [transferId, setTransferId] = createSignal("");
  const [selectedAction, setSelectedAction] = createSignal<string>("");
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

    if (!selectedAction()) {
      setMessage("Please select an action");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const request: EditTransferRequest = {
        transferRequestId: transferId().trim(),
      };

      // Set the appropriate boolean field based on selected action
      switch (selectedAction()) {
        case "debitCustomer":
          request.debitCustomer = true;
          break;
        case "debitMerchant":
          request.debitMerchant = true;
          break;
        case "creditCustomer":
          request.creditCustomer = true;
          break;
        case "creditMerchant":
          request.creditMerchant = true;
          break;
      }

      await api.editTransfer(request);
      setMessage("Transfer updated successfully");
      setIsError(false);

      // Reset form
      setTransferId("");
      setSelectedAction("");
    } catch (error) {
      console.error("Error editing transfer:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to edit transfer"
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-6">
      <h3 class="text-lg font-medium text-white mb-4 tracking-wide uppercase">
        Edit Transfer
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

        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-300 mb-2">
            Select Action *
          </h4>

          <label class="flex items-center space-x-3">
            <input
              type="radio"
              name="action"
              value="debitCustomer"
              checked={selectedAction() === "debitCustomer"}
              onChange={(e) => setSelectedAction(e.currentTarget.value)}
              disabled={isLoading()}
              class="w-4 h-4 text-white bg-black border-gray-700 focus:ring-gray-500"
            />
            <span class="text-gray-400 text-sm">Debit Customer</span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              type="radio"
              name="action"
              value="debitMerchant"
              checked={selectedAction() === "debitMerchant"}
              onChange={(e) => setSelectedAction(e.currentTarget.value)}
              disabled={isLoading()}
              class="w-4 h-4 text-white bg-black border-gray-700 focus:ring-gray-500"
            />
            <span class="text-gray-400 text-sm">Debit Merchant</span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              type="radio"
              name="action"
              value="creditCustomer"
              checked={selectedAction() === "creditCustomer"}
              onChange={(e) => setSelectedAction(e.currentTarget.value)}
              disabled={isLoading()}
              class="w-4 h-4 text-white bg-black border-gray-700 focus:ring-gray-500"
            />
            <span class="text-gray-400 text-sm">Credit Customer</span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              type="radio"
              name="action"
              value="creditMerchant"
              checked={selectedAction() === "creditMerchant"}
              onChange={(e) => setSelectedAction(e.currentTarget.value)}
              disabled={isLoading()}
              class="w-4 h-4 text-white bg-black border-gray-700 focus:ring-gray-500"
            />
            <span class="text-gray-400 text-sm">Credit Merchant</span>
          </label>
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
          class="w-full bg-white text-black px-4 py-3 font-medium tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 border border-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading() ? "Processing..." : "Update Transfer"}
        </button>
      </form>
    </div>
  );
}
