import { Fragment } from "react";

import { cn } from "@/lib/utils";

import { FauxButton, Panel, StatTile } from "./dashboard-ui";

type Tone = "violet" | "blue";

type TimelineRow = {
  channel: string;
  name: string;
  /** Start and length, in weeks. */
  start: number;
  span: number;
  /** 0 to 1 */
  progress: number;
  tone: Tone;
};

const WEEKS = 8;
const TODAY_WEEK = 3.2;

const ROWS: readonly TimelineRow[] = [
  { channel: "Email", name: "Launch sequence", start: 0, span: 4.5, progress: 0.8, tone: "violet" },
  { channel: "Paid social", name: "Awareness flight", start: 1, span: 5, progress: 0.55, tone: "blue" },
  { channel: "Content", name: "Pillar guide and posts", start: 0.5, span: 3.5, progress: 1, tone: "violet" },
  { channel: "Webinar", name: "Live demo series", start: 3.5, span: 2, progress: 0.2, tone: "blue" },
  { channel: "Partners", name: "Co-marketing push", start: 4.5, span: 3, progress: 0, tone: "violet" },
  { channel: "Search", name: "Always-on bidding", start: 2, span: 6, progress: 0.4, tone: "blue" },
];

const BAR_STYLES: Record<Tone, { bar: string; fill: string }> = {
  violet: {
    bar: "border-brand-violet/40 bg-brand-violet/12",
    fill: "bg-brand-violet/30",
  },
  blue: {
    bar: "border-brand-blue/40 bg-brand-blue/12",
    fill: "bg-brand-blue/30",
  },
};

const pct = (weeks: number) => `${(weeks / WEEKS) * 100}%`;

const GRID_LINES = {
  backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px)",
  backgroundSize: `${100 / WEEKS}% 100%`,
} as const;

function Timeline() {
  return (
    <Panel className="min-h-0 flex-1 p-3 sm:p-4">
      <div className="grid h-full grid-cols-[68px_minmax(0,1fr)] grid-rows-[auto_repeat(6,minmax(0,1fr))] sm:grid-cols-[92px_minmax(0,1fr)]">
        <div
          className="grid grid-cols-8 pb-2 text-[10px] text-muted-foreground"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          {Array.from({ length: WEEKS }, (_, index) => (
            <span key={index}>W{index + 1}</span>
          ))}
        </div>

        {ROWS.map((row, index) => (
          <Fragment key={row.channel}>
            <div
              className="flex items-center border-t border-border/60 text-[11px] text-muted-foreground sm:text-xs"
              style={{ gridColumn: 1, gridRow: index + 2 }}
            >
              {row.channel}
            </div>
            <div
              className="relative border-t border-border/60"
              style={{ gridColumn: 2, gridRow: index + 2, ...GRID_LINES }}
            >
              <div
                className={cn(
                  "absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded-lg border px-2 sm:h-8",
                  BAR_STYLES[row.tone].bar,
                )}
                style={{ left: pct(row.start), width: pct(row.span) }}
              >
                <span
                  className={cn("absolute inset-y-0 left-0", BAR_STYLES[row.tone].fill)}
                  style={{ width: `${row.progress * 100}%` }}
                />
                <span className="relative truncate text-[10px] font-medium text-foreground sm:text-[11px]">
                  {row.name}
                </span>
              </div>
            </div>
          </Fragment>
        ))}

        <div
          className="pointer-events-none relative"
          style={{ gridColumn: 2, gridRow: "1 / span 7" }}
        >
          <div
            className="absolute inset-y-0 z-10 w-px bg-linear-to-b from-brand-violet via-brand-violet/60 to-brand-blue/30"
            style={{ left: pct(TODAY_WEEK) }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-1.5 py-0.5 text-[9px] font-semibold text-background">
              Today
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function DashboardView() {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
            Spring Launch
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            May 5 to Jun 27 · 6 channels
          </p>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <div className="hidden -space-x-2 sm:flex">
            {["bg-brand-violet", "bg-brand-blue", "bg-foreground/70"].map((tone) => (
              <span
                key={tone}
                className={cn("size-6 rounded-full ring-2 ring-card", tone)}
              />
            ))}
          </div>
          <FauxButton>New campaign</FauxButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <StatTile label="Budget" value="$24.0k" />
        <StatTile label="Projected reach" value="1.2M" delta="+18%" />
        <StatTile label="Lead goal" value="4,800" />
      </div>

      <Timeline />
    </div>
  );
}
