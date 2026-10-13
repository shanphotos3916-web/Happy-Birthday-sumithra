"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { birthday } from "@/config/birthday";
import AmbientCanvas from "@/components/effects/AmbientCanvas";
import { useMusic } from "@/components/effects/BackgroundMusic";
import { fireConfetti, fireFireworks } from "@/components/effects/Confetti";
import { ease, inView } from "@/lib/animation";
import { EVENTS, scrollToId } from "@/lib/utils";

const BOKEH_PETALS: Array<[number, number, number]> = [[244, 196, 204], [230, 160, 175], [250, 222, 226]];

export default function GrandFinale() {
  const { finale, yourName, herName } = birthday;
  const closing = useRef<HTMLDivElement>(null);
  const celebrated = useInView(closing, { once: true, amount: 0.25 });
  const { sfx } = useMusic();

  useEffect(() => {
    if (!celebrated) return;
    const t1 = window.setTimeout(() => { fireFireworks(4, 800); sfx("celebrate"); }, 500);
    const t2 = window.setTimeout(() => {
      fireConfetti({ x: window.innerWidth * 0.22, y: window.innerHeight * 0.72 }, 70);
      fireConfetti({ x: window.innerWidth * 0.78, y: window.innerHeight * 0.72 }, 70);
    }, 1300);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [celebrated, sfx]);

  return (
    <section
      id="finale"
      aria-label={`Happy Birthday, ${herName}`}
      className="relative overflow-x-clip px-6 py-24 text-ivory sm:py-32"
      style={{ background: "linear-gradient(180deg, #c58690 0%, #6d2338 14%, #3a1224 42%, #1b0e22 100%)" }}
    >
      <AmbientCanvas petals={8} sparkles={28} bokeh={18} petalColors={BOKEH_PETALS} />
      <div
        className="pointer-events-none absolute right-6 top-8 h-16 w-16 rounded-full sm:right-10 sm:top-10 sm:h-24 sm:w-24"
        style={{ background: "radial-gradient(circle at 38% 36%, #fff8ea, #f1dfc0 52%, #d9b878)", boxShadow: "0 0 70px 24px rgba(255,236,200,0.22)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.figure
          className="relative mx-auto mt-6 w-[min(78vw,320px)]"
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
          viewport={inView}
          transition={{ duration: 1.3, ease: ease.silk }}
        >
          <div className="bg-white p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={finale.portrait.src}
                alt={finale.portrait.alt}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <figcaption className="py-3 text-center font-script text-2xl text-burgundy">
              {herName} & {yourName}
            </figcaption>
          </div>
          <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-gold-soft/80" aria-hidden />
        </motion.figure>

        <div ref={closing} className="mx-auto mt-20 max-w-lg text-center">
          <motion.p
            className="font-display text-[clamp(2rem,6vw,3.4rem)] italic leading-none"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, ease: ease.silk }}
          >
            {finale.birthday}
          </motion.p>
          <motion.p
            className="mt-3 inline-block font-script text-[clamp(3.2rem,12vw,6rem)] leading-none text-gold-gradient"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ delay: 0.35, duration: 1.4, ease: ease.silk }}
          >
            {herName}
          </motion.p>
          <motion.p
            className="mx-auto mt-8 max-w-md font-display text-xl italic leading-relaxed text-ivory/90 sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ delay: 0.7, duration: 1.1, ease: ease.silk }}
          >
            {finale.closing}
          </motion.p>
          <motion.p
            className="mt-8 font-script text-4xl text-gold-soft sm:text-5xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ delay: 1, duration: 1.4 }}
          >
            — {yourName}
          </motion.p>
        </div>

        <motion.div
          className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          <button type="button" className="btn-luxe" onClick={() => window.dispatchEvent(new Event(EVENTS.replay))}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Replay the surprise
          </button>
          <button type="button" className="btn-ghost text-ivory/85" onClick={() => scrollToId("message")}>
            <Heart className="h-4 w-4" aria-hidden /> Read my message again
          </button>
        </motion.div>

        <p className="safe-bottom mt-20 px-2 pb-16 text-center text-[0.65rem] tracking-[0.18em] text-ivory/35 sm:text-xs sm:tracking-[0.28em]">MADE WITH LOVE · JUST FOR YOU</p>
      </div>
    </section>
  );
}
