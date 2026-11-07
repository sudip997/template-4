"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  CalendarDays,
  Check,
  FileText,
  Mail,
  Megaphone,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { VisualProps } from "./types";
import {
  Blob,
  CANVAS,
  GLASS,
  GLASS_SHADOW,
  IconTile,
  MiniChip,
} from "./visual-ui";

type WithProgress = { progress: MotionValue<number> };

// Layout, in canvas pixels.
const MID_Y = 155;
const CARD_W = 112;
const CARD_H = 112;
const CARD_TOP = MID_Y - CARD_H / 2;
const CARD_XS = [16, 152, 288] as const;
const PILL_X = 424;
const PILL_W = 120;
const PILL_H = 40;
const CAL_LABEL_TOP = 256;
const CAL_TOP = 284;
const CAL_X = 32;
const CAL_CELL_W = 64;
const CAL_CELL_H = 64;
const CAL_GAP = 8;

type Stage = { title: string; icon: LucideIcon; at: number };

/** `at` is the progress at which the post reaches that stage. */
const STAGES: readonly Stage[] = [
  { title: "Draft", icon: FileText, at: 0.04 },
  { title: "AI review", icon: Sparkles, at: 0.26 },
  { title: "Schedule", icon: CalendarDays, at: 0.48 },
];

type Destination = { name: string; icon: LucideIcon; y: number };

const DESTINATIONS: readonly Destination[] = [
  { name: "Email", icon: Mail, y: 103 },
  { name: "Social", icon: Megaphone, y: 155 },
  { name: "Search", icon: Search, y: 207 },
];

const PUBLISH_AT = 0.78;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const BASE_DOTS = [1, 1, 2, 1, 2, 0, 0] as const;
const TUESDAY = 1;
const SCHEDULED_AT = 0.6;

const LINK_FROM = CARD_XS[0] + CARD_W;
const LINK_TO = PILL_X;

function StageCard({
  progress,
  index,
  stage,
  children,
}: WithProgress & { index: number; stage: Stage; children: ReactNode }) {
  const enter = index * 0.03;
  const opacity = useTransform(progress, [enter, enter + 0.08], [0, 1]);
  const y = useTransform(progress, [enter, enter + 0.08], [14, 0]);
  const lit = useTransform(progress, [stage.at, stage.at + 0.06], [0, 1]);
  const done = useTransform(progress, [stage.at + 0.14, stage.at + 0.18], [0, 1]);

  return (
    <motion.div
      className={cn("absolute rounded-xl p-2.5", GLASS, GLASS_SHADOW)}
      style={{
        left: CARD_XS[index],
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        opacity,
        y,
      }}
    >
      <div className="flex items-start justify-between">
        <IconTile icon={stage.icon} size="sm" />
        <motion.span
          className="grid size-[18px] place-items-center rounded-full bg-brand-violet/20 text-brand-violet"
          style={{ opacity: done }}
        >
          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
        </motion.span>
      </div>
      <p className="mt-2 font-heading text-[13px] leading-5 font-semibold text-foreground">
        {stage.title}
      </p>
      <div className="mt-1">{children}</div>

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-brand-violet/55 shadow-[0_0_32px_-8px_rgb(167_139_250/0.6)]"
        style={{ opacity: lit }}
      />
    </motion.div>
  );
}

function DraftMeta({ progress }: WithProgress) {
  const first = useTransform(progress, [0.06, 0.16], [0, 1]);
  const second = useTransform(progress, [0.12, 0.22], [0, 1]);
  return (
    <div className="mt-2.5 space-y-1.5">
      <motion.span
        className="block h-1.5 w-full origin-left rounded-full bg-white/25"
        style={{ scaleX: first }}
      />
      <motion.span
        className="block h-1.5 w-2/3 origin-left rounded-full bg-white/15"
        style={{ scaleX: second }}
      />
    </div>
  );
}

