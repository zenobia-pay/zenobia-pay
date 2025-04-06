import { Component, createResource, For, Show } from "solid-js"
import { api } from "../../services/api"
import type { ListBankAccountsResponse } from "../../types/plaid"

const Accounts: Component = () => {
  const [banks, { refetch: refetchBanks }] =
    createResource<ListBankAccountsResponse>(api.listBankAccounts)

  const handleCreateLinkToken = async () => {
    try {
      const response = await api.createLinkToken()
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Show
          when={!banks.loading}
          fallback={Array(3)
            .fill(0)
            .map(() => (
              <div class="card bg-base-100 shadow-md h-48">
                <div class="card-body animate-pulse flex flex-col justify-between">
                  <div class="h-4 bg-base-300 rounded w-3/4"></div>
                  <div>
                    <div class="h-8 bg-base-300 rounded w-1/2 mb-2"></div>
                    <div class="h-4 bg-base-300 rounded w-1/4"></div>
                  </div>
                  <div class="flex justify-end">
                    <div class="h-10 bg-base-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
        >
          <For each={banks()?.items || []}>
            {(bank) => (
              <div class="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg hover:shadow-xl transition-all">
                <div class="card-body">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="card-title">
                        {bank.bankAccountName || "Bank Account"}
                      </h3>
                      <p class="opacity-80">
                        ****{bank.bankAccountId?.slice(-4) || "0000"}
                      </p>
                    </div>
                    <div class="badge badge-outline">Active</div>
                  </div>

                  <div class="space-y-2 mt-4">
                    <div>
                      <p class="text-xs opacity-80">Available Balance</p>
                      <p class="text-xl font-bold">$10,000.00</p>
                    </div>
                  </div>

                  <div class="card-actions justify-end mt-4">
                    <button class="btn btn-sm btn-outline btn-primary">
                      View Details
                    </button>
                    <button class="btn btn-sm btn-outline btn-primary">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </Show>

        {/* Add Account Card */}
        <div class="card bg-base-100 shadow-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors h-48">
          <div
            class="card-body flex flex-col items-center justify-center cursor-pointer"
            onClick={handleCreateLinkToken}
          >
            <div class="text-4xl opacity-60">+</div>
            <p class="text-center opacity-70">Link a new bank account</p>
          </div>
        </div>
      </div>
    </div>
  )

  return <AccountsContent />
}

export default Accounts
