import { Component } from "solid-js"
import { A } from "@solidjs/router"

const Privacy: Component = () => {
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
                class="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                aria-current="page"
              >
                Privacy
              </A>
              <A
                href="/docs"
                class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
              <h1 class="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p class="mt-1 text-sm text-gray-500">Last updated: June 15, 2023</p>
            </div>
            <div class="px-4 py-5 sm:p-6 prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At Zenobia Pay, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services ("Services").
              </p>

              <h2>2. Information We Collect</h2>

              <h3>2.1 Personal Information</h3>
              <p>
                We may collect personal information that you provide directly to us, such as:
              </p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Billing information and payment details</li>
                <li>Business information (business name, EIN, etc.)</li>
                <li>Account credentials</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <p>
                We automatically collect information about your use of our Services, such as:
              </p>
              <ul>
                <li>IP address and device identifiers</li>
                <li>Browser type and settings</li>
                <li>Date and time of access</li>
                <li>Referring website</li>
                <li>System activity and usage patterns</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize your experience</li>
              </ul>

              <h2>4. Sharing of Information</h2>
              <p>
                We may share your information with:
              </p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Financial institutions necessary to process transactions</li>
                <li>Business partners with your consent</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h2>7. Children's Privacy</h2>
              <p>
                Our Services are not intended for children under 18. We do not knowingly collect personal information from children under 18.
              </p>

              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@zenobiapay.com" class="text-indigo-600 hover:text-indigo-900">privacy@zenobiapay.com</a>.
              </p>
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

export default Privacy