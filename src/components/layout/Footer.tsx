import { Component } from "solid-js";
import { A } from "@solidjs/router";

const Footer: Component = () => {
  return (
    <footer class="bg-gray-100 pt-12 pb-8 border-t border-gray-200">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul class="space-y-2">
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Contact Us
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  FAQs
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Track Order
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Returns & Exchanges
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Shipping Information
                </A>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">
              About ZENOBIA
            </h3>
            <ul class="space-y-2">
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  About Us
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Careers
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Sustainability
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Press
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Corporate Information
                </A>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul class="space-y-2">
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Terms & Conditions
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Privacy Policy
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Cookie Policy
                </A>
              </li>
              <li>
                <A href="#" class="text-sm text-gray-600 hover:text-black">
                  Accessibility
                </A>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">
              Connect with Us
            </h3>
            <div class="flex space-x-4 mb-4">
              <A href="#" class="p-2" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </A>
              <A href="#" class="p-2" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.352-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.668.01 2.985.058 4.04.045.975.207 1.504.344 1.856.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.975-.045 1.504-.207 1.856-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.668-.01-2.985-.058-4.04-.045-.975-.207-1.504-.344-1.856a3.09 3.09 0 0 0-.748-1.15 3.09 3.09 0 0 0-1.15-.748c-.352-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                </svg>
              </A>
              <A href="#" class="p-2" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </A>
            </div>

            <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">
              Subscribe
            </h3>
            <form class="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email"
                class="border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                class="bg-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-xs text-gray-500">
            &copy; 2023 ZENOBIA. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <img
              src="https://via.placeholder.com/40x25"
              alt="Visa"
              class="h-6"
            />
            <img
              src="https://via.placeholder.com/40x25"
              alt="Mastercard"
              class="h-6"
            />
            <img
              src="https://via.placeholder.com/40x25"
              alt="American Express"
              class="h-6"
            />
            <img
              src="https://via.placeholder.com/40x25"
              alt="PayPal"
              class="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
