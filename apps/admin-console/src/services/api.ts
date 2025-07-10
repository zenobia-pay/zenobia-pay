import { authService } from "./auth";

const API_BASE_URL = "https://api.zenobiapay.com";

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

export const api = {
  editTransfer: async (request: EditTransferRequest): Promise<void> => {
    return callApi(async (token) => {
      const response = await fetch(`${API_BASE_URL}/edit-transfer`, {
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
      const response = await fetch(`${API_BASE_URL}/mark-in-dispute`, {
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
};
