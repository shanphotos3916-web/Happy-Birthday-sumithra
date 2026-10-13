"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/config/birthday";
import AmbientCanvas from "@/components/effects/AmbientCanvas";
import PhotoFrame from "@/components/ui/PhotoFrame";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import SplitText from "@/components/ui/SplitText";
import { ease, getGsap, prefersReducedMotion } from "@/lib/animation";

function useBirthdayLabel(): string | null {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!birthday.birthdayDate) return;
    const d = new Date(`${birthday.birthdayDate}T00:00:00`);
    if (Number.isNaN(d.getTime())) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    const days = Math.round((next.getTime() - today.getTime()) / 86_400_000);
    const pretty = next.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    setLabel(days === 0 ? `Today · ${pretty}` : `${pretty} · ${days} day${days === 1 ? "" : "s"} to go`);
  }, []);
  return label;
}

export default function BirthdayHero({ started }: { started: boolean }) {
  const { hero, herName } = birthday;
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const dateLabel = useBirthdayLabel();

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((layer) => {
        const speed = Number(layer.dataset.speed);
        gsap.to(layer, {
          yPercent: speed * 30,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      });
    }, el);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!tilt.current) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      gsap.to(tilt.current, { rotateY: x * 8, rotateX: -y * 6, duration: 1.2, ease: "power3.out" });
    };
    if (fine) window.addEventListener("pointermove", onMove);
    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const show = started ? "show" : "hidden";

  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-x-clip bg-gradient-to-b from-ivory via-[#fbeee9] to-blush/70 px-0 pb-28 pt-16 sm:pt-24"
    >
      {/* depth layers */}
      <div data-speed="-0.6" className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-lavender/40 blur-3xl" aria-hidden />
      <div data-speed="0.8" className="pointer-events-none absolute -right-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-rose/25 blur-3xl" aria-hidden />
      <div data-speed="0.3" className="absolute inset-0" aria-hidden>
        <AmbientCanvas petals={10} sparkles={36} />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <motion.p
            className="eyebrow mb-6 text-rose-deep"
            initial={{ opacity: 0, y: 10 }}
            animate={show}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } } }}
          >
            {dateLabel ?? "A little universe made just for you"}
          </motion.p>
          <h1 id="hero-title" className="font-display leading-[0.95] text-burgundy [perspective:800px]">
            <SplitText text={hero.headline} play={started} delay={0.35} className="block text-[clamp(2.6rem,8vw,5.6rem)]" />
            <SplitText
              text={herName}
              play={started}
              delay={0.9}
              stagger={0.06}
              className="mt-2 block font-display text-[clamp(3rem,10vw,7rem)] italic text-rose-deep"
            />
          </h1>
          <motion.p
            className="mx-auto mt-8 max-w-md text-[1.05rem] leading-relaxed text-wine/80 lg:mx-0"
            initial="hidden"
            animate={show}
            variants={{ hidden: { opacity: 0, y: 20, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, delay: 1.8, ease: ease.silk } } }}
          >
            {hero.subtitle}
          </motion.p>
        </div>

        <div className="relative mx-auto w-[min(82vw,420px)] [perspective:1200px]">
          <div data-speed="-0.25" className="absolute -inset-10 rounded-full opacity-90 blur-2xl" style={{ background: "radial-gradient(circle, rgba(236,200,140,0.55), rgba(244,211,214,0.45) 45%, transparent 70%)" }} aria-hidden />
          <motion.div
            initial="hidden"
            animate={show}
            variants={{
              hidden: { opacity: 0, rotateY: -25, rotateX: 12, y: 60, scale: 0.9 },
              show: { opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1, transition: { duration: 1.8, delay: 0.7, ease: ease.silk } },
            }}
          >
            <div ref={tilt} className="[transform-style:preserve-3d]">
              <figure className="relative rotate-[1.5deg] bg-white p-3 pb-16 shadow-[0_40px_80px_-30px_rgba(91,26,46,0.55)] sm:p-4 sm:pb-20">
                <PhotoFrame photo={hero.photo} priority sizes="(max-width: 768px) 82vw, 420px" />
                <motion.figcaption
                  className="absolute bottom-4 left-0 right-0 text-center font-script text-2xl text-burgundy sm:bottom-6 sm:text-[1.7rem]"
                  initial="hidden"
                  animate={show}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 2.4, duration: 1.4 } } }}
                >
                  {hero.caption}
                </motion.figcaption>
                <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2 bg-gold-soft/70 shadow-sm" aria-hidden />
              </figure>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <ScrollIndicator target="message" />
      </motion.div>
    </section>
  );
}
