"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/config/birthday";
import PhotoFrame from "@/components/ui/PhotoFrame";
import Lightbox from "@/components/ui/Lightbox";
import { ease, fadeUp } from "@/lib/animation";
import { cn } from "@/lib/utils";

/** Quiet mosaic. The first frame opens the wall; the landscape frame spans a row. */
const SPAN = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "",
  "col-span-2",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

export default function MemoryGallery() {
  const photos = birthday.gallery.photos;
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-[#f3ebe4] py-16 sm:py-24">
      <header className="mx-auto mb-10 max-w-3xl px-6 text-center sm:mb-14">
        <motion.h2
          id="gallery-title"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-[clamp(2.4rem,7vw,4.4rem)] italic leading-none text-burgundy"
        >
          {birthday.gallery.title}
        </motion.h2>
      </header>
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1.5 px-3 sm:grid-cols-4 sm:gap-2 sm:px-6">
        {photos.map((photo, i) => (
          <motion.li
            key={photo.src}
            className={cn(SPAN[i] ?? "")}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: ease.silk, delay: (i % 4) * 0.04 }}
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={photo.alt}
              className="group relative block h-full w-full overflow-hidden"
            >
              <PhotoFrame
                photo={photo}
                index={i}
                aspect={
                  i === 0
                    ? "aspect-[4/5] sm:absolute sm:inset-0 sm:aspect-auto sm:h-full sm:w-full"
                    : photo.orientation === "landscape"
                      ? "aspect-[16/9]"
                      : "aspect-[3/4]"
                }
                sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                priority={i === 0}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      <Lightbox photos={photos} index={active} onClose={close} onChange={setActive} />
    </section>
  );
}
