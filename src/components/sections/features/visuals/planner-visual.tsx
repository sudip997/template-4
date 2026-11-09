"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import {
  Mail,
  Megaphone,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

import {
  IconTile,
  MiniChip,
} from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BRIEF =
  "Launch Aurora, our spring collection, in three weeks. Budget $24k, focused on repeat buyers.";
const WORDS = BRIEF.split(" ");

const LABEL =
  "Illustration: a campaign brief for a spring launch with a 24 thousand dollar budget turns into a suggested plan with email, paid social and search, each with a day, a budget and a projected lift, ending in a projected reach of 184 thousand, 22 percent above the last launch.";

type PlanRow = {
  channel: string;
  action: string;
  slot: string;
  budget: string;
  /** Share of the budget, as a percentage. */
  share: number;
  lift: string;
  icon: LucideIcon;
  /** Colour shared by the row's dot and its segment in the budget bar. */
  swatch: string;
};

const PLAN: readonly PlanRow[] = [
  {
    channel: "Email",
    action: "Teaser sequence",
    slot: "Wed 10:00",
    budget: "$5.5k",
    share: 23,
    lift: "+14%",
    icon: Mail,
    swatch: "bg-brand-violet",
  },
  {
    channel: "Paid social",
    action: "Carousel ads",
    slot: "Thu 09:00",
    budget: "$12k",
    share: 50,
    lift: "+21%",
    icon: Megaphone,
    swatch: "bg-brand-blue",
  },
  {
    channel: "Search",
    action: "Brand and product terms",
    slot: "Fri 08:00",
    budget: "$6.5k",
    share: 27,
    lift: "+9%",
    icon: Search,
    swatch: "bg-brand-violet/40",
  },
];

const REACH_THOUSANDS = 184;

// Timeline, in seconds after the panel scrolls into view.
const WORD_STEP = 0.045;
const WORDS_START = 0.4;
const WORDS_END = WORDS_START + WORDS.length * WORD_STEP;
const GENERATE_AT = WORDS_END + 0.2;
const PLAN_HEAD_AT = GENERATE_AT + 0.3;
const ROWS_AT = PLAN_HEAD_AT + 0.25;
const ROW_STEP = 0.28;
const SUMMARY_AT = ROWS_AT + PLAN.length * ROW_STEP + 0.1;

function rise(delay: number, y = 10): Variants {
  return {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: EASE },
    },
  };
}

function fade(delay: number): Variants {
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, delay, ease: EASE } },
  };
}

const PULSE_RING: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: {
    opacity: [0.7, 0],
    scale: [1, 1.3],
    transition: { delay: GENERATE_AT, duration: 0.8, ease: "easeOut" },
  },
};

const BUDGET_BAR: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { delay: SUMMARY_AT + 0.1, duration: 0.9, ease: EASE },
  },
};

/** Counts the projected reach up from zero once the summary appears. */
function ReachCounter({ play }: { play: boolean }) {
  const reduceMotion = useReducedMotion();
  // Starts at the final value, so the server markup and reduced-motion users
  // both see the real number; the count-up resets it to zero when it plays.
  const value = useMotionValue(REACH_THOUSANDS);
  const label = useTransform(value, (v) => `${Math.round(v)}k`);

  useEffect(() => {
    if (!play || reduceMotion) return;
    value.set(0);
    const controls = animate(value, REACH_THOUSANDS, {
      duration: 1.4,
      delay: SUMMARY_AT + 0.1,
      ease: EASE,
    });
    return () => controls.stop();
  }, [play, reduceMotion, value]);

  return (
    <motion.span className="text-brand-gradient font-heading text-2xl leading-none font-semibold tracking-[-0.03em] tabular-nums sm:text-[28px]">
      {label}
    </motion.span>
  );
}

