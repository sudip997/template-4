"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  DollarSign,
  FileText,
  Mail,
  Megaphone,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

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

type Channel = {
  name: string;
  /** Share of attributed revenue, in percent. */
  share: number;
  icon: LucideIcon;
  /** Stroke width of the flow into the revenue card. */
  flow: number;
};

const CHANNELS: readonly Channel[] = [
  { name: "Email", share: 42, icon: Mail, flow: 7 },
  { name: "Paid social", share: 27, icon: Megaphone, flow: 5 },
  { name: "Content", share: 19, icon: FileText, flow: 3.5 },
  { name: "Search", share: 12, icon: Search, flow: 2.5 },
];

// Layout, in canvas pixels.
const CH_X = 20;
const CH_W = 180;
const CH_H = 56;
const CH_TOP = 84;
const CH_PITCH = 68;
const REV_X = 360;
const REV_Y = 72;
const REV_W = 180;
const REV_H = 284;
const FLOW_TARGETS = [132, 186, 240, 294] as const;

const TOTAL_REVENUE = 284_600;
const USD = new Intl.NumberFormat("en-US");

const SPARK_LINE =
  "M0 54 C16 52 22 46 36 44 S58 46 70 36 S94 30 106 22 S134 14 156 6";
const SPARK_AREA = `${SPARK_LINE} L156 64 L0 64 Z`;

const channelCenter = (index: number) => CH_TOP + index * CH_PITCH + CH_H / 2;
const flowPath = (index: number) => {
  const startX = CH_X + CH_W;
  const midX = (startX + REV_X) / 2;
  const startY = channelCenter(index);
  const endY = FLOW_TARGETS[index];
  return `M${startX} ${startY} C${midX} ${startY} ${midX} ${endY} ${REV_X} ${endY}`;
};

const flowStart = (index: number) => 0.1 + index * 0.06;

function ChannelCard({
  progress,
  index,
  channel,
}: WithProgress & { index: number; channel: Channel }) {
  const Icon = channel.icon;
  const isTop = index === 0;
  const enter = index * 0.03;

  const opacity = useTransform(progress, [enter, enter + 0.08], [0, 1]);
  const x = useTransform(progress, [enter, enter + 0.08], [-12, 0]);
  const bar = useTransform(
    progress,
    [flowStart(index) + 0.04, flowStart(index) + 0.3],
    [0, 1],
  );
  const share = useTransform(
    progress,
    [flowStart(index) + 0.04, flowStart(index) + 0.3],
    [0, channel.share],
  );
  const shareText = useTransform(share, (value) => `${Math.round(value)}%`);
  const lit = useTransform(progress, [0.82, 0.9], [0, 1]);

  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-3 rounded-xl px-3",
        GLASS,
        GLASS_SHADOW,
      )}
      style={{
        left: CH_X,
        top: CH_TOP + index * CH_PITCH,
        width: CH_W,
        height: CH_H,
        opacity,
        x,
      }}
    >
      <IconTile
        icon={Icon}
        tone={isTop ? "brand" : "neutral"}
        className="size-8"
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="font-heading text-[13px] font-semibold text-foreground">
          {channel.name}
        </p>
        <span className="mt-1.5 block h-1 w-full rounded-full bg-white/10">
          <motion.span
            className="block h-full origin-left rounded-full bg-brand-gradient"
            style={{ scaleX: bar, width: `${(channel.share / 42) * 100}%` }}
          />
        </span>
      </div>
      <motion.span className="w-9 text-right text-xs font-medium text-foreground tabular-nums">
        {shareText}
      </motion.span>

      {isTop && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-brand-violet/60 shadow-[0_0_32px_-8px_rgb(167_139_250/0.65)]"
          style={{ opacity: lit }}
        />
      )}
    </motion.div>
  );
}

function Flow({
  progress,
  index,
  channel,
}: WithProgress & { index: number; channel: Channel }) {
  const start = flowStart(index);
  const d = flowPath(index);

  const draw = useTransform(progress, [start, start + 0.2], [0, 1]);
  const visible = useTransform(progress, [start, start + 0.01], [0, 1]);
  const pulseOpacity = useTransform(
    progress,
    [start + 0.18, start + 0.24],
    [0, 0.9],
  );
  const pulseOffset = useTransform(progress, [start, 1], [0, -420]);

  return (
    <>
      <path
        d={d}
        stroke="rgb(255 255 255 / 0.06)"
        strokeWidth={channel.flow}
        strokeLinecap="round"
      />
      <motion.path
        d={d}
        stroke="url(#attribution-flow)"
        strokeWidth={channel.flow}
        strokeLinecap="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.path
        d={d}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 30"
        style={{ strokeDashoffset: pulseOffset, opacity: pulseOpacity }}
      />
    </>
  );
}

