"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type AnimatedNumberProps = {
  value: number;
  className?: string;
};

/**
 * Counts from the previous value to the new one when `value` changes. Tabular
 * figures keep the width steady while it counts, so nothing shifts. With
 * reduced motion it simply shows the new value.
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(value);
  const latest = useRef(value);

  useEffect(() => {
    if (reduceMotion || latest.current === value) return;

    const controls = animate(latest.current, value, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (current) => {
        latest.current = current;
        setDisplayed(Math.round(current));
      },
      onComplete: () => {
        latest.current = value;
        setDisplayed(value);
      },
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <span className={cn("tabular-nums", className)}>
      {reduceMotion ? value : displayed}
    </span>
  );
}