function PlanListRow({ row, index }: { row: PlanRow; index: number }) {
  const at = ROWS_AT + index * ROW_STEP;

  return (
    <motion.li
      variants={rise(at, 10)}
      className="flex items-center gap-3 px-3 py-2.5 sm:gap-3.5 sm:px-3.5"
    >
      <IconTile icon={row.icon} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] leading-5 font-medium text-foreground">
          {row.channel}
        </p>
        <p className="truncate text-xs leading-5 text-muted-foreground">
          {row.action} · {row.slot}
        </p>
      </div>
      <motion.span
        variants={fade(at + 0.12)}
        className="hidden items-center gap-1.5 text-xs text-muted-foreground tabular-nums sm:flex"
      >
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", row.swatch)}
        />
        {row.budget}
      </motion.span>
      <motion.span variants={fade(at + 0.2)}>
        <MiniChip tone="blue">{row.lift}</MiniChip>
      </motion.span>
    </motion.li>
  );
}

/**
 * Visual for the AI campaign planner card. A glass panel, anchored to the
 * card's bottom-right corner, shows a short brief turning into a drafted plan
 * with a budget split and projected reach. It plays once when it scrolls into
 * view and shows its final state when the user prefers reduced motion.
 *
 * It is an illustration: the button is not a real control and nothing in it
 * takes focus.
 */
export function PlannerVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const show = Boolean(reduceMotion) || inView;

  return (
    <div ref={ref} className="relative pl-6 sm:pl-8">
      {/* A second, fainter panel peeking out above and behind the main one. */}
      <div
        aria-hidden="true"
        className="absolute -top-3 right-0 bottom-0 left-10 rounded-tl-xl border-t border-l border-white/[0.07] bg-white/[0.025] sm:left-12"
      />

      <motion.div
        role="img"
        aria-label={LABEL}
        initial={reduceMotion ? false : "hidden"}
        animate={show ? "show" : "hidden"}
        className="relative flex flex-col gap-4 rounded-tl-xl border-t border-l border-white/10 bg-surface-2/70 p-4 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:gap-5 sm:p-5"
      >
        {/* The brief */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles
              className="size-3.5 text-brand-violet"
              aria-hidden="true"
            />
            Campaign brief
          </p>
          <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-background/50 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-foreground sm:text-sm">
              {WORDS.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <motion.span
                    variants={rise(WORDS_START + index * WORD_STEP, 4)}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                  {index < WORDS.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
            <span className="relative self-end sm:self-auto">
              <motion.span
                aria-hidden="true"
                variants={PULSE_RING}
                className="absolute inset-0 rounded-lg ring-2 ring-brand-violet motion-reduce:hidden"
              />
              <span className="relative inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-gradient px-3 text-xs font-semibold whitespace-nowrap text-background shadow-[0_8px_24px_-10px] shadow-brand-violet/50">
                <Sparkles className="size-3.5" strokeWidth={2.4} />
                Generate plan
              </span>
            </span>
          </div>
        </div>

        {/* The drafted plan */}
        <div className="flex flex-col gap-2">
          <motion.div
            variants={rise(PLAN_HEAD_AT, 6)}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="font-medium text-foreground">Suggested plan</span>
            <span className="truncate text-muted-foreground">
              Based on 14 past launches
            </span>
          </motion.div>
          <ul className="divide-y divide-white/[0.07] overflow-hidden rounded-lg border border-white/10 bg-background/40">
            {PLAN.map((row, index) => (
              <PlanListRow key={row.channel} row={row} index={index} />
            ))}
          </ul>
        </div>

        {/* The outcome */}
        <motion.div
          variants={rise(SUMMARY_AT, 8)}
          className="flex flex-col gap-4 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
        >
          <div>
            <p className="text-xs text-muted-foreground">Projected reach</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <ReachCounter play={inView} />
              <MiniChip tone="blue">+22% vs last launch</MiniChip>
            </div>
          </div>

          <div className="w-full sm:max-w-[250px]">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Budget split</span>
              <span className="text-foreground tabular-nums">$24k</span>
            </div>
            <motion.div
              variants={BUDGET_BAR}
              className="flex h-1.5 origin-left gap-1"
            >
              {PLAN.map((row) => (
                <span
                  key={row.channel}
                  className={cn("rounded-full", row.swatch)}
                  style={{ flex: `${row.share} 1 0%` }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
