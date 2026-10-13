"use client";

import { isLowPowerDevice, isSmallScreen } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animation";

/**
 * Lightweight, dependency-free celebration effects.
 * Each call creates a temporary full-screen canvas that removes itself.
 */

type Particle = {
  x: number; y: number; vx: number; vy: number; life: number; max: number;
  size: number; color: string; rot: number; vr: number; shape: "rect" | "dot" | "spark";
  gravity: number; drag: number;
};

const GOLDS = ["#f6e4bb", "#d9b878", "#c49a58", "#fff3d6", "#f4d3d6", "#e8a9b4"];

function overlay(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "70",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return null; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { canvas, ctx, w, h };
}

function run(particles: Particle[], spawn?: (t: number) => Particle[] | void, duration = 4000) {
  const o = overlay();
  if (!o) return;
  const { canvas, ctx, w, h } = o;
  const t0 = performance.now();
  const tick = (t: number) => {
    const elapsed = t - t0;
    const extra = spawn?.(elapsed);
    if (extra) particles.push(...extra);
    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      const a = Math.max(0, 1 - p.life / p.max);
      if (a <= 0 || p.y > h + 40) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2 * (0.4 + Math.abs(Math.sin(p.rot * 2))));
        ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        if (p.shape === "spark") {
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
    if (elapsed < duration || particles.length) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

const scale = () => (isLowPowerDevice() ? 0.45 : isSmallScreen() ? 0.6 : 1);

/** A graceful burst of gold confetti from a point (defaults to centre). */
export function fireConfetti(origin?: { x: number; y: number }, amount = 140) {
  if (prefersReducedMotion()) return;
  const n = Math.round(amount * scale());
  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight / 2;
  const ps: Particle[] = Array.from({ length: n }, () => {
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const sp = 4 + Math.random() * 9;
    const spark = Math.random() < 0.3;
    return {
      x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
      life: 0, max: 110 + Math.random() * 90, size: spark ? 1 + Math.random() * 1.5 : 6 + Math.random() * 6,
      color: GOLDS[Math.floor(Math.random() * GOLDS.length)], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      shape: spark ? "spark" : "rect", gravity: spark ? 0.04 : 0.12, drag: 0.975,
    };
  });
  run(ps, undefined, 0);
}

/** Soft, slow fireworks — a handful of gold blooms. */
export function fireFireworks(bursts = 6, spacing = 650) {
  if (prefersReducedMotion()) return;
  const s = scale();
  let fired = 0;
  const bloom = (): Particle[] => {
    const x = window.innerWidth * (0.15 + Math.random() * 0.7);
    const y = window.innerHeight * (0.12 + Math.random() * 0.3);
    const n = Math.round(60 * s);
    const color = GOLDS[Math.floor(Math.random() * GOLDS.length)];
    return Array.from({ length: n }, (_, i) => {
      const ang = (i / n) * Math.PI * 2;
      const sp = 2 + Math.random() * 2.2;
      return {
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 80 + Math.random() * 40,
        size: 1.2 + Math.random(), color, rot: 0, vr: 0, shape: "spark", gravity: 0.03, drag: 0.965,
      };
    });
  };
  run([], (elapsed) => {
    if (fired < bursts && elapsed > fired * spacing) { fired++; return bloom(); }
  }, bursts * spacing);
}
