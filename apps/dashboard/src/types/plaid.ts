import type { Institution } from "plaid"

// Custom type for our API's create link token response
export interface CreateLinkTokenResponse {
  linkToken: string
}

// Custom type for our API's list banks response (renamed to match OpenAPI)
export interface ListBankAccountsResponse {
  continuationToken?: string
  items: BankAccount[]
}

// Custom type for our API's bank connection format (renamed to match OpenAPI)
export interface BankAccount {
  bankAccountId: string
  bankAccountName: string
}

// Configuration for Plaid Link
export interface PlaidLinkConfig {
  token: string
  onSuccess: (public_token: string, metadata: Institution) => void
  onExit: (err: Error | null, metadata: { status?: string }) => void
  onEvent: (eventName: string, metadata: { error?: Error }) => void
}
