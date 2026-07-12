"use client";

import { motion, useReducedMotion } from "framer-motion";

// Deterministic positions/timing (percent-based) so SSR and client match.
const SPARKS = [
  { x: "10%", y: "18%", s: 16, d: 0.0, dur: 3.4 },
  { x: "84%", y: "22%", s: 12, d: 0.6, dur: 3.0 },
  { x: "22%", y: "62%", s: 10, d: 1.1, dur: 3.8 },
  { x: "70%", y: "70%", s: 14, d: 0.3, dur: 3.2 },
  { x: "48%", y: "13%", s: 9, d: 1.6, dur: 2.8 },
  { x: "90%", y: "54%", s: 8, d: 0.9, dur: 3.6 },
  { x: "6%", y: "72%", s: 11, d: 1.4, dur: 3.1 },
  { x: "62%", y: "30%", s: 7, d: 2.0, dur: 2.9 },
  { x: "34%", y: "84%", s: 13, d: 0.5, dur: 3.5 },
  { x: "78%", y: "86%", s: 9, d: 1.8, dur: 3.3 },
  { x: "16%", y: "40%", s: 8, d: 2.3, dur: 3.0 },
  { x: "92%", y: "34%", s: 10, d: 1.2, dur: 3.7 },
  { x: "52%", y: "58%", s: 6, d: 2.5, dur: 2.7 },
  { x: "40%", y: "33%", s: 7, d: 0.8, dur: 3.4 },
];

const STAR_PATH =
  "M12 0 C12.6 7 17 11.4 24 12 C17 12.6 12.6 17 12 24 C11.4 17 7 12.6 0 12 C7 11.4 11.4 7 12 0 Z";

/**
 * A tasteful field of twinkling gold sparkles that plays while its section is
 * in view. Purely decorative (aria-hidden, pointer-events-none). Parent must be
 * positioned (relative). Disabled entirely under prefers-reduced-motion.
 */
export default function Sparkles({ color = "#D8C08A" }: { color?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKS.map((sp, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            left: sp.x,
            top: sp.y,
            width: sp.s,
            height: sp.s,
            color,
            filter: "drop-shadow(0 0 4px currentColor)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{
            opacity: [0, 1, 0.2, 1, 0],
            scale: [0, 1, 0.7, 1, 0],
            rotate: [0, 20, -10, 0],
          }}
          viewport={{ once: false, margin: "-8%" }}
          transition={{
            duration: sp.dur,
            repeat: Infinity,
            delay: sp.d,
            ease: "easeInOut",
          }}
        >
          <path d={STAR_PATH} fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}
