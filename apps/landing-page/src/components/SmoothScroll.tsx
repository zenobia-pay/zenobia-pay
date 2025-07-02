import { onMount, onCleanup } from "solid-js";
import Lenis from "lenis";

export default function SmoothScroll() {
  let lenis: Lenis;

  onMount(() => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Expose Lenis instance globally
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  onCleanup(() => {
    if (lenis) {
      lenis.destroy();
      // Clean up global reference
      delete (window as any).lenis;
    }
  });

  return null;
}