function RevenueCard({ progress }: WithProgress) {
  const opacity = useTransform(progress, [0.06, 0.16], [0, 1]);
  const x = useTransform(progress, [0.06, 0.16], [14, 0]);
  const revenue = useTransform(progress, (value) => {
    const t = Math.min(1, Math.max(0, (value - 0.15) / 0.65));
    return `$${USD.format(Math.round(t * TOTAL_REVENUE))}`;
  });
  const delta = useTransform(progress, [0.62, 0.7], [0, 1]);
  const line = useTransform(progress, [0.2, 0.8], [0, 1]);
  const area = useTransform(progress, [0.4, 0.85], [0, 1]);
  const top = useTransform(progress, [0.82, 0.9], [0, 1]);
  const topY = useTransform(progress, [0.82, 0.9], [8, 0]);

  return (
    <motion.div
      className={cn("absolute rounded-xl p-3", GLASS, GLASS_SHADOW)}
      style={{
        left: REV_X,
        top: REV_Y,
        width: REV_W,
        height: REV_H,
        opacity,
        x,
      }}
    >
      <div className="flex items-center gap-2">
        <IconTile icon={DollarSign} size="sm" />
        <p className="text-xs text-muted-foreground">Attributed revenue</p>
      </div>

      <motion.p className="text-brand-gradient mt-3 font-heading text-[28px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
        {revenue}
      </motion.p>

      <motion.div className="mt-2 flex items-center gap-1.5" style={{ opacity: delta }}>
        <MiniChip tone="blue">
          <TrendingUp className="size-3" aria-hidden="true" />
          +23%
        </MiniChip>
        <span className="text-xs text-muted-foreground">vs last quarter</span>
      </motion.div>

      <svg
        viewBox="0 0 156 64"
        className="mt-3 h-16 w-full"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="attribution-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
          <linearGradient id="attribution-area" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: "var(--brand-violet)", stopOpacity: 0.32 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-violet)", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <motion.path
          d={SPARK_AREA}
          fill="url(#attribution-area)"
          style={{ opacity: area }}
        />
        <motion.path
          d={SPARK_LINE}
          stroke="url(#attribution-line)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: line }}
        />
      </svg>

      <motion.div
        className="mt-3 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] p-2"
        style={{ opacity: top, y: topY }}
      >
        <IconTile icon={Mail} size="sm" />
        <span className="leading-tight">
          <span className="block text-xs text-muted-foreground">
            Top performer
          </span>
          <span className="block text-[13px] font-semibold text-foreground">
            Email · 4.9x ROAS
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function Caption({ progress }: WithProgress) {
  const opacity = useTransform(progress, [0, 0.06], [0, 1]);
  return (
    <motion.p
      className="absolute text-xs text-muted-foreground"
      style={{ left: CH_X, top: 36, opacity }}
    >
      Revenue by channel · last 90 days
    </motion.p>
  );
}

/**
 * Step three: every channel feeds a flow into one revenue card. Flow width
 * shows each channel's share, the total counts up, and the top performer is
 * highlighted at the end.
 */
export function AttributionVisual({ progress }: VisualProps) {
  return (
    <div className="absolute inset-0">
      <Blob tone="violet" className="-top-16 -left-14 size-96" />
      <Blob tone="blue" className="-right-12 -bottom-20 size-[26rem]" />

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
            id="attribution-flow"
            gradientUnits="userSpaceOnUse"
            x1={CH_X + CH_W}
            y1="0"
            x2={REV_X}
            y2="0"
          >
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>
        {CHANNELS.map((channel, index) => (
          <Flow
            key={channel.name}
            progress={progress}
            index={index}
            channel={channel}
          />
        ))}
      </svg>

      <Caption progress={progress} />
      {CHANNELS.map((channel, index) => (
        <ChannelCard
          key={channel.name}
          progress={progress}
          index={index}
          channel={channel}
        />
      ))}
      <RevenueCard progress={progress} />
    </div>
  );
}
