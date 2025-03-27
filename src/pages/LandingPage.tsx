import { Navigation } from "../components/Navigation"
import { createSignal, onCleanup, onMount, createEffect } from "solid-js"
import { api } from "../services/api"

// Define the WaitlistEntry type locally since it's not exported from api
type WaitlistEntry = {
  name: string
  email: string
  businessType: string
}

export default function LandingPage() {
  const words = ["Cheaper.", "Faster.", "Simpler.", "Better."]
  const [wordIndex, setWordIndex] = createSignal(0)
  const [currentWord, setCurrentWord] = createSignal(words[0])
  const [isAnimating, setIsAnimating] = createSignal(false)
  const [scrollY, setScrollY] = createSignal(0)
  const [activeCarouselSlide, setActiveCarouselSlide] = createSignal(0)

  const [formData, setFormData] = createSignal<WaitlistEntry>({
    name: "",
    email: "",
    businessType: "",
  })
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [submitError, setSubmitError] = createSignal("")
  const [submitSuccess, setSubmitSuccess] = createSignal(false)
  const [svgScale, setSvgScale] = createSignal(1.2)
  const [windowWidth, setWindowWidth] = createSignal(window.innerWidth)

  onMount(() => {
    // Word animation interval
    const interval = setInterval(changeWord, 3000)

    // Set initial window width
    setWindowWidth(window.innerWidth)

    // Add resize listener for responsive handling
    window.addEventListener("resize", handleResize)

    // Add scroll listener for parallax effect
    window.addEventListener("scroll", handleScroll)

    // Cleanup
    onCleanup(() => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    })
  })

  // Function to handle window resize
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  // Function to handle scroll for parallax effect
  const handleScroll = () => {
    setScrollY(window.scrollY)
  }

  // Check if user is at the top of the page
  const isAtTop = () => {
    return scrollY() < 50 // Consider "at top" if scrolled less than 50px
  }

  // Calculate fade opacity based on scroll position for a smoother transition
  const getScrollFadeOpacity = () => {
    const maxFadeScrollY = 150 // Reduced from 200 to make elements disappear sooner
    if (scrollY() <= 0) return 1 // Fully visible at top
    if (scrollY() >= maxFadeScrollY) return 0 // Fully hidden after maxFadeScrollY

    // Linear interpolation between 1 and 0 based on scroll position
    // Using a slightly steeper curve for faster initial fade
    const fadeProgress = scrollY() / maxFadeScrollY
    return Math.pow(1 - fadeProgress, 1.2) // Slightly non-linear fade for faster initial disappearance
  }

  // Calculate parallax transforms based on scroll position
  const getParallaxTransform = (speed: number = 0.2) => {
    return `translateY(${scrollY() * speed}px)`
  }

  // Calculate SVG parallax transform (slower than text for depth effect)
  const getSvgParallaxTransform = () => {
    // Move the SVG background at a slower rate than the text
    // This creates the effect of the background covering the text
    return `translateY(${scrollY() * 0.05}px)`
  }

  // Calculate responsive letter spacing based on screen width
  const getLetterSpacing = () => {
    const width = windowWidth()
    if (width < 640) {
      return "8px" // Small screens
    } else if (width < 1024) {
      return "12px" // Medium screens
    } else {
      return "17px" // Large screens
    }
  }

  // Calculate responsive transforms based on scroll position
  const getScrollTransform = (direction: "left" | "right") => {
    const width = windowWidth()
    const baseRotation = width < 640 ? 1 : 2
    const baseTranslation = width < 640 ? 2 : 5

    // Calculate animation based on scroll position
    // No animation for first 10px, then more rapid animation until 150px
    const scrollThreshold = 75
    const maxScrollEffect = 125

    // No animation for first 10px
    if (scrollY() <= scrollThreshold) return "rotate(0) translateY(0)"

    // Calculate progress with adjusted range (from 10px to 150px)
    const scrollProgress = Math.min(
      1,
      (scrollY() - scrollThreshold) / (maxScrollEffect - scrollThreshold)
    )

    if (direction === "left") {
      return `rotate(-${baseRotation * scrollProgress}deg) translateY(-${
        baseTranslation * scrollProgress
      }px)`
    } else {
      return `rotate(${baseRotation * scrollProgress}deg) translateY(${
        baseTranslation * scrollProgress
      }px)`
    }
  }

  // Calculate text position relative to SVG - with specific breakpoints
  const getTextPosition = () => {
    const width = windowWidth()

    // Define breakpoints and their corresponding values
    const breakpoints = [
      { width: 5000, translateX: -200, translateY: 820, scale: 2.5 },
      { width: 3500, translateX: -100, translateY: 500, scale: 2.5 },
      { width: 1920, translateX: 75, translateY: 285, scale: 1.3 },
      { width: 1700, translateX: 75, translateY: 230, scale: 1.15 },
      { width: 1500, translateX: 75, translateY: 190, scale: 1.0 },
      { width: 1300, translateX: 75, translateY: 150, scale: 0.9 },
      { width: 1100, translateX: 60, translateY: 85, scale: 0.8 },
      { width: 1024, translateX: 60, translateY: 70, scale: 0.7 },
      { width: 1023, translateX: 25, translateY: 140, scale: 0.9 },
      { width: 900, translateX: 30, translateY: 105, scale: 0.8 },
      { width: 768, translateX: 20, translateY: 45, scale: 0.75 },
      { width: 767, translateX: -10, translateY: 115, scale: 1.6 },
      { width: 640, translateX: 0, translateY: 75, scale: 1.45 },
      { width: 639, translateX: 10, translateY: 170, scale: 1.4 },
      { width: 500, translateX: 30, translateY: 130, scale: 1.2 },
      { width: 499, translateX: 0, translateY: 180, scale: 1.2 },
      { width: 370, translateX: 5, translateY: 100, scale: 0.9 },
    ]

    // Find the appropriate breakpoints to interpolate between
    let lowerBreakpoint = breakpoints[breakpoints.length - 1]
    let upperBreakpoint = breakpoints[0]

    for (let i = 0; i < breakpoints.length - 1; i++) {
      if (width <= breakpoints[i].width && width > breakpoints[i + 1].width) {
        upperBreakpoint = breakpoints[i]
        lowerBreakpoint = breakpoints[i + 1]
        break
      }
    }

    // If width is larger than our largest breakpoint, use the largest breakpoint values
    if (width > breakpoints[0].width) {
      return {
        translateX: `${breakpoints[0].translateX}px`,
        translateY: `${breakpoints[0].translateY}px`,
        scale: breakpoints[0].scale.toFixed(2),
      }
    }

    // If width is smaller than our smallest breakpoint, use the smallest breakpoint values
    if (width < breakpoints[breakpoints.length - 1].width) {
      return {
        translateX: `${breakpoints[breakpoints.length - 1].translateX}px`,
        translateY: `${breakpoints[breakpoints.length - 1].translateY}px`,
        scale: breakpoints[breakpoints.length - 1].scale.toFixed(2),
      }
    }

    // Calculate the percentage between the two breakpoints
    const range = upperBreakpoint.width - lowerBreakpoint.width
    const percentage = (width - lowerBreakpoint.width) / range

    // Interpolate values
    const translateX =
      lowerBreakpoint.translateX +
      percentage * (upperBreakpoint.translateX - lowerBreakpoint.translateX)
    const translateY =
      lowerBreakpoint.translateY +
      percentage * (upperBreakpoint.translateY - lowerBreakpoint.translateY)
    const scale =
      lowerBreakpoint.scale +
      percentage * (upperBreakpoint.scale - lowerBreakpoint.scale)

    return {
      translateX: `${translateX.toFixed(0)}px`,
      translateY: `${translateY.toFixed(0)}px`,
      scale: scale.toFixed(2),
    }
  }

  // Calculate SVG viewBox based on screen width to make it appear larger on mobile
  const getSvgViewBox = () => {
    const width = windowWidth()
    if (width < 500) {
      // For very small screens, use an even smaller viewBox to make the SVG appear larger
      return "500 0 600 977" // More focused center portion for very small screens
    } else if (width < 640) {
      // For mobile, use a smaller viewBox to make the SVG appear larger
      return "400 0 800 977" // Focus on center portion
    } else if (width < 768) {
      return "300 0 1000 977" // Slightly wider view for medium-small screens
    } else if (width < 1024) {
      return "200 0 1200 977" // Even wider for medium screens
    } else {
      return "0 0 1512 977" // Full view for large screens
    }
  }

  // SVG as inline component with responsive handling
  const ShapeTopSVG = () => {
    return (
      <div
        class="absolute top-0 left-0 right-0 w-full z-0 flex justify-center overflow-hidden"
        style={{
          "pointer-events": "none", // Ensure SVG doesn't interfere with clicks
          transform: getSvgParallaxTransform(),
          transition: "transform 0.1s ease-out",
        }}
      >
        <svg
          style={{
            width: "100%",
            "max-width": "100%",
            "transform-origin": "top center",
          }}
          viewBox={getSvgViewBox()}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-278.142 -50.346L1550.38 -50.123C1550.38 -50.123 1621.87 -18.333 1570.36 45.8362C1518.85 110.005 1048.98 624.701 981.392 717.259C902.293 825.578 848.34 767.288 881.28 682.946C974.635 443.913 446.128 60.021 -252.864 77.1558C-317.588 78.7425 -317.209 14.4254 -311.415 -23.4523C-309.118 -38.4676 -293.345 -50.3479 -278.142 -50.346Z"
            fill="white"
          />
        </svg>
      </div>
    )
  }

  // Rotated SVG for the second section
  const ShapeBottomSVG = () => (
    <div
      class="absolute left-0 right-0 w-full z-0 flex justify-center overflow-hidden"
      style={{
        "pointer-events": "none", // Ensure SVG doesn't interfere with clicks
        transform: `${getSvgParallaxTransform()} rotate(180deg)`,
        transition: "transform 0.1s ease-out",
        bottom: "100%", // Position the bottom of the SVG at the top of the container
      }}
    >
      <svg
        style={{
          width: "100%",
          "max-width": "100%",
          "transform-origin": "top center",
        }}
        viewBox={getSvgViewBox()}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-278.142 -50.346L1550.38 -50.123C1550.38 -50.123 1621.87 -18.333 1570.36 45.8362C1518.85 110.005 1048.98 624.701 981.392 717.259C902.293 825.578 848.34 767.288 881.28 682.946C974.635 443.913 446.128 60.021 -252.864 77.1558C-317.588 78.7425 -317.209 14.4254 -311.415 -23.4523C-309.118 -38.4676 -293.345 -50.3479 -278.142 -50.346Z"
          fill="white"
        />
      </svg>
    </div>
  )

  const changeWord = () => {
    setIsAnimating(true)

    // Wait for exit animation
    setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
      setCurrentWord(words[wordIndex()])

      // Reset animation state after word changes
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 500)
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    // Only validate email since we're using default values for other fields
    const { email } = formData()
    if (!email.trim()) {
      setSubmitError("Please enter your email address")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSubmitError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      // Use default values for name and businessType
      const submissionData = {
        name: "Waitlist User",
        email: email,
        businessType: "other",
      }

      await api.submitWaitlistEntry(submissionData)
      setSubmitSuccess(true)
      setFormData({ name: "", email: "", businessType: "" })

      // Optional: Scroll to success message
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById("contact")?.offsetTop,
          behavior: "smooth",
        })
      }, 100)
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(
          error.message || "Failed to submit. Please try again later."
        )
      } else {
        setSubmitError("Failed to submit. Please try again later.")
      }
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle carousel scroll
  const handleCarouselScroll = (e: Event) => {
    const container = e.currentTarget as HTMLElement
    const scrollPosition = container.scrollLeft
    const slideWidth = container.offsetWidth

    // Calculate which slide is most visible
    const slideIndex = Math.round(scrollPosition / slideWidth)
    setActiveCarouselSlide(slideIndex)
  }

  // Function to navigate to a specific carousel slide
  const navigateToSlide = (index: number) => {
    const container = document.querySelector(
      ".carousel-container"
    ) as HTMLElement
    if (container) {
      const slideWidth = container.offsetWidth
      container.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      })
      setActiveCarouselSlide(index)
    }
  }

  // Function to navigate to the next or previous slide
  const navigateCarousel = (direction: "next" | "prev") => {
    const totalSlides = 3
    let newIndex = activeCarouselSlide()

    if (direction === "next") {
      newIndex = (newIndex + 1) % totalSlides
    } else {
      newIndex = (newIndex - 1 + totalSlides) % totalSlides
    }

    navigateToSlide(newIndex)
  }

  return (
    <>
      <Navigation />
      {/* Hero Section */}
      <div class="relative bg-primary min-h-screen pt-16 overflow-hidden">
        <ShapeTopSVG />
        <div class="relative z-10 flex flex-col items-center h-full py-12 sm:py-16 md:py-20">
          <div
            class="px-4 w-full max-w-7xl mx-auto"
            style={{
              transform: `translate(${getTextPosition().translateX}, ${
                getTextPosition().translateY
              }) ${getParallaxTransform(0.3)}`, // Positive value to move down as you scroll down
              transition: "transform 0.1s ease-out",
            }}
          >
            <h1
              class="text-4xl text-[5rem] md:text-[10rem] font-headline font-extrabold leading-none mb-4 sm:mb-6 flex flex-wrap justify-center relative"
              style={{
                "letter-spacing": getLetterSpacing(),
                transform: `scale(${getTextPosition().scale})`,
                "transform-origin": "center center",
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Create a more sophisticated effect with alternating backgrounds */}
              <div
                class="relative inline-flex overflow-visible transition-transform duration-300 ease-in-out"
                style={{
                  transform: getScrollTransform("left"),
                  transition: "transform 0.3s ease-out",
                }}
              >
                {/* Background shape for contrast */}
                <div class="absolute inset-0 rounded-md transform -rotate-1 scale-110"></div>

                {/* Letter-by-letter styling with proper contrast */}
                <div
                  class="relative z-10 flex"
                  style={{ "letter-spacing": getLetterSpacing() }}
                >
                  <span class="text-white">Z</span>
                  <span class="text-white">e</span>
                  <span class="text-white">n</span>
                </div>
              </div>

              <div
                class="relative inline-flex overflow-visible mx-0 transition-transform duration-300 ease-in-out"
                style={{
                  transform: getScrollTransform("right"),
                  transition: "transform 0.3s ease-out",
                }}
              >
                {/* Background shape for contrast */}
                <div class="absolute inset-0 rounded-md transform rotate-1 scale-110"></div>

                {/* Letter-by-letter styling with proper contrast */}
                <div
                  class="relative z-10 flex"
                  style={{ "letter-spacing": getLetterSpacing() }}
                >
                  <span class="text-primary">o</span>
                  <span class="text-primary">b</span>
                  <span class="text-primary">i</span>
                  <span class="text-primary">a</span>
                </div>
              </div>
            </h1>
          </div>
        </div>

        {/* Tagline positioned at bottom left of hero section - only visible at top */}
        <div
          class="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 z-10 transition-opacity duration-300"
          style={{
            opacity: getScrollFadeOpacity(),
            visibility: getScrollFadeOpacity() === 0 ? "hidden" : "visible",
            transform: `translateY(${scrollY() * 0.1}px)`, // Slight movement as it fades
          }}
        >
          {/* <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cream font-body tracking-wider">
            The way to pay for luxury
          </p> */}
        </div>

        {/* Down arrow for navigation - only visible at top */}
        <div
          class="absolute bottom-16 right-12 z-10 cursor-pointer animate-bounce transition-opacity duration-300"
          onClick={() => {
            document
              .getElementById("what-we-do")
              ?.scrollIntoView({ behavior: "smooth" })
          }}
          style={{
            opacity: getScrollFadeOpacity(),
            visibility: getScrollFadeOpacity() === 0 ? "hidden" : "visible",
            transform: `translateY(${scrollY() * 0.2}px)`, // Slightly faster movement as it fades
          }}
        >
          <svg
            width="16"
            height="40"
            viewBox="0 0 16 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="opacity-80 hover:opacity-100 transition-opacity"
          >
            <path
              d="M8 36L8 4"
              stroke="white"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 31L8 36L13 31"
              stroke="white"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* What We Do Section */}
      <section
        id="what-we-do"
        class="min-h-[100vh] md:min-h-[120vh] bg-primary flex items-center py-32 md:py-48 relative overflow-hidden"
      >
        <div
          class="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-end"
          style={{
            transform: `translateY(${(scrollY() - 800) * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div
            class="relative w-1/2 ml-auto"
            style={{
              opacity: Math.min(1, 0.5 + (scrollY() - 600) / 100), // Start fade earlier and reach full opacity sooner
              transform: `translateY(${Math.max(
                0,
                50 - (scrollY() - 300) / 10
              )}px)`, // Move up as user scrolls
              transition: "opacity 0.3s ease-out",
            }}
          >
            <p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-cream font-headline leading-tight">
              Zenobia Pay makes payments software for luxury retailers who want
              to accept bank transfers as payments so that they avoid fraud
              chargebacks.
            </p>
          </div>
        </div>
      </section>

      <div class="bg-cream relative">
        <ShapeBottomSVG />
        {/* Secure Payments for Luxury Section */}
        <section id="secure-payments" class="pb-32 pt-64">
          <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              class="text-4xl font-headline text-primary mb-16 uppercase tracking-wider text-center"
              data-aos="fade-up"
            >
              Secure payments for luxury
            </h2>

            {/* Desktop view - grid layout */}
            <div
              class="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24"
              data-aos="fade-up"
            >
              {/* Item 1 */}
              <div class="flex flex-col">
                <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8 hover:shadow-lg transition-all">
                  <div class="text-5xl font-headline text-primary mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      class="mx-auto"
                    >
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                    </svg>
                  </div>
                </div>
                <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                  <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                    Fraud Protection
                  </h3>
                  <p class="text-dark/80 font-body text-center max-w-[80%] mx-auto">
                    Zenobia Pay is tied to the user's device. Hardware
                    fingerprinting and biometric verification can reduce fraud
                    by 99%. Bank transfer rails don't have the same reverse
                    chargeback policies as credit card rails.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div class="flex flex-col">
                <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8 hover:shadow-lg transition-all">
                  <div class="text-5xl font-headline text-primary mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      class="mx-auto"
                    >
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                    </svg>
                  </div>
                </div>
                <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                  <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                    3x cheaper payments
                  </h3>
                  <p class="text-dark/80 font-body text-center max-w-[80%] mx-auto">
                    Credit card processing fees average 3% of transaction value.
                    Zenobia Pay is 1%.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div class="flex flex-col">
                <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8 hover:shadow-lg transition-all">
                  <div class="text-5xl font-headline text-primary mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      class="mx-auto"
                    >
                      <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1z" />
                      <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8.5 5a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V9a.5.5 0 0 0 1 0V7.5H10a.5.5 0 0 0 0-1H8.5z" />
                    </svg>
                  </div>
                </div>
                <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                  <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                    Seamless Integration
                  </h3>
                  <p class="text-dark/80 font-body text-center max-w-[80%] mx-auto">
                    Easily integrate with your existing POS and e-commerce
                    systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile view - horizontal scrollable carousel */}
            <div class="md:hidden mt-24" data-aos="fade-up">
              {/* Carousel container with horizontal scroll */}
              <div class="relative">
                <div
                  class="flex overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide carousel-container"
                  onScroll={handleCarouselScroll}
                >
                  {/* Item 1 */}
                  <div class="snap-center flex-shrink-0 w-[80vw] mx-2 first:ml-4">
                    <div class="flex flex-col">
                      <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8">
                        <div class="text-5xl font-headline text-primary mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            class="mx-auto"
                          >
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                          </svg>
                        </div>
                      </div>
                      <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                        <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                          Fraud Protection
                        </h3>
                        <p class="text-dark/80 font-body text-center">
                          Zenobia Pay is tied to the user's device. Hardware
                          fingerprinting and biometric verification can reduce
                          fraud by 99%. Bank transfer rails don't have the same
                          reverse chargeback policies as credit card rails.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div class="snap-center flex-shrink-0 w-[80vw] mx-2">
                    <div class="flex flex-col">
                      <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8">
                        <div class="text-5xl font-headline text-primary mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            class="mx-auto"
                          >
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                          </svg>
                        </div>
                      </div>
                      <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                        <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                          3x cheaper payments
                        </h3>
                        <p class="text-dark/80 font-body text-center">
                          Credit card processing fees average 3% of transaction
                          value. Zenobia Pay is 1%.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div class="snap-center flex-shrink-0 w-[80vw] mx-2">
                    <div class="flex flex-col">
                      <div class="aspect-square border border-dark flex flex-col items-center justify-center p-8">
                        <div class="text-5xl font-headline text-primary mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            class="mx-auto"
                          >
                            <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1z" />
                            <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8.5 5a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V9a.5.5 0 0 0 1 0V7.5H10a.5.5 0 0 0 0-1H8.5z" />
                          </svg>
                        </div>
                      </div>
                      <div class="mt-4 mx-auto max-w-[80%] min-h-[100px]">
                        <h3 class="text-xl text-primary font-headline uppercase tracking-wider text-center mb-6 font-bold">
                          Seamless Integration
                        </h3>
                        <p class="text-dark/80 font-body text-center">
                          Easily integrate with your existing POS and e-commerce
                          systems.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" class="py-24">
          <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col" data-aos="fade-up">
              <div class="text-center mb-12">
                <h2 class="text-4xl font-headline text-primary mb-6 uppercase tracking-wider">
                  Join the Waitlist
                </h2>
                <p class="text-xl text-dark mb-8 max-w-3xl mx-auto">
                  Be the first to use Zenobia Pay.
                </p>
              </div>

              <div
                class="max-w-3xl mx-auto w-full"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <form class="space-y-6" onSubmit={handleSubmit}>
                  <div class="flex flex-col md:flex-row md:items-end gap-4">
                    <div class="flex-grow">
                      <label class="block text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={formData().email}
                        onInput={(e) =>
                          setFormData({
                            ...formData(),
                            email: e.currentTarget.value,
                          })
                        }
                        class="w-full px-4 py-3 border-2 border-dark focus:border-secondary focus:outline-none bg-white"
                      />
                    </div>
                    <div class="md:ml-2">
                      <button
                        type="submit"
                        disabled={isSubmitting()}
                        class="w-full md:w-auto bg-primary text-cream px-8 py-3 border-2 border-primary hover:bg-secondary hover:border-secondary transition-colors font-body disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider whitespace-nowrap"
                      >
                        {isSubmitting() ? "Submitting..." : "Join Waitlist"}
                      </button>
                    </div>
                  </div>

                  {submitError() && (
                    <div class="text-red-600 text-sm uppercase tracking-wider">
                      {submitError()}
                    </div>
                  )}
                  {submitSuccess() && (
                    <div class="text-secondary text-sm uppercase tracking-wider">
                      Thank you for joining our waitlist! We'll be in touch
                      soon.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="py-16 border-t border-dark bg-primary">
          <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 class="text-xl font-headline text-cream mb-6 uppercase tracking-wider">
                  Zenobia Pay
                </h3>
                <p class="text-sm text-cream/80 font-body">
                  The opposite of an earthquake.
                </p>
              </div>
              <div>
                <h4 class="text-lg font-headline text-cream mb-6 uppercase tracking-wider">
                  Company
                </h4>
                <ul class="space-y-4">
                  <li>
                    <a
                      href="#about"
                      class="text-cream/80 hover:text-cream transition-colors uppercase text-sm tracking-wider"
                    >
                      About Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="text-lg font-headline text-cream mb-6 uppercase tracking-wider">
                  Legal
                </h4>
                <ul class="space-y-4"></ul>
              </div>
              <div>
                <h4 class="text-lg font-headline text-cream mb-6 uppercase tracking-wider">
                  Connect
                </h4>
                <ul class="space-y-4">
                  <li>
                    <a
                      href="https://x.com/zenobia_pay"
                      class="text-cream/80 hover:text-cream transition-colors uppercase text-sm tracking-wider"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/zenobia-pay"
                      class="text-cream/80 hover:text-cream transition-colors uppercase text-sm tracking-wider"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-16 pt-8 border-t border-dark/20 text-sm text-cream/70">
              <p class="tracking-wider">
                &copy; 2025 Zenobia Pay. All rights reserved.
              </p>
            </div>

            {/* Large ZENOBIA text at the bottom */}
            <div class="mt-16 flex justify-center overflow-hidden">
              <h1
                class="text-[4rem] sm:text-[7rem] md:text-[8rem] lg:text-[11rem] font-headline font-extrabold text-white"
                style={{
                  "letter-spacing": "0.17em",
                }}
              >
                ZENOBIA
              </h1>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
