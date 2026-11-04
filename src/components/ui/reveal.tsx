"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the reveal starts, for staggering. */
  delay?: number;
  /** Starting vertical offset in px. Use 0 for a pure fade. */
  y?: number;
};

/**
 * Fades (and gently lifts) its content in once, the first time it scrolls into
 * view. Renders in its final state when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
