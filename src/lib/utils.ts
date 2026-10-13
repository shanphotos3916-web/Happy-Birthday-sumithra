export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return Boolean(
    nav.connection?.saveData ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory && nav.deviceMemory <= 4),
  );
}

export function isSmallScreen(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

let scrollLocks = 0;
let savedScrollY = 0;

/** Lock the page without overflow:hidden, which breaks scrolling on iOS. */
export function lockPageScroll(): void {
  if (typeof document === "undefined") return;
  if (scrollLocks === 0) {
    savedScrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  scrollLocks += 1;
}

export function unlockPageScroll(): void {
  if (typeof document === "undefined" || scrollLocks === 0) return;
  scrollLocks -= 1;
  if (scrollLocks > 0) return;
  const body = document.body;
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, savedScrollY);
  window.requestAnimationFrame(() => window.scrollTo(0, savedScrollY));
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Window events that let distant sections talk without global state. */
export const EVENTS = {
  replay: "birthday:replay",
} as const;
