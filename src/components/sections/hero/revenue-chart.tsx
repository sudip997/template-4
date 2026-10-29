type Point = { x: number; y: number };

const WIDTH = 640;
const HEIGHT = 220;
const GRID_LINES = [44, 88, 132, 176] as const;
const X_LABELS = ["Mar 01", "Mar 08", "Mar 15", "Mar 22", "Mar 29"] as const;

function toPoints(values: readonly number[]): Point[] {
  const step = WIDTH / (values.length - 1);
  return values.map((y, index) => ({ x: index * step, y }));
}

const round = (value: number) => Math.round(value * 10) / 10;

/** Converts points to a smooth cubic Bezier path (Catmull-Rom style). */
function smoothPath(points: readonly Point[], tension = 0.18): string {
  const first = points[0];
  if (!first) return "";

  let path = `M${round(first.x)},${round(first.y)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(p2.x)},${round(p2.y)}`;
  }

  return path;
}

const revenuePoints = toPoints([172, 150, 158, 118, 126, 88, 98, 60, 38]);
const spendPoints = toPoints([188, 178, 174, 160, 158, 142, 144, 128, 120]);

const revenueLine = smoothPath(revenuePoints);
const revenueArea = `${revenueLine} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
const spendLine = smoothPath(spendPoints);

const HIGHLIGHT_INDEX = 7;
const highlight = revenuePoints[HIGHLIGHT_INDEX];
const highlightLeft = `${round((highlight.x / WIDTH) * 100)}%`;
const highlightTop = `${round((highlight.y / HEIGHT) * 100)}%`;

/** Decorative revenue vs. spend chart, drawn with static SVG paths. */
export function RevenueChart() {
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: "var(--brand-violet)", stopOpacity: 0.34 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-violet)", stopOpacity: 0 }}
            />
          </linearGradient>
          <linearGradient id="hero-revenue-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--brand-violet)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-blue)" }} />
          </linearGradient>
        </defs>

        {GRID_LINES.map((y) => (
          <line
            key={y}
            x1="0"
            x2={WIDTH}
            y1={y}
            y2={y}
            className="stroke-border"
            strokeWidth="1"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={revenueArea} fill="url(#hero-revenue-fill)" />
        <path
          d={spendLine}
          className="stroke-brand-blue/60"
          strokeWidth="1.75"
          strokeDasharray="5 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={revenueLine}
          stroke="url(#hero-revenue-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Highlighted data point + tooltip, positioned in the SVG's coordinate space. */}
      <span
        className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet ring-4 ring-brand-violet/25"
        style={{ left: highlightLeft, top: highlightTop }}
      />
      <span
        className="absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-center leading-tight shadow-lg shadow-black/40"
        style={{ left: highlightLeft, top: highlightTop }}
      >
        <span className="block text-[10px] text-muted-foreground">Mar 22</span>
        <span className="block text-xs font-semibold tabular-nums text-foreground">
          $2,840
        </span>
      </span>

      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
        {X_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
