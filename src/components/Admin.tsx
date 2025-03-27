import { Component, createSignal, createResource } from "solid-js"
import { api } from "../services/api"
import { authService } from "../services/auth"
import type { ListBankAccountsResponse, PlaidLinkConfig } from "../types/plaid"
import { Dashboard } from "./Dashboard"

// Add type definition for Plaid
declare global {
  interface Window {
    Plaid: {
      create: (config: PlaidLinkConfig) => {
        open: () => void
        exit: () => void
      }
    }
  }
}

const Admin: Component = () => {
  const [error, setError] = createSignal<string | null>(null)

  // Create resource for bank accounts
  const [banks, { refetch: refetchBanks }] =
    createResource<ListBankAccountsResponse>(api.listBankAccounts)

  const handleCreateLinkToken = async () => {
    setError(null)
    try {
      const response = await api.createLinkToken()
      const handler = window.Plaid.create({
        token: response.linkToken,
        onSuccess: async (public_token: string, metadata: any) => {
          try {
            await api.exchangePublicToken(public_token)
            // Refetch banks after successful link
            refetchBanks()
          } catch (err) {
            console.error("Error exchanging public token:", err)
            setError("Failed to complete bank account linking.")
          }
        },
        onExit: (err: any) => {
          if (err != null) {
            setError("Error linking bank account. Please try again.")
          }
        },
        onEvent: (eventName: string, metadata: any) => {
          console.log("Plaid Link event:", eventName, metadata)
        },
      })

      handler.open()
    } catch (err) {
      setError("Failed to create link token. Please try again later.")
      console.error("Error creating link token:", err)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      window.location.href = "/"
    } catch (err) {
      console.error("Error signing out:", err)
      setError("Failed to sign out. Please try again.")
    }
  }

  return (
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-md">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">Zenobia Admin</a>
        </div>
        <div class="flex-none">
          <div class="dropdown dropdown-end">
            <div
              tabindex={0}
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img
                  alt="Admin avatar"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabindex={0}
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={handleCreateLinkToken}>Link Bank Account</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {error() && (
        <div class="alert alert-error shadow-lg max-w-md mx-auto mt-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error()}</span>
          </div>
          <div class="flex-none">
            <button class="btn btn-sm" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <Dashboard />
    </div>
  )
}

export default Admin
