import { Component, createSignal, For, Show } from "solid-js"
import { AdminLayout } from "../AdminLayout"

interface ApiKey {
  id: string
  name: string
  prefix: string
  created: string
  lastUsed: string | null
  type: "test" | "live"
}

interface Webhook {
  id: string
  url: string
  events: string[]
  active: boolean
  created: string
  lastFailed: string | null
}

const Developers: Component = () => {
  const [activeTab, setActiveTab] = createSignal("api-keys")

  // Mock data
  const [apiKeys] = createSignal<ApiKey[]>([
    {
      id: "key_1",
      name: "Production Key",
      prefix: "pk_live_51H",
      created: "2023-05-15",
      lastUsed: "2023-06-10",
      type: "live"
    },
    {
      id: "key_2",
      name: "Test Key",
      prefix: "pk_test_51H",
      created: "2023-05-15",
      lastUsed: "2023-06-12",
      type: "test"
    }
  ])

  const [webhooks] = createSignal<Webhook[]>([
    {
      id: "wh_1",
      url: "https://example.com/webhooks/zenobia",
      events: ["payment.completed", "payment.failed"],
      active: true,
      created: "2023-05-20",
      lastFailed: null
    }
  ])

  return (
    <AdminLayout>
      <div class="space-y-6">
        <header>
          <h1 class="text-2xl font-semibold text-gray-900">Developer Tools</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your API keys, webhooks, and access developer resources
          </p>
        </header>

        {/* Tabs */}
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("api-keys")}
              class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab() === "api-keys"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab("webhooks")}
              class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab() === "webhooks"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Webhooks
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab() === "logs"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Event Logs
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab() === "docs"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documentation
            </button>
          </nav>
        </div>

        {/* API Keys Tab */}
        <Show when={activeTab() === "api-keys"}>
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">API Keys</h2>
              <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                Create API Key
              </button>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <For each={apiKeys()}>
                  {(key) => (
                    <li>
                      <div class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <div class="flex-shrink-0">
                              <div class={`h-8 w-8 rounded-full flex items-center justify-center ${key.type === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="font-medium text-gray-900">{key.name}</div>
                              <div class="text-sm text-gray-500">
                                {key.prefix}•••••••••••••••
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center space-x-4">
                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${key.type === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {key.type === 'live' ? 'Live' : 'Test'}
                            </span>
                            <button class="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button class="text-red-400 hover:text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                          <div class="sm:flex">
                            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Created: {key.created}
                            </div>
                          </div>
                          <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last used: {key.lastUsed || 'Never'}
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 class="text-md font-medium text-gray-900">About API Keys</h3>
              <p class="mt-2 text-sm text-gray-500">
                Your API keys are used to authenticate requests to the Zenobia Pay API. Keep your secret keys secure and do not share them in publicly accessible areas such as GitHub or client-side code.
              </p>
              <p class="mt-2 text-sm text-gray-500">
                All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
              </p>
            </div>
          </div>
        </Show>

        {/* Webhooks Tab */}
        <Show when={activeTab() === "webhooks"}>
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Webhooks</h2>
              <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                Add Webhook
              </button>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <For each={webhooks()}>
                  {(webhook) => (
                    <li>
                      <div class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <div class="flex-shrink-0">
                              <div class={`h-8 w-8 rounded-full flex items-center justify-center ${webhook.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="font-medium text-gray-900 break-all">{webhook.url}</div>
                              <div class="text-sm text-gray-500">
                                Events: {webhook.events.join(", ")}
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center space-x-4">
                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${webhook.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {webhook.active ? 'Active' : 'Inactive'}
                            </span>
                            <button class="text-indigo-400 hover:text-indigo-500">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </button>
                            <button class="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button class="text-red-400 hover:text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                          <div class="sm:flex">
                            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Created: {webhook.created}
                            </div>
                          </div>
                          <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last failed: {webhook.lastFailed || 'Never'}
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 class="text-md font-medium text-gray-900">About Webhooks</h3>
              <p class="mt-2 text-sm text-gray-500">
                Webhooks allow you to receive real-time notifications when events happen in your Zenobia Pay account.
                For example, when a payment is completed or when a transfer fails.
              </p>
              <p class="mt-2 text-sm text-gray-500">
                We'll send HTTP POST requests to your endpoint with event data whenever these events occur.
              </p>
            </div>
          </div>
        </Show>

        {/* Logs Tab */}
        <Show when={activeTab() === "logs"}>
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Event Logs</h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Filter by:</span>
                <select class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>All events</option>
                  <option>API requests</option>
                  <option>Webhooks</option>
                  <option>Payments</option>
                  <option>Errors</option>
                </select>
              </div>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Start using our API to see events in the log.
                </p>
                <div class="mt-6">
                  <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    Test API Connection
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 class="text-md font-medium text-gray-900">About Event Logs</h3>
              <p class="mt-2 text-sm text-gray-500">
                Event logs provide a history of all API requests, webhook deliveries, and system events related to your account.
                Use these logs to debug integration issues or monitor system activity.
              </p>
              <p class="mt-2 text-sm text-gray-500">
                Logs are retained for 30 days. For longer retention, consider exporting logs or setting up webhook monitoring.
              </p>
            </div>
          </div>
        </Show>

        {/* Documentation Tab */}
        <Show when={activeTab() === "docs"}>
          <div class="space-y-6">
            <h2 class="text-lg font-medium text-gray-900">Documentation</h2>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg font-medium text-gray-900">API Reference</h3>
                </div>
                <div class="px-4 py-5 sm:p-6">
                  <p class="text-sm text-gray-500">
                    Complete reference for our REST API endpoints, request parameters, and response formats.
                  </p>
                  <div class="mt-4">
                    <a
                      href="/docs"
                      target="_blank"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      View API Reference
                      <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                    Client libraries for various programming languages to help you integrate with our API quickly.
                  </p>
                  <div class="mt-4 space-y-2">
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Node.js SDK</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Python SDK</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Ruby SDK</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">PHP SDK</a>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg font-medium text-gray-900">Tutorials</h3>
                </div>
                <div class="px-4 py-5 sm:p-6">
                  <p class="text-sm text-gray-500">
                    Step-by-step guides to help you implement common payment flows and integrations.
                  </p>
                  <div class="mt-4 space-y-2">
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Accept your first payment</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Set up webhooks</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Handle failed payments</a>
                    <a href="#" class="block text-sm text-indigo-600 hover:text-indigo-900">Implement recurring billing</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium text-gray-900">Sample Applications</h3>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <p class="text-sm text-gray-500">
                  Example projects that demonstrate how to integrate Zenobia Pay into various application types.
                </p>
                <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div class="border border-gray-200 rounded-md p-4 hover:shadow-sm">
                    <h4 class="text-md font-medium text-gray-900">E-commerce Checkout</h4>
                    <p class="mt-2 text-sm text-gray-500 mb-4">
                      A sample online store with Zenobia Pay integration.
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        React
                      </span>
                      <a href="#" class="text-xs text-indigo-600 hover:text-indigo-900">View on GitHub</a>
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-md p-4 hover:shadow-sm">
                    <h4 class="text-md font-medium text-gray-900">Subscription Portal</h4>
                    <p class="mt-2 text-sm text-gray-500 mb-4">
                      A SaaS subscription management dashboard.
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Node.js
                      </span>
                      <a href="#" class="text-xs text-indigo-600 hover:text-indigo-900">View on GitHub</a>
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-md p-4 hover:shadow-sm">
                    <h4 class="text-md font-medium text-gray-900">Mobile Payment SDK</h4>
                    <p class="mt-2 text-sm text-gray-500 mb-4">
                      Example mobile app with Zenobia Pay integration.
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Flutter
                      </span>
                      <a href="#" class="text-xs text-indigo-600 hover:text-indigo-900">View on GitHub</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </AdminLayout>
  )
}

export default Developers