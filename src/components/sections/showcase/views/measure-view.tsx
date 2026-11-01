import { FileText, TrendingUp } from "lucide-react";

import {
  Chip,
  FauxButton,
  FloatingCard,
  Panel,
  StatTile,
} from "../dashboard-ui";

type Channel = {
  name: string;
  revenue: string;
  roas: string;
  /** Share of attributed revenue, in percent. Shares add up to 100. */
  share: number;
};

const CHANNELS: readonly Channel[] = [
  { name: "Email", revenue: "$70.0k", roas: "4.9x", share: 38 },
  { name: "Paid social", revenue: "$53.4k", roas: "3.8x", share: 29 },
  { name: "Search", revenue: "$36.8k", roas: "4.4x", share: 20 },
  { name: "Organic", revenue: "$24.0k", roas: "n/a", share: 13 },
];

const NODE_GAP = 3;
const RIGHT_GAP = 1.2;
const LEFT_SPACE = 100 - NODE_GAP * (CHANNELS.length - 1);
const RIGHT_SPACE = 100 - RIGHT_GAP * (CHANNELS.length - 1);
const BAND_START = 2;
const BAND_END = 98;
const BAND_MID = (BAND_START + BAND_END) / 2;

type Band = {
  name: string;
  path: string;
  leftTop: number;
  leftHeight: number;
  rightTop: number;
  rightHeight: number;
  gradientId: string;
};

const round = (value: number) => Number(value.toFixed(2));

/**
 * Geometry for the flow diagram, in a 0-100 coordinate space on both axes.
 * Each channel is a band from its own node (left) into a segment of the
 * revenue node (right); the gaps keep the bands visibly separate.
 */
const BANDS: readonly Band[] = (() => {
  let leftCursor = 0;
  let rightCursor = 0;

  return CHANNELS.map((channel, index) => {
    const leftHeight = (channel.share / 100) * LEFT_SPACE;
    const rightHeight = (channel.share / 100) * RIGHT_SPACE;
    const leftTop = leftCursor;
    const rightTop = rightCursor;

    leftCursor += leftHeight + NODE_GAP;
    rightCursor += rightHeight + RIGHT_GAP;

    const path = [
      `M${BAND_START} ${round(leftTop)}`,
      `C${BAND_MID} ${round(leftTop)} ${BAND_MID} ${round(rightTop)} ${BAND_END} ${round(rightTop)}`,
      `L${BAND_END} ${round(rightTop + rightHeight)}`,
      `C${BAND_MID} ${round(rightTop + rightHeight)} ${BAND_MID} ${round(leftTop + leftHeight)} ${BAND_START} ${round(leftTop + leftHeight)}`,
      "Z",
    ].join(" ");

    return {
      name: channel.name,
      path,
      leftTop: round(leftTop),
      leftHeight: round(leftHeight),
      rightTop: round(rightTop),
      rightHeight: round(rightHeight),
      gradientId: `attribution-band-${index}`,
    };
  });
})();

function AttributionFlow() {
  return (
    <Panel className="flex min-h-0 min-w-0 flex-1 flex-col p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-foreground">
          Revenue attribution
        </p>
        <Chip tone="muted">Data-driven model</Chip>
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[72px_minmax(0,1fr)_72px] gap-x-2 sm:grid-cols-[88px_minmax(0,1fr)_88px]">
        <div className="relative">
          {BANDS.map((band) => (
            <div
              key={band.name}
              className="absolute left-0 -translate-y-1/2 leading-tight"
              style={{ top: `${band.leftTop + band.leftHeight / 2}%` }}
            >
              <span className="block text-[11px] text-foreground sm:text-xs">
                {band.name}
              </span>
            </div>
          ))}
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="size-full"
          aria-hidden="true"
        >
          <defs>
            {BANDS.map((band, index) => (
              <linearGradient key={band.gradientId} id={band.gradientId} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" style={{ stopColor: "var(--brand-violet)", stopOpacity: 0.5 - index * 0.06 }} />
                <stop offset="100%" style={{ stopColor: "var(--brand-blue)", stopOpacity: 0.28 }} />
              </linearGradient>
            ))}
          </defs>
          {BANDS.map((band) => (
            <path
              key={band.name}
              d={band.path}
              fill={`url(#${band.gradientId})`}
              style={{ stroke: "var(--card)" }}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {BANDS.map((band) => (
            <rect
              key={`${band.name}-node`}
              x="0"
              y={band.leftTop}
              width="1.6"
              height={band.leftHeight}
              rx="0.6"
              style={{ fill: "var(--brand-violet)" }}
            />
          ))}
          {BANDS.map((band) => (
            <rect
              key={`${band.name}-revenue`}
              x="98.4"
              y={band.rightTop}
              width="1.6"
              height={band.rightHeight}
              rx="0.6"
              style={{ fill: "var(--brand-blue)" }}
            />
          ))}
        </svg>

        <div className="flex flex-col items-end justify-center text-right leading-tight">
          <span className="text-[11px] text-muted-foreground sm:text-xs">Revenue</span>
          <span className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
            $184k
          </span>
        </div>
      </div>
    </Panel>
  );
}

function ChannelTable() {
  return (
    <Panel className="hidden w-[250px] shrink-0 flex-col p-4 xl:flex">
      <p className="text-[13px] font-medium text-foreground">By channel</p>
      <ul className="mt-4 flex flex-1 flex-col justify-between">
        {CHANNELS.map((channel) => (
          <li key={channel.name}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">{channel.name}</span>
              <span className="font-medium tabular-nums text-foreground">
                {channel.revenue}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-gradient"
                  style={{ width: `${channel.share * 2.2}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground">
                {channel.roas}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function MeasureView() {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
            Attribution
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Last 30 days · Multi-touch
          </p>
        </div>
        <FauxButton variant="ghost" className="lg:hidden">Export report</FauxButton>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <StatTile label="Attributed" value="$184.2k" delta="+12.4%" />
        <StatTile label="ROAS" value="4.8x" delta="+0.6" />
        <StatTile label="CAC" value="$38" delta="-9%" />
      </div>

      <div className="flex min-h-0 flex-1 gap-3 sm:gap-4">
        <AttributionFlow />
        <ChannelTable />
      </div>
    </div>
  );
}

const SPARKLINE = "0,30 14,26 28,28 42,19 56,22 70,13 84,16 98,7 112,4";

export function MeasureFloaters() {
  return (
    <>
      <FloatingCard
        delay={0.15}
        className="-top-6 -right-4 w-[240px] xl:-right-10"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Top performer</span>
          <Chip tone="violet">
            <TrendingUp className="size-3" />
            Email
          </Chip>
        </div>
        <p className="mt-2 font-heading text-2xl leading-none font-semibold tracking-tight text-foreground">
          4.9x <span className="text-sm font-normal text-muted-foreground">ROAS</span>
        </p>
        <svg viewBox="0 0 112 34" className="mt-3 h-9 w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="measure-sparkline" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
              <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
            </linearGradient>
          </defs>
          <polyline
            points={SPARKLINE}
            stroke="url(#measure-sparkline)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </FloatingCard>

      <FloatingCard
        delay={0.3}
        className="-bottom-6 -left-4 flex w-[250px] items-center gap-3 xl:-left-10"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-brand-violet ring-1 ring-border">
          <FileText className="size-4" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13px] font-medium text-foreground">
            Weekly attribution report
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Ready · PDF, 12 pages
          </span>
        </span>
      </FloatingCard>
    </>
  );
}
