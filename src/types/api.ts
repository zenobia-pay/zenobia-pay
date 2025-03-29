export interface ErrorResponse {
  error: string
  message: string
}

// Define the model types based on OpenAPI spec
export interface Location {
  address?: string
  latitude: number
  longitude: number
}

export interface PaymentParticipantIdentity {
  id: string
  name: string
}

export interface StatementItem {
  name: string
  amount: number
}

export enum TransferStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_FLIGHT = "IN_FLIGHT",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface UpdateMerchantRequest {
  bankAccountId?: string
  merchantDisplayName?: string
  merchantDescription?: string
  merchantLocation?: Location
  webhookUrl?: string
}

export interface WaitlistEntry {
  id: string
  name?: string
  email?: string
  businessType?: string
  createdAt?: string
  updatedAt?: string
}

export interface Transfer {
  amount: number
  status: TransferStatus
  merchant: PaymentParticipantIdentity
  statementItems?: StatementItem[]
  creationTime: string
}

export interface MerchantTransfer {
  amount: number
  status: TransferStatus
  transferRequestId: string
}

export interface CustomerTransferResponse {
  continuationToken?: string
  items: Transfer[]
}

export interface MerchantTransferResponse {
  continuationToken?: string
  items: MerchantTransfer[]
}

export interface BankAccount {
  bankAccountId: string
  bankAccountName: string
}

export interface ListBankAccountsResponse {
  continuationToken?: string
  items: BankAccount[]
}

export interface CreateTransferRequestResponse {
  transferRequestId: string
  merchantId: string
}

export interface FulfillTransferResponse {
  amount: number
  merchant: PaymentParticipantIdentity
  statementItems: StatementItem[]
}

export interface GetMerchantTransferResponse {
  transferRequestId: string
  merchant: PaymentParticipantIdentity
  status: TransferStatus
  statementItems: StatementItem[]
  statusMessage?: string
}

export interface CreateM2mCredentialsResponse {
  clientId: string
  clientSecret: string
}

export interface GetMerchantConfigResponse {
  bankAccountId?: string
  merchantDisplayName?: string
  merchantDescription?: string
  webhookUrl?: string
  merchantLocation?: Location
}

// Define GraphQL operation types
export type CreateWaitlistEntryMutation = {
  createWaitlistEntry: WaitlistEntry
}

export type ListWaitlistEntriesQuery = {
  listWaitlistEntries: {
    items: WaitlistEntry[]
  }
}

// User-related types
export enum UserType {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER",
}

export interface SubmitOnboardingRequest {
  firstName: string
  lastName: string
  userType: UserType
  merchantDisplayName?: string
}

export interface GetUserProfileResponse {
  hasOnboarded: boolean
  userType: UserType
  isApproved: boolean
}