function RevealChip({
  progress,
  at,
  children,
}: WithProgress & { at: number; children: ReactNode }) {
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1]);
  const y = useTransform(progress, [at, at + 0.05], [4, 0]);
  return (
    <motion.span className="inline-block" style={{ opacity, y }}>
      <MiniChip>{children}</MiniChip>
    </motion.span>
  );
}

/** A connector that draws itself between two points, with a dot at the end. */
function Link({
  progress,
  d,
  endX,
  endY,
  from,
  to,
}: WithProgress & {
  d: string;
  endX: number;
  endY: number;
  from: number;
  to: number;
}) {
  const draw = useTransform(progress, [from, to], [0, 1]);
  const visible = useTransform(progress, [from, from + 0.005], [0, 1]);
  const dot = useTransform(progress, [to - 0.02, to], [0, 1]);

  return (
    <>
      <path
        d={d}
        stroke="rgb(255 255 255 / 0.1)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <motion.path
        d={d}
        stroke="url(#publish-link)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.circle
        cx={endX}
        cy={endY}
        r="3"
        style={{ opacity: dot, fill: "var(--brand-blue)" }}
      />
    </>
  );
}

function DestinationPill({
  progress,
  index,
  destination,
}: WithProgress & { index: number; destination: Destination }) {
  const Icon = destination.icon;
  const at = PUBLISH_AT + index * 0.04;
  const enter = 0.04 + index * 0.03;

  const opacity = useTransform(progress, [enter, enter + 0.08], [0, 1]);
  const x = useTransform(progress, [enter, enter + 0.08], [10, 0]);
  const dim = useTransform(progress, [at - 0.04, at], [0.55, 1]);
  const lit = useTransform(progress, [at, at + 0.05], [0, 1]);

  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-2.5 rounded-xl px-3",
        GLASS,
        GLASS_SHADOW,
      )}
      style={{
        left: PILL_X,
        top: destination.y - PILL_H / 2,
        width: PILL_W,
        height: PILL_H,
        opacity,
        x,
      }}
    >
      <motion.span
        className="flex min-w-0 flex-1 items-center gap-2"
        style={{ opacity: dim }}
      >
        <Icon
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="text-[13px] font-medium text-foreground">
          {destination.name}
        </span>
      </motion.span>
      <motion.span
        className="grid size-5 place-items-center rounded-full bg-brand-gradient text-background"
        style={{ opacity: lit }}
      >
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-brand-blue/50 shadow-[0_0_28px_-8px_rgb(96_165_250/0.6)]"
        style={{ opacity: lit }}
      />
    </motion.div>
  );
}

function DayCell({
  progress,
  index,
}: WithProgress & { index: number }) {
  const enter = 0.05 + index * 0.015;
  const opacity = useTransform(progress, [enter, enter + 0.08], [0, 1]);
  const lit = useTransform(
    progress,
    [SCHEDULED_AT, SCHEDULED_AT + 0.06],
    [0, 1],
  );
  const isTuesday = index === TUESDAY;
  const baseDots = BASE_DOTS[index];

  return (
    <motion.div
      className={cn(
        "absolute flex flex-col justify-between rounded-xl p-2.5",
        GLASS,
      )}
      style={{
        left: CAL_X + index * (CAL_CELL_W + CAL_GAP),
        top: CAL_TOP,
        width: CAL_CELL_W,
        height: CAL_CELL_H,
        opacity,
      }}
    >
      <span className="text-xs text-muted-foreground">{DAYS[index]}</span>
      <span className="flex gap-1">
        {Array.from({ length: baseDots }, (_, dot) => (
          <span key={dot} className="size-1.5 rounded-full bg-white/25" />
        ))}
        {isTuesday &&
          [0, 1, 2].map((dot) => (
            <TuesdayDot key={dot} progress={progress} order={dot} />
          ))}
      </span>

      {isTuesday && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-brand-violet/30 to-brand-blue/20 ring-1 ring-brand-violet/60 shadow-[0_0_32px_-8px_rgb(167_139_250/0.7)]"
          style={{ opacity: lit }}
        />
      )}
    </motion.div>
  );
}

