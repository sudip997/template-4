import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Design size of every diagram. The stage scales this box to fit its width. */
export const CANVAS = { width: 560, height: 440 } as const;

/** Flat raised surface used by every card inside the diagrams. */
export const SURFACE = "border border-border bg-surface-2";

/** One soft, short shadow. Depth comes from the surface colour, not effects. */
export const SURFACE_SHADOW = "shadow-[0_8px_24px_-14px_rgb(0_0_0/0.7)]";

type IconTileProps = {
  icon: LucideIcon;
  size?: "sm" | "md";
  /** `accent` is a quiet violet tint; `neutral` is plain gray. */
  tone?: "accent" | "neutral";
  className?: string;
};

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "accent",
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center",
        size === "sm" ? "size-7 rounded-md" : "size-9 rounded-lg",
        tone === "accent"
          ? "bg-brand-violet/15 text-brand-violet"
          : "bg-white/[0.06] text-foreground",
        className,
      )}
    >
      <Icon
        className={size === "sm" ? "size-3.5" : "size-[18px]"}
        strokeWidth={2.1}
        aria-hidden="true"
      />
    </span>
  );
}

/** Small tinted label used for values and states inside the diagrams. */
export function MiniChip({
  tone = "violet",
  className,
  children,
}: {
  tone?: "violet" | "blue";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tone === "violet"
          ? "bg-brand-violet/15 text-brand-violet"
          : "bg-brand-blue/15 text-brand-blue",
        className,
      )}
    >
      {children}
    </span>
  );
}
