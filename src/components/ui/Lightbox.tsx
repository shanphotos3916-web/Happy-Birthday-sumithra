"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/config/birthday";
import PhotoFrame from "./PhotoFrame";
import { ease } from "@/lib/animation";
import { lockPageScroll, unlockPageScroll } from "@/lib/utils";

const RATIO: Record<Photo["orientation"], number> = { portrait: 0.8, landscape: 4 / 3, square: 1 };

type Props = {
  photos: readonly Photo[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
};

export default function Lightbox({ photos, index, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const photo = open ? photos[index] : null;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
  }, [open, index, photos.length, onClose, onChange]);

  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (index === null) return;
    if (info.offset.x < -60) onChange((index + 1) % photos.length);
    else if (info.offset.x > 60) onChange((index - 1 + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${photos.length}`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-plum/95 p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={onDragEnd}
            transition={{ duration: 0.6, ease: ease.silk }}
          >
            <div
              className="mx-auto overflow-hidden rounded-sm bg-ivory p-2 shadow-2xl shadow-black/50 sm:p-3"
              style={{ width: `min(100%, calc(66svh * ${RATIO[photo.orientation]}))` }}
            >
              <PhotoFrame photo={photo} index={index} sizes="(max-width: 768px) 100vw, 768px" priority />
            </div>
          </motion.figure>

          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo"
            className="glass absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-ivory"
            style={{ top: "max(1rem, env(safe-area-inset-top))" }}>
            <X className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); onChange((index - 1 + photos.length) % photos.length); }}
            className="glass absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-ivory">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); onChange((index + 1) % photos.length); }}
            className="glass absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-ivory">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
