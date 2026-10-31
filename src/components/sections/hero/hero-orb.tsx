"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const SPRING = { stiffness: 70, damping: 16, mass: 0.9 } as const;

const clampUnit = (value: number) => Math.min(1, Math.max(-1, value));

type Ring = {
  /** Tailwind inset that sizes the ring relative to the orb. */
  inset: string;
  /** 3D tilt of the ring's plane. */
  tilt: string;
  /** Colour of the comet-tail arc. */
  tail: string;
  /** Seconds per revolution. */
  duration: number;
  reverse?: boolean;
};

const RINGS: readonly Ring[] = [
  {
    inset: "inset-0",
    tilt: "rotateX(72deg) rotateY(-16deg)",
    tail: "var(--brand-violet)",
    duration: 34,
  },
  {
    inset: "inset-[9%]",
    tilt: "rotateX(64deg) rotateY(24deg)",
    tail: "var(--brand-blue)",
    duration: 26,
    reverse: true,
  },
  {
    inset: "inset-[18%]",
    tilt: "rotateX(79deg) rotateY(6deg)",
    tail: "#ddd6fe",
    duration: 20,
  },
] as const;

type Particle = {
  left: string;
  top: string;
  size: string;
  tone: string;
  delay: string;
};

const PARTICLES: readonly Particle[] = [
  { left: "12%", top: "26%", size: "size-1.5", tone: "bg-brand-violet", delay: "-2s" },
  { left: "86%", top: "20%", size: "size-1", tone: "bg-white/80", delay: "-5s" },
  { left: "92%", top: "58%", size: "size-1.5", tone: "bg-brand-blue", delay: "-7s" },
  { left: "20%", top: "78%", size: "size-1", tone: "bg-white/70", delay: "-1s" },
  { left: "70%", top: "90%", size: "size-1.5", tone: "bg-brand-violet", delay: "-4s" },
  { left: "6%", top: "52%", size: "size-1", tone: "bg-brand-blue", delay: "-6s" },
] as const;

const SPHERE_BACKGROUND = [
  // specular highlight
  "radial-gradient(circle at 30% 24%, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0) 16%)",
  // blue rim light from the lower right
  "radial-gradient(circle at 84% 88%, rgb(96 165 250 / 0.7) 0%, rgb(96 165 250 / 0) 46%)",
  // violet body falling off to a deep indigo core
  "radial-gradient(circle at 34% 30%, #b9a6fb 0%, #7c5cf0 24%, #4a32b8 50%, #1a1245 80%, #0b0920 100%)",
].join(", ");

const SPHERE_SHADOW = [
  "inset -24px -28px 70px rgb(96 165 250 / 0.4)",
  "inset 12px 14px 36px rgb(255 255 255 / 0.14)",
  "0 0 90px rgb(167 139 250 / 0.45)",
  "0 0 220px rgb(167 139 250 / 0.2)",
].join(", ");

const SWIRL_BACKGROUND =
  "conic-gradient(from 20deg, transparent 0%, rgb(96 165 250 / 0.5) 18%, transparent 36%, rgb(196 181 253 / 0.45) 62%, transparent 80%)";

const GLOW_BACKGROUND =
  "radial-gradient(circle, rgb(167 139 250 / 0.34) 0%, rgb(96 165 250 / 0.13) 38%, transparent 68%)";

/** Subtle latitude/longitude wireframe that makes the sphere read as glass. */
function SphereWireframe() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 size-full opacity-[0.22]"
      fill="none"
      stroke="white"
      strokeWidth="0.25"
    >
      <ellipse cx="50" cy="50" rx="49.5" ry="15" />
      <ellipse cx="50" cy="50" rx="49.5" ry="32" />
      <ellipse cx="50" cy="50" rx="15" ry="49.5" />
      <ellipse cx="50" cy="50" rx="32" ry="49.5" />
      <line x1="0.5" y1="50" x2="99.5" y2="50" />
      <line x1="50" y1="0.5" x2="50" y2="99.5" />
    </svg>
  );
}

/**
 * Decorative abstract orb: a glass-like sphere ringed by tilted orbit arcs with
 * glowing nodes. The orb reacts to the cursor with a spring-driven 3D tilt, and
 * its layers shift at different depths for parallax.
 *
 * Purely decorative, so it is hidden from assistive technology.
 */
export function HeroOrb({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Normalised cursor offset from the orb's centre, -1..1 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, SPRING);
  const y = useSpring(pointerY, SPRING);

  const tiltY = useTransform(x, [-1, 1], [-11, 11]);
  const tiltX = useTransform(y, [-1, 1], [9, -9]);

  const glowX = useTransform(x, [-1, 1], [-16, 16]);
  const glowY = useTransform(y, [-1, 1], [-16, 16]);
  const particleX = useTransform(x, [-1, 1], [26, -26]);
  const particleY = useTransform(y, [-1, 1], [22, -22]);

  useEffect(() => {
    if (reduceMotion) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const dx =
        (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const dy =
        (event.clientY - (rect.top + rect.height / 2)) /
        (window.innerHeight / 2);
      pointerX.set(clampUnit(dx));
      pointerY.set(clampUnit(dy));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion, pointerX, pointerY]);

  return (
    <div
      ref={rootRef}
      data-hero-orb
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-full select-none",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        {/* Ambient glow, behind everything */}
        <motion.div
          className="absolute -inset-[14%]"
          style={{ x: glowX, y: glowY }}
        >
          <div
            className="animate-glow size-full rounded-full"
            style={{ background: GLOW_BACKGROUND }}
          />
        </motion.div>

        {/* 3D stage: sphere + orbit rings tilt toward the cursor */}
        <div className="absolute inset-0" style={{ perspective: 1400 }}>
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-[21%] overflow-hidden rounded-full"
              style={{ background: SPHERE_BACKGROUND, boxShadow: SPHERE_SHADOW }}
            >
              <div
                className="animate-orbit absolute -inset-[18%] rounded-full"
                style={{
                  background: SWIRL_BACKGROUND,
                  mixBlendMode: "screen",
                  maskImage:
                    "radial-gradient(circle, #000 30%, transparent 72%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, #000 30%, transparent 72%)",
                  animationDuration: "40s",
                }}
              />
              <SphereWireframe />
            </div>

            {RINGS.map((ring) => (
              <div
                key={ring.inset}
                className={cn(
                  "absolute rounded-full border border-white/[0.09]",
                  ring.inset,
                )}
                style={{ transform: ring.tilt, transformStyle: "preserve-3d" }}
              >
                <div
                  className="animate-orbit relative size-full"
                  style={{
                    animationDuration: `${ring.duration}s`,
                    animationDirection: ring.reverse ? "reverse" : "normal",
                  }}
                >
                  <div
                    className="orb-ring absolute inset-0 rounded-full"
                    style={{
                      backgroundImage: `conic-gradient(from 0deg, transparent 0%, transparent 30%, ${ring.tail} 100%)`,
                    }}
                  />
                  <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_4px] shadow-brand-blue/70" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating particles, nearest layer: strongest parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ x: particleX, y: particleY }}
        >
          {PARTICLES.map((particle) => (
            <span
              key={`${particle.left}-${particle.top}`}
              className={cn(
                "animate-float absolute rounded-full shadow-[0_0_10px_2px] shadow-brand-violet/50",
                particle.size,
                particle.tone,
              )}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
