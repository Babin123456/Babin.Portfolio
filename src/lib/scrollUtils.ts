export const getElementTargetScroll = (
  target: string | HTMLElement,
  headerOffset: number = 80
): number => {
  if (typeof window === "undefined" || !target) return 0;

  if (typeof target === "string") {
    const clean = target.trim();
    if (clean === "" || clean === "/" || clean === "#" || clean === "#home" || clean === "home") {
      return 0;
    }
  }

  const selector =
    typeof target === "string"
      ? target.startsWith("#") || target.startsWith(".")
        ? target
        : `#${target}`
      : null;

  const element =
    selector !== null
      ? (document.querySelector(selector) as HTMLElement | null)
      : (target as HTMLElement);

  if (!element) return 0;
  if (element.id === "home") return 0;

  // On desktop with active sticky stacking sections
  if (window.innerWidth >= 1024) {
    const stackParent = (element.closest("[data-scroll-stack]") ||
      element.closest(".lg\\:sticky, .sticky")) as HTMLElement | null;

    const main = document.getElementById("main-content") || stackParent?.parentElement;

    if (stackParent && main && main.contains(stackParent)) {
      // Calculate total cumulative height of all preceding stack sections from document top of main
      const mainDocTop = main.getBoundingClientRect().top + window.scrollY;

      let accumulatedOffset = 0;
      let curr = main.firstElementChild as HTMLElement | null;
      while (curr && curr !== stackParent) {
        accumulatedOffset += curr.offsetHeight || 0;
        curr = curr.nextElementSibling as HTMLElement | null;
      }

      // Check if target is inside the stack container and has an internal offset (like About inside section 2)
      const relativeTop =
        element !== stackParent
          ? Math.max(0, element.getBoundingClientRect().top - stackParent.getBoundingClientRect().top)
          : 0;

      const trueDocTop = mainDocTop + accumulatedOffset + relativeTop;
      return Math.max(0, trueDocTop - headerOffset);
    }
  }

  // Standard natural document coordinate (used on mobile and normal non-stacked views)
  const rect = element.getBoundingClientRect();
  const currentScrollY =
    window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  return Math.max(0, rect.top + currentScrollY - headerOffset);
};

export const smoothScrollToTarget = (
  target: string | HTMLElement,
  options: {
    headerOffset?: number;
    duration?: number;
    onComplete?: () => void;
  } = {}
) => {
  const { headerOffset = 80, duration = 1.0, onComplete } = options;

  if (typeof window === "undefined" || !target) return;

  const targetY = getElementTargetScroll(target, headerOffset);

  // If Lenis is active on desktop, use Lenis scrollTo
  const lenis = window.lenis;
  if (lenis && window.innerWidth >= 1024) {
    lenis.scrollTo(targetY, {
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete,
    });
  } else {
    // Native smooth scroll for mobile & touch devices
    try {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    } catch {
      window.scrollTo(0, targetY);
    }

    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  }
};
