"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Motion system
 * - Framer Motion: component state transitions (intro, envelope, modals, buttons).
 * - GSAP + ScrollTrigger: scroll-linked choreography (parallax, word-by-word message lighting).
 */

let registered = false;
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Easing curves shared across Framer Motion. */
export const ease = {
  silk: [0.22, 1, 0.36, 1] as const,
  cinematic: [0.65, 0, 0.35, 1] as const,
  soft: [0.33, 1, 0.68, 1] as const,
};

export const springs = {
  gentle: { type: "spring", stiffness: 70, damping: 18, mass: 1 } as const,
  lift: { type: "spring", stiffness: 260, damping: 24 } as const,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: ease.silk },
  },
};

export const stagger = (delayChildren = 0, staggerChildren = 0.12) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
