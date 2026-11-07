"use client";

import type { MotionValue } from "motion/react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import { ScaledCanvas } from "./scaled-canvas";
import { STEPS, type Step } from "./steps";
import { useGatedProgress } from "./use-gated-progress";
import { CANVAS } from "./visuals/visual-ui";

/** One lighting recipe per step, cross-faded behind the diagrams. */
const LIGHTING = [
  "radial-gradient(ellipse 60% 55% at 86% 8%, rgb(167 139 250 / 0.3), transparent 70%), radial-gradient(ellipse 50% 50% at 6% 96%, rgb(96 165 250 / 0.2), transparent 70%)",
  "radial-gradient(ellipse 56% 55% at 50% 0%, rgb(96 165 250 / 0.28), transparent 70%), radial-gradient(ellipse 56% 50% at 92% 100%, rgb(167 139 250 / 0.24), transparent 70%)",
  "radial-gradient(ellipse 56% 55% at 12% 6%, rgb(167 139 250 / 0.28), transparent 70%), radial-gradient(ellipse 60% 55% at 94% 90%, rgb(96 165 250 / 0.26), transparent 70%)",
] as const;

type VisualSlotProps = {
  step: Step;
  active: boolean;
  progress: MotionValue<number>;
};

/**
 * Hosts one diagram. All diagrams stay mounted and stacked; only the active one
 * is visible and follows the clock, so switching is a CSS cross-fade.
 */
function VisualSlot({ step, active, progress }: VisualSlotProps) {
  const gated = useGatedProgress(progress, active);
  const { Visual } = step;

  return (
    <div
      role={active ? "img" : undefined}
      aria-label={active ? step.visualLabel : undefined}
      aria-hidden={active ? undefined : true}
      className={cn(
        "absolute inset-0 transition-[opacity,visibility,transform] duration-500 ease-out motion-reduce:transition-none",
        active ? "visible opacity-100" : "invisible scale-[0.98] opacity-0",
      )}
    >
      <Visual progress={gated} />
    </div>
  );
}

type StageProps = {
  active: number;
  progress: MotionValue<number>;
  paused: boolean;
  /** Show the pause/play control (hidden when autoplay is off). */
  showControl: boolean;
  onTogglePaused: () => void;
  panelId: string;
  activeTabId: string;
};

/** Frosted-glass window that holds the animated diagram for the active step. */
export function Stage({
  active,
  progress,
  paused,
  showControl,
  onTogglePaused,
  panelId,
  activeTabId,
}: StageProps) {
  return (
    <div className="relative">
      {/* Light spilling out from behind the glass. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[10%] -inset-y-[16%] -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 46% 40% at 70% 28%, rgb(167 139 250 / 0.3), transparent 72%)",
            "radial-gradient(ellipse 42% 44% at 26% 76%, rgb(96 165 250 / 0.26), transparent 72%)",
          ].join(", "),
        }}
      />

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={activeTabId}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.07] to-white/[0.02] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.08)] backdrop-blur-2xl before:absolute before:inset-x-16 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-brand-violet/80 before:to-transparent"
      >
        {LIGHTING.map((background, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
              index === active ? "opacity-100" : "opacity-0",
            )}
            style={{ background }}
          />
        ))}

        <ScaledCanvas width={CANVAS.width} height={CANVAS.height}>
          {STEPS.map((step, index) => (
            <VisualSlot
              key={step.id}
              step={step}
              active={index === active}
              progress={progress}
            />
          ))}
        </ScaledCanvas>
      </div>

      {showControl && (
        <button
          type="button"
          onClick={onTogglePaused}
          aria-label={paused ? "Play step animation" : "Pause step animation"}
          className="absolute right-3 bottom-3 z-20 grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-foreground backdrop-blur-md outline-none transition-colors hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-ring"
        >
          {paused ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
