"use client";

import type { MotionValue } from "motion/react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import { ScaledCanvas } from "./scaled-canvas";
import { STEPS, type Step } from "./steps";
import { useGatedProgress } from "./use-gated-progress";
import { CANVAS } from "./visuals/visual-ui";

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
        "absolute inset-0 transition-[opacity,visibility] duration-500 ease-out motion-reduce:transition-none",
        active ? "visible opacity-100" : "invisible opacity-0",
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

/** Dark panel that holds the animated diagram for the active step. */
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
      {/* One faint pool of violet behind the panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[8%] -inset-y-[12%] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 44% at 60% 40%, rgb(167 139 250 / 0.1), transparent 72%)",
        }}
      />

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={activeTabId}
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8)]"
      >
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
          className="absolute right-3 bottom-3 z-20 grid size-9 place-items-center rounded-full border border-border bg-surface-2 text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
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
