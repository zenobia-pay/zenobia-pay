import {
  Component,
  createContext,
  useContext,
  createResource,
  JSX,
  createSignal,
  createMemo,
} from "solid-js"
import { api } from "../services/api"
import type {
  GetMerchantConfigResponse,
  MerchantTransferResponse,
  CheckManualOrdersConfigResponse,
  SetupManualOrdersResponse,
  ListOrdersResponse,
  MerchantTransfer,
  TransferStatisticsResponse,
  TransferStatisticsRequest,
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
  allMerchantTransfers: () => MerchantTransfer[]
  hasMoreTransfers: () => boolean
  m2mCredentials: () => M2mCredential[]
  m2mCredentialsLoading: () => boolean
  manualOrdersConfig: () => CheckManualOrdersConfigResponse | undefined
  manualOrdersConfigLoading: () => boolean
  orders: () => ListOrdersResponse | undefined
  ordersLoading: () => boolean
  ordersError: () => Error | undefined
  transferStatistics: () => TransferStatisticsResponse | undefined
  transferStatisticsLoading: () => boolean
  refetchMerchantConfig: () => Promise<void>
  refetchMerchantTransfers: () => Promise<void>
  loadMoreTransfers: () => Promise<void>
  refetchM2mCredentials: () => Promise<void>
  refetchManualOrdersConfig: () => Promise<void>
  refetchOrders: () => Promise<void>
  fetchTransferStatistics: (filterParams: {
    filterType: string
    customStartDate?: string
    customEndDate?: string
  }) => Promise<void>
  clearTransferStatisticsCache: () => void
  generateM2mCredentials: () => Promise<{
    clientId: string
    clientSecret: string
  } | null>
  deleteM2mCredentials: (clientId: string) => Promise<void>
  setupManualOrders: () => Promise<SetupManualOrdersResponse>
}

const MerchantContext = createContext<MerchantContextValue>(
  {} as MerchantContextValue
)

export const useMerchant = () => useContext(MerchantContext)

