import type { CSSProperties } from "react";

/** Brand tints as a percentage of the design tokens, so colors stay central. */
const violet = (percent: number) =>
  `color-mix(in srgb, var(--brand-violet) ${percent}%, transparent)`;
const blue = (percent: number) =>
  `color-mix(in srgb, var(--brand-blue) ${percent}%, transparent)`;

/** Both prefixes: Safari still needs the -webkit- form for CSS masks. */
function mask(image: string): CSSProperties {
  return { maskImage: image, WebkitMaskImage: image };
}

/**
 * Light fanning out from the rim of the horizon: wedges alternate violet and
 * blue and are mirrored around the vertical axis. The wedges fade out well
 * before they reach the copy, so the text always sits on calm ground.
 */
const BEAMS = `conic-gradient(from 300deg at 50% 100%,
  transparent 0deg, transparent 8deg,
  ${violet(15)} 13deg, transparent 19deg,
  transparent 27deg, ${blue(13)} 32deg, transparent 38deg,
  transparent 50deg, ${violet(18)} 60deg, transparent 70deg,
  transparent 82deg, ${blue(13)} 88deg, transparent 93deg,
  transparent 101deg, ${violet(15)} 107deg, transparent 112deg,
  transparent 360deg)`;

/** One radial mask fades the beams upward and sideways in a single layer
 *  (stacked masks would add up instead of intersecting). */
const BEAMS_FADE = mask(
  "radial-gradient(ellipse 72% 100% at 50% 100%, #000 0%, transparent 80%)",
);

/** Soft pool of light that sits right above the rim. */
const RIM_GLOW = [
  `radial-gradient(ellipse 52% 100% at 50% 100%, ${violet(46)} 0%, ${violet(20)} 34%, transparent 72%)`,
  `radial-gradient(ellipse 78% 100% at 50% 100%, ${blue(20)} 0%, transparent 70%)`,
].join(", ");

/** The lit edge of the horizon: bright at the apex, tapering to nothing. It is
 *  revealed as a thin crescent between the outer and inner disc below. */
const RIM_LIGHT = `linear-gradient(90deg, transparent 10%, ${blue(75)} 30%, color-mix(in srgb, var(--brand-violet) 45%, white) 50%, ${blue(75)} 70%, transparent 90%)`;

/** The disc's upper face catches a little of the glow, then falls to midnight. */
const DISC_FACE = `linear-gradient(180deg, ${violet(16)} 0%, transparent 7%), var(--midnight)`;

/** Fine grain from an inline SVG: no extra request and no dependency. White
 *  noise at a very low opacity, concentrated around the glow. */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .8 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NOISE_FADE = mask(
  "radial-gradient(ellipse 85% 75% at 50% 100%, #000 0%, transparent 90%)",
);

/**
 * Decorative "horizon glow" for the CTA panel: a dark disc rising from the
 * bottom edge like the rim of a planet, lit along its top edge, with a pool of
 * light and soft beams above it. Pure gradients and a faint grain; no blur
 * filters. Place it as the first child of a `relative isolate overflow-hidden`
 * panel; it paints behind the panel's content.
 *
 * The rim offset (how far the disc rises) is repeated for the glow so the two
 * stay aligned at every breakpoint: 6.5rem, 8rem, 9rem.
 */
export function HorizonGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: NOISE, ...NOISE_FADE }}
      />

      <div
        className="absolute inset-0 hidden sm:block"
        style={{ background: BEAMS, ...BEAMS_FADE }}
      />

      {/* Breathes slowly; reduced motion switches the animation off globally. */}
      <div
        className="animate-glow absolute inset-x-0 bottom-[6.5rem] h-[85%] origin-bottom sm:bottom-32 lg:bottom-36"
        style={{ background: RIM_GLOW }}
      />

      {/* The disc: the outer circle's gradient shows through as a thin rim of
          light because the inner circle is nudged down by 2px. */}
      <div
        className="absolute left-1/2 top-[calc(100%-6.5rem)] aspect-square w-[190%] -translate-x-1/2 rounded-full sm:top-[calc(100%-8rem)] sm:w-[150%] lg:top-[calc(100%-9rem)] lg:w-[125%]"
        style={{ background: RIM_LIGHT }}
      >
        <div
          className="absolute inset-0 translate-y-[2px] rounded-full"
          style={{ background: DISC_FACE }}
        />
      </div>
    </div>
  );
}
