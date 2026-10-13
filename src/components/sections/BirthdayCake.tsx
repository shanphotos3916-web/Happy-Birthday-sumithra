"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDown, RotateCcw } from "lucide-react";
import { birthday } from "@/config/birthday";
import AmbientCanvas from "@/components/effects/AmbientCanvas";
import { useMusic } from "@/components/effects/BackgroundMusic";
import { fireConfetti } from "@/components/effects/Confetti";
import { ease } from "@/lib/animation";
import { scrollToId } from "@/lib/utils";

type Phase = "waiting" | "lighting" | "ready" | "blown";

const CX = 160;

/** Frosting drips hanging below the front edge of an elliptical tier top. */
function dripPath(rx: number, ry: number, y: number, seed: number): string {
  const n = 9;
  let d = `M ${CX - rx} ${y}`;
  for (let i = 0; i <= n * 2; i++) {
    const t = i / (n * 2);
    const x = CX - rx + t * rx * 2;
    const edge = y + ry * Math.sqrt(Math.max(0, 1 - ((x - CX) / rx) ** 2));
    const len = i % 2 === 1 ? 10 + ((i * 7 + seed) % 5) * 4 : 3;
    d += ` Q ${x - rx / (n * 2)} ${edge + len} ${x} ${edge + (i % 2 === 1 ? len : 2)}`;
  }
  d += ` L ${CX + rx} ${y} A ${rx} ${ry} 0 0 1 ${CX - rx} ${y} Z`;
  return d;
}

function Tier({ top, h, rx, ry, seed }: { top: number; h: number; rx: number; ry: number; seed: number }) {
  const bottom = top + h;
  const pearls = 13;
  return (
    <g>
      <rect x={CX - rx} y={top} width={rx * 2} height={h} fill="url(#tier)" />
      <ellipse cx={CX} cy={bottom} rx={rx} ry={ry} fill="url(#tier)" />
      <path d={dripPath(rx, ry, top, seed)} fill="url(#frosting)" />
      <ellipse cx={CX} cy={top} rx={rx} ry={ry} fill="#fff7f1" />
      <ellipse cx={CX} cy={top} rx={rx * 0.85} ry={ry * 0.7} fill="#ffffff" opacity="0.5" />
      {Array.from({ length: pearls }).map((_, i) => {
        const a = Math.PI * (i / (pearls - 1));
        return <circle key={i} cx={CX - Math.cos(a) * rx * 0.98} cy={bottom + Math.sin(a) * ry * 0.98 - 1} r={2.6} fill="url(#pearl)" />;
      })}
    </g>
  );
}

