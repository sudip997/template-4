"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FaqItem as FaqItemData } from "./data";

type FaqItemProps = {
  item: FaqItemData;
  open: boolean;
  onToggle: () => void;
  /** Unique per rendered item, used to wire the button to its answer. */
  idPrefix: string;
};

/**
 * One question. The heading wraps a real button (`aria-expanded` and
 * `aria-controls`), and the answer is a labelled region that grows with
 * Motion. When the user prefers reduced motion the answer simply appears.
 * An open item is lit with a violet border and a soft violet and blue wash.
 */
export function FaqItem({ item, open, onToggle, idPrefix }: FaqItemProps) {
  const reduceMotion = useReducedMotion();
  const buttonId = `${idPrefix}-question`;
  const panelId = `${idPrefix}-answer`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-300 motion-reduce:transition-none",
        open
          ? "border-brand-violet/30 bg-card bg-linear-to-br from-brand-violet/[0.09] via-transparent to-brand-blue/[0.05] shadow-[0_24px_60px_-34px_rgb(167_139_250/0.45),inset_0_1px_0_0_rgb(255_255_255/0.06)]"
          : "border-white/10 bg-card/70 hover:border-white/20 hover:bg-card",
      )}
    >
      {open ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/60 to-transparent"
        />
      ) : null}

      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6 sm:py-[1.125rem]"
        >
          <span
            className={cn(
              "font-heading text-[15px] leading-snug font-medium tracking-[-0.015em] text-pretty transition-colors duration-200 motion-reduce:transition-none sm:text-base",
              open
                ? "text-foreground"
                : "text-foreground/90 group-hover:text-foreground",
            )}
          >
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300 motion-reduce:transition-none",
              open
                ? "bg-brand-gradient text-background"
                : "border border-white/10 bg-white/[0.04] text-muted-foreground group-hover:text-foreground",
            )}
          >
            <Plus
              className={cn(
                "size-4 transition-transform duration-300 motion-reduce:transition-none",
                open && "rotate-45",
              )}
              strokeWidth={2.2}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] px-5 pr-14 pb-5 text-[15px] leading-relaxed text-pretty text-muted-foreground sm:px-6 sm:pr-16 sm:pb-6">
              {item.answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
