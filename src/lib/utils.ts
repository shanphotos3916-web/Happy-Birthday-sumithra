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
