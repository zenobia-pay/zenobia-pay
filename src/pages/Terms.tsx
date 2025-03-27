import { Component } from "solid-js"
import { A } from "@solidjs/router"

const Terms: Component = () => {
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
                class="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                aria-current="page"
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
              <h1 class="text-2xl font-bold text-gray-900">Terms of Service</h1>
              <p class="mt-1 text-sm text-gray-500">Last updated: June 15, 2023</p>
            </div>
            <div class="px-4 py-5 sm:p-6 prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Zenobia Pay. These Terms of Service ("Terms") govern your access to and use of the Zenobia Pay platform, website, and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>

              <h2>2. Use of Services</h2>
              <p>
                You may use our Services only as permitted by these Terms and any applicable laws. You may not misuse our Services, for example, by interfering with them or accessing them using a method other than the interface and instructions we provide.
              </p>

              <h2>3. Your Account</h2>
              <p>
                To use certain features of our Services, you may need to create an account. You are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under your account.
              </p>

              <h2>4. Privacy</h2>
              <p>
                Our <A href="/privacy" class="text-indigo-600 hover:text-indigo-900">Privacy Policy</A> explains how we collect, use, and protect your information when you use our Services. By using our Services, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>

              <h2>5. Content</h2>
              <p>
                Our Services may allow you to store, send, receive, or otherwise make available certain content. You retain ownership of any intellectual property rights that you hold in that content.
              </p>

              <h2>6. Modifications to Services</h2>
              <p>
                We are constantly changing and improving our Services. We may add or remove features, and we may suspend or stop a Service altogether.
              </p>

              <h2>7. Termination</h2>
              <p>
                If you violate these Terms, we may terminate or suspend your access to the Services. We may also terminate or suspend your account if we believe it is necessary to comply with law or to protect our rights, property, or safety.
              </p>

              <h2>8. Liability</h2>
              <p>
                To the extent permitted by law, we exclude all warranties, and our liability to you is limited. We are not responsible for content or services provided by others.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We may revise these Terms from time to time. The most current version of these Terms will govern our relationship with you. We will notify you of material changes to these Terms by email or by posting a notice on our website.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:legal@zenobiapay.com" class="text-indigo-600 hover:text-indigo-900">legal@zenobiapay.com</a>.
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

export default Terms