"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";
import type { Ref } from "react";

import { cn } from "@/lib/utils";

import type { Step } from "./steps";

type StepItemProps = {
  step: Step;
  index: number;
  isLast: boolean;
  active: boolean;
  /** 0 to 1 over the active step; fills the bar under the description. */
  progress: MotionValue<number>;
  /** False when autoplay is off, so there is no bar to fill. */
  showProgress: boolean;
  tabId: string;
  panelId: string;
  tabRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
};

/**
 * One row of the step list: icon, title and description. The active row gets a
 * glass highlight (shared across rows, so it glides between them) and a bar
 * along its bottom edge that fills as the step plays.
 */
export function StepItem({
  step,
  index,
  isLast,
  active,
  progress,
  showProgress,
  tabId,
  panelId,
  tabRef,
  onSelect,
}: StepItemProps) {
  const reduceMotion = useReducedMotion();
  const Icon = step.icon;
  const titleId = `${tabId}-title`;
  const descriptionId = `${tabId}-description`;

  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      id={tabId}
      aria-selected={active}
      aria-controls={panelId}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "group relative block w-full px-5 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-7 sm:py-7",
        !isLast && "border-b border-white/[0.08]",
      )}
    >
      {active && (
        <motion.span
          layoutId="launch-flow-highlight"
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-brand-violet/[0.18] via-brand-blue/[0.07] to-transparent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)]"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 42 }
          }
        />
      )}

      <span className="relative flex items-start gap-4">
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg transition-[background-color,box-shadow,color,border-color] duration-300",
            active
              ? "bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
              : "border border-white/10 bg-white/[0.04] text-muted-foreground group-hover:text-foreground",
          )}
        >
          <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span
              id={titleId}
              className={cn(
                "font-heading text-lg leading-snug font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-xl",
                active
                  ? "text-foreground"
                  : "text-foreground/80 group-hover:text-foreground",
              )}
            >
              {step.title}
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-xs text-muted-foreground tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </span>
          <span
            id={descriptionId}
            className={cn(
              "mt-2 block text-[15px] leading-relaxed text-pretty transition-colors duration-300",
              active ? "text-foreground/75" : "text-muted-foreground",
            )}
          >
            {step.description}
          </span>
        </span>
      </span>

      {active && showProgress && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-white/[0.06]"
        >
          <motion.span
            className="block h-full origin-left bg-brand-gradient shadow-[0_0_14px_1px_rgb(167_139_250/0.7)]"
            style={{ scaleX: progress }}
          />
        </span>
      )}
    </button>
  );
}
