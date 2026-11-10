"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Trophy } from "lucide-react";
import { useEffect, useRef } from "react";

import { MiniChip } from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

type Variant = {
  id: "A" | "B";
  subject: string;
  /** Final open rate, in percent. */
  openRate: number;
  /** Open rate once the test is about a third of the way through. */
  midRate: number;
};

const VARIANTS: readonly [Variant, Variant] = [
  {
    id: "A",
    subject: "Meet Aurora, our spring collection",
    openRate: 38.4,
    midRate: 33.1,
  },
  {
    id: "B",
    subject: "48 hours of early access to Aurora",
    openRate: 46.9,
    midRate: 35.2,
  },
];

const MAX_RATE = Math.max(...VARIANTS.map((variant) => variant.openRate));
const CONFIDENCE = 95;
const TEST_SHARE = 15;

const LABEL = `Illustration: a subject line test on the Aurora launch email, sent to ${TEST_SHARE} percent of the list. Variant A, "${VARIANTS[0].subject}", reaches a ${VARIANTS[0].openRate} percent open rate. Variant B, "${VARIANTS[1].subject}", reaches ${VARIANTS[1].openRate} percent, about 22 percent higher. At ${CONFIDENCE} percent confidence B is declared the winner and sent to the remaining ${100 - TEST_SHARE} percent of the list.`;

// The whole sequence is one value running from 0 to 1. Each piece below maps
// its own slice of that range, so everything stays in sync.
const ENTER_END = 0.12;
const COUNT_START = 0.1;
const COUNT_MID = 0.45;
const COUNT_END = 0.8;
const RESOLVE_START = 0.82;
const RESOLVE_END = 0.94;

type WithProgress = { progress: MotionValue<number> };

function VariantRow({
  variant,
  index,
  progress,
}: WithProgress & { variant: Variant; index: number }) {
  const isWinner = variant.id === "B";
  const enter = index * 0.04;

  const opacity = useTransform(progress, [enter, enter + ENTER_END], [0, 1]);
  const y = useTransform(progress, [enter, enter + ENTER_END], [10, 0]);
  const rate = useTransform(
    progress,
    [COUNT_START, COUNT_MID, COUNT_END],
    [0, variant.midRate, variant.openRate],
  );
  const rateText = useTransform(rate, (value) => `${value.toFixed(1)}%`);
  const bar = useTransform(rate, (value) => value / MAX_RATE);

  // The loser fades back, the winner gets a highlight and a badge.
  const dim = useTransform(
    progress,
    [RESOLVE_START, RESOLVE_END],
    [1, isWinner ? 1 : 0.62],
  );
  const highlight = useTransform(
    progress,
    [RESOLVE_START, RESOLVE_END],
    [0, isWinner ? 1 : 0],
  );
  const badgeScale = useTransform(
    progress,
    [RESOLVE_START, RESOLVE_END],
    [0.8, 1],
  );

  return (
    <motion.li style={{ opacity, y }} className="relative">
      <motion.div
        style={{ opacity: dim }}
        className="relative flex flex-col gap-3 rounded-lg border border-white/10 bg-background/50 p-3"
      >
        <div className="flex items-start gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/[0.06] font-heading text-xs font-semibold text-foreground">
            {variant.id}
          </span>
          <p className="min-w-0 flex-1 pt-0.5 text-[13px] leading-snug font-medium text-pretty text-foreground">
            {variant.subject}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              style={{ scaleX: bar }}
              className="relative block h-full origin-left rounded-full bg-brand-violet/70"
            >
              {isWinner ? (
                <motion.span
                  style={{ opacity: highlight }}
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand-violet to-brand-blue"
                />
              ) : null}
            </motion.span>
          </span>
          <motion.span className="w-14 text-right font-heading text-sm font-semibold text-foreground tabular-nums">
            {rateText}
          </motion.span>
        </div>

        {isWinner ? (
          <motion.span
            aria-hidden="true"
            style={{ opacity: highlight }}
            className="pointer-events-none absolute inset-0 rounded-lg bg-brand-violet/[0.06] ring-1 ring-brand-violet/60"
          />
        ) : null}
      </motion.div>

      {isWinner ? (
        <motion.span
          aria-hidden="true"
          style={{ opacity: highlight, scale: badgeScale }}
          className="absolute -top-2 right-3 inline-flex origin-bottom-right items-center gap-1 rounded-full bg-brand-gradient px-2 py-0.5 text-[11px] font-semibold text-background shadow-[0_6px_16px_-6px] shadow-brand-violet/60"
        >
          <Trophy className="size-3" strokeWidth={2.4} />
          Winner
        </motion.span>
      ) : null}
    </motion.li>
  );
}

