import { auth0Config } from "../config/auth0"
import type {
  CustomerTransferResponse,
  MerchantTransferResponse,
  UpdateMerchantRequest,
  CreateTransferRequestResponse,
  FulfillTransferResponse,
  GetMerchantTransferResponse,
  GetMerchantConfigResponse,
  StatementItem,
  GetUserProfileResponse,
  SubmitOnboardingRequest,
} from "../types/api"
import type {
  CreateLinkTokenResponse,
  ListBankAccountsResponse,
} from "../types/plaid"
import { createAuth0Client } from "@auth0/auth0-spa-js"
import type { Auth0Client } from "@auth0/auth0-spa-js"

const API_BASE_URL =
  "https://mm24mwlpnd.execute-api.us-east-1.amazonaws.com/Prod"

// const API_BASE_URL = "https://api.zenobiapay.com/Prod"

// Shared Auth0 client instance
let auth0ClientInstance: Auth0Client | null = null

// Initialize Auth0 client
const getAuth0Client = async (): Promise<Auth0Client> => {
  if (!auth0ClientInstance) {
    auth0ClientInstance = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        audience: auth0Config.audience,
        redirect_uri: auth0Config.redirectUri,
        scope: auth0Config.scope,
      },
      cacheLocation: "localstorage",
      useRefreshTokens: true,
    })
  }
  return auth0ClientInstance
}

// Reset Auth0 client (useful when authentication state needs to be cleared)
const resetAuth0Client = () => {
  auth0ClientInstance = null
  // Clear any existing auth state
  localStorage.removeItem("auth0.is.authenticated")

  // Additional cleanup for Auth0 storage items
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith("auth0") || key.includes("@@auth0spajs@@"))) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

// Helper to get the Auth0 token
const getAuthToken = async (): Promise<string> => {
  try {
    const auth0Client = await getAuth0Client()
    const isAuthenticated = await auth0Client.isAuthenticated()

    if (!isAuthenticated) {
      console.log(
        "User is not authenticated in getAuthToken, redirecting to login"
      )
      // Reset client before redirecting
      resetAuth0Client()
      // Save current path for redirect after login
      sessionStorage.setItem("redirectPath", window.location.pathname)
      window.location.href = "/login"
      throw new Error("User is not authenticated")
    }

    try {
      const token = await auth0Client.getTokenSilently()
      if (!token) {
        throw new Error("No authentication token available")
      }
      return token
    } catch (tokenError) {
      console.error("Token error:", tokenError)

      // Check if this is a refresh token error
      if (
        tokenError instanceof Error &&
        (tokenError.message.includes("missing refresh token") ||
          tokenError.message.includes("invalid_grant") ||
          tokenError.message.includes("expired"))
      ) {
        console.log(
          "Auth token expired or refresh token missing, redirecting to login"
        )
        // Reset the client to clear cached tokens
        resetAuth0Client()

        // Save current path for redirect after login
        sessionStorage.setItem("redirectPath", window.location.pathname)

        // Redirect to login
        window.location.href = "/login"
      }

      throw tokenError
    }
  } catch (error) {
    console.error("Error in getAuthToken:", error)
    throw error
  }
}

// A wrapper for API calls that handles authentication errors
const callApi = async <T>(
  apiCall: (token: string) => Promise<T>
): Promise<T> => {
  try {
    const token = await getAuthToken()
    return await apiCall(token)
  } catch (error) {
    console.error("API call error:", error)

    // Handle different error types
    if (error instanceof Error) {
      // Try to extract more info from HTTP errors
      if (error.message.includes("HTTP error! status:")) {
        const statusMatch = error.message.match(/status: (\d+)/)
        if (statusMatch) {
          const status = parseInt(statusMatch[1])

          // Handle auth-related errors
          if (status === 401 || status === 403) {
            console.log("API call returned auth error (status: " + status + ")")
          }
        }
      }

      // Check for token-related errors
      if (
        error.message.includes("missing refresh token") ||
        error.message.includes("invalid_grant") ||
        error.message.includes("expired")
      ) {
        console.log("Auth token error detected, redirecting to login")

        // Reset the client to clear cached tokens
        resetAuth0Client()

        // Save current path for redirect
        sessionStorage.setItem("redirectPath", window.location.pathname)

        // Redirect to login page
        window.location.href = "/login"
      }
    }

    throw error
  }
}

// Export the Auth0 client functions for use in other services if needed
export const auth0Utils = {
  getAuth0Client,
  resetAuth0Client,
}

export const api = {
  createLinkToken: async (): Promise<CreateLinkTokenResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/create-link-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      return json as CreateLinkTokenResponse
    })
  },

  exchangePublicToken: async (
    publicToken: string
  ): Promise<Record<string, never>> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/exchange-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ linkToken: publicToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to exchange public token")
      }

      console.log("response", response)
      const data = await response.json()
      return data as Record<string, never>
    })
  },

  listBankAccounts: async (): Promise<ListBankAccountsResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/list-bank-accounts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("bank accounts list response", json)
      return json
    })
  },

  createTransferRequest: async (params: {
    amount: number
    bankAccountId: string
    statementItems?: StatementItem[]
  }): Promise<CreateTransferRequestResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/create-transfer-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      return json as CreateTransferRequestResponse
    })
  },

  fulfillTransfer: async (params: {
    transferRequestId: string
    merchantId: string
    bankAccountId: string
  }): Promise<FulfillTransferResponse> => {
    return callApi(async (token) => {
      console.log("fulfilling transfer", params)

      const response = await fetch(`${API_BASE_URL}/fulfill-transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      return json as FulfillTransferResponse
    })
  },

  getMerchantTransfer: async (
    id: string
  ): Promise<GetMerchantTransferResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${API_BASE_URL}/get-merchant-transfer?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("get merchant transfer response", json)
      return json as GetMerchantTransferResponse
    })
  },

  listCustomerTransfers: async (): Promise<CustomerTransferResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/list-customer-transfers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("customer transfers response", json)
      return json
    })
  },

  listMerchantTransfers: async (
    continuationToken?: string
  ): Promise<MerchantTransferResponse> => {
    return callApi(async (token) => {
      const url = new URL(`${API_BASE_URL}/list-merchant-transfers`)
      if (continuationToken) {
        url.searchParams.append("continuationToken", continuationToken)
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("merchant transfers response", json)
      return json
    })
  },

  getMerchantConfig: async (): Promise<GetMerchantConfigResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/get-merchant-config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("merchant config response", json)
      return json
    })
  },

  updateMerchantConfig: async (
    updateRequest: UpdateMerchantRequest
  ): Promise<Record<string, never>> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/update-merchant-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateRequest),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("update merchant config response", json)
      return json
    })
  },

  submitOnboarding: async (
    onboardingData: SubmitOnboardingRequest
  ): Promise<Record<string, never>> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/submit-onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(onboardingData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("submit onboarding response", json)
      return json
    })
  },

  getUserProfile: async (): Promise<GetUserProfileResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/get-user-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("get user profile response", json)
      return json as GetUserProfileResponse
    })
  },
}
