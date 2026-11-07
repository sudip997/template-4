"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  Activity,
  Check,
  Mail,
  Megaphone,
  Search,
  Target,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { VisualProps } from "./types";
import { Blob, CANVAS, GLASS, GLASS_SHADOW, IconTile } from "./visual-ui";

const GOAL = "Grow demo signups 30% this quarter";
/** The goal has finished typing by this point in the step. */
const GOAL_TYPED_BY = 0.12;

type Channel = { name: string; detail: string; icon: LucideIcon };

const CHANNELS: readonly Channel[] = [
  { name: "Email", detail: "12.4k subscribers", icon: Mail },
  { name: "Paid social", detail: "3 ad accounts", icon: Megaphone },
  { name: "Search", detail: "Ads and organic", icon: Search },
  { name: "Analytics", detail: "Revenue events", icon: Activity },
];

// Layout, in canvas pixels.
const GOAL_Y = 20;
const GOAL_H = 60;
const ROW_X = 64;
const ROW_W = 432;
const ROW_H = 54;
const ROW_TOP = 108;
const ROW_PITCH = 64;
const THREAD_X = 36;
const ELBOW = 16;
const READY_TOP = 380;

const GOAL_CENTER = GOAL_Y + GOAL_H / 2;
const rowTop = (index: number) => ROW_TOP + index * ROW_PITCH;
const rowCenter = (index: number) => rowTop(index) + ROW_H / 2;
const LAST_ROW = CHANNELS.length - 1;

/** Line from the goal card, round the corner, then down past every row. */
const THREAD_PATH = `M${ROW_X} ${GOAL_CENTER} H${THREAD_X + ELBOW} Q${THREAD_X} ${GOAL_CENTER} ${THREAD_X} ${GOAL_CENTER + ELBOW} V${rowCenter(LAST_ROW)}`;

/** Distance along the thread (approximate) at which it reaches a given y. */
const threadPosition = (y: number) =>
  ROW_X - (THREAD_X + ELBOW) + ELBOW * 1.52 + (y - (GOAL_CENTER + ELBOW));
const threadFraction = (y: number) =>
  threadPosition(y) / threadPosition(rowCenter(LAST_ROW));

/** Progress at which the thread reaches row `index` and that row connects. */
const reach = (index: number) => 0.16 + index * 0.16;

const THREAD_INPUT = [0.08, ...CHANNELS.map((_, index) => reach(index))];
const THREAD_OUTPUT = [
  0,
  ...CHANNELS.map((_, index) => threadFraction(rowCenter(index))),
];

type WithProgress = { progress: MotionValue<number> };

function GoalCard({ progress }: WithProgress) {
  const typed = useTransform(progress, (value) =>
    GOAL.slice(
      0,
      Math.round(Math.min(1, value / GOAL_TYPED_BY) * GOAL.length),
    ),
  );
  const caret = useTransform(
    progress,
    [0.01, 0.02, GOAL_TYPED_BY, GOAL_TYPED_BY + 0.03],
    [0, 1, 1, 0],
  );
  const opacity = useTransform(progress, [0, 0.04], [0, 1]);
  const y = useTransform(progress, [0, 0.04], [10, 0]);

  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-3 rounded-xl px-3.5",
        GLASS,
        GLASS_SHADOW,
      )}
      style={{
        left: ROW_X,
        top: GOAL_Y,
        width: ROW_W,
        height: GOAL_H,
        opacity,
        y,
      }}
    >
      <IconTile icon={Target} />
      <div className="min-w-0 leading-tight">
        <p className="text-xs text-muted-foreground">Quarterly goal</p>
        <p className="mt-1 flex items-center text-[15px] font-medium text-foreground">
          <motion.span>{typed}</motion.span>
          <motion.span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-0.5 rounded-full bg-brand-violet"
            style={{ opacity: caret }}
          />
        </p>
      </div>
    </motion.div>
  );
}