function Cake({ candles, lit, blown }: { candles: number; lit: number; blown: boolean }) {
  const spread = 46;
  return (
    <svg viewBox="0 0 320 340" className="h-auto w-full overflow-visible" role="img" aria-label={blown ? "A birthday cake with the candles blown out" : `A birthday cake with ${lit} lit candles`}>
      <defs>
        <linearGradient id="tier" x1="0" x2="1">
          <stop offset="0" stopColor="#d99aa6" />
          <stop offset="0.35" stopColor="#f6d5da" />
          <stop offset="0.6" stopColor="#f1c6cd" />
          <stop offset="1" stopColor="#c47f8d" />
        </linearGradient>
        <linearGradient id="frosting" x1="0" x2="1">
          <stop offset="0" stopColor="#efe0d6" />
          <stop offset="0.4" stopColor="#fffaf5" />
          <stop offset="1" stopColor="#e6d2c6" />
        </linearGradient>
        <radialGradient id="pearl" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#c49a58" />
        </radialGradient>
        <linearGradient id="plate" x1="0" x2="1">
          <stop offset="0" stopColor="#b38a4f" />
          <stop offset="0.5" stopColor="#f6e4bb" />
          <stop offset="1" stopColor="#a87e45" />
        </linearGradient>
        <linearGradient id="candle" x1="0" x2="1">
          <stop offset="0" stopColor="#e9d3c4" />
          <stop offset="0.5" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#dcc0b0" />
        </linearGradient>
        <radialGradient id="flameGlow">
          <stop offset="0" stopColor="#ffd58a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff9d5c" />
          <stop offset="0.45" stopColor="#ffd37a" />
          <stop offset="1" stopColor="#fff6d8" />
        </linearGradient>
      </defs>

      <ellipse cx={CX} cy={326} rx={150} ry={14} fill="rgba(0,0,0,0.35)" filter="blur(4px)" />
      <ellipse cx={CX} cy={318} rx={150} ry={16} fill="url(#plate)" />
      <ellipse cx={CX} cy={315} rx={140} ry={12} fill="#fbf0d8" opacity="0.6" />

      <Tier top={222} h={86} rx={128} ry={14} seed={1} />
      <Tier top={152} h={70} rx={98} ry={11} seed={3} />
      <Tier top={94} h={58} rx={68} ry={8} seed={5} />

      {Array.from({ length: candles }).map((_, i) => {
        const offset = candles === 1 ? 0 : (i / (candles - 1) - 0.5) * 2 * spread;
        const x = CX + offset;
        const base = 96 - Math.cos((offset / spread) * (Math.PI / 2)) * 4;
        const isLit = !blown && i < lit;
        return (
          <g key={i}>
            <rect x={x - 3.5} y={base - 36} width={7} height={36} rx={2} fill="url(#candle)" />
            {[0, 1, 2, 3].map((s) => (
              <path key={s} d={`M ${x - 3.5} ${base - 30 + s * 9} l 7 -4`} stroke="#d58e9b" strokeWidth="2" opacity="0.7" />
            ))}
            <line x1={x} y1={base - 36} x2={x} y2={base - 41} stroke="#3a2a22" strokeWidth="1.2" />
            <motion.g initial={false} animate={{ opacity: isLit ? 1 : 0 }} transition={{ duration: isLit ? 0.6 : 0.25 }}>
              <circle cx={x} cy={base - 48} r={22} fill="url(#flameGlow)" />
              <path className="svg-flame" style={{ animationDelay: `${i * 0.2}s` }}
                d={`M ${x} ${base - 60} C ${x + 6} ${base - 50} ${x + 5} ${base - 42} ${x} ${base - 40} C ${x - 5} ${base - 42} ${x - 6} ${base - 50} ${x} ${base - 60} Z`}
                fill="url(#flame)" />
            </motion.g>
            {blown && (
              <circle className="svg-smoke" style={{ animationDelay: `${i * 0.08}s` }} cx={x} cy={base - 46} r={4} fill="rgba(240,230,235,0.5)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function BirthdayCake() {
  const { cake, herName } = birthday;
  const root = useRef<HTMLElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.15 });
  const [phase, setPhase] = useState<Phase>("waiting");
  const [lit, setLit] = useState(0);
  const { sfx } = useMusic();

  useEffect(() => {
    if (inView && phase === "waiting") setPhase("lighting");
  }, [inView, phase]);

  useEffect(() => {
    if (phase !== "lighting") return;
    if (lit >= cake.candles) { setPhase("ready"); return; }
    const t = window.setTimeout(() => setLit((n) => n + 1), lit === 0 ? 1100 : 420);
    return () => window.clearTimeout(t);
  }, [phase, lit, cake.candles]);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const blow = useCallback(() => {
    if (phaseRef.current !== "ready") return;
    phaseRef.current = "blown";
    sfx("blow");
    setPhase("blown");
    window.setTimeout(() => {
      const r = cakeRef.current?.getBoundingClientRect();
      fireConfetti(r ? { x: r.left + r.width / 2, y: r.top + r.height * 0.25 } : undefined, 160);
      sfx("celebrate");
    }, 450);
  }, [sfx]);

  const relight = () => {
    setLit(0);
    setPhase("lighting");
  };

  return (
    <section
      ref={root}
      id="cake"
      aria-labelledby="cake-title"
      className="relative flex min-h-screen-safe flex-col items-center justify-center overflow-x-clip px-5 py-20 text-ivory sm:px-6 sm:py-24"
      style={{ background: "linear-gradient(180deg, #1b0e22 0%, #3a1530 45%, #8c4a5c 85%, #c58690 100%)" }}
    >
      <AmbientCanvas petals={8} sparkles={70} />
      <div className="pointer-events-none absolute left-1/2 top-[55%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-[1500ms]"
        style={{ background: "radial-gradient(circle, rgba(255,200,130,0.35), transparent 65%)", opacity: phase === "blown" ? 0.25 : lit / cake.candles }} aria-hidden />

      <div className="relative text-center">
        <motion.p className="eyebrow text-gold" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1 }}>
          {cake.eyebrow}
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={phase === "blown" ? "after" : "before"}
            id="cake-title"
            className="mx-auto mt-5 max-w-xl font-display text-[clamp(2rem,6vw,3.8rem)] italic leading-[1.1]"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 1, ease: ease.silk, delay: phase === "blown" ? 0.8 : 0.3 }}
          >
            {phase === "blown" ? cake.afterWish : cake.heading}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.div
        ref={cakeRef}
        className="relative mt-10 w-[min(78vw,360px)]"
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.6, ease: ease.silk, delay: 0.4 }}
      >
        <Cake candles={cake.candles} lit={lit} blown={phase === "blown"} />
      </motion.div>

      <div className="relative mt-10 flex min-h-[7.5rem] flex-col items-center gap-3" aria-live="polite">
        {phase !== "blown" ? (
          <>
            <button type="button" className="btn-luxe" onClick={blow} disabled={phase !== "ready"}>
              {phase === "ready" ? cake.button : "Lighting the candles…"}
            </button>
          </>
        ) : (
          <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.9 }}>
            <p className="font-script text-2xl text-gold-soft">Happy Birthday, {herName}</p>
            <button type="button" className="btn-luxe" onClick={() => scrollToId("finale")}>
              One last thing <ArrowDown className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" onClick={relight} className="flex min-h-11 items-center gap-2 px-3 text-sm text-ivory/70 hover:text-ivory">
              <RotateCcw className="h-4 w-4" aria-hidden /> Light the candles again
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
