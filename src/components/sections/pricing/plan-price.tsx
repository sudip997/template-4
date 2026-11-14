"use client";

import { AnimatedNumber } from "./animated-number";
import { useBilling } from "./billing-context";
import type { PlanPricing } from "./plans";

type PlanPriceProps = {
  pricing: PlanPricing;
  className?: string;
};

/** Whole-dollar amounts only, formatted the same on the server and client. */
function formatAmount(currency: string, amount: number): string {
  return `${currency}${amount.toLocaleString("en-US")}`;
}

/**
 * The price block of a plan card. The number counts to the new price when the
 * billing period changes, and the note underneath reserves two lines of height
 * so the card never jumps.
 */
export function PlanPrice({ pricing, className }: PlanPriceProps) {
  const { period } = useBilling();

  if (pricing.kind === "custom") {
    return (
      <div className={className}>
        <p className="font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.045em] text-foreground sm:text-[3.25rem]">
          {pricing.headline}
        </p>
        <p className="mt-3 min-h-10 max-w-[18rem] text-sm leading-5 text-pretty text-muted-foreground">
          {pricing.note}
        </p>
      </div>
    );
  }

  const { currency, monthly, yearly } = pricing;
  const isYearly = period === "yearly";
  const price = isYearly ? yearly : monthly;
  const yearlyTotal = yearly * 12;
  const yearlySavings = (monthly - yearly) * 12;

  return (
    <div className={className}>
      {/* Screen readers get the settled price; the counting number is hidden. */}
      <p className="sr-only">{`${formatAmount(currency, price)} per month`}</p>
      <p aria-hidden="true" className="flex items-baseline gap-1">
        <span className="self-start pt-1.5 font-heading text-2xl font-medium text-muted-foreground">
          {currency}
        </span>
        <AnimatedNumber
          value={price}
          className="font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.045em] text-foreground sm:text-[3.25rem]"
        />
        <span className="ml-1.5 text-sm text-muted-foreground">/ month</span>
      </p>
      <p className="mt-3 min-h-10 text-sm leading-5 text-pretty text-muted-foreground">
        {isYearly ? (
          <>
            Billed {formatAmount(currency, yearlyTotal)} yearly.{" "}
            <span className="font-medium text-brand-violet">
              You save {formatAmount(currency, yearlySavings)}.
            </span>
          </>
        ) : (
          <>
            Billed monthly.{" "}
            <span className="text-foreground/80">
              Save {formatAmount(currency, yearlySavings)} a year with yearly
              billing.
            </span>
          </>
        )}
      </p>
    </div>
  );
}
