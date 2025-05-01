import { Component } from "solid-js";
import { A } from "@solidjs/router";

const Footer: Component = () => {
  return (
    <footer class="bg-gray-100 pt-16 pb-8">
      <div class="container mx-auto px-4">
        {/* Newsletter Signup */}
        <div class="max-w-xl mb-16">
          <h2 class="text-2xl mb-4">FARFETCH emails</h2>
          <p class="text-sm text-gray-600 mb-4">
            Sign up for promotions, tailored new arrivals, stock updates and
            more – straight to your inbox
          </p>
          <div class="flex gap-4">
            <input
              type="email"
              placeholder="Email address"
              class="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
            <button class="bg-black text-white px-8 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">
              Sign up
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-4">
            By signing up, you agree to our Privacy Policy. Unsubscribe anytime
            at the bottom of our emails or by replying STOP to any of our SMS.
          </p>
        </div>

        {/* Footer Links */}
        <div class="grid grid-cols-4 gap-8 mb-16">
          <div>
            <h3 class="font-medium mb-6">Customer Service</h3>
            <ul class="space-y-4">
              <li>
                <A href="/contact" class="text-sm hover:text-gray-600">
                  Contact us
                </A>
              </li>
              <li>
                <A href="/faq" class="text-sm hover:text-gray-600">
                  FAQs
                </A>
              </li>
              <li>
                <A href="/delivery" class="text-sm hover:text-gray-600">
                  Orders and delivery
                </A>
              </li>
              <li>
                <A href="/returns" class="text-sm hover:text-gray-600">
                  Returns and refunds
                </A>
              </li>
              <li>
                <A href="/payment" class="text-sm hover:text-gray-600">
                  Payment and pricing
                </A>
              </li>
              <li>
                <A href="/crypto" class="text-sm hover:text-gray-600">
                  Cryptocurrency payments
                </A>
              </li>
              <li>
                <A href="/terms" class="text-sm hover:text-gray-600">
                  Promotion terms and conditions
                </A>
              </li>
              <li>
                <A href="/promise" class="text-sm hover:text-gray-600">
                  FARFETCH Customer Promise
                </A>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium mb-6">About FARFETCH</h3>
            <ul class="space-y-4">
              <li>
                <A href="/about" class="text-sm hover:text-gray-600">
                  About us
                </A>
              </li>
              <li>
                <A href="/partners" class="text-sm hover:text-gray-600">
                  FARFETCH partner boutiques
                </A>
              </li>
              <li>
                <A href="/careers" class="text-sm hover:text-gray-600">
                  Careers
                </A>
              </li>
              <li>
                <A href="/app" class="text-sm hover:text-gray-600">
                  FARFETCH app
                </A>
              </li>
              <li>
                <A href="/modern-slavery" class="text-sm hover:text-gray-600">
                  Modern slavery statement
                </A>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium mb-6">Discounts and membership</h3>
            <ul class="space-y-4">
              <li>
                <A href="/affiliate" class="text-sm hover:text-gray-600">
                  Affiliate program
                </A>
              </li>
              <li>
                <A href="/refer" class="text-sm hover:text-gray-600">
                  Refer a friend
                </A>
              </li>
              <li>
                <A href="/membership" class="text-sm hover:text-gray-600">
                  FARFETCH membership
                </A>
              </li>
              <li>
                <A href="/student" class="text-sm hover:text-gray-600">
                  Student discount UNIDAYS
                </A>
              </li>
              <li>
                <A href="/graduates" class="text-sm hover:text-gray-600">
                  Student Beans and Graduates
                </A>
              </li>
              <li>
                <A href="/youth" class="text-sm hover:text-gray-600">
                  Student and Youth discount
                </A>
              </li>
              <li>
                <A href="/essential" class="text-sm hover:text-gray-600">
                  Essential worker discount
                </A>
              </li>
              <li>
                <A href="/shoprunner" class="text-sm hover:text-gray-600">
                  Shoprunner discount
                </A>
              </li>
              <li>
                <A href="/donate" class="text-sm hover:text-gray-600">
                  Donate and save
                </A>
              </li>
              <li>
                <A href="/senior" class="text-sm hover:text-gray-600">
                  Senior discount
                </A>
              </li>
            </ul>
          </div>

          <div>
            <div class="mb-12">
              <h3 class="font-medium mb-6">FARFETCH Sustainable Services</h3>
              <ul class="space-y-4">
                <li>
                  <A href="/refresh" class="text-sm hover:text-gray-600">
                    Refresh: clear out your wardrobe
                  </A>
                </li>
                <li>
                  <A href="/second-life" class="text-sm hover:text-gray-600">
                    Second Life: sell your designer bags
                  </A>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-medium mb-6">Follow us</h3>
              <div class="flex space-x-4">
                <a
                  href="https://instagram.com/farfetch"
                  class="text-gray-600 hover:text-black"
                >
                  <span class="sr-only">Instagram</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/farfetch"
                  class="text-gray-600 hover:text-black"
                >
                  <span class="sr-only">Facebook</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/farfetch"
                  class="text-gray-600 hover:text-black"
                >
                  <span class="sr-only">Twitter</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://snapchat.com/farfetch"
                  class="text-gray-600 hover:text-black"
                >
                  <span class="sr-only">Snapchat</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M12.166 3c.796 0 3.495.223 4.769 3.073.426.959.324 2.589.24 3.898l-.002.047c-.011.146-.022.293-.03.436.239.088.498.043.753 0a2.54 2.54 0 01.659-.13c.298-.015.591.055.86.277.27.223.363.534.363.79 0 .386-.147.638-.293.838-.073.1-.293.328-.574.328-.132 0-.271-.023-.418-.05a2.879 2.879 0 00-.544-.066c-.324 0-.466.134-.482.151.009.169.021.342.036.517.102 1.042.239 2.334.041 3.046-.592 2.143-1.903 3.235-2.892 3.907a5.644 5.644 0 01-1.066.537c-.737.297-1.419.447-2.02.447s-1.283-.15-2.02-.447a5.644 5.644 0 01-1.066-.537c-.989-.672-2.3-1.764-2.892-3.907-.198-.712-.061-2.004.041-3.046.015-.175.027-.348.036-.517-.016-.017-.158-.151-.482-.151a2.879 2.879 0 00-.544.066c-.147.027-.286.05-.418.05-.281 0-.501-.228-.574-.328C3.147 11.638 3 11.386 3 11c0-.256.093-.567.363-.79.269-.222.562-.292.86-.277.225.011.449.057.659.13.255.043.514.088.753 0a9.928 9.928 0 01-.03-.436l-.003-.047c-.084-1.309-.186-2.939.24-3.898C6.671 3.223 9.37 3 10.166 3h2zm0 18c.667 0 1.333-.133 2-.4.667-.267 1.267-.633 1.8-1.1.533-.467.967-1.025 1.3-1.675.333-.65.5-1.358.5-2.125 0-.4-.067-.742-.2-1.025-.134-.283-.267-.492-.4-.625a8.578 8.578 0 00-.3-.275 2.407 2.407 0 01-.2-.2c-.2-.2-.434-.458-.7-.775a8.153 8.153 0 01-.7-.975c-.2-.333-.3-.633-.3-.9 0-.2.05-.375.15-.525.1-.15.25-.258.45-.325.267-.133.584-.233.95-.3.367-.067.734-.133 1.1-.2.367-.067.7-.158 1-.275.3-.117.45-.292.45-.525 0-.2-.083-.375-.25-.525-.167-.15-.367-.267-.6-.35-.233-.083-.484-.142-.75-.175a5.406 5.406 0 00-.75-.05c-.333 0-.683.042-1.05.125-.367.083-.7.208-1 .375-.3.167-.55.383-.75.65-.2.267-.3.583-.3.95 0 .333.1.642.3.925.2.283.434.541.7.775.267.233.517.45.75.65.233.2.417.4.55.6.133.2.2.417.2.65 0 .267-.083.467-.25.6-.167.133-.367.2-.6.2-.333 0-.625-.075-.875-.225-.25-.15-.459-.342-.625-.575a3.487 3.487 0 01-.375-.75 4.928 4.928 0 01-.2-.75c-.033-.267-.05-.525-.05-.775 0-.4.075-.758.225-1.075.15-.317.342-.592.575-.825.233-.233.492-.417.775-.55.283-.133.55-.2.8-.2.4 0 .75.083 1.05.25.3.167.542.383.725.65.183.267.308.567.375.9.067.333.1.658.1.975 0 .4-.075.775-.225 1.125-.15.35-.342.667-.575.95-.233.283-.492.517-.775.7-.283.183-.55.275-.8.275-.333 0-.625-.075-.875-.225-.25-.15-.459-.342-.625-.575a3.487 3.487 0 01-.375-.75 4.928 4.928 0 01-.2-.75c-.033-.267-.05-.525-.05-.775 0-.4.075-.758.225-1.075.15-.317.342-.592.575-.825.233-.233.492-.417.775-.55.283-.133.55-.2.8-.2.4 0 .75.083 1.05.25.3.167.542.383.725.65.183.267.308.567.375.9.067.333.1.658.1.975 0 .4-.075.775-.225 1.125-.15.35-.342.667-.575.95-.233.283-.492.517-.775.7-.283.183-.55.275-.8.275z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/farfetch"
                  class="text-gray-600 hover:text-black"
                >
                  <span class="sr-only">YouTube</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div class="border-t border-gray-200 pt-8">
          <div class="flex flex-wrap gap-4 text-xs text-gray-500">
            <A href="/privacy" class="hover:text-gray-900">
              Privacy policy
            </A>
            <A href="/terms" class="hover:text-gray-900">
              Terms and conditions
            </A>
            <A href="/accessibility" class="hover:text-gray-900">
              Accessibility
            </A>
            <A href="/intellectual-property" class="hover:text-gray-900">
              Protection of Intellectual Property
            </A>
            <A href="/do-not-sell" class="hover:text-gray-900">
              Do not sell or share my info
            </A>
          </div>
          <p class="text-xs text-gray-500 mt-4">
            'FARFETCH' and the 'FARFETCH' logo are trade marks of FARFETCH UK
            Limited and are registered in numerous jurisdictions around the
            world.
          </p>
          <p class="text-xs text-gray-500 mt-2">
            © Copyright 2025 FARFETCH UK Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
