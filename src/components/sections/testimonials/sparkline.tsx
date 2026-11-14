"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

const WIDTH = 240;
const HEIGHT = 84;
const PAD_X = 8;
const PAD_Y = 16;

type Point = { x: number; y: number };

const fixed = (value: number) => value.toFixed(1);

/** Turns a list of values into a smooth line, a closed area under it, and the
 *  position of the last point. */
function buildPaths(values: readonly number[]) {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const step = (WIDTH - PAD_X * 2) / (values.length - 1);

  const points: Point[] = values.map((value, index) => ({
    x: PAD_X + index * step,
    y: PAD_Y + (1 - (value - min) / range) * (HEIGHT - PAD_Y * 2),
  }));

  let line = `M${fixed(points[0].x)} ${fixed(points[0].y)}`;
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const midX = (from.x + to.x) / 2;
    line += ` C${fixed(midX)} ${fixed(from.y)} ${fixed(midX)} ${fixed(to.y)} ${fixed(to.x)} ${fixed(to.y)}`;
  }

  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L${fixed(last.x)} ${HEIGHT} L${fixed(first.x)} ${HEIGHT} Z`;

  return { line, area, last };
}

type SparklineProps = {
  /** Oldest first. Needs at least two points. */
  values: readonly number[];
  className?: string;
};

/**
 * A small trend line that draws itself once, the first time it scrolls into
 * view. It is decorative: the stat beside it carries the meaning. Reduced
 * motion renders it fully drawn.
 */
export function Sparkline({ values, className }: SparklineProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();

  if (values.length < 2) return null;

  const { line, area, last } = buildPaths(values);
  const lineId = `${id}-line`;
  const areaId = `${id}-area`;
  const inView = { once: true, margin: "0px 0px -40px 0px" } as const;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className ?? "block h-auto w-full"}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-violet)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-blue)" }} />
        </linearGradient>
        <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: "var(--brand-violet)", stopOpacity: 0.28 }}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--brand-violet)", stopOpacity: 0 }}
          />
        </linearGradient>
      </defs>

      <motion.path
        d={area}
        fill={`url(#${areaId})`}
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
        transition={{ duration: 0.9, delay: 0.6 }}
      />
      <motion.path
        d={line}
        stroke={`url(#${lineId})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={inView}
        transition={{
          pathLength: { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.2, delay: 0.3 },
        }}
      />
      <motion.g
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        <circle cx={last.x} cy={last.y} r={9} className="fill-brand-blue/20" />
        <circle cx={last.x} cy={last.y} r={3.5} className="fill-brand-blue" />
      </motion.g>
    </svg>
  );
}
