"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScaledCanvasProps = {
  /** Design size in px. Children are laid out inside this box. */
  width: number;
  height: number;
  /**
   * Largest scale the box may reach. Without it the box would grow with its
   * container, blowing the diagram and its text up on wide screens.
   */
  maxScale?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Lays children out in a fixed `width` x `height` design box and scales the
 * whole box to the width of its container, keeping the aspect ratio. This lets
 * the diagrams use exact pixel coordinates (cards and SVG lines always line up)
 * at any screen size.
 *
 * The scale is written straight to the DOM from a ResizeObserver, so resizing
 * never re-renders React.
 */
export function ScaledCanvas({
  width,
  height,
  maxScale,
  className,
  children,
}: ScaledCanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const box = boxRef.current;
    if (!frame || !box) return;

    const fit = () => {
      box.style.transform = `scale(${frame.clientWidth / width})`;
      box.style.opacity = "1";
    };
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={frameRef}
      className={cn("relative mx-auto w-full overflow-hidden", className)}
      style={{
        aspectRatio: `${width} / ${height}`,
        maxWidth: maxScale ? width * maxScale : undefined,
      }}
    >
      {/* Hidden until the first measurement, so it never flashes unscaled. */}
      <div
        ref={boxRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, opacity: 0 }}
      >
        {children}
      </div>
    </div>
  );
}
