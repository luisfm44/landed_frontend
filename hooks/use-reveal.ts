import { useEffect, useRef, useState } from "react";

/**
 * Intersection Observer hook for scroll-reveal animations.
 *
 * Once the target enters the viewport, `visible` is permanently set to true
 * (one-shot) — elements don't un-reveal on scroll-back. This prevents
 * distracting re-animations and keeps scroll down smooth.
 *
 * threshold=0.12 — reveal starts when 12% of the element is visible.
 * Low enough that tall sections begin animating before fully in view.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // stop observing after first reveal — zero ongoing overhead
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
