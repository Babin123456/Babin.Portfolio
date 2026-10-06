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

  const stickyParent = element.closest(".sticky") as HTMLElement | null;
  const main = document.getElementById("main-content") || stickyParent?.parentElement;

  if (stickyParent && main && main.contains(stickyParent)) {
    const mainTop = main.getBoundingClientRect().top + window.scrollY;

    let stackTop = mainTop;
    let sib = stickyParent.previousElementSibling as HTMLElement | null;
    while (sib) {
      stackTop += sib.offsetHeight || 0;
      sib = sib.previousElementSibling as HTMLElement | null;
    }

    const relativeOffset =
      element.getBoundingClientRect().top - stickyParent.getBoundingClientRect().top;

    const trueDocTop = stackTop + Math.max(0, relativeOffset);
    return Math.max(0, trueDocTop - headerOffset);
  }

  const rect = element.getBoundingClientRect();
  return Math.max(0, rect.top + window.scrollY - headerOffset);
};

export const smoothScrollToTarget = (
  target: string | HTMLElement,
  options: {
    headerOffset?: number;
    duration?: number;
    onComplete?: () => void;
  } = {}
) => {
  const { headerOffset = 80, duration = 1.25, onComplete } = options;
  const targetY = getElementTargetScroll(target, headerOffset);
  const lenis = (window as any).lenis;

  if (lenis) {
    lenis.scrollTo(targetY, {
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete,
    });
  } else {
    window.scrollTo({ top: targetY, behavior: "smooth" });
    if (onComplete) {
      setTimeout(onComplete, duration * 1000);
    }
  }
};
