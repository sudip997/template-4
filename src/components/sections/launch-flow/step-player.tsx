"use client";

import { useId, useRef, type KeyboardEvent } from "react";

import { Stage } from "./stage";
import { StepItem } from "./step-item";
import { STEPS, STEP_DURATION } from "./steps";
import { useAutoplay } from "./use-autoplay";

/**
 * The interactive part of the section: a list of steps on the left and the
 * matching animated diagram on the right.
 *
 * It advances on its own (each step's bar fills, then the next step starts and
 * the diagram changes) and loops. Clicking a step jumps to it and restarts its
 * bar. It follows the ARIA tabs pattern, so arrow keys, Home and End work too.
 */
export function StepPlayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const { active, progress, paused, autoplay, select, togglePaused } =
    useAutoplay({
      count: STEPS.length,
      duration: STEP_DURATION,
      targetRef: rootRef,
    });

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = STEPS.length - 1;
    let next: number;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = active === last ? 0 : active + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = active === 0 ? last : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14"
    >
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Launch flow steps"
          onKeyDown={handleKeyDown}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl"
        >
          {STEPS.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              index={index}
              isLast={index === STEPS.length - 1}
              active={index === active}
              progress={progress}
              showProgress={autoplay}
              tabId={tabId(index)}
              panelId={panelId}
              tabRef={(element) => {
                tabRefs.current[index] = element;
              }}
              onSelect={() => select(index)}
            />
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-7">
        <Stage
          active={active}
          progress={progress}
          paused={paused}
          showControl={autoplay}
          onTogglePaused={togglePaused}
          panelId={panelId}
          activeTabId={tabId(active)}
        />
      </div>
    </div>
  );
}
