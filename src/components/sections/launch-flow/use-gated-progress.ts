"use client";

import {
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";

/**
 * A copy of `source` that only follows it while `active` is true. A diagram
 * that has just been replaced therefore holds its last frame while it fades
 * out, instead of rewinding to the start as the next step begins.
 */
export function useGatedProgress(
  source: MotionValue<number>,
  active: boolean,
): MotionValue<number> {
  const gated = useMotionValue(0);

  useMotionValueEvent(source, "change", (value) => {
    if (active) gated.set(value);
  });

  useEffect(() => {
    if (active) gated.set(source.get());
  }, [active, gated, source]);

  return gated;
}
