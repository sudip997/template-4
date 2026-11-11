import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** `brand` is the gradient tile for a flagship feature; `quiet` is neutral. */
  iconTone?: "brand" | "quiet";
  /** CSS `background` for light that pools inside the card, behind the visual. */
  glow?: string;
  className?: string;
  /** The product visual. It sits at the bottom and owns its own padding, so it
   *  can bleed off the card's edges. */
  children?: ReactNode;
};

/**
 * Shared shell for every card in the Features grid: a dark surface with a faint
 * violet/blue tint, a text block on top and a product visual underneath.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconTone = "quiet",
  glow,
  className,
  children,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] transition-[border-color] duration-300 hover:border-brand-violet/30",
        className,
      )}
    >
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: glow }}
        />
      ) : null}

      <div className="p-6 pb-0 sm:p-8 sm:pb-0">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-lg",
            iconTone === "brand"
              ? "bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
              : "border border-white/10 bg-white/[0.04] text-foreground",
          )}
        >
          <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-heading text-xl leading-snug font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Fills whatever height the grid row gives the card. Visuals sit at the
          bottom by default; one that wants to fill the space can grow. */}
      {children ? (
        <div className="flex flex-1 flex-col justify-end pt-8 lg:pt-10">
          {children}
        </div>
      ) : null}
    </article>
  );
}
