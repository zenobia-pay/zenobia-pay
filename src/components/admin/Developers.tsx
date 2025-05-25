import { Component, createSignal, For, Show, createEffect } from "solid-js"
import { api } from "../../services/api"
import { toast } from "solid-toast"
import { useLocation, useNavigate } from "@solidjs/router"
import type { UpdateMerchantRequest } from "../../types/api"
import { useMerchant } from "../../context/MerchantContext"

// This defines the structure for webhooks in the UI
interface WebhookDisplay {
  id: string
  url: string
}

// Add interface for M2M credentials
interface M2mCredential {
  clientId: string
  createdAt?: string
}

const Developers: Component = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const merchant = useMerchant()

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
  const [newCredentials, setNewCredentials] = createSignal<{
    clientId: string
    clientSecret: string
  } | null>(null)
  const [isDeletingCredentials, setIsDeletingCredentials] = createSignal<
    string | null
  >(null)

  // Added state for webhook management
  const [webhookUrl, setWebhookUrl] = createSignal("")
  const [isEditingWebhook, setIsEditingWebhook] = createSignal(false)
  const [isSavingWebhook, setIsSavingWebhook] = createSignal(false)

  // Update webhook URL when merchant config changes
  createEffect(() => {
    const config = merchant.merchantConfig()
    if (config?.webhookUrl) {
      setWebhookUrl(config.webhookUrl)
    }
  })

  const handleGenerateCredentials = async () => {
    setIsGeneratingCredentials(true)
    try {
      const credentials = await merchant.generateM2mCredentials()
      setNewCredentials(credentials)
    } catch (err) {
      console.error("Error generating credentials:", err)
    } finally {
      setIsGeneratingCredentials(false)
    }
  }

  const handleDeleteCredentials = async (clientId: string) => {
    setIsDeletingCredentials(clientId)
    try {
      await merchant.deleteM2mCredentials(clientId)
    } catch (err) {
      console.error("Error deleting credentials:", err)
    } finally {
      setIsDeletingCredentials(null)
    }
  }

  // New function to save webhook URL
  const saveWebhookUrl = async () => {
    try {
      setIsSavingWebhook(true)

      const updateRequest: UpdateMerchantRequest = {
        bankAccountId: merchant.merchantConfig()?.bankAccountId || "",
        merchantDisplayName:
          merchant.merchantConfig()?.merchantDisplayName || "",
        webhookUrl: webhookUrl(),
      }

      await api.updateMerchantConfig(updateRequest)
      toast.success("Webhook URL updated successfully")
      setIsEditingWebhook(false)

      // Refetch to ensure we have the latest data
      await merchant.refetchMerchantConfig()
    } catch (error) {
      console.error("Error updating webhook URL:", error)
      toast.error("Failed to update webhook URL")
    } finally {
      setIsSavingWebhook(false)
    }
  }

  const cancelWebhookEdit = () => {
    // Reset to original value from merchant config
    const configWebhookUrl = merchant.merchantConfig()?.webhookUrl
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

      {/* M2M Credentials Tab */}
      <Show when={activeSubtab() === "m2m-credentials"}>
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">
              Machine-to-Machine Credentials
            </h2>
            <button
              onClick={handleGenerateCredentials}
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
            <Show when={isGeneratingCredentials()}>
              <div class="p-6 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500">
                  Generating credentials...
                </p>
              </div>
            </Show>
            <Show
              when={
                !merchant.m2mCredentialsLoading() &&
                merchant.m2mCredentials().length === 0
              }
            >
              <div class="p-6 text-center">
                <p class="text-sm text-gray-500">
                  You haven't created any M2M credentials yet. Use the button
                  above to generate credentials.
                </p>
              </div>
            </Show>
            <Show
              when={
                !merchant.m2mCredentialsLoading() &&
                merchant.m2mCredentials().length > 0
              }
            >
              <ul class="divide-y divide-gray-200">
                <For each={merchant.m2mCredentials()}>
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
                              handleDeleteCredentials(credential.clientId)
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

          <Show when={newCredentials()}>
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
                      value={newCredentials()?.clientId}
                      class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          newCredentials()?.clientId || ""
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
                      value={newCredentials()?.clientSecret}
                      class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          newCredentials()?.clientSecret || ""
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
              Webhooks give real-time notifications when transfer events happen.
              It is crucial that webhook domains are set correctly so that order
              status updates are received. Failure to receive webhook events
              will result in customers who have been charged but not received
              their order.
            </p>
          </div>

          <Show when={!isEditingWebhook()}>
            <Show when={webhooks().length === 0}>
              <div class="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p class="text-sm text-gray-500 mb-4">No webhooks configured</p>
                <button
                  type="button"
                  onClick={() => setIsEditingWebhook(true)}
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Add Webhook
                </button>
              </div>
            </Show>

            <Show when={webhooks().length > 0}>
              <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul role="list" class="divide-y divide-gray-200">
                  <For each={webhooks()}>
                    {(webhook) => (
                      <li class="px-6 py-4">
                        <div class="flex items-center justify-between">
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {webhook.url}
                            </p>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setIsEditingWebhook(true)}
                              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </Show>
          </Show>

          <Show when={isEditingWebhook()}>
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
