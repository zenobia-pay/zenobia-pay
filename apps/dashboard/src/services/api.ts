import { auth0Config } from "../config/auth0"
import type {
  MerchantTransferResponse,
  UpdateMerchantRequest,
  CreateTransferRequestResponse,
  FulfillTransferResponse,
  GetMerchantTransferResponse,
  GetMerchantConfigResponse,
  StatementItem,
  GetUserProfileResponse,
  CreateM2mCredentialsResponse,
  ListM2mCredentialsResponse,
  DeleteM2mCredentialsResponse,
  SubmitMerchantOnboardingRequest,
  PlaidProduct,
  MerchantPayoutResponse,
  MerchantKYBRequest,
  MerchantKYBResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  ListOrdersResponse,
  CheckManualOrdersConfigResponse,
  SetupManualOrdersResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  DeleteOrderResponse,
} from "../types/api"
import type {
  CreateLinkTokenResponse,
  ListBankAccountsResponse,
} from "../types/plaid"
import { createAuth0Client } from "@auth0/auth0-spa-js"
import type { Auth0Client } from "@auth0/auth0-spa-js"
import { authService } from "./auth"

// Define Auth0Error interface
interface Auth0Error extends Error {
  error: string
  error_description: string
  audience?: string
  scope?: string
}

const PROD_API_BASE_URL = "https://api.zenobiapay.com"
const TEST_API_BASE_URL =
  "https://mm24mwlpnd.execute-api.us-east-1.amazonaws.com/Prod"

// Simple test mode toggle
let isTestMode = false

export const toggleTestMode = () => {
  isTestMode = !isTestMode
}

export const getTestMode = () => {
  return isTestMode
}

