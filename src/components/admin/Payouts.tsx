import { Component, createResource, For, Show, createSignal } from "solid-js"
import { api } from "../../services/api"
import type { ListBankAccountsResponse } from "../../types/plaid"
import { PlaidProduct } from "../../types/api"
import { toast } from "solid-toast"

const Payouts: Component = () => {
  const [selectedAccountId, setSelectedAccountId] = createSignal<string | null>(
    null
  )
  const [isUpdating, setIsUpdating] = createSignal(false)

  // Fetch merchant config to get the currently selected bank account
  const [merchantConfig, { refetch: refetchMerchantConfig }] = createResource(
    async () => {
      try {
        const config = await api.getMerchantConfig()
        // Set the selected account ID from the config
        if (config.bankAccountId) {
          setSelectedAccountId(config.bankAccountId)
        }
        return config
      } catch (err) {
        console.error("Error fetching merchant config:", err)
        toast.error("Failed to load current payout settings")
        return {}
      }
    }
  )

  const [banks, { refetch: refetchBanks }] =
    createResource<ListBankAccountsResponse>(api.listBankAccounts)

  const handleCreateLinkToken = async () => {
    try {
      const response = await api.createLinkToken(PlaidProduct.AUTH)
      const handler = window.Plaid.create({
        token: response.linkToken,
        onSuccess: async (public_token: string) => {
          try {
            await api.exchangePublicToken(public_token)
            refetchBanks()
          } catch (err) {
            console.error("Error exchanging public token:", err)
          }
        },
        onExit: (err: any) => {
          if (err != null) {
            console.error("Error linking bank account:", err)
          }
        },
        onEvent: (eventName: string, metadata: any) => {
          console.log("Plaid Link event:", eventName, metadata)
        },
      })

      handler.open()
    } catch (err) {
      console.error("Error creating link token:", err)
    }
  }

  // Function to update the selected bank account for payouts
  const updatePayoutAccount = async () => {
    const accountId = selectedAccountId()
    if (!accountId) return

    try {
      setIsUpdating(true)
      await api.updateMerchantConfig({
        bankAccountId: accountId,
      })
      toast.success("Default payout account updated successfully")
      refetchMerchantConfig()
    } catch (err) {
      console.error("Error updating payout account:", err)
      toast.error("Failed to update payout account")
    } finally {
      setIsUpdating(false)
    }
  }

  // Skeleton loader for bank accounts
  const LoadingSkeletons = () => (
    <div class="flex flex-col space-y-4">
      {[1, 2].map(() => (
        <div class="card card-side bg-base-200 shadow animate-pulse">
          <div class="card-body flex-row items-center justify-between p-6">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <div class="flex-shrink-0 bg-base-300 p-3 rounded-full w-14 h-14"></div>
              <div class="space-y-2">
                <div class="h-5 bg-base-300 rounded w-40"></div>
                <div class="h-4 bg-base-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const PayoutsContent = () => (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Your Accounts</h1>
        <button onClick={handleCreateLinkToken} class="btn btn-primary">
          + Add New Account
        </button>
      </div>

      {/* Descriptive section */}
      <div class="bg-base-100 p-6 rounded-lg border border-base-300 shadow-sm mb-6">
        <h2 class="text-lg font-medium mb-2">About Payouts</h2>
        <p class="text-base-content opacity-80">
          Connect your bank accounts to receive payments from Zenobia Pay. Once
          connected, you can receive funds directly to your bank account when
          customers make payments. We use secure bank connections to ensure your
          funds are transferred safely and quickly.
        </p>
        <p class="text-base-content opacity-80 mt-2">
          To get started, click the "Add New Account" button and follow the
          prompts to securely link your bank account. Your banking information
          is encrypted and protected.
        </p>
      </div>

      {/* Show loading state for both merchant config and bank accounts */}
      <Show
        when={!merchantConfig.loading && !banks.loading}
        fallback={<LoadingSkeletons />}
      >
        <Show
          when={(banks()?.items?.length || 0) > 0}
          fallback={
            <div
              class="rounded-xl bg-base-200 p-12 shadow-sm border-2 border-dashed border-base-300 flex flex-col items-center justify-center cursor-pointer min-h-[200px] hover:border-primary transition-all"
              onClick={handleCreateLinkToken}
            >
              <div class="text-6xl opacity-60 mb-3">+</div>
              <p class="text-xl opacity-70">
                Click here to connect your first bank account
              </p>
            </div>
          }
        >
          {/* Display connected accounts with selection option */}
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium">Connected Accounts</h2>
              <Show
                when={
                  selectedAccountId() &&
                  selectedAccountId() !== merchantConfig()?.bankAccountId
                }
              >
                <button
                  onClick={updatePayoutAccount}
                  disabled={isUpdating()}
                  class="btn btn-sm btn-primary"
                >
                  {isUpdating() ? "Updating..." : "Save Changes"}
                </button>
              </Show>
            </div>
            <p class="text-sm text-base-content opacity-70 mb-2">
              Select which account you want to receive payouts to. This will be
              your default account for all payments.
            </p>

            <For each={banks()?.items || []}>
              {(bank) => (
                <div
                  class={`card card-side bg-base-100 border ${
                    selectedAccountId() === bank.bankAccountId
                      ? "border-primary border-2"
                      : "border-base-300"
                  } text-base-content shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                  onClick={() => setSelectedAccountId(bank.bankAccountId)}
                >
                  <div class="card-body flex-row items-center justify-between">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                      <div class="flex-shrink-0 bg-primary bg-opacity-10 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 6l18 0M3 12h18M3 18h18"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="card-title text-lg md:text-xl">
                          {bank.bankAccountName || "Bank Account"}
                        </h3>
                        <p class="opacity-80">
                          ****{bank.bankAccountId?.slice(-4) || "0000"}
                        </p>
                      </div>
                    </div>

                    {/* Selected indicator */}
                    <div class="flex items-center">
                      {merchantConfig()?.bankAccountId ===
                        bank.bankAccountId && (
                        <span class="badge badge-primary mr-3">Default</span>
                      )}
                      <div
                        class={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAccountId() === bank.bankAccountId
                            ? "border-primary"
                            : "border-base-300"
                        }`}
                      >
                        {selectedAccountId() === bank.bankAccountId && (
                          <div class="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  )

  return <PayoutsContent />
}

export default Payouts
