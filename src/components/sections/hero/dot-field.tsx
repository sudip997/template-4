"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type RGB = readonly [number, number, number];

const SPACING = 26;
const BASE_RADIUS = 1.05;
const POINTER_RADIUS = 210;
const WAVE_PERIOD_MS = 8000;
const WAVE_WIDTH = 90;

const BASE_DOT: RGB = [161, 161, 170];
const FALLBACK_VIOLET: RGB = [167, 139, 250];
const FALLBACK_BLUE: RGB = [96, 165, 250];

/** Reads a `#rrggbb` CSS variable from :root so the dots follow the design tokens. */
function readColor(name: string, fallback: RGB): RGB {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const match = /^#([0-9a-f]{6})$/i.exec(raw);
  if (!match) return fallback;
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type DotFieldProps = { className?: string };

/**
 * Canvas dot grid. Dots light up (violet to blue) around the cursor, pick up
 * light near the hero orb, and a soft signal ripple radiates from the orb.
 *
 * - Pointer tracking only runs for fine pointers (mouse/trackpad).
 * - `prefers-reduced-motion` renders one static frame: no cursor, no ripple.
 * - The animation loop pauses while the canvas is off-screen or the tab is hidden.
 */
export function DotField({ className }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const violet = readColor("--brand-violet", FALLBACK_VIOLET);
    const blue = readColor("--brand-blue", FALLBACK_BLUE);

    let width = 0;
    let height = 0;
    let anchor = { x: 0, y: 0, radius: 0 };
    let visible = true;
    let frameId = 0;
    const startedAt = performance.now();

    // `x`/`y` chase `targetX`/`targetY`, `strength` chases `targetStrength`.
    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      targetStrength: 0,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The orb is the light source: find it so nearby dots can glow.
      const orb = canvas
        .closest("section")
        ?.querySelector<HTMLElement>("[data-hero-orb]");
      if (orb) {
        const box = orb.getBoundingClientRect();
        anchor = {
          x: box.left - rect.left + box.width / 2,
          y: box.top - rect.top + box.height / 2,
          radius: box.width * 0.85,
        };
      } else {
        anchor = { x: width * 0.75, y: height * 0.5, radius: width * 0.3 };
      }
      draw(performance.now());
    };

    function draw(now: number) {
      pointer.x = lerp(pointer.x, pointer.targetX, 0.16);
      pointer.y = lerp(pointer.y, pointer.targetY, 0.16);
      pointer.strength = lerp(pointer.strength, pointer.targetStrength, 0.08);

      const elapsed = now - startedAt;
      const waveProgress = reduceMotion
        ? 0
        : (elapsed % WAVE_PERIOD_MS) / WAVE_PERIOD_MS;
      const waveRadius = waveProgress * Math.max(width, height) * 0.85;
      const waveIntensity = reduceMotion ? 0 : 0.5 * (1 - waveProgress) ** 1.5;

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width % SPACING) / 2;
      const offsetY = (height % SPACING) / 2;
      const field = new Float32Array(cols * rows);

      ctx!.clearRect(0, 0, width, height);

      // Pass 1: every dot at its resting state, batched into a single path.
      ctx!.fillStyle = `rgba(${BASE_DOT[0]},${BASE_DOT[1]},${BASE_DOT[2]},0.22)`;
      ctx!.beginPath();
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = offsetX + col * SPACING;
          const y = offsetY + row * SPACING;

          let influence = 0;

          if (pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const t = 1 - Math.sqrt(dx * dx + dy * dy) / POINTER_RADIUS;
            if (t > 0) influence = t * t * pointer.strength;
          }

          const ax = x - anchor.x;
          const ay = y - anchor.y;
          const anchorDistance = Math.sqrt(ax * ax + ay * ay);

          const glow = 1 - anchorDistance / anchor.radius;
          if (glow > 0) influence = Math.max(influence, glow * glow * 0.55);

          if (waveIntensity > 0) {
            const delta = Math.abs(anchorDistance - waveRadius);
            if (delta < WAVE_WIDTH) {
              const q = 1 - delta / WAVE_WIDTH;
              influence = Math.max(influence, q * q * waveIntensity);
            }
          }

          field[row * cols + col] = influence;
          ctx!.moveTo(x + BASE_RADIUS, y);
          ctx!.arc(x, y, BASE_RADIUS, 0, Math.PI * 2);
        }
      }
      ctx!.fill();

      // Pass 2: lit dots on top, tinted violet (left) to blue (right).
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const influence = field[row * cols + col];
          if (influence < 0.03) continue;

          const x = offsetX + col * SPACING;
          const y = offsetY + row * SPACING;
          const mix = clamp01(x / width);
          const r = Math.round(lerp(violet[0], blue[0], mix));
          const g = Math.round(lerp(violet[1], blue[1], mix));
          const b = Math.round(lerp(violet[2], blue[2], mix));

          ctx!.fillStyle = `rgba(${r},${g},${b},${0.3 + influence * 0.7})`;
          ctx!.beginPath();
          ctx!.arc(x, y, BASE_RADIUS + influence * 1.7, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    const frame = (now: number) => {
      frameId = 0;
      draw(now);
      if (visible && !document.hidden) {
        frameId = requestAnimationFrame(frame);
      }
    };

    const start = () => {
      if (reduceMotion || frameId) return;
      frameId = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      pointer.targetStrength = inside ? 1 : 0;
      if (!inside) return;
      if (pointer.strength < 0.02) {
        // Entering from outside: appear under the cursor instead of sliding in.
        pointer.x = x;
        pointer.y = y;
      }
      pointer.targetX = x;
      pointer.targetY = y;
    };

    const onPointerLeave = () => {
      pointer.targetStrength = 0;
    };

    const onVisibilityChange = () => {
      if (!document.hidden) start();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
    });
    intersectionObserver.observe(canvas);

    if (!reduceMotion) {
      if (finePointer) {
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        document.documentElement.addEventListener(
          "pointerleave",
          onPointerLeave,
        );
      }
      document.addEventListener("visibilitychange", onVisibilityChange);
      start();
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", className)}
    />
  );
}
