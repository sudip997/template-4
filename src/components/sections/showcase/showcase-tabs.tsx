"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useId,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";

import { DashboardShell } from "./dashboard-shell";
import { SHOWCASE_TABS, type ShowcaseTabId } from "./tabs-data";
import { MeasureFloaters, MeasureView } from "./views/measure-view";
import { PlanFloaters, PlanView } from "./views/plan-view";
import { PublishFloaters, PublishView } from "./views/publish-view";

type TabView = { Body: ComponentType; Floaters: ComponentType };

const VIEWS: Record<ShowcaseTabId, TabView> = {
  plan: { Body: PlanView, Floaters: PlanFloaters },
  publish: { Body: PublishView, Floaters: PublishFloaters },
  measure: { Body: MeasureView, Floaters: MeasureFloaters },
};

/** Horizontal offset of the blue glow, so the light drifts with the selected tab. */
const GLOW_SHIFT: Record<ShowcaseTabId, string> = {
  plan: "-16%",
  publish: "0%",
  measure: "16%",
};

const EASE = [0.22, 1, 0.36, 1] as const;

function DashboardGlow({ active }: { active: ShowcaseTabId }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-[18%] -inset-y-[30%] -z-10"
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 46% 34% at 50% 20%, rgb(167 139 250 / 0.34), transparent 72%)",
            "radial-gradient(ellipse 40% 44% at 24% 66%, rgb(167 139 250 / 0.42), transparent 72%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{
          transform: `translateX(${GLOW_SHIFT[active]})`,
          background:
            "radial-gradient(ellipse 36% 42% at 74% 44%, rgb(96 165 250 / 0.4), transparent 72%)",
        }}
      />
    </div>
  );
}

export function ShowcaseTabs() {
  const [activeId, setActiveId] = useState<ShowcaseTabId>("plan");
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // The window starts tilted back and flattens as it scrolls into view.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "start 35%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [44, 0]);

  const activeIndex = SHOWCASE_TABS.findIndex((tab) => tab.id === activeId);
  const activeTab = SHOWCASE_TABS[activeIndex];
  const { Body, Floaters } = VIEWS[activeId];

  const tabId = (id: ShowcaseTabId) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  const selectIndex = (index: number) => {
    setActiveId(SHOWCASE_TABS[index].id);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = SHOWCASE_TABS.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = activeIndex === last ? 0 : activeIndex + 1;
        break;
      case "ArrowLeft":
        next = activeIndex === 0 ? last : activeIndex - 1;
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
    selectIndex(next);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="tablist"
        aria-label="Product tour steps"
        onKeyDown={handleKeyDown}
        className="mx-auto grid max-w-[1120px] grid-cols-3 gap-2 sm:gap-3"
      >
        {SHOWCASE_TABS.map((tab, index) => {
          const selected = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "group relative flex flex-col items-start rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-4",
                selected
                  ? "border-brand-violet/40 bg-card"
                  : "border-border bg-card/40 hover:border-foreground/20 hover:bg-card/70",
              )}
            >
              {selected ? (
                <>
                  <motion.span
                    layoutId={`${baseId}-tab-glow`}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-linear-to-b from-brand-violet/12 to-transparent"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                  <motion.span
                    layoutId={`${baseId}-tab-line`}
                    aria-hidden="true"
                    className="absolute inset-x-5 -top-px h-px bg-linear-to-r from-transparent via-brand-violet to-transparent"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </>
              ) : null}

              <span className="relative flex w-full items-center justify-between">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg transition-colors sm:size-9",
                    selected
                      ? "bg-brand-gradient text-background"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {tab.step}
                </span>
              </span>
              <span className="relative mt-3 block font-heading text-sm font-semibold text-foreground sm:text-base">
                {tab.label}
              </span>
              <span className="relative mt-1 hidden text-sm leading-snug text-muted-foreground md:block">
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground md:hidden">
        {activeTab.description}
      </p>

      <div className="relative mt-8 sm:mt-10 lg:mt-12" style={{ perspective: 1800 }}>
        <DashboardGlow active={activeId} />

        <motion.div
          ref={stageRef}
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(activeId)}
          className="relative mx-auto max-w-[1120px]"
          style={
            reduceMotion
              ? undefined
              : { rotateX, scale, y, transformOrigin: "50% 0%" }
          }
        >
          <p className="sr-only">{activeTab.summary}</p>

          <div aria-hidden="true">
            <DashboardShell activeNav={activeTab.nav} address={activeTab.address}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeId}
                  className="h-full"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <Body />
                </motion.div>
              </AnimatePresence>
            </DashboardShell>

            <div className="pointer-events-none absolute inset-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeId}
                  className="absolute inset-0"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Floaters />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
