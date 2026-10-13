"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { birthday } from "@/config/birthday";

type Sfx = "chime" | "paper" | "blow" | "celebrate";

type MusicApi = {
  playing: boolean;
  /** Called from a user gesture. Respects a previous "off" choice unless forced. */
  start: (force?: boolean) => void;
  toggle: () => void;
  sfx: (name: Sfx) => void;
};

const MusicContext = createContext<MusicApi | null>(null);
const PREF_KEY = "bday-music";
const FADE_MS = 1600;

/** Gentle generated music-box melody so the site never needs an unlicensed track. */
class MusicBox {
  private timer: number | null = null;
  private step = 0;
  private next = 0;
  constructor(private ctx: AudioContext, private out: AudioNode) {}

  private note(freq: number, at: number, dur: number, vol: number) {
    const o = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o2.type = "triangle";
    o.frequency.value = freq;
    o2.frequency.value = freq * 2;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.12;
    o2.connect(g2).connect(g);
    o.connect(g).connect(this.out);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.start(at); o2.start(at);
    o.stop(at + dur + 0.05); o2.stop(at + dur + 0.05);
  }

  start() {
    // I – vi – IV – V in F major, slow arpeggios.
    const chords = [
      [349.23, 440, 523.25, 698.46],
      [293.66, 349.23, 440, 587.33],
      [233.08, 293.66, 349.23, 466.16],
      [261.63, 329.63, 392, 523.25],
    ];
    const pattern = [0, 1, 2, 3, 2, 1];
    const beat = 0.42;
    this.next = this.ctx.currentTime + 0.1;
    const schedule = () => {
      while (this.next < this.ctx.currentTime + 1.2) {
        const chord = chords[Math.floor(this.step / pattern.length) % chords.length];
        const idx = pattern[this.step % pattern.length];
        this.note(chord[idx], this.next, 2.4, 0.16);
        if (this.step % pattern.length === 0) this.note(chord[0] / 2, this.next, 3.2, 0.1);
        this.next += beat;
        this.step++;
      }
    };
    schedule();
    this.timer = window.setInterval(schedule, 300);
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const boxRef = useRef<MusicBox | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileFailed = useRef(false);
  const fadeRaf = useRef(0);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      // soft echo for a dreamy tail
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.32;
      const fb = ctx.createGain();
      fb.gain.value = 0.28;
      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(fb).connect(delay);
      delay.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  const fadeAudio = useCallback((to: number, done?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    cancelAnimationFrame(fadeRaf.current);
    const from = el.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / FADE_MS);
      el.volume = from + (to - from) * k;
      if (k < 1) fadeRaf.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRaf.current = requestAnimationFrame(step);
  }, []);

  const playSynth = useCallback(() => {
    const ctx = getCtx();
    const master = masterRef.current;
    if (!ctx || !master) return false;
    if (!boxRef.current) {
      boxRef.current = new MusicBox(ctx, master);
      boxRef.current.start();
    }
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(birthday.music.volume, ctx.currentTime + FADE_MS / 1000);
    return true;
  }, [getCtx]);

  const play = useCallback(() => {
    const src = birthday.music.src;
    if (src && !fileFailed.current) {
      if (!audioRef.current) {
        const el = new Audio(src);
        el.loop = true;
        el.preload = "none";
        el.volume = 0;
        el.addEventListener("error", () => {
          fileFailed.current = true;
          audioRef.current = null;
          if (playSynth()) setPlaying(true);
        });
        audioRef.current = el;
      }
      const el = audioRef.current;
      el.play().then(() => fadeAudio(birthday.music.volume)).catch(() => {
        // Play was blocked, or the file could not start. If the file itself
        // failed, the error listener has already switched to the melody.
        if (fileFailed.current) return;
        setPlaying(false);
      });
      setPlaying(true);
      return;
    }
    setPlaying(playSynth());
  }, [fadeAudio, playSynth]);

  const pause = useCallback(() => {
    setPlaying(false);
    if (audioRef.current) fadeAudio(0, () => audioRef.current?.pause());
    const ctx = ctxRef.current, master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_MS / 1000);
      window.setTimeout(() => {
        if (master.gain.value < 0.01) { boxRef.current?.stop(); boxRef.current = null; }
      }, FADE_MS + 100);
    }
  }, [fadeAudio]);

  const start = useCallback((force = false) => {
    if (!force && sessionStorage.getItem(PREF_KEY) === "off") return;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    if (playing) { sessionStorage.setItem(PREF_KEY, "off"); pause(); }
    else { sessionStorage.setItem(PREF_KEY, "on"); play(); }
  }, [playing, pause, play]);

  const sfx = useCallback((name: Sfx) => {
    if (!birthday.soundEffects) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const out = ctx.destination;
    const tone = (f: number, at: number, dur: number, vol: number) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g).connect(out); o.start(at); o.stop(at + dur);
    };
    const noise = (dur: number, freq: number, vol: number) => {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = ctx.createBufferSource(); s.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 0.7;
      const g = ctx.createGain(); g.gain.value = vol;
      s.connect(f).connect(g).connect(out); s.start(now);
    };
    if (name === "chime") [1046.5, 1318.5, 1568].forEach((f, i) => tone(f, now + i * 0.09, 1.4, 0.06));
    if (name === "paper") noise(0.5, 2400, 0.12);
    if (name === "blow") noise(0.9, 500, 0.25);
    if (name === "celebrate") [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, now + i * 0.11, 1.8, 0.05));
  }, [getCtx]);

  useEffect(() => () => {
    boxRef.current?.stop();
    audioRef.current?.pause();
    void ctxRef.current?.close().catch(() => {});
  }, []);

  const api = useMemo(() => ({ playing, start, toggle, sfx }), [playing, start, toggle, sfx]);
  return <MusicContext.Provider value={api}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicApi {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}
