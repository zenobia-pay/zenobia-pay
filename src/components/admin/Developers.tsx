import {
  Component,
  createSignal,
  For,
  Show,
  createEffect,
  createResource,
} from "solid-js"
import { api } from "../../services/api"
import { toast } from "solid-toast"
import { useLocation, useNavigate } from "@solidjs/router"
import type {
  GetMerchantConfigResponse,
  UpdateMerchantRequest,
} from "../../types/api"

// This defines the structure for webhooks in the UI
interface WebhookDisplay {
  id: string
  url: string
  events: string[]
  active: boolean
  created: string
  lastFailed: string | null
}

// Add interface for M2M credentials
interface M2mCredential {
  clientId: string
  createdAt?: string
}

const Developers: Component = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const activeSubtab = () => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get("tab")

    // First check if we're on the developers tab
    if (tab !== "developers") return "m2m-credentials" // Default if not on developers tab

    // Then check for subtab
    const subtab = searchParams.get("subtab")
    if (subtab === "webhooks") return "webhooks"
    if (subtab === "docs") return "docs"
    return "m2m-credentials" // Default subtab
  }

  const [isGeneratingCredentials, setIsGeneratingCredentials] =
    createSignal(false)
  const [generatedCredentials, setGeneratedCredentials] = createSignal<{
    clientId: string
    clientSecret: string
  } | null>(null)
  const [m2mCredentials, setM2mCredentials] = createSignal<M2mCredential[]>([])
  const [isLoadingCredentials, setIsLoadingCredentials] = createSignal(false)
  const [isDeletingCredential, setIsDeletingCredential] = createSignal(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    createSignal(false)
  const [confirmCredentialId, setConfirmCredentialId] = createSignal<
    string | null
  >(null)

  // Added state for webhook management
  const [webhookUrl, setWebhookUrl] = createSignal("")
  const [isEditingWebhook, setIsEditingWebhook] = createSignal(false)
  const [isSavingWebhook, setIsSavingWebhook] = createSignal(false)
  const [webhookEvents] = createSignal([
    "payment.completed",
    "payment.failed",
    "transfer.created",
    "transfer.completed",
  ])

  // Fetch merchant config for webhook data
  const [merchantConfig, { refetch: refetchMerchantConfig }] =
    createResource<GetMerchantConfigResponse>(async () => {
      try {
        const result = await api.getMerchantConfig()

        // Update webhook URL from merchant config
        if (result.webhookUrl) {
          setWebhookUrl(result.webhookUrl)
        }

        return result
      } catch (err) {
        console.error("Error fetching merchant config:", err)
        toast.error("Failed to load webhook configuration")
        return {} as GetMerchantConfigResponse
      }
    })

  // Load required data based on active subtab
  createEffect(() => {
    if (activeSubtab() === "m2m-credentials") {
      loadM2mCredentials()
    } else if (activeSubtab() === "webhooks") {
      refetchMerchantConfig()
    }
  })

  const loadM2mCredentials = async () => {
    try {
      setIsLoadingCredentials(true)
      const response = await api.listM2mCredentials()
      setM2mCredentials(response.credentials)
    } catch (error) {
      console.error("Error loading M2M credentials:", error)
      toast.error("Failed to load M2M credentials")
    } finally {
      setIsLoadingCredentials(false)
    }
  }

  const generateM2mCredentials = async () => {
    try {
      setIsGeneratingCredentials(true)
      const credentials = await api.createM2mCredentials()
      setGeneratedCredentials(credentials)
      toast.success("M2M credentials generated successfully")
      // Refresh the list of credentials
      loadM2mCredentials()
    } catch (error) {
      console.error("Error generating M2M credentials:", error)
      toast.error("Failed to generate M2M credentials")
    } finally {
      setIsGeneratingCredentials(false)
    }
  }

  const confirmDeleteCredential = (clientId: string) => {
    setConfirmCredentialId(clientId)
    setShowDeleteConfirmation(true)
  }

  const cancelDeleteCredential = () => {
    setShowDeleteConfirmation(false)
    setConfirmCredentialId(null)
  }

  const proceedWithDelete = async () => {
    const clientId = confirmCredentialId()
    if (!clientId) return

    try {
      setIsDeletingCredential(true)
      await api.deleteM2mCredentials(clientId)
      toast.success("M2M credentials deleted successfully")
      // Refresh the list of credentials
      loadM2mCredentials()
    } catch (error) {
      console.error("Error deleting M2M credentials:", error)
      toast.error("Failed to delete M2M credentials")
    } finally {
      setIsDeletingCredential(false)
      setShowDeleteConfirmation(false)
      setConfirmCredentialId(null)
    }
  }

  // New function to save webhook URL
  const saveWebhookUrl = async () => {
    try {
      setIsSavingWebhook(true)

      const updateRequest: UpdateMerchantRequest = {
        webhookUrl: webhookUrl(),
      }

      await api.updateMerchantConfig(updateRequest)
      toast.success("Webhook URL updated successfully")
      setIsEditingWebhook(false)

      // Refetch to ensure we have the latest data
      refetchMerchantConfig()
    } catch (error) {
      console.error("Error updating webhook URL:", error)
      toast.error("Failed to update webhook URL")
    } finally {
      setIsSavingWebhook(false)
    }
  }

  const cancelWebhookEdit = () => {
    // Reset to original value from merchant config
    const configWebhookUrl = merchantConfig()?.webhookUrl
    if (configWebhookUrl) {
      setWebhookUrl(configWebhookUrl)
    } else {
      setWebhookUrl("")
    }
    setIsEditingWebhook(false)
  }

  // Webhook data derived from merchant config
  const webhooks = () => {
    if (!webhookUrl()) return [] as WebhookDisplay[]

    return [
      {
        id: "wh_main",
        url: webhookUrl(),
        events: webhookEvents(),
        active: true,
        created: merchantConfig()?.webhookUrl
          ? "Already configured"
          : "Just now",
        lastFailed: null,
      },
    ] as WebhookDisplay[]
  }

  return (
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-gray-900">Developer Tools</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your M2M credentials, webhooks, and access developer resources
        </p>
      </header>

      {/* Subtabs */}
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => navigate("?tab=developers&subtab=m2m-credentials")}
            class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubtab() === "m2m-credentials"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            M2M Credentials
          </button>
          <button
            onClick={() => navigate("?tab=developers&subtab=webhooks")}
            class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubtab() === "webhooks"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => navigate("?tab=developers&subtab=docs")}
            class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubtab() === "docs"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Documentation
          </button>
        </nav>
      </div>

      {/* Delete Confirmation Modal */}
      <Show when={showDeleteConfirmation()}>
        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    class="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Delete M2M Credential
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this credential? Any
                      applications using it will no longer be able to
                      authenticate.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={proceedWithDelete}
                  disabled={isDeletingCredential()}
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:bg-red-400"
                >
                  {isDeletingCredential() ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  onClick={cancelDeleteCredential}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* M2M Credentials Tab */}
      <Show when={activeSubtab() === "m2m-credentials"}>
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">
              Machine-to-Machine Credentials
            </h2>
            <button
              onClick={generateM2mCredentials}
              disabled={isGeneratingCredentials()}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {isGeneratingCredentials()
                ? "Generating..."
                : "Generate New Credentials"}
            </button>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="text-md font-medium text-gray-900">
              About M2M Credentials
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Machine-to-Machine (M2M) credentials allow your server
              applications to authenticate directly with our API without
              involving a user. These credentials are ideal for server-side
              applications, scheduled jobs, or any backend service that needs to
              call our API.
            </p>
            <p class="mt-2 text-sm text-gray-500">
              Important: Keep your credentials secure. Do not expose them in
              client-side code or public repositories. If credentials are
              compromised, generate new ones immediately and update your
              applications.
            </p>
          </div>

          {/* List of existing credentials */}
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-md font-medium text-gray-900">
                Your Credentials
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                These credentials can be used for server-to-server API
                authentication.
              </p>
            </div>
            <Show when={isLoadingCredentials()}>
              <div class="p-6 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500">Loading credentials...</p>
              </div>
            </Show>
            <Show
              when={!isLoadingCredentials() && m2mCredentials().length === 0}
            >
              <div class="p-6 text-center">
                <p class="text-sm text-gray-500">
                  You haven't created any M2M credentials yet. Use the button
                  above to generate credentials.
                </p>
              </div>
            </Show>
            <Show when={!isLoadingCredentials() && m2mCredentials().length > 0}>
              <ul class="divide-y divide-gray-200">
                <For each={m2mCredentials()}>
                  {(credential) => (
                    <li class="px-4 py-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <div class="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">
                              Client ID
                            </div>
                            <div class="text-sm text-gray-500">
                              {credential.clientId}
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center">
                          {credential.createdAt && (
                            <span class="text-sm text-gray-500 mr-4">
                              Created:{" "}
                              {new Date(
                                credential.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              confirmDeleteCredential(credential.clientId)
                            }
                            class="text-red-400 hover:text-red-500"
                            title="Delete credential"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>

          <Show when={generatedCredentials()}>
            <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <div class="space-y-4">
                <div>
                  <h3 class="text-md font-medium text-gray-900 mb-2">
                    Newly Generated Credentials
                  </h3>
                  <div class="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                          Important
                        </h3>
                        <div class="mt-2 text-sm text-yellow-700">
                          <p>
                            These credentials will only be shown once. Make sure
                            to save them securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      readonly
                      value={generatedCredentials()?.clientId}
                      class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generatedCredentials()?.clientId || ""
                        )
                        toast.success("Client ID copied to clipboard")
                      }}
                      class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm rounded-r-md hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Client Secret
                  </label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      readonly
                      value={generatedCredentials()?.clientSecret}
                      class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generatedCredentials()?.clientSecret || ""
                        )
                        toast.success("Client Secret copied to clipboard")
                      }}
                      class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm rounded-r-md hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      {/* Webhooks Tab */}
      <Show when={activeSubtab() === "webhooks"}>
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Webhooks</h2>
            <Show when={!isEditingWebhook() && webhooks().length === 0}>
              <button
                onClick={() => setIsEditingWebhook(true)}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Add Webhook
              </button>
            </Show>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="text-md font-medium text-gray-900">About Webhooks</h3>
            <p class="mt-2 text-sm text-gray-500">
              Webhooks allow you to receive real-time notifications when events
              happen in your Zenobia Pay account. For example, when a payment is
              completed or when a transfer fails.
            </p>
            <p class="mt-2 text-sm text-gray-500">
              We'll send HTTP POST requests to your endpoint with event data
              whenever these events occur.
            </p>
          </div>

          <Show when={merchantConfig.loading}>
            <div class="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-500">
                Loading webhook configuration...
              </p>
            </div>
          </Show>

          <Show when={!merchantConfig.loading && isEditingWebhook()}>
            <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">
                {webhooks().length === 0 ? "Add Webhook" : "Edit Webhook"}
              </h3>
              <div class="space-y-4">
                <div>
                  <label
                    for="webhook-url"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Webhook URL
                  </label>
                  <div class="mt-1">
                    <input
                      type="url"
                      id="webhook-url"
                      value={webhookUrl()}
                      onInput={(e) => setWebhookUrl(e.currentTarget.value)}
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://your-server.com/webhooks/zenobia"
                    />
                  </div>
                  <p class="mt-1 text-sm text-gray-500">
                    Enter the URL where Zenobia Pay should send webhook events
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Events
                  </label>
                  <div class="mt-2 space-y-2">
                    <p class="text-sm text-gray-500">
                      Your webhook will receive all of the following events:
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <For each={webhookEvents()}>
                        {(event) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {event}
                          </span>
                        )}
                      </For>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={saveWebhookUrl}
                    disabled={isSavingWebhook()}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
                  >
                    {isSavingWebhook() ? "Saving..." : "Save Webhook"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelWebhookEdit}
                    disabled={isSavingWebhook()}
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Show>

          <Show when={!merchantConfig.loading && !isEditingWebhook()}>
            <Show when={webhooks().length === 0}>
              <div class="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p class="text-sm text-gray-500">
                  No webhook URL has been configured yet. Click "Add Webhook" to
                  set one up.
                </p>
              </div>
            </Show>

            <Show when={webhooks().length > 0}>
              <div class="bg-white shadow overflow-hidden sm:rounded-md">
                <ul class="divide-y divide-gray-200">
                  <For each={webhooks()}>
                    {(webhook) => (
                      <li>
                        <div class="px-4 py-4 sm:px-6">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <div class="flex-shrink-0">
                                <div
                                  class={`h-8 w-8 rounded-full flex items-center justify-center ${webhook.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div class="ml-4">
                                <div class="font-medium text-gray-900 break-all">
                                  {webhook.url}
                                </div>
                                <div class="text-sm text-gray-500">
                                  Events: {webhook.events.join(", ")}
                                </div>
                              </div>
                            </div>
                            <div class="flex items-center space-x-4">
                              <span
                                class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${webhook.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {webhook.active ? "Active" : "Inactive"}
                              </span>
                              <button
                                class="text-gray-400 hover:text-gray-500"
                                onClick={() => setIsEditingWebhook(true)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </Show>
          </Show>
        </div>
      </Show>
      {/* Documentation Tab */}
      <Show when={activeSubtab() === "docs"}>
        <div class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900">Documentation</h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium text-gray-900">API Reference</h3>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <p class="text-sm text-gray-500">
                  Complete reference for our REST API endpoints, request
                  parameters, and response formats.
                </p>
                <div class="mt-4">
                  <a
                    href="https://docs.zenobiapay.com"
                    target="_blank"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    View API Reference
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-2 -mr-0.5 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium text-gray-900">SDKs</h3>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <p class="text-sm text-gray-500">
                  Client libraries for various programming languages to help you
                  integrate with our API quickly.
                </p>
                <div class="mt-4 space-y-2">
                  <a
                    href="https://github.com/zenobia-pay/client"
                    class="block text-sm text-indigo-600 hover:text-indigo-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JavaScript Client
                  </a>
                  <a
                    href="https://github.com/zenobia-pay/ui-solid"
                    class="block text-sm text-indigo-600 hover:text-indigo-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SolidJS Pay with Zenobia
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium text-gray-900">Tutorials</h3>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <p class="text-sm text-gray-500">
                  Step-by-step guides to help you implement common payment flows
                  and integrations. Tutorials coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default Developers
