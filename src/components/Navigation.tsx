import { createSignal, onMount } from "solid-js"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false)

  onMount(() => {
    // Set navigation height as CSS variable
    const navElement = document.querySelector("header nav") as HTMLElement
    if (navElement) {
      const navHeight = navElement.offsetHeight
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navHeight}px`
      )

      // Update on resize
      window.addEventListener("resize", updateNavHeight)
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateNavHeight)
    }
  })

  const updateNavHeight = () => {
    const navElement = document.querySelector("header nav") as HTMLElement
    if (navElement) {
      const navHeight = navElement.offsetHeight
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navHeight}px`
      )
    }
  }

  return (
    <header class="fixed w-full z-50 bg-cream">
      <nav class="max-w-8xl mx-auto px-4 sm:px-8 py-3">
        <div class="flex justify-between items-center">
          <div class="flex-shrink-0">
            <a
              href="/"
              class="text-2xl font-headline text-primary uppercase tracking-wider"
            >
              Zenobia Pay
            </a>
          </div>

          {/* Contact Us Button (Desktop and Mobile) */}
          <div class="flex items-center">
            <a
              href="#contact"
              class="inline-flex items-center px-5 py-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-cream transition-colors font-body text-base tracking-wider rounded-md"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
