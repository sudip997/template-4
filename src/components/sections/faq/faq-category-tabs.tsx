"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";

import type { FaqCategory } from "./data";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getIsDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;
const getServerIsDesktop = () => false;

type FaqCategoryTabsProps = {
  categories: readonly FaqCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Prefix shared with the explorer so tabs and panel can reference each other. */
  idPrefix: string;
};

/** Ids that tie a tab to the single tab panel. Shared with the explorer. */
export const tabId = (idPrefix: string, categoryId: string) =>
  `${idPrefix}-tab-${categoryId}`;
export const panelId = (idPrefix: string) => `${idPrefix}-panel`;

/**
 * Category switcher following the ARIA tabs pattern: roving tabindex, arrow
 * keys, Home and End, and the selected tab activates as it receives focus.
 * Below `lg` it is a horizontally scrolling row of pills; from `lg` up it is
 * a vertical rail. A highlight glides between tabs (instant for reduced motion).
 */
export function FaqCategoryTabs({
  categories,
  activeId,
  onSelect,
  idPrefix,
}: FaqCategoryTabsProps) {
  const reduceMotion = useReducedMotion();
  const highlightId = useId();
  const isDesktop = useSyncExternalStore(
    subscribeToViewport,
    getIsDesktop,
    getServerIsDesktop,
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activate = (index: number) => {
    const next = categories[index];
    if (!next) return;

    onSelect(next.id);

    const element = tabRefs.current[next.id];
    element?.focus({ preventScroll: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = categories.length;
    const current = categories.findIndex((category) => category.id === activeId);

    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (current + 1) % count;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (current - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
    }

    if (next === null) return;
    event.preventDefault();
    activate(next);
  };

  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      aria-orientation={isDesktop ? "vertical" : "horizontal"}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:flex lg:flex-col lg:gap-1.5"
    >
      {categories.map((category, index) => {
        const selected = category.id === activeId;
        const Icon = category.icon;

        return (
          <button
            key={category.id}
            ref={(element) => {
              tabRefs.current[category.id] = element;
            }}
            type="button"
            role="tab"
            id={tabId(idPrefix, category.id)}
            aria-selected={selected}
            aria-controls={panelId(idPrefix)}
            tabIndex={selected ? 0 : -1}
            onClick={() => activate(index)}
            className={cn(
              "group relative flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-card/50 py-1.5 pr-2.5 pl-1.5 text-left text-sm font-medium outline-none sm:gap-2.5 sm:pr-3 lg:min-h-0 transition-colors duration-200 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none lg:w-full lg:gap-3.5 lg:border-transparent lg:bg-transparent lg:py-2.5 lg:pr-4 lg:pl-2.5",
              selected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground lg:hover:bg-white/[0.04]",
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${highlightId}-highlight`}
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-linear-to-br from-brand-violet/25 to-brand-blue/15 shadow-[inset_0_0_0_1px_rgb(167_139_250/0.35),inset_0_1px_0_0_rgb(255_255_255/0.12)]"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 38 }
                }
              />
            ) : null}

            <span
              aria-hidden="true"
              className={cn(
                "relative grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-200 motion-reduce:transition-none lg:size-9",
                selected
                  ? "bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
                  : "border border-white/10 bg-white/[0.04] text-foreground/80 group-hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 lg:size-4" strokeWidth={2.1} />
            </span>

            <span className="relative min-w-0">
              <span className="block leading-[1.2] text-balance lg:leading-5">
                {category.label}
              </span>
              <span className="hidden text-xs leading-4 font-normal text-muted-foreground lg:block">
                {category.items.length} questions
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
