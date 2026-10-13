"use client";

import { motion } from "framer-motion";
import { Music2, VolumeX } from "lucide-react";
import { useMusic } from "@/components/effects/BackgroundMusic";

export default function MusicToggle() {
  const { playing, toggle } = useMusic();
  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      className="glass fixed z-50 flex h-12 items-center gap-2 rounded-full pl-3.5 pr-4 text-sm text-ivory shadow-lg shadow-plum/30 transition-colors hover:bg-white/15"
      style={{
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        backgroundColor: "rgba(43, 18, 40, 0.55)",
      }}
    >
      {playing ? <Music2 className="h-4 w-4 text-gold" aria-hidden /> : <VolumeX className="h-4 w-4 opacity-80" aria-hidden />}
      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gold"
            animate={playing ? { height: [4, 14, 6, 12, 4] } : { height: 4 }}
            transition={playing ? { duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" } : { duration: 0.4 }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{playing ? "Music on" : "Music off"}</span>
    </motion.button>
  );
}
