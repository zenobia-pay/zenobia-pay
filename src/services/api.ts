import { authService } from "./auth"
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
} from "../types/api"
import type {
  CreateLinkTokenResponse,
  ListBankAccountsResponse,
} from "../types/plaid"

const API_BASE_URL =
  "https://4sdynx1kod.execute-api.us-east-1.amazonaws.com/Prod"

// Helper to get the Auth0 token
const getAuthToken = async (): Promise<string> => {
  const auth0Client = await import("@auth0/auth0-spa-js").then((module) =>
    module.createAuth0Client({
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
  )

  const isAuthenticated = await auth0Client.isAuthenticated()

  if (!isAuthenticated) {
    throw new Error("User is not authenticated")
  }

  const token = await auth0Client.getTokenSilently()
  if (!token) {
    throw new Error("No authentication token available")
  }

  return token
}

export const api = {
  createLinkToken: async (): Promise<CreateLinkTokenResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error creating link token:", error)
      throw error
    }
  },

  exchangePublicToken: async (
    publicToken: string
  ): Promise<Record<string, never>> => {
    const token = await getAuthToken()

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
  },

  listBankAccounts: async (): Promise<ListBankAccountsResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error listing bank accounts:", error)
      throw error
    }
  },

  createTransferRequest: async (params: {
    amount: number
    bankAccountId: string
    statementItems?: StatementItem[]
  }): Promise<CreateTransferRequestResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error creating transfer request:", error)
      throw error
    }
  },

  fulfillTransfer: async (params: {
    transferRequestId: string
    merchantId: string
    bankAccountId: string
  }): Promise<FulfillTransferResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error fulfilling transfer:", error)
      throw error
    }
  },

  getMerchantTransfer: async (
    id: string
  ): Promise<GetMerchantTransferResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error getting merchant transfer:", error)
      throw error
    }
  },

  listCustomerTransfers: async (): Promise<CustomerTransferResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error listing customer transfers:", error)
      throw error
    }
  },

  listMerchantTransfers: async (
    continuationToken?: string
  ): Promise<MerchantTransferResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error listing merchant transfers:", error)
      throw error
    }
  },

  getMerchantConfig: async (): Promise<GetMerchantConfigResponse> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error getting merchant config:", error)
      throw error
    }
  },

  updateMerchantConfig: async (
    updateRequest: UpdateMerchantRequest
  ): Promise<Record<string, never>> => {
    try {
      const token = await getAuthToken()

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
    } catch (error) {
      console.error("Error updating merchant config:", error)
      throw error
    }
  },
}
