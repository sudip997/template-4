import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Layered lighting for a content section. Pure gradients: no noise, no dot
 * grid, no blur filters. Every layer is clipped to the section and the whole
 * stack fades out toward the top and bottom edges, so neighbouring sections
 * blend without a seam.
 *
 * Each variant is tuned to its section's composition, so the light sits behind
 * the content that matters instead of being spread evenly:
 * - `launch`: light gathers on the right, behind the glass diagram window.
 * - `features`: light starts top-left behind the heading and settles toward
 *   the bottom, behind the enterprise band.
 */
type SectionBackgroundVariant = "launch" | "features";

type SectionBackgroundProps = {
  variant: SectionBackgroundVariant;
  className?: string;
};

/** Brand tints as a percentage of the design tokens, so colors stay central. */
const violet = (percent: number) =>
  `color-mix(in srgb, var(--brand-violet) ${percent}%, transparent)`;
const blue = (percent: number) =>
  `color-mix(in srgb, var(--brand-blue) ${percent}%, transparent)`;
const white = (percent: number) =>
  `color-mix(in srgb, var(--soft-white) ${percent}%, transparent)`;

type Config = {
  /** Large soft pools of light. */
  pools: string;
  /** A wide cone of light falling from a top corner. */
  beam: { background: string; fade: string };
  /** The one slowly breathing orb of light. */
  orb: { className: string; background: string; delay: string };
  /** Optional hairline rings that echo the Hero orb's orbit arcs. */
  rings?: { background: string; fade: string };
  /** Where the faded hairline at the top of the section catches the light. */
  dividerTint: string;
};

const CONFIG: Record<SectionBackgroundVariant, Config> = {
  launch: {
    pools: [
      `radial-gradient(ellipse 52% 44% at 80% 56%, ${violet(17)}, transparent 72%)`,
      `radial-gradient(ellipse 38% 34% at 6% 92%, ${blue(11)}, transparent 72%)`,
      `radial-gradient(ellipse 34% 26% at 30% 4%, ${violet(9)}, transparent 72%)`,
    ].join(", "),
    beam: {
      background: `conic-gradient(from 184deg at 92% -6%, transparent 0deg, ${violet(15)} 9deg, ${blue(9)} 17deg, transparent 29deg)`,
      fade: "radial-gradient(ellipse 78% 92% at 92% 0%, #000 0%, transparent 100%)",
    },
    orb: {
      className:
        "top-[30%] -right-[14%] aspect-square w-[min(78vw,760px)]",
      background: `radial-gradient(circle, ${violet(24)} 0%, ${blue(10)} 38%, transparent 68%)`,
      delay: "0s",
    },
    dividerTint: violet(45),
  },
  features: {
    pools: [
      `radial-gradient(ellipse 46% 32% at 16% 16%, ${violet(16)}, transparent 72%)`,
      `radial-gradient(ellipse 36% 28% at 96% 44%, ${blue(12)}, transparent 72%)`,
      `radial-gradient(ellipse 62% 24% at 50% 94%, ${violet(13)}, transparent 72%)`,
    ].join(", "),
    beam: {
      background: `conic-gradient(from 126deg at 8% -6%, transparent 0deg, ${blue(9)} 11deg, ${violet(15)} 19deg, transparent 29deg)`,
      fade: "radial-gradient(ellipse 78% 92% at 8% 0%, #000 0%, transparent 100%)",
    },
    orb: {
      className:
        "-top-[2%] -left-[12%] aspect-square w-[min(70vw,680px)]",
      background: `radial-gradient(circle, ${violet(20)} 0%, ${blue(8)} 40%, transparent 68%)`,
      // Offset from Launch Flow's orb so the two never pulse in step.
      delay: "-3.5s",
    },
    rings: {
      background: `repeating-radial-gradient(circle at 92% 12%, transparent 0px, transparent 107px, ${white(4.5)} 107px, ${white(4.5)} 108px)`,
      fade: "radial-gradient(circle 600px at 92% 12%, #000 0%, transparent 100%)",
    },
    dividerTint: blue(45),
  },
};

/** Both prefixes: Safari still needs the -webkit- form for CSS masks. */
function mask(image: string): CSSProperties {
  return { maskImage: image, WebkitMaskImage: image };
}

const EDGE_FADE = mask(
  "linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)",
);

export function SectionBackground({
  variant,
  className,
}: SectionBackgroundProps) {
  const { pools, beam, orb, rings, dividerTint } = CONFIG[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {/* Clipped to the section, so the orb can bleed past the viewport edge
          without creating horizontal scroll. */}
      <div className="absolute inset-0 overflow-hidden" style={EDGE_FADE}>
        <div className="absolute inset-0" style={{ background: pools }} />

        <div
          className="absolute inset-0"
          style={{ background: beam.background, ...mask(beam.fade) }}
        />

        {rings ? (
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: rings.background, ...mask(rings.fade) }}
          />
        ) : null}

        {/* Reduced motion switches this animation off in globals.css. */}
        <div
          className={cn("animate-glow absolute rounded-full", orb.className)}
          style={{ background: orb.background, animationDelay: orb.delay }}
        />
      </div>

      {/* A faded hairline that marks the start of the section, tinted to match
          its light. Same device as the Logo Cloud's, with a touch of color. */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${dividerTint}, transparent)`,
        }}
      />
    </div>
  );
}