/** Ring that fills to the confidence level, with the number in the middle. */
function ConfidenceRing({ progress }: WithProgress) {
  const fill = useTransform(
    progress,
    [COUNT_START, COUNT_END],
    [0, CONFIDENCE / 100],
  );
  const visible = useTransform(
    progress,
    [COUNT_START, COUNT_START + 0.02],
    [0, 1],
  );
  const text = useTransform(fill, (value) => `${Math.round(value * 100)}%`);

  return (
    <div className="relative size-12 shrink-0">
      <svg
        viewBox="0 0 40 40"
        className="size-full -rotate-90"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          strokeWidth="3.5"
          className="stroke-white/10"
        />
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-brand-violet"
          style={{ pathLength: fill, opacity: visible }}
        />
      </svg>
      <motion.span className="absolute inset-0 grid place-items-center font-heading text-[11px] font-semibold text-foreground tabular-nums">
        {text}
      </motion.span>
    </div>
  );
}

/**
 * Visual for the A/B testing card: two subject lines race on a slice of the
 * list while a confidence ring fills. When it reaches 95% the test resolves:
 * the status flips, B is crowned and the rest of the list is queued for it.
 *
 * It plays once when it scrolls into view and shows the finished result for
 * reduced motion. It is an illustration; nothing in it takes focus.
 */
export function AbTestingVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ready = Boolean(reduceMotion) || inView;

  // Starts at the finished state, so reduced-motion users and the server
  // markup show the real result; the animation rewinds it when it plays.
  const progress = useMotionValue(1);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: 3.6,
      delay: 0.5,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [inView, reduceMotion, progress]);

  const testing = useTransform(progress, [RESOLVE_START, RESOLVE_END], [1, 0]);
  const found = useTransform(
    progress,
    [RESOLVE_START + 0.03, RESOLVE_END],
    [0, 1],
  );

  return (
    <div ref={ref} className="px-6 sm:px-8">
      <div
        role="img"
        aria-label={LABEL}
        className={cn(
          "rounded-t-xl border-x border-t border-white/10 bg-surface-2/70 p-4 pb-7 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl transition-opacity duration-500 motion-reduce:transition-none sm:p-5 sm:pb-8",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Header and status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] leading-5 font-medium text-foreground">
              Subject line test
            </p>
            <p className="truncate text-xs leading-5 text-muted-foreground">
              Aurora launch email · open rate
            </p>
          </div>
          <span className="grid shrink-0">
            <motion.span
              style={{ opacity: testing }}
              className="col-start-1 row-start-1 justify-self-end"
            >
              <MiniChip>
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-current"
                />
                Testing
              </MiniChip>
            </motion.span>
            <motion.span
              style={{ opacity: found }}
              className="col-start-1 row-start-1 justify-self-end"
            >
              <MiniChip tone="blue">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-current"
                />
                Winner found
              </MiniChip>
            </motion.span>
          </span>
        </div>

        {/* The two variants */}
        <ul className="mt-5 flex flex-col gap-3">
          {VARIANTS.map((variant, index) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              index={index}
              progress={progress}
            />
          ))}
        </ul>

        {/* Confidence and what happens next */}
        <div className="mt-5 flex items-center gap-3.5 border-t border-white/[0.08] pt-4">
          <ConfidenceRing progress={progress} />
          <div className="grid min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              Statistical confidence
            </p>
            <motion.p
              style={{ opacity: testing }}
              className="col-start-1 row-start-2 text-[13px] leading-snug font-medium text-foreground"
            >
              Testing on {TEST_SHARE}% of your list
            </motion.p>
            <motion.p
              style={{ opacity: found }}
              className="col-start-1 row-start-2 text-[13px] leading-snug font-medium text-foreground"
            >
              Sending B to the other {100 - TEST_SHARE}%
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
