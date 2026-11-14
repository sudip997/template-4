import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";

import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

import { PlanPrice } from "./plan-price";
import type { Plan } from "./plans";

/**
 * The featured card draws its gradient border with layered backgrounds: a
 * violet/blue tint and the card surface are clipped to the padding box, and a
 * violet-to-blue gradient fills the border box behind the transparent border.
 */
const FEATURED_SURFACE: CSSProperties = {
  background: [
    "linear-gradient(135deg, color-mix(in srgb, var(--brand-violet) 14%, transparent), transparent 55%, color-mix(in srgb, var(--brand-blue) 8%, transparent)) padding-box",
    "linear-gradient(var(--card), var(--card)) padding-box",
    "linear-gradient(160deg, var(--brand-violet), color-mix(in srgb, var(--brand-blue) 75%, transparent) 48%, color-mix(in srgb, var(--brand-violet) 22%, transparent)) border-box",
  ].join(", "),
};

/** Light that pools inside each card. The featured one is brighter and sits
 *  behind the price, so the eye lands there first. */
const FEATURED_GLOW =
  "radial-gradient(ellipse 80% 38% at 50% 0%, color-mix(in srgb, var(--brand-violet) 26%, transparent), transparent 72%), radial-gradient(ellipse 60% 34% at 50% 100%, color-mix(in srgb, var(--brand-blue) 14%, transparent), transparent 72%)";
const STANDARD_GLOW =
  "radial-gradient(ellipse 70% 32% at 88% 0%, color-mix(in srgb, var(--brand-violet) 11%, transparent), transparent 72%)";

type PricingCardProps = {
  plan: Plan;
  className?: string;
};

/**
 * One plan. A Server Component: only the price inside it is interactive.
 * The recommended plan gets a gradient border, a badge, a brighter glow and a
 * gradient primary button; the others stay quiet on the elevated surface.
 */
export function PricingCard({ plan, className }: PricingCardProps) {
  const {
    id,
    name,
    icon: Icon,
    tagline,
    pricing,
    featured = false,
    badge,
    featuresLead,
    features,
    cta,
  } = plan;
  const nameId = `plan-${id}-name`;

  return (
    <article
      aria-labelledby={nameId}
      style={featured ? FEATURED_SURFACE : undefined}
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-[border-color] duration-300 sm:p-8",
        featured
          ? "border-transparent shadow-[0_32px_90px_-34px_rgb(167_139_250/0.55),inset_0_1px_0_0_rgb(255_255_255/0.08)]"
          : "border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] hover:border-brand-violet/30",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: featured ? FEATURED_GLOW : STANDARD_GLOW }}
      />
      {featured ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/80 to-transparent"
        />
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              featured
                ? "bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
                : "border border-white/10 bg-white/[0.04] text-foreground",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
          </span>
          <h3
            id={nameId}
            className="font-heading text-xl leading-snug font-semibold tracking-[-0.025em] text-foreground sm:text-2xl"
          >
            {name}
          </h3>
        </div>

        {badge ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[11px] leading-none font-semibold text-background shadow-[0_6px_18px_-8px] shadow-brand-violet/70">
            <Sparkles className="size-3" strokeWidth={2.4} aria-hidden="true" />
            {badge}
          </span>
        ) : null}
      </div>

      <p className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-pretty text-muted-foreground">
        {tagline}
      </p>

      <PlanPrice pricing={pricing} className="mt-7" />

      <LinkButton
        href={cta.href}
        variant={featured ? "primary" : "secondary"}
        size="lg"
        className="mt-6 w-full"
      >
        {cta.label}
        <span className="sr-only"> for the {name} plan</span>
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        />
      </LinkButton>

      <div className="mt-7 flex-1 border-t border-white/[0.08] pt-6">
        <p className="text-[13px] font-medium text-foreground">{featuresLead}</p>
        <ul className="mt-4 grid gap-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-[15px] leading-snug text-foreground/80"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mt-px grid size-5 shrink-0 place-items-center rounded-full",
                  featured
                    ? "bg-brand-gradient text-background"
                    : "bg-brand-violet/15 text-brand-violet",
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
