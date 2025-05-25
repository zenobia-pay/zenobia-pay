import {
  Component,
  createContext,
  useContext,
  createResource,
  JSX,
} from "solid-js"
import { api } from "../services/api"
import type {
  GetMerchantConfigResponse,
  MerchantTransferResponse,
} from "../types/api"

// Define M2M credential type
interface M2mCredential {
  clientId: string
  createdAt?: string
}

interface MerchantContextValue {
  merchantConfig: () => GetMerchantConfigResponse | undefined
  merchantConfigLoading: () => boolean
  merchantTransfers: () => MerchantTransferResponse | undefined
  merchantTransfersLoading: () => boolean
  m2mCredentials: () => M2mCredential[]
  m2mCredentialsLoading: () => boolean
  refetchMerchantConfig: () => Promise<void>
  refetchMerchantTransfers: () => Promise<void>
  refetchM2mCredentials: () => Promise<void>
  generateM2mCredentials: () => Promise<{
    clientId: string
    clientSecret: string
  } | null>
  deleteM2mCredentials: (clientId: string) => Promise<void>
}

const MerchantContext = createContext<MerchantContextValue>(
  {} as MerchantContextValue
)

export const useMerchant = () => useContext(MerchantContext)

export const MerchantProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  // Merchant config resource
  const [merchantConfig, { refetch: refetchMerchantConfig }] =
    createResource<GetMerchantConfigResponse>(async () => {
      try {
        return await api.getMerchantConfig()
      } catch (err) {
        console.error("Error fetching merchant config:", err)
        return {} as GetMerchantConfigResponse
      }
    })

  // Merchant transfers resource
  const [merchantTransfers, { refetch: refetchMerchantTransfers }] =
    createResource<ListMerchantTransfersResponse>(async () => {
      try {
        return await api.listMerchantTransfers()
      } catch (err) {
        console.error("Error fetching merchant transfers:", err)
        return {} as ListMerchantTransfersResponse
      }
    })

  // M2M credentials resource
  const [m2mCredentials, { refetch: refetchM2mCredentials }] = createResource<
    M2mCredential[]
  >(async () => {
    try {
      const response = await api.listM2mCredentials()
      return response.credentials
    } catch (err) {
      console.error("Error fetching M2M credentials:", err)
      return []
    }
  })

  // Generate new M2M credentials
  const generateM2mCredentials = async () => {
    try {
      const credentials = await api.createM2mCredentials()
      await refetchM2mCredentials()
      return credentials
    } catch (err) {
      console.error("Error generating M2M credentials:", err)
      return null
    }
  }

  // Delete M2M credentials
  const deleteM2mCredentials = async (clientId: string) => {
    try {
      await api.deleteM2mCredentials(clientId)
      await refetchM2mCredentials()
    } catch (err) {
      console.error("Error deleting M2M credentials:", err)
      throw err
    }
  }

  return (
    <MerchantContext.Provider
      value={{
        merchantConfig: () => merchantConfig(),
        merchantConfigLoading: () => merchantConfig.loading,
        merchantTransfers: () => merchantTransfers(),
        merchantTransfersLoading: () => merchantTransfers.loading,
        m2mCredentials: () => m2mCredentials() || [],
        m2mCredentialsLoading: () => m2mCredentials.loading,
        refetchMerchantConfig: async () => {
          await refetchMerchantConfig()
        },
        refetchMerchantTransfers: async () => {
          await refetchMerchantTransfers()
        },
        refetchM2mCredentials: async () => {
          await refetchM2mCredentials()
        },
        generateM2mCredentials,
        deleteM2mCredentials,
      }}
    >
      {props.children}
    </MerchantContext.Provider>
  )
}
