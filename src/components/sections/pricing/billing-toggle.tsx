"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import { cn } from "@/lib/utils";

import { useBilling, type BillingPeriod } from "./billing-context";

type Option = {
  value: BillingPeriod;
  label: string;
  badge?: string;
};

/** Keep the badge in step with the yearly prices in `plans.ts`. */
const OPTIONS: readonly Option[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "Save 20%" },
];

type BillingToggleProps = {
  className?: string;
};

/**
 * Monthly / yearly switch built as a native radio group, so arrow keys, focus
 * and screen-reader semantics come from the browser. The highlight glides
 * between the two options and a polite live region announces the change.
 */
export function BillingToggle({ className }: BillingToggleProps) {
  const { period, setPeriod } = useBilling();
  const reduceMotion = useReducedMotion();
  const id = useId();

  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="sr-only">Billing period</legend>

      <div className="relative inline-flex rounded-xl border border-white/10 bg-card/70 p-1 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] backdrop-blur-md">
        {OPTIONS.map(({ value, label, badge }) => {
          const selected = period === value;

          return (
            <label
              key={value}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 select-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background motion-reduce:transition-none",
                selected
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={`${id}-billing-period`}
                value={value}
                checked={selected}
                onChange={() => setPeriod(value)}
                className="sr-only"
              />

              {selected ? (
                <motion.span
                  layoutId={`${id}-billing-highlight`}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg bg-linear-to-br from-brand-violet/25 to-brand-blue/15 shadow-[inset_0_0_0_1px_rgb(167_139_250/0.35),inset_0_1px_0_0_rgb(255_255_255/0.12)]"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 38 }
                  }
                />
              ) : null}

              <span className="relative">{label}</span>
              {badge ? (
                <span className="relative rounded-full bg-brand-gradient px-2 py-0.5 text-[11px] leading-none font-semibold text-background">
                  {badge}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {period === "yearly"
          ? "Showing yearly prices, billed annually."
          : "Showing monthly prices, billed monthly."}
      </p>
    </fieldset>
  );
}
