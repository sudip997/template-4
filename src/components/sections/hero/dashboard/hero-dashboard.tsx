"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Check, Sparkles, TrendingUp } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import { Chip, FauxButton, FloatingCard } from "./dashboard-ui";
import { DashboardShell } from "./dashboard-shell";
import { DashboardView } from "./dashboard-view";

const SPARKLINE = "0,30 14,26 28,28 42,19 56,22 70,13 84,16 98,7 112,4";

/** Light that spills out around the window, so it reads as lit from behind. */
function DashboardGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-[16%] -inset-y-[26%] -z-10"
      style={{
        background: [
          "radial-gradient(ellipse 40% 30% at 50% 27%, rgb(167 139 250 / 0.36), transparent 72%)",
          "radial-gradient(ellipse 38% 42% at 22% 62%, rgb(167 139 250 / 0.38), transparent 72%)",
          "radial-gradient(ellipse 36% 42% at 78% 46%, rgb(96 165 250 / 0.36), transparent 72%)",
        ].join(", "),
      }}
    />
  );
}

function AiSuggestionCard() {
  return (
    <FloatingCard
      delay={0.1}
      className="-top-6 -right-4 w-[272px] xl:-right-10"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-medium text-foreground">
          <span className="grid size-6 place-items-center rounded-md bg-brand-gradient text-background">
            <Sparkles className="size-3.5" strokeWidth={2.2} />
          </span>
          AI planner
        </span>
        <Chip tone="violet">Suggestion</Chip>
      </div>
      <p className="mt-3 text-[13px] leading-snug text-foreground">
        Move the live demo to Tuesday, 10:00. Projected{" "}
        <span className="font-semibold text-brand-blue">
          +18% registrations
        </span>
        .
      </p>
      <div className="mt-3.5 flex gap-2">
        <FauxButton>Apply</FauxButton>
        <FauxButton variant="ghost">Dismiss</FauxButton>
      </div>
    </FloatingCard>
  );
}

function ScheduledCard() {
  return (
    <FloatingCard
      delay={0.25}
      className="top-[66%] -left-4 flex w-[250px] items-center gap-3 xl:-left-10"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-background">
        <Check className="size-4" strokeWidth={2.6} />
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] font-medium text-foreground">
          Scheduled
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          3 posts queued for Tuesday
        </span>
      </span>
    </FloatingCard>
  );
}

function TopPerformerCard() {
  return (
    <FloatingCard
      delay={0.4}
      className="top-[56%] -right-4 w-[240px] xl:-right-10"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Top performer</span>
        <Chip tone="violet">
          <TrendingUp className="size-3" />
          Email
        </Chip>
      </div>
      <p className="mt-2 font-heading text-2xl leading-none font-semibold tracking-tight text-foreground">
        4.9x{" "}
        <span className="text-sm font-normal text-muted-foreground">ROAS</span>
      </p>
      <svg
        viewBox="0 0 112 34"
        className="mt-3 h-9 w-full"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-sparkline" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>
        <polyline
          points={SPARKLINE}
          stroke="url(#hero-sparkline)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </FloatingCard>
  );
}

/**
 * The product preview that closes the Hero: one large dashboard window with
 * floating cards layered over it, lit from behind. It starts tilted back and
 * flattens as it scrolls into view; the bottom fades into the page.
 *
 * Decorative, so it is exposed to assistive technology as a single labelled image.
 */
export function HeroDashboard({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "start 40%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);

  return (
    <div className={cn("relative", className)} style={{ perspective: 1800 }}>
      <DashboardGlow />

      <motion.div
        ref={stageRef}
        role="img"
        aria-label="Preview of the Vantora dashboard: a campaign timeline across six channels, an AI suggestion to move a webinar, a confirmation that three posts are scheduled, and email shown as the top-performing channel."
        className="relative mx-auto max-w-[1120px]"
        style={
          reduceMotion
            ? undefined
            : { rotateX, scale, y, transformOrigin: "50% 0%" }
        }
      >
        <div className="[mask-image:linear-gradient(to_bottom,#000_58%,transparent_100%)]">
          <DashboardShell
            activeNav="campaigns"
            address="app.vantora.com/campaigns/spring-launch"
          >
            <DashboardView />
          </DashboardShell>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <AiSuggestionCard />
          <ScheduledCard />
          <TopPerformerCard />
        </div>
      </motion.div>
    </div>
  );
}
