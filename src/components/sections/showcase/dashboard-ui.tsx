"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ClassNameProp = { className?: string };

/** Inset surface used for the cards inside the dashboard window. */
export function Panel({
  className,
  children,
}: ClassNameProp & { children: ReactNode }) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-background/40", className)}
    >
      {children}
    </div>
  );
}

const CHIP_TONES = {
  blue: "bg-brand-blue/10 text-brand-blue",
  violet: "bg-brand-violet/10 text-brand-violet",
  muted: "bg-secondary text-muted-foreground",
} as const;

export type ChipTone = keyof typeof CHIP_TONES;

export function Chip({
  tone = "blue",
  className,
  children,
}: ClassNameProp & { tone?: ChipTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap sm:text-[11px]",
        CHIP_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A button-shaped label. The dashboard is an illustration, so these are
 * deliberately not real buttons and never take keyboard focus.
 */
export function FauxButton({
  variant = "primary",
  className,
  children,
}: ClassNameProp & { variant?: "primary" | "ghost"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] whitespace-nowrap",
        variant === "primary"
          ? "bg-brand-gradient font-semibold text-background"
          : "border border-border font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

type StatTileProps = { label: string; value: string; delta?: string };

export function StatTile({ label, value, delta }: StatTileProps) {
  return (
    <Panel className="p-3 sm:p-3.5">
      <p className="text-[11px] text-muted-foreground sm:text-xs">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="font-heading text-base font-semibold tracking-tight tabular-nums text-foreground sm:text-xl">
          {value}
        </p>
        {delta ? <Chip>{delta}</Chip> : null}
      </div>
    </Panel>
  );
}

type FloatingCardProps = ClassNameProp & { delay?: number; children: ReactNode };

/**
 * Elevated card that overlaps the dashboard window. Only shown from `lg` up,
 * where there is room for it to hang over the window edge.
 */
export function FloatingCard({
  className,
  delay = 0,
  children,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "absolute rounded-xl border border-border bg-secondary p-4 shadow-[0_28px_56px_-18px] shadow-black/80 max-lg:hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
