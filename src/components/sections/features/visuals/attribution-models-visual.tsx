"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useId, useRef, useState } from "react";

import { IconTile } from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

import {
  ATTRIBUTED_REVENUE,
  DEFAULT_MODEL,
  MODELS,
  TOUCHES,
  type AttributionModel,
  type ModelId,
} from "./attribution-models-data";

const SWITCH_SPRING = { type: "spring", stiffness: 420, damping: 42 } as const;
const COLUMN_SPRING = { type: "spring", stiffness: 170, damping: 22 } as const;

const MONEY = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/** Dollar figure for a share of the attributed revenue, like "$130.9k". */
const creditValue = (percent: number) =>
  `$${MONEY.format((ATTRIBUTED_REVENUE * percent) / 100 / 1000)}k`;

/** The one-line result shown under the chart. */
function headline(model: AttributionModel): string {
  const top = Math.max(...model.credit);
  const leaders = model.credit.flatMap((credit, index) =>
    credit === top ? [index] : [],
  );

  if (leaders.length > 1) {
    return `Every touch earns an equal ${top}%, about ${creditValue(top)} each`;
  }
  return `${TOUCHES[leaders[0]].channel} earns ${top}% of the credit, about ${creditValue(top)}`;
}

/**
 * Visual for the attribution card: a working model switch above a column chart
 * of one customer journey. Changing the model re-weights the credit each touch
 * receives. The columns rise once when the card scrolls into view; after that
 * only the switch drives change. With reduced motion everything is instant.
 */
export function AttributionModelsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const groupName = useId();
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ready = Boolean(reduceMotion) || inView;

  const [modelId, setModelId] = useState<ModelId>(DEFAULT_MODEL);
  const model = MODELS.find((item) => item.id === modelId) ?? MODELS[0];
  const top = Math.max(...model.credit);

  return (
    <div ref={ref} className="px-6 sm:px-8">
      <div className="rounded-t-xl border-x border-t border-white/10 bg-surface-2/70 p-4 pb-7 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:p-5 sm:pb-8">
        {/* Model switch: native radio buttons, so the arrow keys just work. */}
        <fieldset className="min-w-0">
          <legend className="mb-2 text-xs text-muted-foreground">
            Attribution model
          </legend>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/50 p-1 min-[420px]:grid-cols-4">
            {MODELS.map((item) => {
              const selected = item.id === modelId;
              return (
                <label key={item.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name={groupName}
                    value={item.id}
                    checked={selected}
                    onChange={() => setModelId(item.id)}
                    aria-label={item.name}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "relative block rounded-md px-2 py-1.5 text-center text-xs font-medium whitespace-nowrap transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                      selected
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${groupName}-highlight`}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-white/[0.08] ring-1 ring-brand-violet/40"
                        transition={
                          reduceMotion ? { duration: 0 } : SWITCH_SPRING
                        }
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Credit per touch */}
        <div
          className={cn(
            "mt-5 transition-opacity duration-500 motion-reduce:transition-none",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <p className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Credit per touch</span>
            <span className="flex items-center gap-1" aria-hidden="true">
              First touch
              <ArrowRight className="size-3" />
              Purchase
            </span>
          </p>

          <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
            {TOUCHES.map((touch, index) => {
              const credit = model.credit[index];
              const leading = credit === top;

              return (
                <li key={touch.channel} className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "font-heading text-base leading-none font-semibold tabular-nums transition-colors duration-300 sm:text-lg",
                      leading ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="sr-only">{touch.channel} credit: </span>
                    {credit}%
                  </span>

                  <div
                    aria-hidden="true"
                    className="flex h-32 w-full items-end justify-center rounded-md bg-white/[0.03] sm:h-36"
                  >
                    <motion.span
                      className="relative block min-h-1 w-full max-w-11 overflow-hidden rounded-t-md bg-white/20"
                      initial={reduceMotion ? false : { height: "0%" }}
                      animate={{ height: ready ? `${credit}%` : "0%" }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { ...COLUMN_SPRING, delay: index * 0.05 }
                      }
                    >
                      <span
                        className={cn(
                          "absolute inset-0 bg-linear-to-t from-brand-violet to-brand-blue transition-opacity duration-300 motion-reduce:transition-none",
                          leading ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </motion.span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <IconTile
                      icon={touch.icon}
                      size="sm"
                      tone={leading ? "accent" : "neutral"}
                    />
                    <span className="text-xs leading-tight font-medium text-foreground">
                      {touch.channel}
                    </span>
                    <span className="hidden text-[11px] leading-tight text-muted-foreground sm:block">
                      {touch.touchpoint}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Result, announced when the model changes. Height is reserved so the
            card doesn't jump between models. */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-5 min-h-[5.25rem] border-t border-white/[0.08] pt-4 sm:min-h-[4.5rem]"
        >
          <span className="block text-sm leading-snug font-medium text-foreground">
            {headline(model)}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
            {model.description}
          </span>
        </p>
      </div>
    </div>
  );
}