export const getApiBaseUrl = () => {
  return isTestMode ? TEST_API_BASE_URL : PROD_API_BASE_URL
}

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
      const authError = tokenError as Auth0Error
      if (
        authError.error === "missing_refresh_token" ||
        authError.error === "invalid_grant" ||
        authError.error === "expired" ||
        (tokenError instanceof Error &&
          (tokenError.message.includes("missing refresh token") ||
            tokenError.message.includes("invalid_grant") ||
            tokenError.message.includes("expired")))
      ) {
        console.log(
          "Auth token expired or refresh token missing, redirecting to login"
        )

        await authService.signOut()
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

      // Check for Auth0 token error object
      const authError = error as Auth0Error
      if (
        authError.error === "missing_refresh_token" ||
        authError.error === "invalid_grant" ||
        authError.error === "expired"
      ) {
        console.log(
          "Auth token error detected from error object, redirecting to login"
        )
        await authService.signOut()
      }
      // Also check for token-related errors in the message for backward compatibility
      else if (
        error.message.includes("missing refresh token") ||
        error.message.includes("invalid_grant") ||
        error.message.includes("expired")
      ) {
        console.log(
          "Auth token error detected from message, redirecting to login"
        )

        await authService.signOut()
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
  createLinkToken: async (
    product: PlaidProduct
  ): Promise<CreateLinkTokenResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/create-link-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("link token response", json)
      return json
    })
  },

  exchangePublicToken: async (
    publicToken: string
  ): Promise<Record<string, never>> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/exchange-token`, {
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
      const response = await fetch(`${getApiBaseUrl()}/list-bank-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
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
    statementItems?: StatementItem[]
    expirySeconds?: number
    transferMetadata?: Record<string, string>
  }): Promise<CreateTransferRequestResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getApiBaseUrl()}/create-transfer-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(params),
        }
      )

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

      const response = await fetch(`${getApiBaseUrl()}/fulfill-transfer`, {
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
        `${getApiBaseUrl()}/get-merchant-transfer?id=${id}`,
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

  listMerchantTransfers: async (
    continuationToken?: string
  ): Promise<MerchantTransferResponse> => {
    return callApi(async (token) => {
      const url = new URL(`${getApiBaseUrl()}/list-merchant-transfers`)
      if (continuationToken) {
        url.searchParams.append("continuationToken", continuationToken)
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("merchant transfers response", json)
      return json
    })
  },

  listMerchantPayouts: async (
    continuationToken?: string
  ): Promise<MerchantPayoutResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/list-merchant-payouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(continuationToken ? { continuationToken } : {}),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("merchant payouts response", json)
      return json
    })
  },

  getMerchantConfig: async (): Promise<GetMerchantConfigResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/get-merchant-config`, {
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
      const response = await fetch(
        `${getApiBaseUrl()}/update-merchant-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateRequest),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("update merchant config response", json)
      return json
    })
  },

  submitMerchantOnboarding: async (
    onboardingData: SubmitMerchantOnboardingRequest
  ): Promise<Record<string, never>> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getApiBaseUrl()}/submit-merchant-onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(onboardingData),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("submit merchant onboarding response", json)
      return json
    })
  },

  getUserProfile: async (): Promise<GetUserProfileResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/get-user-profile`, {
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

  createM2mCredentials: async (): Promise<CreateM2mCredentialsResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getApiBaseUrl()}/create-m2m-credentials`,
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
      console.log("create m2m credentials response", json)
      return json as CreateM2mCredentialsResponse
    })
  },

  listM2mCredentials: async (): Promise<ListM2mCredentialsResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getApiBaseUrl()}/list-m2m-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("list m2m credentials response", json)
      return json as ListM2mCredentialsResponse
    })
  },

  deleteM2mCredentials: async (
    clientId: string
  ): Promise<DeleteM2mCredentialsResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getApiBaseUrl()}/delete-m2m-credentials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ clientId }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("delete m2m credentials response", json)
      return json as DeleteM2mCredentialsResponse
    })
  },

  submitMerchantKYB: async (
    kybData: MerchantKYBRequest
  ): Promise<MerchantKYBResponse> => {
    // Call the local Cloudflare Workers endpoint instead of external API
    const response = await fetch("/kyb/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kybData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    console.log("submit merchant KYB response", json)
    return json as MerchantKYBResponse
  },

  createOrder: async (
    orderData: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    return callApi(async (token) => {
      const response = await fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("create order response", json)
      return json as CreateOrderResponse
    })
  },

  listOrders: async (
    continuationToken?: string
  ): Promise<ListOrdersResponse> => {
    return callApi(async (token) => {
      let url = "/list-orders"
      if (continuationToken) {
        url += `?continuationToken=${encodeURIComponent(continuationToken)}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("orders response", json)
      return json as ListOrdersResponse
    })
  },

  updateOrder: async (
    orderId: string,
    orderData: UpdateOrderRequest
  ): Promise<UpdateOrderResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `/update-order?orderId=${encodeURIComponent(orderId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("update order response", json)
      return json as UpdateOrderResponse
    })
  },

  deleteOrder: async (orderId: string): Promise<DeleteOrderResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `/delete-order?orderId=${encodeURIComponent(orderId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("delete order response", json)
      return json as DeleteOrderResponse
    })
  },

  checkManualOrdersConfig:
    async (): Promise<CheckManualOrdersConfigResponse> => {
      return callApi(async (token) => {
        const response = await fetch("/check-manual-orders-config", {
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
        console.log("check manual orders config response", json)
        return json as CheckManualOrdersConfigResponse
      })
    },

  setupManualOrders: async (): Promise<SetupManualOrdersResponse> => {
    return callApi(async (token) => {
      const response = await fetch("/setup-manual-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("setup manual orders response", json)
      return json as SetupManualOrdersResponse
    })
  },

  disableManualOrders: async (): Promise<{
    success: boolean
    message?: string
  }> => {
    return callApi(async (token) => {
      const response = await fetch("/disable-manual-orders", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log("disable manual orders response", json)
      return json as { success: boolean; message?: string }
    })
  },

  getOrderDetailsForTransaction: async (
    transactionId: string
  ): Promise<{
    orderId: string
    merchantId: string
    amount: number
    description: string | null
    status: string
    transferRequestId: string | null
    merchantDisplayName: string | null
    createdAt: string
    updatedAt: string
  }> => {
    return callApi(async (token) => {
      const response = await fetch(
        `/get-order-details-for-transaction?transactionId=${encodeURIComponent(
          transactionId
        )}`,
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
      console.log("get order details for transaction response", json)
      return json
    })
  },
}
