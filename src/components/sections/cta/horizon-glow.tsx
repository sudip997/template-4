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

/** How far the light reaches beyond the arc, in rem. The glow element is this
 *  much larger than the disc on every side (see `-inset-[15rem]` below), so the
 *  two values must match. */
const REACH = 15;

/**
 * Light that follows the arc. The glow is a circle concentric with the disc;
 * its brightest ring sits exactly on the disc's edge and fades outward, so the
 * light hugs the curve instead of rising from a flat line. `closest-side` makes
 * 100% equal the glow's radius, so `calc(100% - 15rem)` is the disc's edge.
 */
const CONTOUR_GLOW = `radial-gradient(circle closest-side,
  transparent calc(100% - ${REACH + 5}rem),
  ${violet(58)} calc(100% - ${REACH}rem),
  ${violet(30)} calc(100% - ${REACH - 3}rem),
  ${blue(16)} calc(100% - ${REACH - 7}rem),
  ${blue(6)} calc(100% - ${REACH - 11}rem),
  transparent 100%)`;

/** Strongest at the apex, fading toward the sides where the arc leaves the
 *  panel. Applied to the glow so the light has a natural hot spot. */
const CONTOUR_FADE = mask(
  "linear-gradient(to right, transparent 20%, #000 40%, #000 60%, transparent 80%)",
);

/** A small, soft hot spot centered on the apex. It fades to nothing at every
 *  edge of its box (`closest-side`), so it never shows a straight cutoff. */
const APEX_GLOW = `radial-gradient(ellipse closest-side, ${violet(48)} 0%, ${violet(18)} 50%, transparent 100%)`;

/** The lit edge of the arc: bright at the apex, tapering to nothing. It shows
 *  as a thin crescent between the rim and the inner disc below. */
const RIM_LIGHT = `linear-gradient(90deg, transparent 6%, ${blue(75)} 28%, color-mix(in srgb, var(--brand-violet) 40%, white) 50%, ${blue(75)} 72%, transparent 94%)`;

/** The disc's upper face catches a little of the glow, then falls to midnight. */
const DISC_FACE = `linear-gradient(180deg, ${violet(14)} 0%, transparent 6%), var(--midnight)`;

/** Fine grain from an inline SVG: no extra request and no dependency. White
 *  noise at a very low opacity, concentrated around the glow. */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .8 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NOISE_FADE = mask(
  "radial-gradient(ellipse 85% 75% at 50% 100%, #000 0%, transparent 90%)",
);

/**
 * Decorative "horizon glow" for the CTA panel: a dark disc rising from the
 * bottom edge like the rim of a planet, lit along its top edge, with light that
 * follows the curve of the arc. No rays, no flat edges: every layer is a
 * circle or fades to nothing at its own boundary. Pure gradients and a faint
 * grain; no blur filters. Place it as the first child of a
 * `relative isolate overflow-hidden` panel; it paints behind the content.
 *
 * The rim offset (how far the disc rises) is 6.5rem, 8rem and 9rem; the apex
 * glow repeats it so the two stay aligned at every breakpoint.
 */
export function HorizonGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: NOISE, ...NOISE_FADE }}
      />

      {/* Breathes slowly; reduced motion switches the animation off globally.
          Its box is centered on the apex (half of its 14rem height above the
          rim offset), so the lower half is simply hidden by the disc. */}
      <div
        className="animate-glow absolute inset-x-0 bottom-[calc(6.5rem-7rem)] mx-auto h-56 w-[72%] max-w-3xl sm:bottom-[calc(8rem-7rem)] lg:bottom-[calc(9rem-7rem)]"
        style={{ background: APEX_GLOW }}
      />

      {/* The disc. Three stacked circles share one box: the glow (larger than
          the disc on every side), the rim light, and the disc face, which is
          nudged down 2px so the rim shows as a thin crescent at the top. */}
      <div className="absolute left-1/2 top-[calc(100%-6.5rem)] aspect-square w-[190%] -translate-x-1/2 sm:top-[calc(100%-8rem)] sm:w-[150%] lg:top-[calc(100%-9rem)] lg:w-[125%]">
        <div
          className="absolute -inset-[15rem] rounded-full"
          style={{ background: CONTOUR_GLOW, ...CONTOUR_FADE }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: RIM_LIGHT }}
        />
        <div
          className="absolute inset-0 translate-y-[2px] rounded-full"
          style={{ background: DISC_FACE }}
        />
      </div>
    </div>
  );
}