function TuesdayDot({
  progress,
  order,
}: WithProgress & { order: number }) {
  const at = SCHEDULED_AT + order * 0.03;
  const opacity = useTransform(progress, [at, at + 0.04], [0, 1]);
  return (
    <motion.span
      className="relative z-10 size-1.5 rounded-full bg-brand-gradient"
      style={{ opacity }}
    />
  );
}

function CalendarHeader({ progress }: WithProgress) {
  const opacity = useTransform(progress, [0.04, 0.12], [0, 1]);
  return (
    <motion.div
      className="absolute flex items-center justify-between"
      style={{
        left: CAL_X,
        top: CAL_LABEL_TOP,
        width: 7 * CAL_CELL_W + 6 * CAL_GAP,
        opacity,
      }}
    >
      <span className="text-xs text-muted-foreground">This week</span>
      <RevealChip progress={progress} at={SCHEDULED_AT + 0.04}>
        3 posts queued
      </RevealChip>
    </motion.div>
  );
}

/**
 * Step two: a post moves left to right through Draft, AI review and Schedule,
 * fans out to every destination, and lands on Tuesday in the weekly calendar.
 */
export function PublishVisual({ progress }: VisualProps) {
  const links: ReadonlyArray<{
    d: string;
    endX: number;
    endY: number;
    from: number;
    to: number;
  }> = [
    {
      d: `M${CARD_XS[0] + CARD_W} ${MID_Y} H${CARD_XS[1]}`,
      endX: CARD_XS[1],
      endY: MID_Y,
      from: 0.14,
      to: 0.22,
    },
    {
      d: `M${CARD_XS[1] + CARD_W} ${MID_Y} H${CARD_XS[2]}`,
      endX: CARD_XS[2],
      endY: MID_Y,
      from: 0.36,
      to: 0.44,
    },
    ...DESTINATIONS.map((destination) => {
      const startX = CARD_XS[2] + CARD_W;
      const bend = (PILL_X - startX) / 2;
      return {
        d:
          destination.y === MID_Y
            ? `M${startX} ${MID_Y} H${PILL_X}`
            : `M${startX} ${MID_Y} C${startX + bend} ${MID_Y} ${startX + bend} ${destination.y} ${PILL_X} ${destination.y}`,
        endX: PILL_X,
        endY: destination.y,
        from: 0.58,
        to: 0.68,
      };
    }),
  ];

  return (
    <div className="absolute inset-0">
      <Blob tone="blue" className="-top-20 -left-12 size-96" />
      <Blob tone="violet" className="-right-16 -bottom-24 size-[26rem]" />

      <svg
        className="absolute inset-0"
        width={CANVAS.width}
        height={CANVAS.height}
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="publish-link"
            gradientUnits="userSpaceOnUse"
            x1={LINK_FROM}
            y1="0"
            x2={LINK_TO}
            y2="0"
          >
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>
        {links.map((link) => (
          <Link key={link.d} progress={progress} {...link} />
        ))}
      </svg>

      <StageCard progress={progress} index={0} stage={STAGES[0]}>
        <DraftMeta progress={progress} />
      </StageCard>
      <StageCard progress={progress} index={1} stage={STAGES[1]}>
        <RevealChip progress={progress} at={0.32}>
          +18% reach
        </RevealChip>
      </StageCard>
      <StageCard progress={progress} index={2} stage={STAGES[2]}>
        <RevealChip progress={progress} at={0.54}>
          Tue 10:00
        </RevealChip>
      </StageCard>

      {DESTINATIONS.map((destination, index) => (
        <DestinationPill
          key={destination.name}
          progress={progress}
          index={index}
          destination={destination}
        />
      ))}

      <CalendarHeader progress={progress} />
      {DAYS.map((day, index) => (
        <DayCell key={day} progress={progress} index={index} />
      ))}
    </div>
  );
}
