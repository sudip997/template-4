import { Quote, Star, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { LOGOS } from "@/components/sections/logo-cloud/logos";
import { cn } from "@/lib/utils";

import { Avatar, AvatarStack } from "./avatars";
import type {
  CommunityTileData,
  QuoteTileData,
  RatingTileData,
  StatTileData,
  WallTileData,
} from "./data";
import { Sparkline } from "./sparkline";

/** Brand tints as a percentage of the design tokens, so colors stay central. */
const violet = (percent: number) =>
  `color-mix(in srgb, var(--brand-violet) ${percent}%, transparent)`;
const blue = (percent: number) =>
  `color-mix(in srgb, var(--brand-blue) ${percent}%, transparent)`;

/** Fine film grain, used on the featured tile only. A tiny inline SVG filter,
 *  so it costs no request. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** A pool of light inside a tile, behind its content. */
function Glow({ background }: { background: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ background }}
    />
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-medium text-muted-foreground">{children}</p>
  );
}

/** The large figure at the top of a tile, in the brand gradient. */
function BigNumber({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-heading text-[clamp(3rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** A customer's mark and wordmark, taken from the Logo Cloud so the two
 *  sections always agree. Decorative: the company is named in the caption. */
function CompanyBadge({ name }: { name: string }) {
  const logo = LOGOS.find((item) => item.name === name);

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors duration-300 group-hover/tile:text-foreground motion-reduce:transition-none"
    >
      {logo ? (
        <logo.Mark className="size-5 shrink-0 transition-colors duration-300 group-hover/tile:text-brand-violet motion-reduce:transition-none" />
      ) : null}
      <span
        className={cn(
          "leading-none whitespace-nowrap",
          logo?.wordmarkClassName ??
            "font-heading text-lg font-semibold tracking-[-0.02em]",
        )}
      >
        {name}
      </span>
    </span>
  );
}

function MetricPill({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-violet/25 bg-brand-violet/10 px-2.5 py-1 text-xs font-medium text-brand-violet">
      <TrendingUp className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
      <span>
        <span className="font-semibold">{value}</span> {label}
      </span>
    </span>
  );
}

function Author({
  tile,
  className,
}: {
  tile: QuoteTileData;
  className?: string;
}) {
  return (
    <figcaption className={cn("flex items-center gap-3", className)}>
      <Avatar index={tile.avatar} />
      <div className="min-w-0">
        <p className="text-sm leading-5 font-medium text-foreground">
          {tile.name}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
          {tile.role} at {tile.company}
        </p>
      </div>
    </figcaption>
  );
}

/** The tall hero quote: a large result first, then the story behind it. */
function FeaturedQuote({ tile }: { tile: QuoteTileData }) {
  return (
    <figure className="relative flex flex-1 flex-col p-6 sm:p-8">
      <Glow
        background={`radial-gradient(ellipse 80% 46% at 18% 0%, ${violet(22)}, transparent 70%), radial-gradient(ellipse 60% 40% at 100% 100%, ${blue(14)}, transparent 72%)`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <div className="flex items-start justify-between gap-4">
        <CompanyBadge name={tile.company} />
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-background shadow-[0_8px_20px_-8px] shadow-brand-violet/60"
        >
          <Quote className="size-[18px]" strokeWidth={2} />
        </span>
      </div>

      {tile.metric ? (
        <div className="mt-8 lg:mt-10">
          <BigNumber className="text-[clamp(3.5rem,6vw,5rem)] text-brand-gradient">
            {tile.metric.value}
          </BigNumber>
          <p className="mt-3 text-sm text-muted-foreground">
            {tile.metric.label}
          </p>
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="mt-8 h-px bg-linear-to-r from-brand-violet/40 via-white/10 to-transparent"
      />

      <blockquote className="mt-8">
        <p className="font-heading text-xl leading-[1.4] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-[1.375rem] lg:text-2xl">
          {tile.quote}
        </p>
      </blockquote>

      <Author tile={tile} className="mt-auto pt-10" />
    </figure>
  );
}

/** Wide `statement` quotes use the heading font; `compact` ones stay small. */
function StandardQuote({ tile }: { tile: QuoteTileData }) {
  const isStatement = tile.variant === "statement";

  return (
    <figure className="relative flex flex-1 flex-col p-6 sm:p-7">
      <Glow
        background={
          isStatement
            ? `radial-gradient(ellipse 60% 70% at 100% 0%, ${violet(13)}, transparent 70%)`
            : `radial-gradient(ellipse 70% 60% at 0% 100%, ${blue(11)}, transparent 70%)`
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <CompanyBadge name={tile.company} />
        {tile.metric ? (
          <MetricPill value={tile.metric.value} label={tile.metric.label} />
        ) : null}
      </div>

      <blockquote className="mt-5">
        <p
          className={cn(
            isStatement
              ? "font-heading text-lg leading-[1.35] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-xl lg:text-[1.625rem]"
              : "text-[15px] leading-relaxed text-pretty text-foreground/90 sm:text-base",
          )}
        >
          {tile.quote}
        </p>
      </blockquote>

      <Author tile={tile} className="mt-auto pt-6" />
    </figure>
  );
}

function QuoteTile({ tile }: { tile: QuoteTileData }) {
  return tile.variant === "featured" ? (
    <FeaturedQuote tile={tile} />
  ) : (
    <StandardQuote tile={tile} />
  );
}

/** One headline number with a trend line that bleeds off the bottom edge. */
function StatTile({ tile }: { tile: StatTileData }) {
  return (
    <div className="relative flex flex-1 flex-col p-6 sm:p-7">
      <Glow
        background={`radial-gradient(ellipse 70% 50% at 100% 0%, ${blue(14)}, transparent 70%), radial-gradient(ellipse 60% 40% at 0% 100%, ${violet(12)}, transparent 72%)`}
      />

      <Eyebrow>{tile.eyebrow}</Eyebrow>
      <BigNumber className="mt-4 text-brand-gradient">{tile.value}</BigNumber>
      <p className="mt-3 font-heading text-base font-semibold tracking-[-0.02em] text-foreground">
        {tile.label}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        {tile.detail}
      </p>

      <div className="-mx-6 -mb-6 mt-auto pt-8 sm:-mx-7 sm:-mb-7">
        <Sparkline values={tile.trend} />
      </div>
    </div>
  );
}

/** Average score, five stars and how the reviews are spread. */
function RatingTile({ tile }: { tile: RatingTileData }) {
  return (
    <div className="relative flex flex-1 flex-col p-6 sm:p-7">
      <Glow
        background={`radial-gradient(ellipse 70% 50% at 0% 0%, ${violet(15)}, transparent 70%)`}
      />

      <Eyebrow>{tile.eyebrow}</Eyebrow>
      <div className="mt-4 flex items-end gap-2">
        <BigNumber>
          <span className="sr-only">Rated </span>
          {tile.score}
          <span className="sr-only"> out of 5</span>
        </BigNumber>
        <p aria-hidden="true" className="pb-1.5 text-sm text-muted-foreground">
          / 5
        </p>
      </div>

      <div aria-hidden="true" className="mt-3 flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className="size-4 fill-brand-violet text-brand-violet"
            strokeWidth={1.5}
          />
        ))}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Average from {tile.reviewCount} verified reviews
      </p>

      <ul aria-hidden="true" className="mt-auto grid gap-1.5 pt-6">
        {tile.distribution.map((percent, index) => (
          <li
            key={index}
            className="flex items-center gap-2.5 text-[11px] text-muted-foreground"
          >
            <span className="w-2.5 tabular-nums">{5 - index}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
              <span
                className="block h-full rounded-full bg-brand-gradient"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="w-8 text-right tabular-nums">{percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Overlapping avatars and a one-line invitation. Purely proof, no button. */
function CommunityTile({ tile }: { tile: CommunityTileData }) {
  return (
    <div className="relative flex flex-1 flex-col justify-between gap-10 p-6 sm:p-7">
      <Glow
        background={`radial-gradient(ellipse 80% 60% at 100% 100%, ${violet(16)}, transparent 70%), radial-gradient(ellipse 50% 40% at 0% 0%, ${blue(9)}, transparent 72%)`}
      />

      <AvatarStack count={tile.avatarCount} />

      <div>
        <p className="font-heading text-xl leading-snug font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
          Join <span className="text-brand-gradient">{tile.teamCount}</span>{" "}
          marketing teams
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
          {tile.detail}
        </p>
      </div>
    </div>
  );
}

/** Picks the right layout for a tile's `kind`. */
export function WallTileContent({ tile }: { tile: WallTileData }) {
  switch (tile.kind) {
    case "quote":
      return <QuoteTile tile={tile} />;
    case "stat":
      return <StatTile tile={tile} />;
    case "rating":
      return <RatingTile tile={tile} />;
    case "community":
      return <CommunityTile tile={tile} />;
  }
}
