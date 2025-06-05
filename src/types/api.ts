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
  transferRequestId: string
  amount: number
  status: TransferStatus
  createdAt: string
  updatedAt: string
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

export interface ListM2mCredentialsResponse {
  credentials: {
    clientId: string
    createdAt?: string // Optional since it's not explicitly in API spec but useful to have
  }[]
}

export interface DeleteM2mCredentialsRequest {
  clientId: string
}

export interface DeleteM2mCredentialsResponse {
  clientId: string
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

export interface GetUserProfileResponse {
  hasOnboarded: boolean
  userType: UserType
  isApproved: boolean
}

export interface Address {
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  zip5: string
}

export enum EntityType {
  SOLE_PROPRIETORSHIP = "SOLE_PROPRIETORSHIP",
  PARTNERSHIP = "PARTNERSHIP",
  LLP = "LLP",
  LLC = "LLC",
  C_CORP = "C_CORP",
  S_CORP = "S_CORP",
  B_CORP = "B_CORP",
  NON_PROFIT = "NON_PROFIT",
}

export enum TaxIdType {
  TIN = "TIN",
  EIN = "EIN",
}

export interface SubmitMerchantOnboardingRequest {
  firstName: string
  lastName: string
  merchantDisplayName: string
  legalBusinessName: string
  entityType: EntityType
  taxId: string
  taxIdType: TaxIdType
  incorporationDate: string
  address: Address
}

export enum PlaidProduct {
  AUTH = "AUTH",
  IDENTITY_VERIFICATION = "IDENTITY_VERIFICATION",
}
