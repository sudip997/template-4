"use client";

import { useReducedMotion } from "motion/react";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The pointer position inside the tile, set as CSS variables. Until the
 *  pointer has moved (and for reduced motion) the light rests near the top. */
const POINTER = "var(--mx, 50%) var(--my, 28%)";

/** Soft light that follows the pointer across the tile. */
const SPOTLIGHT_FILL: CSSProperties = {
  background: `radial-gradient(380px circle at ${POINTER}, color-mix(in srgb, var(--brand-violet) 20%, transparent), color-mix(in srgb, var(--brand-blue) 7%, transparent) 46%, transparent 72%)`,
};

/** The same light, masked down to the tile's 1px outline. The mask keeps only
 *  the padding box minus the content box, which is the border ring. */
const SPOTLIGHT_BORDER: CSSProperties = {
  padding: 1,
  background: `radial-gradient(240px circle at ${POINTER}, color-mix(in srgb, var(--brand-violet) 80%, transparent), color-mix(in srgb, var(--brand-blue) 42%, transparent) 42%, transparent 72%)`,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

type SpotlightTileProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared shell for every tile in the wall: the dark surface used by the
 * Features cards, plus a hover effect where a violet and blue light follows the
 * pointer and traces the tile's outline.
 *
 * The pointer position is written straight to CSS variables, so moving the
 * mouse never re-renders React. Touch input is ignored, and reduced motion
 * keeps the light still instead of following the pointer.
 */
export function SpotlightTile({ children, className }: SpotlightTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const tile = tileRef.current;
    if (!tile) return;

    const rect = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    tile.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={tileRef}
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      className={cn(
        "group/tile relative isolate flex w-full rounded-2xl border border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] transition-[translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-violet/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* Clips the tile's content and light to the rounded corners, so a
          visual can bleed off an edge. */}
      <div className="relative flex w-full flex-col overflow-hidden rounded-[inherit]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 motion-reduce:transition-none"
          style={SPOTLIGHT_FILL}
        />
        {children}
      </div>

      {/* Sits one pixel outside the clipped box, exactly over the border. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 motion-reduce:transition-none"
        style={SPOTLIGHT_BORDER}
      />
    </div>
  );
}
