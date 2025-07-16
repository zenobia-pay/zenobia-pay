import { createSignal, Show, onMount } from "solid-js";
import { api, type GetAdminTransferResponse } from "../services/api";
import { useEnvironment } from "../context/EnvironmentContext";

interface TransferDetailsProps {
  transferId: string;
  merchantSub: string;
}

export default function TransferDetails(props: TransferDetailsProps) {
  const { onEnvironmentChange, environment } = useEnvironment();
  const [transferData, setTransferData] =
    createSignal<GetAdminTransferResponse | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [selectedAction, setSelectedAction] = createSignal<string>("");
  const [isEditing, setIsEditing] = createSignal(false);
  const [editMessage, setEditMessage] = createSignal("");
  const [isEditError, setIsEditError] = createSignal(false);

  const loadTransfer = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.getAdminTransfer({ id: props.transferId });
      setTransferData(response);
    } catch (err) {
      console.error("Error fetching transfer:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transfer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTransfer = async (e: Event) => {
    e.preventDefault();

    if (!selectedAction()) {
      setEditMessage("Please select an action");
      setIsEditError(true);
      return;
    }

    setIsEditing(true);
    setEditMessage("");
    setIsEditError(false);

    try {
      const request: any = {
        transferRequestId: props.transferId,
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
      setEditMessage("Transfer updated successfully");
      setIsEditError(false);

      // Reset form and reload transfer data
      setSelectedAction("");
      await loadTransfer();
    } catch (err) {
      console.error("Error editing transfer:", err);
      setEditMessage(
        err instanceof Error ? err.message : "Failed to edit transfer"
      );
      setIsEditError(true);
    } finally {
      setIsEditing(false);
    }
  };

  const getBackToTransfersUrl = () => {
    const envParam = environment() === "BETA" ? "&env=beta" : "";
    return `/merchant?sub=${props.merchantSub}${envParam}`;
  };

  onMount(() => {
    loadTransfer();

    // Register callback to refetch data when environment changes
    onEnvironmentChange(() => {
      loadTransfer();
    });
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div class="bg-gray-900 border border-gray-800 p-2 sm:p-6 rounded">
      {/* Back to Transfers Button */}
      <div class="mb-4">
        <a
          href={getBackToTransfersUrl()}
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
          Back to Transfers
        </a>
      </div>

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 class="text-lg font-medium text-white tracking-wide uppercase">
          Transfer Details
        </h3>
        <button
          onClick={loadTransfer}
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
          <p class="text-gray-400 text-sm">Loading transfer details...</p>
        </div>
      </Show>

      <Show when={!isLoading() && transferData()}>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Transfer Information */}
          <div class="bg-black border border-gray-800 p-3 sm:p-4 rounded space-y-3 sm:space-y-4">
            <h4 class="text-white font-medium text-sm tracking-wide uppercase border-b border-gray-700 pb-2">
              Transfer Information
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Transfer ID
                </p>
                <p class="text-white text-xs font-mono break-all">
                  {transferData()?.transferRequestId}
                </p>
              </div>

              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Customer Name
                </p>
                <p class="text-white text-xs">{transferData()?.customerName}</p>
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
                <p class="text-white text-xs">
                  {formatAmount(transferData()?.fee || 0)}
                </p>
              </div>

              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Inbound Status
                </p>
                <p class="text-white text-xs">
                  {transferData()?.inboundStatus}
                </p>
              </div>

              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Outbound Status
                </p>
                <p class="text-white text-xs">
                  {transferData()?.outboundStatus}
                </p>
              </div>

              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Creation Time
                </p>
                <p class="text-white text-xs">
                  {formatDate(transferData()?.creationTime || "")}
                </p>
              </div>

              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Payout Time
                </p>
                <p class="text-white text-xs">
                  {(() => {
                    const data = transferData();
                    return data && data.payoutTime
                      ? formatDate(data.payoutTime)
                      : "N/A";
                  })()}
                </p>
              </div>
            </div>

            <Show when={transferData()?.statusMessage}>
              <div>
                <p class="text-gray-400 text-xs uppercase tracking-wide">
                  Status Message
                </p>
                <p class="text-white text-xs">
                  {transferData()?.statusMessage}
                </p>
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

          {/* Edit Transfer Form */}
          <div class="bg-black border border-gray-800 p-3 sm:p-4 rounded">
            <h4 class="text-white font-medium text-sm tracking-wide uppercase border-b border-gray-700 pb-2 mb-4">
              Edit Transfer
            </h4>

            <form onSubmit={handleEditTransfer} class="space-y-4">
              <div class="space-y-3">
                <h5 class="text-sm font-medium text-gray-300 mb-2">
                  Select Action
                </h5>

                <label class="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="action"
                    value="debitCustomer"
                    checked={selectedAction() === "debitCustomer"}
                    onChange={(e) => setSelectedAction(e.currentTarget.value)}
                    disabled={isEditing()}
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
                    disabled={isEditing()}
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
                    disabled={isEditing()}
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
                    disabled={isEditing()}
                    class="w-4 h-4 text-white bg-black border-gray-700 focus:ring-gray-500"
                  />
                  <span class="text-gray-400 text-sm">Credit Merchant</span>
                </label>
              </div>

              <Show when={editMessage()}>
                <div
                  class={`p-3 rounded ${
                    isEditError()
                      ? "bg-red-900 border border-red-700"
                      : "bg-green-900 border border-green-700"
                  }`}
                >
                  <p
                    class={`text-sm ${
                      isEditError() ? "text-red-300" : "text-green-300"
                    }`}
                  >
                    {editMessage()}
                  </p>
                </div>
              </Show>

              <button
                type="submit"
                disabled={isEditing()}
                class="w-full bg-white text-black px-4 py-3 font-medium tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 border border-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                {isEditing() ? "Processing..." : "Update Transfer"}
              </button>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}
