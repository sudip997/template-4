"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Check, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { MiniChip } from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

import {
  DEFAULT_RULES,
  RULES,
  SEGMENT_NAME,
  TOTAL_CONTACTS,
  audienceSize,
  type RuleId,
} from "./audience-segments-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NUMBER = new Intl.NumberFormat("en-US");

const DEFAULT_SIZE = audienceSize(new Set(DEFAULT_RULES));

/**
 * Visual for the audience segments card: a segment with a live audience count
 * and five rule chips that really toggle. Each rule narrows the audience, the
 * number counts to its new value and the share bar follows it.
 *
 * The count rises from zero once when the card scrolls into view. After that
 * only the chips drive it. With reduced motion every change is instant.
 */
export function AudienceSegmentsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const rulesLabelId = useId();
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ready = Boolean(reduceMotion) || inView;

  const [active, setActive] = useState<ReadonlySet<RuleId>>(
    () => new Set(DEFAULT_RULES),
  );
  const [saved, setSaved] = useState(false);

  const size = audienceSize(active);
  const share = size / TOTAL_CONTACTS;

  // Starts on the default audience, so the server markup and reduced-motion
  // users see a real number; the first play rewinds it to zero and counts up.
  const count = useMotionValue(DEFAULT_SIZE);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!ready) return;
    if (reduceMotion) {
      count.set(size);
      return;
    }
    const first = !hasPlayed.current;
    hasPlayed.current = true;
    if (first) count.set(0);

    const controls = animate(count, size, {
      duration: first ? 1.4 : 0.55,
      delay: first ? 0.45 : 0,
      ease: EASE,
    });
    return () => controls.stop();
  }, [ready, reduceMotion, size, count]);

  const countText = useTransform(count, (value) =>
    NUMBER.format(Math.round(value)),
  );
  const barScale = useTransform(count, (value) =>
    Math.min(1, value / TOTAL_CONTACTS),
  );

  function toggle(id: RuleId) {
    setActive((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSaved(false);
  }

  const summary =
    active.size === 0
      ? "No rules · everyone"
      : `${active.size} ${active.size === 1 ? "rule" : "rules"} · ${Math.round(share * 100)}% of list`;

  return (
    <div ref={ref} className="px-6 sm:px-8">
      <div
        className={cn(
          "rounded-t-xl border-x border-t border-white/10 bg-surface-2/70 p-4 pb-7 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl transition-opacity duration-500 motion-reduce:transition-none sm:p-5 sm:pb-8",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs leading-5 text-muted-foreground">Segment</p>
            <p className="truncate text-[13px] leading-5 font-medium text-foreground">
              {SEGMENT_NAME}
            </p>
          </div>
          <MiniChip tone="blue">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-current"
            />
            Live count
          </MiniChip>
        </div>

        {/* Audience size. The animated number is hidden from assistive tech;
            the polite live region below announces only the settled value. */}
        <div className="mt-5">
          <p
            aria-hidden="true"
            className="font-heading text-[2.5rem] leading-none font-semibold tracking-[-0.03em] text-brand-gradient tabular-nums sm:text-[2.75rem]"
          >
            <motion.span>{countText}</motion.span>
          </p>
          <p aria-hidden="true" className="mt-2 text-xs text-muted-foreground">
            matching contacts of {NUMBER.format(TOTAL_CONTACTS)}
          </p>
          <div
            aria-hidden="true"
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              style={{ scaleX: barScale }}
              className="h-full origin-left rounded-full bg-linear-to-r from-brand-violet to-brand-blue"
            />
          </div>
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {NUMBER.format(size)} of {NUMBER.format(TOTAL_CONTACTS)} contacts
            match. {summary}.
          </p>
        </div>

        {/* Rules */}
        <div className="mt-5">
          <p id={rulesLabelId} className="mb-2 text-xs text-muted-foreground">
            Rules
          </p>
          <div
            role="group"
            aria-labelledby={rulesLabelId}
            className="flex flex-wrap gap-2"
          >
            {RULES.map((rule) => {
              const on = active.has(rule.id);
              return (
                <button
                  key={rule.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(rule.id)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                    on
                      ? "border-brand-violet/40 bg-brand-violet/15 text-brand-violet hover:bg-brand-violet/20"
                      : "border-white/10 bg-transparent text-muted-foreground hover:border-white/20 hover:text-foreground",
                  )}
                >
                  {on ? (
                    <Check
                      className="size-3.5 shrink-0"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus
                      className="size-3.5 shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  )}
                  {rule.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary and save */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-white/[0.08] pt-4">
          <p aria-hidden="true" className="text-[13px] text-muted-foreground">
            {summary}
          </p>
          <button
            type="button"
            onClick={() => setSaved(true)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-[filter,box-shadow,background-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
              saved
                ? "bg-white/[0.06] text-foreground"
                : "bg-brand-gradient text-background shadow-[0_8px_24px_-10px] shadow-brand-violet/50 hover:brightness-110",
            )}
          >
            {saved ? (
              <>
                <Check className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
                Saved
              </>
            ) : (
              "Save segment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
