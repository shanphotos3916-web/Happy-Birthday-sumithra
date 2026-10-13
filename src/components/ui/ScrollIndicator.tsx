"use client";

import { scrollToId } from "@/lib/utils";

export default function ScrollIndicator({ target, label = "Scroll" }: { target: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToId(target)}
      className="group flex min-h-11 flex-col items-center gap-2 px-4 py-2 text-burgundy/70 transition-colors hover:text-burgundy"
      aria-label="Scroll to the next section"
    >
      <span className="eyebrow text-[0.62rem]">{label}</span>
      <span className="relative flex h-9 w-5 justify-center rounded-full border border-current" aria-hidden>
        <span className="mt-1.5 h-1.5 w-1 rounded-full bg-current" style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }} />
      </span>
    </button>
  );
}
