"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { birthday } from "@/config/birthday";
import AmbientCanvas from "@/components/effects/AmbientCanvas";
import { useMusic } from "@/components/effects/BackgroundMusic";
import SplitText from "@/components/ui/SplitText";
import { ease } from "@/lib/animation";

const UNLOCK_KEY = "bday-unlocked";

type Phase = "locked" | "reveal";

export default function OpeningExperience({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const { start, sfx } = useMusic();
  const inputRef = useRef<HTMLInputElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const { opening, herName } = birthday;

  useEffect(() => {
    if (sessionStorage.getItem(UNLOCK_KEY) === "1") setPhase("reveal");
    else window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 900);
  }, []);

  useEffect(() => {
    if (phase !== "reveal") return;
    const f = window.setTimeout(() => continueRef.current?.focus({ preventScroll: true }), 2200);
    const t = window.setTimeout(onDone, 8500);
    return () => {
      window.clearTimeout(f);
      window.clearTimeout(t);
    };
  }, [phase, onDone]);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (!res.ok) {
        setError(true);
        setShake((n) => n + 1);
        inputRef.current?.focus();
        return;
      }
      sessionStorage.setItem(UNLOCK_KEY, "1");
      if (birthday.music.startOnOpen) start();
      sfx("chime");
      setPhase("reveal");
    } catch {
      setError(true);
      setShake((n) => n + 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      data-intro
      role="dialog"
      aria-modal="true"
      aria-label={phase === "locked" ? "Password" : "Birthday surprise opening"}
      className="fixed inset-0 z-[90] flex min-h-[100svh] flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-plum px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-ivory"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)", transition: { duration: 1.3, ease: ease.cinematic } }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, #3d1838 0%, #241029 45%, #12071a 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        aria-hidden
      />
      <AmbientCanvas petals={16} sparkles={80} slowStart />
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden />

      <AnimatePresence mode="wait">
        {phase === "locked" ? (
          <motion.form
            key="lock"
            onSubmit={unlock}
            className="relative z-[1] flex w-full max-w-md flex-col items-center text-center"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(10px)", transition: { duration: 0.7, ease: ease.cinematic } }}
            transition={{ duration: 1.2, delay: 0.4, ease: ease.silk }}
          >
            <motion.span
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold"
              style={{ boxShadow: "0 0 40px rgba(217,184,120,0.25)" }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Lock className="h-6 w-6" strokeWidth={1.4} aria-hidden />
            </motion.span>

            <h1 className="font-display text-[clamp(1.8rem,6vw,2.8rem)] italic leading-snug text-blush">
              {opening.lockTitle}
            </h1>
            <p className="mt-4 text-ivory/70">{opening.lockHint}</p>

            <motion.div key={shake} className="mt-10 w-full" animate={error ? { x: [0, -10, 9, -6, 5, 0] } : { x: 0 }} transition={{ duration: 0.45 }}>
              <label htmlFor="surprise-password" className="sr-only">Password</label>
              <input
                ref={inputRef}
                id="surprise-password"
                type="password"
                value={value}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                onChange={(ev) => { setValue(ev.target.value); setError(false); }}
                className="w-full border-b border-gold/50 bg-transparent py-3 text-center font-display text-lg tracking-[0.12em] text-ivory outline-none placeholder:text-ivory/25 focus-visible:border-gold sm:text-2xl sm:tracking-[0.2em]"
                placeholder="••••••"
                aria-invalid={error}
                aria-describedby={error ? "password-error" : undefined}
              />
            </motion.div>

            <p id="password-error" role="alert" className="mt-4 min-h-6 text-sm text-blush">
              {error ? opening.lockError : ""}
            </p>

            <button type="submit" className="btn-luxe mt-6 max-w-full" disabled={busy || value.trim().length === 0}>
              {opening.lockButton}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="reveal"
            className="relative z-[1] flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 h-[120vw] max-h-[700px] w-[120vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(244,211,214,0.22), transparent 60%)" }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: ease.silk }}
              aria-hidden
            />
            <SplitText
              as="h1"
              text={opening.reveal}
              className="relative font-display text-[clamp(2rem,7vw,4.5rem)] leading-tight text-ivory [perspective:600px]"
              stagger={0.045}
              delay={0.2}
            />
            <motion.p
              className="relative mt-6 font-script text-[clamp(2.6rem,11vw,6rem)] leading-none text-gold-gradient"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)", letterSpacing: "0.2em" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", letterSpacing: "0.01em" }}
              transition={{ delay: 1.5, duration: 2, ease: ease.silk }}
            >
              {herName}
            </motion.p>
            <motion.button
              ref={continueRef}
              type="button"
              onClick={onDone}
              className="btn-ghost relative mt-12 text-ivory/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
            >
              Begin
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
