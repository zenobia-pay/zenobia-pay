import { Component, createResource, For, Show } from "solid-js"
import { api } from "../../services/api"
import type { ListBankAccountsResponse } from "../../types/plaid"
import { PlaidProduct } from "../../types/api"

const Accounts: Component = () => {
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

  const AccountsContent = () => (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Your Accounts</h1>
        <button onClick={handleCreateLinkToken} class="btn btn-primary">
          + Add New Account
        </button>
      </div>

      <div class="flex flex-col space-y-4">
        <Show
          when={!banks.loading && (banks()?.items?.length || 0) > 0}
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
          <For each={banks()?.items || []}>
            {(bank) => (
              <div class="card card-side bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg hover:shadow-xl transition-all">
                <div class="card-body flex-row items-center justify-between">
                  <div class="flex flex-col md:flex-row md:items-center gap-4">
                    <div class="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8"
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

                  <div class="flex flex-col md:flex-row items-end md:items-center gap-4">
                    <div>
                      <p class="text-xs opacity-80">Available Balance</p>
                      <p class="text-xl font-bold">$10,000.00</p>
                    </div>

                    <div class="badge badge-outline ml-0 md:ml-4">Active</div>

                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-outline btn-primary">
                        View
                      </button>
                      <button class="btn btn-sm btn-outline btn-primary">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>

          {/* Empty state shows only when there are no accounts */}
          <Show when={(banks()?.items?.length || 0) === 0}>
            <div
              class="rounded-xl bg-base-200 p-12 shadow-sm border-2 border-dashed border-base-300 flex flex-col items-center justify-center cursor-pointer min-h-[200px] hover:border-primary transition-all"
              onClick={handleCreateLinkToken}
            >
              <div class="text-6xl opacity-60 mb-3">+</div>
              <p class="text-xl opacity-70">
                Click here to connect your first bank account
              </p>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  )

  return <AccountsContent />
}

export default Accounts