function ChannelRow({
  progress,
  index,
  channel,
}: WithProgress & { index: number; channel: Channel }) {
  const start = reach(index);
  const enterAt = 0.02 + index * 0.03;

  const opacity = useTransform(progress, [enterAt, enterAt + 0.08], [0, 1]);
  const y = useTransform(progress, [enterAt, enterAt + 0.08], [12, 0]);
  const idle = useTransform(progress, [start - 0.02, start], [1, 0]);
  const connecting = useTransform(
    progress,
    [start, start + 0.02, start + 0.08, start + 0.1],
    [0, 1, 1, 0],
  );
  const connected = useTransform(progress, [start + 0.08, start + 0.11], [0, 1]);
  const knobX = useTransform(progress, [start + 0.02, start + 0.09], [0, 18]);
  const trackOn = useTransform(progress, [start + 0.02, start + 0.09], [0, 1]);
  const tileOpacity = useTransform(progress, [start, start + 0.1], [0.5, 1]);

  const Icon = channel.icon;

  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-3 rounded-xl px-3.5",
        GLASS,
        GLASS_SHADOW,
      )}
      style={{
        left: ROW_X,
        top: rowTop(index),
        width: ROW_W,
        height: ROW_H,
        opacity,
        y,
      }}
    >
      <motion.span style={{ opacity: tileOpacity }}>
        <IconTile icon={Icon} />
      </motion.span>

      <div className="min-w-0 flex-1 leading-tight">
        <p className="font-heading text-[15px] font-semibold text-foreground">
          {channel.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{channel.detail}</p>
      </div>

      <div className="grid min-w-24 items-center justify-items-end text-xs">
        <motion.span
          className="col-start-1 row-start-1 whitespace-nowrap text-muted-foreground"
          style={{ opacity: idle }}
        >
          Not linked
        </motion.span>
        <motion.span
          className="col-start-1 row-start-1 whitespace-nowrap text-brand-blue"
          style={{ opacity: connecting }}
        >
          Connecting…
        </motion.span>
        <motion.span
          className="col-start-1 row-start-1 flex items-center gap-1 whitespace-nowrap font-medium text-brand-violet"
          style={{ opacity: connected }}
        >
          <Check className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          Connected
        </motion.span>
      </div>

      <span className="relative block h-[22px] w-10 shrink-0 rounded-full bg-white/10">
        <motion.span
          className="absolute inset-0 rounded-full bg-brand-gradient"
          style={{ opacity: trackOn }}
        />
        <motion.span
          className="absolute top-0.5 left-0.5 size-[18px] rounded-full bg-white shadow-md"
          style={{ x: knobX }}
        />
      </span>

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-brand-violet/50 shadow-[0_0_32px_-8px_rgb(167_139_250/0.6)]"
        style={{ opacity: connected }}
      />
    </motion.div>
  );
}

/** Short branch from the thread into a row, with a dot at each end. */
function ThreadBranch({ progress, index }: WithProgress & { index: number }) {
  const start = reach(index);
  const y = rowCenter(index);
  const draw = useTransform(progress, [start, start + 0.04], [0, 1]);
  const drawOpacity = useTransform(progress, [start, start + 0.005], [0, 1]);
  const junction = useTransform(progress, [start - 0.01, start + 0.01], [0, 1]);
  const port = useTransform(progress, [start + 0.03, start + 0.05], [0, 1]);

  return (
    <>
      <motion.path
        d={`M${THREAD_X} ${y} H${ROW_X}`}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          pathLength: draw,
          opacity: drawOpacity,
          stroke: "var(--brand-violet)",
        }}
      />
      <motion.circle
        cx={THREAD_X}
        cy={y}
        r="3.5"
        style={{ opacity: junction, fill: "var(--brand-violet)" }}
      />
      <motion.circle
        cx={ROW_X}
        cy={y}
        r="3"
        style={{ opacity: port, fill: "var(--brand-blue)" }}
      />
    </>
  );
}

function ReadyBadge({ progress }: WithProgress) {
  const opacity = useTransform(progress, [0.78, 0.86], [0, 1]);
  const y = useTransform(progress, [0.78, 0.86], [12, 0]);

  return (
    <motion.div
      className="absolute inset-x-0 flex justify-center"
      style={{ top: READY_TOP, opacity, y }}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2 shadow-[0_14px_40px_-10px_rgb(167_139_250/0.55)]",
          GLASS,
        )}
      >
        <span className="grid size-6 place-items-center rounded-full bg-brand-gradient text-background">
          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="text-[13px] font-medium text-foreground">
          Workspace ready
        </span>
        <span className="text-xs text-muted-foreground">
          {CHANNELS.length} channels synced
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Step one: a goal is typed in, then a thread runs down the page and connects
 * each channel in turn (toggle, status, port dot), ending in a "ready" badge.
 * Deliberately a straight vertical flow: no hub, nothing radial.
 */
export function ConnectVisual({ progress }: VisualProps) {
  const threadLength = useTransform(progress, THREAD_INPUT, THREAD_OUTPUT);

  return (
    <div className="absolute inset-0">
      <Blob tone="violet" className="-top-16 -right-10 size-96" />
      <Blob tone="blue" className="-bottom-24 -left-16 size-96" />

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
            id="connect-thread"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={GOAL_CENTER}
            x2="0"
            y2={rowCenter(LAST_ROW)}
          >
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>
        <path
          d={THREAD_PATH}
          stroke="rgb(255 255 255 / 0.1)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.path
          d={THREAD_PATH}
          stroke="url(#connect-thread)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: threadLength }}
        />
        {CHANNELS.map((channel, index) => (
          <ThreadBranch key={channel.name} progress={progress} index={index} />
        ))}
      </svg>

      <GoalCard progress={progress} />
      {CHANNELS.map((channel, index) => (
        <ChannelRow
          key={channel.name}
          progress={progress}
          index={index}
          channel={channel}
        />
      ))}
      <ReadyBadge progress={progress} />
    </div>
  );
}
