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
import { EVENTS } from "@/lib/utils";

export default function Experience() {
  const [introOpen, setIntroOpen] = useState(true);
  const [run, setRun] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hideMain = mounted && introOpen;

  const finishIntro = useCallback(() => setIntroOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.classList.toggle("intro-lock", introOpen);
    return () => document.body.classList.remove("intro-lock");
  }, [introOpen]);

  useEffect(() => {
    const replay = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
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
        <main inert={hideMain} aria-hidden={hideMain || undefined}>
          <BirthdayHero key={run} started={!introOpen} />
          <MessageSection />
          <MemoryGallery />
          <VideoMemories />
          <BirthdayCake key={`cake-${run}`} />
          <GrandFinale />
        </main>
        {!introOpen && <MusicToggle />}
      </MusicProvider>
    </MotionConfig>
  );
}
