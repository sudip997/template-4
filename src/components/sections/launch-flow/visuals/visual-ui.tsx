import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Design size of every diagram. The stage scales this box to fit its width. */
export const CANVAS = { width: 560, height: 440 } as const;

/** Frosted-glass surface used by every card inside the diagrams. */
export const GLASS = "border border-white/10 bg-white/[0.06] backdrop-blur-md";

/** Soft drop shadow plus a faint top highlight, the "lit glass" edge. */
export const GLASS_SHADOW =
  "shadow-[0_18px_40px_-18px_rgb(0_0_0/0.85),inset_0_1px_0_0_rgb(255_255_255/0.09)]";

const BLOB_COLORS = {
  violet: "rgb(167 139 250 / 0.32)",
  blue: "rgb(96 165 250 / 0.28)",
} as const;

/**
 * Soft pool of colour behind the cards, so the glass has something to blur.
 * Position and size come from `className`.
 */
export function Blob({
  tone,
  className,
}: {
  tone: keyof typeof BLOB_COLORS;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        background: `radial-gradient(circle, ${BLOB_COLORS[tone]}, transparent 66%)`,
      }}
    />
  );
}

type IconTileProps = {
  icon: LucideIcon;
  size?: "sm" | "md";
  /** `brand` is the violet-to-blue gradient; `neutral` is quiet glass. */
  tone?: "brand" | "neutral";
  className?: string;
};

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "brand",
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center",
        size === "sm" ? "size-7 rounded-md" : "size-9 rounded-lg",
        tone === "brand"
          ? "bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
          : "border border-white/10 bg-white/[0.08] text-foreground",
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
