"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Film, Play, X } from "lucide-react";
import { birthday, type Video } from "@/config/birthday";
import { ease, fadeUp } from "@/lib/animation";
import { cn } from "@/lib/utils";

function VideoModal({ items, index, onClose, onChange }: { items: readonly Video[]; index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState(false);
  const open = index !== null;
  const video = open ? items[index] : null;

  useEffect(() => setError(false), [index]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [open, index, items.length, onClose, onChange]);

  return (
    <AnimatePresence>
      {open && video && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Video"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/94 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key={index}
            className="flex w-full max-w-sm flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: ease.silk }}
          >
            <div className="relative aspect-[9/16] max-h-[78svh] w-full overflow-hidden bg-black shadow-2xl">
              {video.src && !error ? (
                <video
                  key={video.src}
                  src={video.src}
                  poster={video.poster || undefined}
                  controls
                  autoPlay
                  playsInline
                  onError={() => setError(true)}
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ivory/70">
                  <Film className="h-8 w-8" aria-hidden />
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" aria-label="Previous video" onClick={() => onChange((index - 1 + items.length) % items.length)} className="glass flex h-12 w-12 items-center justify-center rounded-full text-ivory">
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button type="button" aria-label="Next video" onClick={() => onChange((index + 1) % items.length)} className="glass flex h-12 w-12 items-center justify-center rounded-full text-ivory">
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </motion.div>
          <button ref={closeRef} type="button" aria-label="Close video" onClick={onClose} className="glass absolute right-4 flex h-12 w-12 items-center justify-center rounded-full text-ivory" style={{ top: "max(1rem, env(safe-area-inset-top))" }}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VideoMemories() {
  const items = birthday.videos.items;
  const [modal, setModal] = useState<number | null>(null);
  const close = useCallback(() => setModal(null), []);

  return (
    <section id="videos" aria-labelledby="videos-title" className="relative overflow-hidden bg-[#140c12] py-16 text-ivory sm:py-24">
      <header className="mx-auto mb-10 max-w-3xl px-6 text-center sm:mb-14">
        <motion.h2
          id="videos-title"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.05]"
        >
          {birthday.videos.title} <span className="block italic text-blush">{birthday.videos.titleAccent}</span>
        </motion.h2>
      </header>
      <ul className="no-scrollbar mx-auto flex max-w-6xl snap-x gap-2 overflow-x-auto px-3 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-6">
        {items.map((clip, i) => (
          <li key={clip.src} className="w-[68vw] max-w-[240px] shrink-0 snap-center md:w-auto md:max-w-none">
            <button
              type="button"
              onClick={() => setModal(i)}
              aria-label={`Play clip ${i + 1}`}
              className={cn("group relative block aspect-[9/16] w-full overflow-hidden bg-black")}
            >
              {clip.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={clip.poster} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              ) : (
                <span className="absolute inset-0 bg-burgundy" />
              )}
              <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" aria-hidden />
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 backdrop-blur-sm">
                <Play className="ml-0.5 h-5 w-5 fill-white text-white" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <VideoModal items={items} index={modal} onClose={close} onChange={setModal} />
    </section>
  );
}
