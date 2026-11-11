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
import { BellOff, Check, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { MiniChip } from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

import {
  ALERT_CAMPAIGN,
  CAMPAIGNS,
  DAY,
  DAYS_IN_MONTH,
  EXPECTED_SHARE,
  TOTAL_BUDGET,
  TOTAL_SPENT,
  formatMoney,
  paceDelta,
  paceStatus,
  projectedSpend,
  runOutDay,
  suggestedDailyCap,
  type Campaign,
} from "./budget-pacing-data";

type AlertState = "alert" | "capped" | "dismissed";

/** Every track runs from zero to this share of the budget, so there is room
 *  to show spend that is projected to overshoot the budget line. */
const TRACK_MAX = 1.25;
const BUDGET_POS = 1 / TRACK_MAX;
const EXPECTED_POS = EXPECTED_SHARE / TRACK_MAX;

const SPRING = { type: "spring", stiffness: 140, damping: 22 } as const;

const toPercent = (share: number) => `${share * 100}%`;

/** Eases a slice of the 0 to 1 timeline: 0 before `from`, 1 after `to`. */
function ramp(progress: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return 1 - (1 - t) ** 3;
}

type WithProgress = { progress: MotionValue<number> };

function PaceRow({
  campaign,
  index,
  progress,
  state,
}: WithProgress & { campaign: Campaign; index: number; state: AlertState }) {
  const reduceMotion = useReducedMotion();
  const status = paceStatus(campaign);
  const capped = campaign.id === ALERT_CAMPAIGN.id && state === "capped";

  const spentShare = campaign.spent / campaign.budget;
  const projectedAmount = projectedSpend(
    campaign,
    capped ? suggestedDailyCap(campaign) : undefined,
  );
  const projectedShare = projectedAmount / campaign.budget;

  // The projected spend eases to its new value when a cap is set or undone.
  const projected = useMotionValue(projectedShare);
  useEffect(() => {
    if (reduceMotion) {
      projected.set(projectedShare);
      return;
    }
    const controls = animate(projected, projectedShare, SPRING);
    return () => controls.stop();
  }, [projectedShare, reduceMotion, projected]);

  const enter = index * 0.04;
  const opacity = useTransform(progress, [enter, enter + 0.12], [0, 1]);
  const y = useTransform(progress, [enter, enter + 0.12], [8, 0]);

  const fillWidth = useTransform(progress, (value) =>
    toPercent((ramp(value, 0.1, 0.55) * spentShare) / TRACK_MAX),
  );
  const extent = useTransform(
    [progress, projected],
    ([value, share]: number[]) => (ramp(value, 0.4, 0.78) * share) / TRACK_MAX,
  );
  const withinBudgetWidth = useTransform(extent, (value) =>
    toPercent(Math.min(value, BUDGET_POS)),
  );
  const overBudgetWidth = useTransform(extent, (value) =>
    toPercent(Math.max(0, value - BUDGET_POS)),
  );
  const paceOpacity = useTransform(progress, [0.5, 0.6], [0, 1]);

  return (
    <motion.li style={{ opacity, y }}>
      <p className="sr-only">
        {campaign.name}: {capped ? "on budget after the daily cap" : status.label}.
        Spent {formatMoney(campaign.spent)} of {formatMoney(campaign.budget)},
        projected {formatMoney(projectedAmount)} by the end of the month.
      </p>

      <div aria-hidden="true">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[13px] leading-5 font-medium text-foreground">
            {campaign.name}
          </span>
          {capped ? (
            <MiniChip tone="blue">
              <Check className="size-3" strokeWidth={2.6} />
              On budget
            </MiniChip>
          ) : status.flagged ? (
            <MiniChip tone="blue">{status.label}</MiniChip>
          ) : (
            <span className="text-xs leading-5 text-muted-foreground">
              {status.label}
            </span>
          )}
        </div>

        <div className="relative mt-2.5 h-2 rounded-full bg-white/10">
          {/* Projected end of month: violet inside the budget, blue past it. */}
          <motion.span
            style={{ width: withinBudgetWidth }}
            className="absolute inset-y-0 left-0 rounded-l-full bg-brand-violet/25"
          />
          <motion.span
            style={{ width: overBudgetWidth, left: toPercent(BUDGET_POS) }}
            className="absolute inset-y-0 rounded-r-full bg-brand-blue/60"
          />
          {/* Spent so far */}
          <motion.span
            style={{ width: fillWidth }}
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-brand-violet to-brand-blue"
          />
          {/* Budget limit */}
          <span
            className="absolute -top-1 -bottom-1 w-px bg-white/40"
            style={{ left: toPercent(BUDGET_POS) }}
          />
          {/* Where spend should be today */}
          <motion.span
            style={{ left: toPercent(EXPECTED_POS), opacity: paceOpacity }}
            className="absolute -top-[7px] h-0 w-0 -translate-x-1/2 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-white/75"
          />
        </div>
      </div>
    </motion.li>
  );
}

function LegendItem({
  swatch,
  children,
}: {
  swatch: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {swatch}
      {children}
    </span>
  );
}

/** One of the three alert messages. They share a grid cell, so the card is as
 *  tall as the tallest one and never jumps; inactive ones are invisible, which
 *  also takes them out of the tab order and the accessibility tree. */
function AlertCard({
  active,
  icon,
  message,
  children,
}: {
  active: boolean;
  icon: ReactNode;
  message: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "col-start-1 row-start-1 flex flex-col gap-3 rounded-lg border border-brand-blue/25 bg-brand-blue/[0.07] p-3 transition-[opacity,visibility] duration-300 motion-reduce:transition-none",
        active ? "opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-blue/15 text-brand-blue">
          {icon}
        </span>
        {/* Announced once by the live region, so hidden from the page here. */}
        <p
          aria-hidden="true"
          className="min-w-0 flex-1 pt-0.5 text-[13px] leading-snug text-foreground"
        >
          {message}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pl-[2.375rem]">{children}</div>
    </div>
  );
}

const BUTTON_BASE =
  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-brand-gradient text-background shadow-[0_8px_24px_-10px] shadow-brand-violet/50 transition-[filter] duration-200 hover:brightness-110`;
const BUTTON_SECONDARY = `${BUTTON_BASE} border border-white/10 font-medium text-muted-foreground transition-colors duration-200 hover:border-white/20 hover:text-foreground`;

/**
 * Visual for the budget pacing card: three campaigns on a track that shows
 * spend so far, where spend should be today and where it is headed by the end
 * of the month. Paid social is running ahead, so an alert offers a one-click
 * daily cap, which really does pull its projection back inside the budget.
 *
 * The tracks fill once when the card scrolls into view and the alert rises
 * about a second later. After that only the buttons change anything. With
 * reduced motion the finished state shows at once and changes are instant.
 */
export function BudgetPacingVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ready = Boolean(reduceMotion) || inView;

  const [state, setState] = useState<AlertState>("alert");

  // One value runs the entrance from 0 to 1. It starts at the finished state,
  // so reduced-motion users and the server markup show the real result.
  const progress = useMotionValue(1);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: 2.8,
      delay: 0.4,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [inView, reduceMotion, progress]);

  // The alert stays out of reach until it has risen into view.
  const alertOpacity = useTransform(progress, [0.8, 0.95], [0, 1]);
  const alertY = useTransform(progress, [0.8, 0.95], [10, 0]);
  const alertVisibility = useTransform(progress, (value): "hidden" | "visible" =>
    value < 0.8 ? "hidden" : "visible",
  );

  const cap = suggestedDailyCap(ALERT_CAMPAIGN);
  const aheadPercent = Math.round(paceDelta(ALERT_CAMPAIGN) * 100);
  const messages: Record<AlertState, string> = {
    alert: `${ALERT_CAMPAIGN.name} is pacing ${aheadPercent}% ahead. At this rate it runs out on day ${runOutDay(ALERT_CAMPAIGN)}.`,
    capped: `Daily cap set at $${cap}. ${ALERT_CAMPAIGN.name} now finishes the month on budget.`,
    dismissed: `Alert dismissed. We'll flag ${ALERT_CAMPAIGN.name} again if pacing gets worse.`,
  };

  const headerChip =
    state === "alert" ? (
      <MiniChip tone="blue">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current"
        />
        1 alert
      </MiniChip>
    ) : state === "capped" ? (
      <MiniChip tone="blue">
        <Check className="size-3" strokeWidth={2.6} aria-hidden="true" />
        On track
      </MiniChip>
    ) : (
      <MiniChip>1 flagged</MiniChip>
    );

  return (
    <div ref={ref} className="flex flex-1 flex-col px-6 sm:px-8">
      <div
        className={cn(
          "flex flex-1 flex-col rounded-t-xl border-x border-t border-white/10 bg-surface-2/70 p-4 pb-7 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl transition-opacity duration-500 motion-reduce:transition-none sm:p-5 sm:pb-8",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] leading-5 font-medium text-foreground">
              Budget pacing
            </p>
            <p className="truncate text-xs leading-5 text-muted-foreground">
              Day {DAY} of {DAYS_IN_MONTH} · {formatMoney(TOTAL_SPENT)} of{" "}
              {formatMoney(TOTAL_BUDGET)} spent
            </p>
          </div>
          <span className="shrink-0">{headerChip}</span>
        </div>

        {/* Campaign tracks */}
        <ul className="mt-5 flex flex-col gap-4">
          {CAMPAIGNS.map((campaign, index) => (
            <PaceRow
              key={campaign.id}
              campaign={campaign}
              index={index}
              progress={progress}
              state={state}
            />
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
        >
          <LegendItem
            swatch={
              <span className="h-0 w-0 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-white/75" />
            }
          >
            Pace today
          </LegendItem>
          <LegendItem swatch={<span className="h-3 w-px bg-white/40" />}>
            Budget
          </LegendItem>
          <LegendItem
            swatch={<span className="h-1.5 w-3 rounded-full bg-brand-violet/25" />}
          >
            Projected
          </LegendItem>
        </div>

        {/* Takes up any height the card has to spare, so the panel fills the
            card and the alert stays pinned to the bottom. */}
        <div className="min-h-4 flex-1" />

        {/* Alert */}
        <motion.div
          style={{
            opacity: alertOpacity,
            y: alertY,
            visibility: alertVisibility,
          }}
          className="grid"
        >
          <AlertCard
            active={state === "alert"}
            message={messages.alert}
            icon={
              <TriangleAlert
                className="size-3.5"
                strokeWidth={2.1}
                aria-hidden="true"
              />
            }
          >
            <button
              type="button"
              onClick={() => setState("capped")}
              aria-label={`Cap daily spend on ${ALERT_CAMPAIGN.name} at $${cap}`}
              className={BUTTON_PRIMARY}
            >
              Cap daily spend
            </button>
            <button
              type="button"
              onClick={() => setState("dismissed")}
              aria-label={`Dismiss the pacing alert for ${ALERT_CAMPAIGN.name}`}
              className={BUTTON_SECONDARY}
            >
              Dismiss
            </button>
          </AlertCard>

          <AlertCard
            active={state === "capped"}
            message={messages.capped}
            icon={<Check className="size-3.5" strokeWidth={2.6} aria-hidden="true" />}
          >
            <button
              type="button"
              onClick={() => setState("alert")}
              aria-label="Undo the daily cap and restore the alert"
              className={BUTTON_SECONDARY}
            >
              Undo
            </button>
          </AlertCard>

          <AlertCard
            active={state === "dismissed"}
            message={messages.dismissed}
            icon={<BellOff className="size-3.5" strokeWidth={2.1} aria-hidden="true" />}
          >
            <button
              type="button"
              onClick={() => setState("alert")}
              aria-label="Restore the pacing alert"
              className={BUTTON_SECONDARY}
            >
              Undo
            </button>
          </AlertCard>
        </motion.div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {messages[state]}
        </p>
      </div>
    </div>
  );
}
