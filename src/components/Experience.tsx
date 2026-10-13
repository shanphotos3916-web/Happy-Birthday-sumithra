"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { MusicProvider } from "@/components/effects/BackgroundMusic";
import OpeningExperience from "@/components/intro/OpeningExperience";
import MusicToggle from "@/components/ui/MusicToggle";
import BirthdayHero from "@/components/sections/BirthdayHero";
import MessageSection from "@/components/sections/MessageSection";
import MemoryGallery from "@/components/sections/MemoryGallery";
import VideoMemories from "@/components/sections/VideoMemories";
import BirthdayCake from "@/components/sections/BirthdayCake";
import GrandFinale from "@/components/sections/GrandFinale";
import { getGsap } from "@/lib/animation";
import { EVENTS, lockPageScroll, unlockPageScroll } from "@/lib/utils";

export default function Experience() {
  const [introOpen, setIntroOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const [run, setRun] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hideMain = mounted && introOpen;

  const finishIntro = useCallback(() => setIntroOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (introOpen) {
      setReady(false);
      lockPageScroll();
      return () => unlockPageScroll();
    }
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [introOpen]);

  useEffect(() => {
    if (!ready) return;
    const { ScrollTrigger } = getGsap();
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 80);
    void document.fonts?.ready.then(refresh);
    window.addEventListener("orientationchange", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("orientationchange", refresh);
    };
  }, [ready]);

  useEffect(() => {
    const replay = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setReady(false);
      setRun((r) => r + 1);
      setIntroOpen(true);
    };
    window.addEventListener(EVENTS.replay, replay);
    return () => window.removeEventListener(EVENTS.replay, replay);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <AnimatePresence>{introOpen && <OpeningExperience key={run} onDone={finishIntro} />}</AnimatePresence>
        <main key={ready ? `live-${run}` : "hold"} inert={hideMain} aria-hidden={hideMain || undefined}>
          <BirthdayHero started={ready} />
          <MessageSection started={ready} />
          <MemoryGallery />
          <VideoMemories />
          <BirthdayCake />
          <GrandFinale />
        </main>
        {ready && <MusicToggle />}
      </MusicProvider>
    </MotionConfig>
  );
}
