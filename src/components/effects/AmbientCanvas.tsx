"use client";

import { useEffect, useRef } from "react";
import { isLowPowerDevice, isSmallScreen } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animation";

type Props = {
  petals?: number;
  sparkles?: number;
  bokeh?: number;
  /** Petal palette — base RGB triplets. */
  petalColors?: Array<[number, number, number]>;
  className?: string;
  /** Fade particles in slowly on mount (opening scene). */
  slowStart?: boolean;
};

type Petal = {
  x: number; y: number; z: number; size: number; vy: number; vx: number;
  rot: number; vr: number; sway: number; phase: number; color: [number, number, number];
};
type Spark = { x: number; y: number; r: number; phase: number; speed: number; drift: number };
type Bokeh = { x: number; y: number; r: number; vy: number; hue: [number, number, number]; a: number };

const DEFAULT_PETALS: Array<[number, number, number]> = [
  [244, 196, 204],
  [226, 150, 166],
  [250, 220, 224],
  [205, 120, 140],
];

export default function AmbientCanvas({
  petals = 14,
  sparkles = 50,
  bokeh = 0,
  petalColors = DEFAULT_PETALS,
  className = "",
  slowStart = false,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const factor = isLowPowerDevice() ? 0.45 : isSmallScreen() ? 0.6 : 1;
    const nPetals = Math.round(petals * factor);
    const nSparks = Math.round(sparkles * factor);
    const nBokeh = Math.round(bokeh * factor);

    let w = 0, h = 0, raf = 0, visible = true, start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const makePetal = (initial: boolean): Petal => {
      const z = rand(0.35, 1);
      return {
        x: rand(-0.1, 1.1) * w,
        y: initial ? rand(-0.2, 1) * h : rand(-0.25, -0.05) * h,
        z,
        size: rand(7, 15) * z,
        vy: rand(0.25, 0.6) * z,
        vx: rand(-0.15, 0.25),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.012, 0.012),
        sway: rand(0.4, 1.2),
        phase: rand(0, Math.PI * 2),
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      };
    };
    const P: Petal[] = Array.from({ length: nPetals }, () => makePetal(true));
    const S: Spark[] = Array.from({ length: nSparks }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: rand(0.5, 1.8),
      phase: rand(0, Math.PI * 2), speed: rand(0.4, 1.4), drift: rand(-0.08, -0.02),
    }));
    const B: Bokeh[] = Array.from({ length: nBokeh }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: rand(14, 60), vy: rand(-0.15, -0.04),
      hue: Math.random() > 0.4 ? [236, 200, 130] : [240, 170, 180], a: rand(0.05, 0.16),
    }));

    const drawPetal = (p: Petal, alpha: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.phase * 1.3)));
      const s = p.size;
      const [r, g, b] = p.color;
      const grad = ctx.createLinearGradient(-s, -s, s, s);
      grad.addColorStop(0, `rgba(${r},${g},${b},${0.95 * alpha})`);
      grad.addColorStop(1, `rgba(${r - 30},${g - 40},${b - 30},${0.75 * alpha})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.8, s * 0.8, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.8, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const frame = (t: number) => {
      const intro = slowStart ? Math.min(1, (t - start) / 3500) : 1;
      ctx.clearRect(0, 0, w, h);

      for (const b of B) {
        if (!reduce) { b.y += b.vy; if (b.y < -b.r) { b.y = h + b.r; b.x = Math.random() * w; } }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${b.hue.join(",")},${b.a * intro})`);
        g.addColorStop(1, `rgba(${b.hue.join(",")},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }

      for (const s of S) {
        if (!reduce) { s.y += s.drift; if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; } }
        const tw = reduce ? 0.7 : 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase);
        const a = tw * intro;
        ctx.fillStyle = `rgba(242,214,150,${0.85 * a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.r > 1.3) {
          ctx.fillStyle = `rgba(242,214,150,${0.18 * a})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (!reduce) {
          p.phase += 0.012;
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.phase) * p.sway * 0.35;
          p.rot += p.vr;
          if (p.y > h + 30 || p.x > w + 40 || p.x < -40) P[i] = makePetal(false);
        }
        drawPetal(p, (0.45 + 0.55 * p.z) * intro);
      }
    };

    const loop = (t: number) => {
      frame(t);
      if (visible) raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      start = -1e9;
      frame(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (!reduce && visible && !was) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (!reduce && visible && !was) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(performance.now()); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [petals, sparkles, bokeh, petalColors, slowStart]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
