"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animation";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
  as?: "span" | "h1" | "h2" | "p";
  /** When false, stays hidden (used to wait for the intro). */
  play?: boolean;
};

/** Character-by-character reveal. Screen readers get the plain text. */
export default function SplitText({ text, className, delay = 0, stagger = 0.04, inView = false, as = "span", play = true }: Props) {
  const Tag = motion[as];
  const words = text.split(" ");
  let i = 0;
  const trigger = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { initial: "hidden", animate: play ? "show" : "hidden" };
  return (
    <Tag className={className} aria-label={text} {...trigger}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch) => {
            const d = delay + i++ * stagger;
            return (
              <motion.span
                key={`${wi}-${d}`}
                className="inline-block will-change-transform"
                variants={{
                  hidden: { opacity: 0, y: "0.45em", rotateX: -70, filter: "blur(6px)" },
                  show: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.9, delay: d, ease: ease.silk } },
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
