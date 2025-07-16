import { authService } from "./auth";

// This will be set by the environment context
let getApiBaseUrl: (() => string) | null = null;

export const setApiBaseUrlGetter = (getter: () => string) => {
  getApiBaseUrl = getter;
};

// Helper to get the Auth0 token
const getAuthToken = async (): Promise<string> => {
  try {
    const token = await authService.getTokenSilently();
    if (!token) {
      throw new Error("No authentication token available");
    }
    return token;
  } catch (error) {
    console.error("Error in getAuthToken:", error);
    throw error;
  }
};

// A wrapper for API calls that handles authentication
const callApi = async <T>(
  apiCall: (token: string) => Promise<T>
): Promise<T> => {
  try {
    const token = await getAuthToken();
    return await apiCall(token);
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

// Helper to get the current API base URL
const getCurrentApiBaseUrl = (): string => {
  if (!getApiBaseUrl) {
    // Fallback to PROD if context is not set
    return "https://api.zenobiapay.com";
  }
  return getApiBaseUrl();
};

export interface EditTransferRequest {
  transferRequestId: string;
  debitCustomer?: boolean;
  debitMerchant?: boolean;
  creditCustomer?: boolean;
  creditMerchant?: boolean;
}

export interface MarkInDisputeRequest {
  transferRequestId: string;
}

export interface GetAdminTransferRequest {
  id: string;
}

export interface GetAdminTransferResponse {
  transferRequestId: string;
  amount: number;
  inboundStatus: string;
  outboundStatus: string;
  statementItems: StatementItem[];
  statusMessage: string;
  customerName: string;
  fee: number;
  payoutTime: string;
  creationTime: string;
}

export interface StatementItem {
  // Add properties based on the schema reference
  // This is a placeholder - you may need to define the actual structure
  id?: string;
  amount?: number;
  description?: string;
  timestamp?: string;
}

export interface ListAdminTransfersRequest {
  sub: string;
  continuationToken?: string;
}

export interface ListAdminTransfersResponse {
  continuationToken?: string;
  items: Array<{
    amount: number;
    status: string;
    transferRequestId: string;
    customerName: string;
    fee: number;
    payoutTime: string;
    creationTime: string;
  }>;
}

export interface ListMerchantsResponse {
  merchants: Array<{
    id: string;
    name: string;
    approved: boolean;
    creationTime: string;
  }>;
}

export const api = {
  editTransfer: async (request: EditTransferRequest): Promise<void> => {
    return callApi(async (token) => {
      const response = await fetch(`${getCurrentApiBaseUrl()}/edit-transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    });
  },

  markInDispute: async (request: MarkInDisputeRequest): Promise<void> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getCurrentApiBaseUrl()}/mark-in-dispute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    });
  },

  getAdminTransfer: async (
    request: GetAdminTransferRequest
  ): Promise<GetAdminTransferResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getCurrentApiBaseUrl()}/get-admin-transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });
  },

  listAdminTransfers: async (
    request: ListAdminTransfersRequest
  ): Promise<ListAdminTransfersResponse> => {
    return callApi(async (token) => {
      const response = await fetch(
        `${getCurrentApiBaseUrl()}/list-admin-transfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });
  },

  listMerchants: async (): Promise<ListMerchantsResponse> => {
    return callApi(async (token) => {
      const response = await fetch(`${getCurrentApiBaseUrl()}/list-merchants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });
  },
};
