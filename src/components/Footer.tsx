import { A } from "@solidjs/router";

export default function Footer() {
  return (
    <>
      {/* Top curved block */}

      <footer class="bg-black text-white py-64">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div>
              <h3 class="text-2xl font-bold mb-4 tracking-tight">
                Zenobia Pay
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-white font-medium">Backed by</span>
                <img src="/yc-logo.svg" alt="YCombinator" class="h-5" />
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 class="text-lg font-bold mb-4 tracking-tight">Company</h4>
              <ul class="space-y-2">
                <li>
                  <A
                    href="/about"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    About Us
                  </A>
                </li>
                <li>
                  <A
                    href="/contact"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Contact
                  </A>
                </li>
                <li>
                  <A
                    href="/careers"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Careers
                  </A>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 class="text-lg font-bold mb-4 tracking-tight">Legal</h4>
              <ul class="space-y-2">
                <li>
                  <A
                    href="/privacy"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Privacy Policy
                  </A>
                </li>
                <li>
                  <A
                    href="/terms"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Terms and Conditions
                  </A>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h4 class="text-lg font-bold mb-4 tracking-tight">Connect</h4>
              <ul class="space-y-2">
                <li>
                  <a
                    href="https://twitter.com/zenobiapay"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/zenobiapay"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@zenobiapay.com"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Email us: info@zenobiapay.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:6468479305"
                    class="text-neutral-400 hover:text-white transition font-medium"
                  >
                    Call the CEO: 646-847-9305
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-neutral-800 text-center">
            <p class="text-neutral-400 font-medium">
              © {new Date().getFullYear()} Zenobia Pay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
