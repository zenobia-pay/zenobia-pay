import { Component, createSignal } from "solid-js"
import { A } from "@solidjs/router"

const Docs: Component = () => {
  const [activeTab, setActiveTab] = createSignal("introduction")

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex-shrink-0">
              <A href="/" class="flex items-center">
                <span class="text-lg font-semibold text-indigo-600">Zenobia Pay</span>
              </A>
            </div>
            <nav class="flex space-x-8">
              <A
                href="/"
                class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </A>
              <A
                href="/terms"
                class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Terms
              </A>
              <A
                href="/privacy"
                class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Privacy
              </A>
              <A
                href="/docs"
                class="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                aria-current="page"
              >
                Documentation
              </A>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h1 class="text-2xl font-bold text-gray-900">Documentation</h1>
              <p class="mt-1 text-sm text-gray-500">
                Learn how to integrate and use Zenobia Pay's services
              </p>
            </div>

            <div class="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div class="w-full md:w-64 border-r border-gray-200 bg-gray-50">
                <nav class="p-4 space-y-1">
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "introduction"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("introduction")}
                  >
                    Introduction
                  </button>
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "quickstart"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("quickstart")}
                  >
                    Quick Start
                  </button>
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "api-reference"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("api-reference")}
                  >
                    API Reference
                  </button>
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "webhooks"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("webhooks")}
                  >
                    Webhooks
                  </button>
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "sdks"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("sdks")}
                  >
                    SDKs
                  </button>
                  <button
                    class={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab() === "faq"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("faq")}
                  >
                    FAQ
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div class="flex-1 p-6">
                {activeTab() === "introduction" && (
                  <div class="prose max-w-none">
                    <h2>Introduction to Zenobia Pay</h2>
                    <p>
                      Zenobia Pay provides a suite of payment processing tools that allow
                      businesses to accept payments online, manage customer information,
                      and track transactions. Our services are designed to be easy to integrate,
                      secure, and scalable.
                    </p>
                    <h3>Key Features</h3>
                    <ul>
                      <li>Accept credit card, ACH, and other payment methods</li>
                      <li>Secure storage of customer payment information</li>
                      <li>Automated reconciliation and reporting</li>
                      <li>Fraud prevention tools</li>
                      <li>Customizable checkout experiences</li>
                    </ul>
                    <h3>Getting Started</h3>
                    <p>
                      To start using Zenobia Pay, you'll need to:
                    </p>
                    <ol>
                      <li>Create an account</li>
                      <li>Complete your business profile</li>
                      <li>Integrate our SDK or API into your application</li>
                      <li>Start accepting payments</li>
                    </ol>
                    <p>
                      Head over to the <button
                        class="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => setActiveTab("quickstart")}
                      >Quick Start</button> guide
                      to get up and running in minutes.
                    </p>
                  </div>
                )}

                {activeTab() === "quickstart" && (
                  <div class="prose max-w-none">
                    <h2>Quick Start Guide</h2>
                    <p>
                      This guide will help you get started with Zenobia Pay's payment processing services.
                    </p>

                    <h3>Step 1: Set Up Your Account</h3>
                    <p>
                      Before you begin integration, you'll need to:
                    </p>
                    <ol>
                      <li>Sign up for a Zenobia Pay account</li>
                      <li>Verify your email address</li>
                      <li>Complete your business profile</li>
                      <li>Add your banking information</li>
                    </ol>

                    <h3>Step 2: Get Your API Keys</h3>
                    <p>
                      Once your account is set up, you can find your API keys in the Developer section of your dashboard.
                      You'll need these keys to authenticate your API requests.
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        // Example API key<br />
                        sk_test_51KjF8dGhJ7nK9lP3xcVb2L4M8tGy6JQpZxBq3YwOoN
                      </code>
                    </div>

                    <h3>Step 3: Install the SDK</h3>
                    <p>
                      Our SDKs make it easy to integrate with Zenobia Pay. Choose the SDK for your platform:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        # Node.js<br />
                        npm install zenobia-pay-node<br /><br />

                        # Python<br />
                        pip install zenobia-pay<br /><br />

                        # PHP<br />
                        composer require zenobia-pay/zenobia-pay-php
                      </code>
                    </div>

                    <h3>Step 4: Create a Payment</h3>
                    <p>
                      Now you're ready to accept your first payment. Here's a simple example in JavaScript:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        // Initialize Zenobia Pay with your API key<br />
                        const zenobiaPay = require('zenobia-pay-node')('sk_test_your_api_key');<br /><br />

                        // Create a payment<br />
                        const payment = await zenobiaPay.payments.create({'{'}
                        <br />
                        &nbsp;&nbsp;amount: 2000, // $20.00<br />
                        &nbsp;&nbsp;currency: 'usd',<br />
                        &nbsp;&nbsp;payment_method: 'pm_card_visa',<br />
                        &nbsp;&nbsp;description: 'Example payment',<br />
                        &nbsp;&nbsp;customer: 'cus_12345',<br />
                        {'}'});<br /><br />

                        console.log(payment);
                      </code>
                    </div>

                    <h3>Next Steps</h3>
                    <p>
                      Now that you've processed your first payment, explore the full
                      <button
                        class="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => setActiveTab("api-reference")}
                      >API Reference</button> to learn more about what you can do with Zenobia Pay.
                    </p>
                  </div>
                )}

                {activeTab() === "api-reference" && (
                  <div class="prose max-w-none">
                    <h2>API Reference</h2>
                    <p>
                      The Zenobia Pay API is organized around REST. Our API has predictable resource-oriented URLs,
                      accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP
                      response codes, authentication, and verbs.
                    </p>

                    <h3>Base URL</h3>
                    <p>
                      All API requests should be made to:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>https://api.zenobiapay.com/v1</code>
                    </div>

                    <h3>Authentication</h3>
                    <p>
                      Authenticate your API requests by including your API key in the Authorization header:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        Authorization: Bearer sk_test_your_api_key
                      </code>
                    </div>

                    <h3>Payments</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                          <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">/payments</td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">POST</td>
                          <td class="px-3 py-2 text-sm text-gray-500">Create a new payment</td>
                        </tr>
                        <tr>
                          <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">/payments/{'{'}<span class="text-green-600">payment_id</span>{'}'}</td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">GET</td>
                          <td class="px-3 py-2 text-sm text-gray-500">Retrieve a payment</td>
                        </tr>
                        <tr>
                          <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">/payments</td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">GET</td>
                          <td class="px-3 py-2 text-sm text-gray-500">List all payments</td>
                        </tr>
                        <tr>
                          <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">/payments/{'{'}<span class="text-green-600">payment_id</span>{'}'}/refund</td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">POST</td>
                          <td class="px-3 py-2 text-sm text-gray-500">Refund a payment</td>
                        </tr>
                      </tbody>
                    </table>

                    <p class="mt-6">
                      For complete documentation on all available endpoints, please refer to our
                      <a href="#" class="text-indigo-600 hover:text-indigo-900">full API docs</a>.
                    </p>
                  </div>
                )}

                {activeTab() === "webhooks" && (
                  <div class="prose max-w-none">
                    <h2>Webhooks</h2>
                    <p>
                      Webhooks allow you to receive real-time notifications about events that happen in your Zenobia Pay account.
                      Instead of polling our API for updates, webhooks push events to your endpoint as they occur.
                    </p>

                    <h3>Setting Up Webhooks</h3>
                    <p>
                      To set up a webhook:
                    </p>
                    <ol>
                      <li>Go to the Developer section of your dashboard</li>
                      <li>Click on "Webhooks"</li>
                      <li>Click "Add Endpoint"</li>
                      <li>Enter the URL where you want to receive webhooks</li>
                      <li>Select the events you want to subscribe to</li>
                      <li>Save your webhook configuration</li>
                    </ol>

                    <h3>Handling Webhook Events</h3>
                    <p>
                      When an event occurs, we'll send an HTTP POST request to your endpoint with a JSON payload:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        {'{'}
                        <br />
                        &nbsp;&nbsp;"id": "evt_1KjF8dGhJ7nK9lP3xcVb2L4M",<br />
                        &nbsp;&nbsp;"type": "payment.succeeded",<br />
                        &nbsp;&nbsp;"created": 1647532890,<br />
                        &nbsp;&nbsp;"data": {'{'}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"object": {'{'}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "pay_1KjF8dGhJ7nK9lP3xcVb2L4M",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"amount": 2000,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currency": "usd",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"status": "succeeded",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// ... other payment details<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                        <br />
                        &nbsp;&nbsp;{'}'}
                        <br />
                        {'}'}
                      </code>
                    </div>

                    <h3>Securing Webhooks</h3>
                    <p>
                      To verify that the webhook was sent by Zenobia Pay, you should validate the signature included in each request:
                    </p>
                    <div class="bg-gray-100 p-4 rounded">
                      <code>
                        // Node.js example<br />
                        const zenobiaPay = require('zenobia-pay-node');<br /><br />

                        const signature = req.headers['zenobia-signature'];<br />
                        const payload = req.body;<br />
                        const webhookSecret = 'whsec_...'; // Your webhook secret<br /><br />

                        try {'{'}
                        <br />
                        &nbsp;&nbsp;const event = zenobiaPay.webhooks.constructEvent(payload, signature, webhookSecret);<br />
                        &nbsp;&nbsp;// Handle the event<br />
                        {'}'} catch (err) {'{'}
                        <br />
                        &nbsp;&nbsp;console.log('Webhook signature verification failed.', err);<br />
                        &nbsp;&nbsp;return res.status(400).send();<br />
                        {'}'}
                      </code>
                    </div>
                  </div>
                )}

                {activeTab() === "sdks" && (
                  <div class="prose max-w-none">
                    <h2>SDKs & Libraries</h2>
                    <p>
                      Zenobia Pay provides official client libraries for several programming languages to make
                      integrating with our API as easy as possible.
                    </p>

                    <h3>Available SDKs</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <h4 class="font-medium">Node.js</h4>
                        <div class="mt-2 text-sm text-gray-600">
                          <p>Compatible with Node.js 12+</p>
                          <div class="mt-3">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900 font-medium">View on GitHub</a>
                          </div>
                          <div class="mt-2 bg-gray-100 p-2 rounded">
                            <code>npm install zenobia-pay-node</code>
                          </div>
                        </div>
                      </div>

                      <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <h4 class="font-medium">Python</h4>
                        <div class="mt-2 text-sm text-gray-600">
                          <p>Compatible with Python 3.6+</p>
                          <div class="mt-3">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900 font-medium">View on GitHub</a>
                          </div>
                          <div class="mt-2 bg-gray-100 p-2 rounded">
                            <code>pip install zenobia-pay</code>
                          </div>
                        </div>
                      </div>

                      <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <h4 class="font-medium">PHP</h4>
                        <div class="mt-2 text-sm text-gray-600">
                          <p>Compatible with PHP 7.4+</p>
                          <div class="mt-3">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900 font-medium">View on GitHub</a>
                          </div>
                          <div class="mt-2 bg-gray-100 p-2 rounded">
                            <code>composer require zenobia-pay/zenobia-pay-php</code>
                          </div>
                        </div>
                      </div>

                      <div class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <h4 class="font-medium">Ruby</h4>
                        <div class="mt-2 text-sm text-gray-600">
                          <p>Compatible with Ruby 2.6+</p>
                          <div class="mt-3">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900 font-medium">View on GitHub</a>
                          </div>
                          <div class="mt-2 bg-gray-100 p-2 rounded">
                            <code>gem install zenobia_pay</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3>Community Libraries</h3>
                    <p>
                      In addition to our official SDKs, there are also community-maintained libraries for various languages and frameworks.
                    </p>
                    <ul>
                      <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Zenobia Pay for .NET</a></li>
                      <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Zenobia Pay for Go</a></li>
                      <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Zenobia Pay for Laravel</a></li>
                      <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Zenobia Pay for React</a></li>
                    </ul>
                  </div>
                )}

                {activeTab() === "faq" && (
                  <div class="prose max-w-none">
                    <h2>Frequently Asked Questions</h2>

                    <div class="space-y-6">
                      <div>
                        <h3>What currencies does Zenobia Pay support?</h3>
                        <p>
                          Zenobia Pay supports processing payments in over 135 currencies, but settlement is available in a more limited set,
                          including USD, EUR, GBP, CAD, AUD, and more. See our <a href="#" class="text-indigo-600 hover:text-indigo-900">currency documentation</a> for the full list.
                        </p>
                      </div>

                      <div>
                        <h3>How do I handle failed payments?</h3>
                        <p>
                          When a payment fails, you'll receive a webhook event with the details of the failure. You can also set up automatic
                          retry logic through our dashboard. For more information, see our guide on
                          <a href="#" class="text-indigo-600 hover:text-indigo-900">handling failed payments</a>.
                        </p>
                      </div>

                      <div>
                        <h3>What are the fees for using Zenobia Pay?</h3>
                        <p>
                          Our standard pricing is 2.9% + 30¢ per successful card charge. Volume discounts are available for businesses processing
                          over $80,000 per month. For detailed pricing information, please see our <a href="#" class="text-indigo-600 hover:text-indigo-900">pricing page</a>.
                        </p>
                      </div>

                      <div>
                        <h3>How long does it take to get set up?</h3>
                        <p>
                          Most businesses can start accepting test payments immediately after signing up. To accept live payments, you'll need to
                          complete the verification process, which typically takes 1-2 business days.
                        </p>
                      </div>

                      <div>
                        <h3>Is Zenobia Pay PCI compliant?</h3>
                        <p>
                          Yes, Zenobia Pay is PCI Level 1 compliant, which is the highest level of certification available.
                          When you use our checkout or Elements, your integration is also PCI compliant.
                        </p>
                      </div>

                      <div>
                        <h3>How do I get help if I have questions?</h3>
                        <p>
                          We offer several support channels:
                        </p>
                        <ul>
                          <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Email support</a></li>
                          <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Live chat</a> (available during business hours)</li>
                          <li><a href="#" class="text-indigo-600 hover:text-indigo-900">Community forum</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-gray-500">
            © 2023 Zenobia Pay, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Docs