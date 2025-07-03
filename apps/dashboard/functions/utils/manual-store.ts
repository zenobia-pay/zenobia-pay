import { decrypt } from "../../utils/encryption"
import type { Env } from "../types"

export interface ManualStoreCredentials {
  clientId: string
  clientSecret: string
  createdAt: number
  updatedAt: number
}

/**
 * Get manual store credentials for a merchant from the database
 * This is a server-side utility function - do not expose to clients
 */
export async function getManualStoreCredentials(
  env: Env,
  merchantId: string
): Promise<ManualStoreCredentials | null> {
  try {
    // Get manual store credentials from database
    const manualStore = await env.MERCHANTS_OAUTH.prepare(
      `SELECT zenobia_client_id, zenobia_client_secret, created_at, updated_at
       FROM manual_stores WHERE merchant_id = ?`
    )
      .bind(merchantId)
      .first()

    if (!manualStore) {
      return null
    }

    // Decrypt the client secret
    const decryptedSecret = await decrypt(
      manualStore.zenobia_client_secret as string,
      env.MANUAL_ORDERS_ENCRYPTION_KEY || "default-key-change-in-production"
    )

    return {
      clientId: manualStore.zenobia_client_id as string,
      clientSecret: decryptedSecret,
      createdAt: manualStore.created_at as number,
      updatedAt: manualStore.updated_at as number,
    }
  } catch (error) {
    console.error("Error fetching manual store credentials:", error)
    return null
  }
}
