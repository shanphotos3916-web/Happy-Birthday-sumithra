"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/config/birthday";
import AmbientCanvas from "@/components/effects/AmbientCanvas";
import { ease, fadeUp, getGsap, inView, prefersReducedMotion, stagger } from "@/lib/animation";
import { cn } from "@/lib/utils";

type Word = { text: string; glow: boolean };

/** "a *beautiful heart,* b" → words flagged for the gold highlight. Punctuation may sit outside the stars. */
function parse(paragraph: string): Word[] {
  let glow = false;
  return paragraph.split(" ").filter(Boolean).map((raw) => {
    const token = raw.replace(/[^\p{L}\p{N}*]/gu, "");
    const opens = token.startsWith("*");
    const closes = token.endsWith("*");
    if (opens) glow = true;
    const word = { text: raw.replace(/\*/g, ""), glow };
    if (closes) glow = false;
    return word;
  });
}

const NOTE_TILTS = [-4, 3, -2.5, 4];

function Note({ text, index }: { text: string; index: number }) {
  const right = index % 2 === 1;
  return (
    <motion.div
      className={cn("my-14 flex sm:my-20", right ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, y: 28, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: NOTE_TILTS[index % NOTE_TILTS.length] }}
      viewport={inView}
      transition={{ duration: 1.2, ease: ease.silk }}
    >
      <div className="paper relative w-[min(70vw,19rem)] px-5 pb-6 pt-8 text-center shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] sm:px-6">
        <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-gold-soft/70" aria-hidden />
        <p className="font-script text-[1.7rem] leading-snug text-burgundy">{text}</p>
      </div>
    </motion.div>
  );
}

export default function MessageSection({ started }: { started: boolean }) {
  const { message, yourName } = birthday;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!started || !el || prefersReducedMotion()) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-lit]").forEach((para) => {
        const words = para.querySelectorAll("[data-word]");
        if (coarse) {
          gsap.fromTo(words, { opacity: 0.35 }, {
            opacity: 1,
            duration: 0.7,
            stagger: 0.02,
            ease: "power1.out",
            scrollTrigger: { trigger: para, start: "top 90%", once: true },
          });
          return;
        }
        gsap.fromTo(words, { opacity: 0.2 }, {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: para, start: "top 82%", end: "bottom 45%", scrub: 0.4 },
        });
      });

      if (!coarse) {
        gsap.to("[data-glow]", {
          yPercent: 260,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
        });
      }

      gsap.from("[data-signature]", {
        autoAlpha: 0,
        y: 16,
        duration: 1.1,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: "[data-signature]", start: "top 92%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [started]);

  return (
    <section
      ref={root}
      id="message"
      aria-labelledby="message-title"
      className="relative overflow-x-clip bg-[#1b0e22] px-6 py-28 text-ivory sm:py-36"
    >
      <AmbientCanvas petals={5} sparkles={55} />
      <div
        data-glow
        className="pointer-events-none absolute left-1/2 top-[8%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(197,134,144,0.45), rgba(217,184,120,0.15) 50%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl">
        <motion.header className="text-center" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0, 0.12)}>
          <motion.p variants={fadeUp} className="eyebrow text-gold">{message.eyebrow}</motion.p>
          <motion.h2 id="message-title" variants={fadeUp} className="mt-6 font-display text-[clamp(2.2rem,6vw,4.4rem)] italic leading-[1.05] text-blush">
            {message.title}
          </motion.h2>
          <motion.div variants={fadeUp} className="mx-auto mt-10 h-16 w-px bg-gradient-to-b from-gold to-transparent" aria-hidden />
        </motion.header>

        <div className="mt-16 sm:mt-24">
          {message.paragraphs.map((p, i) => (
            <div key={i}>
              <p data-lit className="font-display text-[clamp(1.6rem,4.6vw,3.1rem)] leading-[1.32] tracking-[-0.01em]">
                {parse(p).map((w, wi) => (
                  <span key={wi}>
                    <span data-word className={cn("inline-block", w.glow && "italic text-gold")}>{w.text}</span>{" "}
                  </span>
                ))}
              </p>
              {message.notes[i] && <Note text={message.notes[i]} index={i} />}
            </div>
          ))}
        </div>

        <div className="mt-28 flex flex-col items-end sm:mt-36">
          <span className="mb-5 h-px w-16 bg-gold/80" aria-hidden />
          <p className="font-display text-xl italic text-blush sm:text-2xl">{message.closing}</p>
          <p data-signature className="mt-3 font-script text-[clamp(3.2rem,9vw,5.2rem)] leading-none text-gold-soft">
            {yourName} <span className="ml-1 text-rose">♡</span>
          </p>
        </div>
      </div>
    </section>
  );
}