export const MerchantProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  // State for paginated merchant transfers
  const [allTransfers, setAllTransfers] = createSignal<MerchantTransfer[]>([])
  const [currentContinuationToken, setCurrentContinuationToken] = createSignal<
    string | undefined
  >(undefined)
  const [isLoadingMore, setIsLoadingMore] = createSignal(false)

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

  // Merchant transfers resource (first page only)
  const [merchantTransfers, { refetch: refetchMerchantTransfers }] =
    createResource<MerchantTransferResponse>(async () => {
      try {
        const response = await api.listMerchantTransfers()
        // Initialize allTransfers with the first page
        setAllTransfers(response.items || [])
        setCurrentContinuationToken(response.continuationToken)
        return response
      } catch (err) {
        console.error("Error fetching merchant transfers:", err)
        return {} as MerchantTransferResponse
      }
    })

  // Computed values for pagination
  const hasMoreTransfers = createMemo(() => {
    return !!currentContinuationToken()
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

  // Manual orders config resource
  const [manualOrdersConfig, { refetch: refetchManualOrdersConfig }] =
    createResource<CheckManualOrdersConfigResponse>(async () => {
      try {
        return await api.checkManualOrdersConfig()
      } catch (err) {
        console.error("Error fetching manual orders config:", err)
        return {} as CheckManualOrdersConfigResponse
      }
    })

  // Orders resource
  const [orders, { refetch: refetchOrders }] =
    createResource<ListOrdersResponse>(async () => {
      try {
        return await api.listOrders()
      } catch (err) {
        console.error("Error fetching orders:", err)
        return {} as ListOrdersResponse
      }
    })

  // Transfer statistics state with memoization
  const [transferStatisticsCache, setTransferStatisticsCache] = createSignal<
    Map<string, TransferStatisticsResponse>
  >(new Map())
  const [transferStatisticsLoading, setTransferStatisticsLoading] =
    createSignal(false)
  const [currentFilterParams, setCurrentFilterParams] = createSignal<
    | {
        filterType: string
        customStartDate?: string
        customEndDate?: string
      }
    | undefined
  >(undefined)

  // Helper function to create cache key from filter parameters
  const createCacheKey = (filterParams: {
    filterType: string
    customStartDate?: string
    customEndDate?: string
  }): string => {
    return JSON.stringify(filterParams)
  }

  // Helper function to convert filter params to API params
  const convertFilterToApiParams = (filterParams: {
    filterType: string
    customStartDate?: string
    customEndDate?: string
  }): TransferStatisticsRequest => {
    const now = new Date()
    const beginningOfTime = new Date(2025, 0, 1) // January 1st, 2025
    let startDate: Date
    let endDate: Date

    switch (filterParams.filterType) {
      case "today":
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        endDate = now
        break
      case "yesterday":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case "last7days":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
        endDate = now
        break
      case "last30days":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 30)
        endDate = now
        break
      case "last90days":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 90)
        endDate = now
        break
      case "yeartodate":
        startDate = new Date(now.getFullYear(), 0, 1) // January 1st of current year
        endDate = now
        break
      case "custom":
        // For custom dates, validate and provide defaults
        if (filterParams.customStartDate) {
          startDate = new Date(filterParams.customStartDate)
          if (isNaN(startDate.getTime())) {
            startDate = beginningOfTime
          }
        } else {
          startDate = beginningOfTime
        }

        if (filterParams.customEndDate) {
          endDate = new Date(filterParams.customEndDate)
          if (isNaN(endDate.getTime())) {
            endDate = now
          }
        } else {
          endDate = now
        }
        break
      case "all":
      default:
        // For "all time", use beginning of time to now
        startDate = beginningOfTime
        endDate = now
        break
    }

    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    }
  }

  // Get transfer statistics from cache or current state
  const transferStatistics = createMemo(() => {
    const filterParams = currentFilterParams()
    if (!filterParams) return undefined

    const cacheKey = createCacheKey(filterParams)
    const cached = transferStatisticsCache().get(cacheKey)
    console.log("Cache lookup:", { filterParams, cacheKey, cached: !!cached })
    return cached
  })

  // Load more transfers function
  const loadMoreTransfers = async () => {
    if (isLoadingMore() || !hasMoreTransfers()) return
    console.log("Loading more transfers")

    setIsLoadingMore(true)
    try {
      const continuationToken = currentContinuationToken()
      if (!continuationToken) return

      const nextPage = await api.listMerchantTransfers(continuationToken)

      // Add new transfers to the existing list
      setAllTransfers((prev) => [...prev, ...(nextPage.items || [])])
      setCurrentContinuationToken(nextPage.continuationToken)
    } catch (err) {
      console.error("Error loading more transfers:", err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Fetch transfer statistics function with memoization
  const fetchTransferStatistics = async (filterParams: {
    filterType: string
    customStartDate?: string
    customEndDate?: string
  }) => {
    console.log("Fetching transfer statistics for filter", filterParams)
    const cacheKey = createCacheKey(filterParams)

    // Check if we already have this data in cache
    if (transferStatisticsCache().has(cacheKey)) {
      setCurrentFilterParams(filterParams)
      return
    }

    setTransferStatisticsLoading(true)
    setCurrentFilterParams(filterParams)

    try {
      const apiParams = convertFilterToApiParams(filterParams)
      console.log("API params", apiParams)
      const stats = await api.getTransferStatistics(apiParams)
      setTransferStatisticsCache((prev) => {
        const newCache = new Map(prev)
        newCache.set(cacheKey, stats)
        return newCache
      })
    } catch (err) {
      console.error("Error fetching transfer statistics:", err)
    } finally {
      setTransferStatisticsLoading(false)
    }
  }

  // Clear transfer statistics cache
  const clearTransferStatisticsCache = () => {
    console.log("Clearing transfer statistics cache")
    setTransferStatisticsCache(new Map())
    setCurrentFilterParams(undefined)
  }

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

  // Setup manual orders
  const setupManualOrders = async () => {
    try {
      return await api.setupManualOrders()
    } catch (err) {
      console.error("Error setting up manual orders:", err)
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
        allMerchantTransfers: () => allTransfers(),
        hasMoreTransfers,
        m2mCredentials: () => m2mCredentials() || [],
        m2mCredentialsLoading: () => m2mCredentials.loading,
        manualOrdersConfig: () => manualOrdersConfig(),
        manualOrdersConfigLoading: () => manualOrdersConfig.loading,
        orders: () => orders(),
        ordersLoading: () => orders.loading,
        ordersError: () => orders.error,
        transferStatistics: () => transferStatistics(),
        transferStatisticsLoading: () => transferStatisticsLoading(),
        refetchMerchantConfig: async () => {
          await refetchMerchantConfig()
        },
        refetchMerchantTransfers: async () => {
          await refetchMerchantTransfers()
          clearTransferStatisticsCache()
        },
        loadMoreTransfers,
        refetchM2mCredentials: async () => {
          await refetchM2mCredentials()
        },
        refetchManualOrdersConfig: async () => {
          await refetchManualOrdersConfig()
        },
        refetchOrders: async () => {
          await refetchOrders()
          clearTransferStatisticsCache()
        },
        fetchTransferStatistics,
        clearTransferStatisticsCache,
        generateM2mCredentials,
        deleteM2mCredentials,
        setupManualOrders,
      }}
    >
      {props.children}
    </MerchantContext.Provider>
  )
}
