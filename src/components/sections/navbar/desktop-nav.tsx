"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

import type { NavLink } from "./nav-links";

type DesktopNavProps = {
  links: readonly NavLink[];
  activeId: string | null;
};

/**
 * Centered capsule navigation (desktop only). A soft highlight glides between
 * links on hover/focus, and the section in view gets a gradient underline.
 */
export function DesktopNav({ links, activeId }: DesktopNavProps) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", bounce: 0.15, duration: 0.45 };

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul
        className="flex items-center gap-0.5 rounded-full border border-border/80 bg-card/50 p-1 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-md"
        onMouseLeave={() => setHoveredHref(null)}
      >
        {links.map((link) => {
          const isActive = activeId === link.href.replace(/^#/, "");

          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                onMouseEnter={() => setHoveredHref(link.href)}
                onFocus={() => setHoveredHref(link.href)}
                onBlur={() => setHoveredHref(null)}
                className="relative isolate block rounded-full px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=location]:text-foreground"
              >
                {hoveredHref === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden="true"
                    transition={transition}
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                  />
                )}
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden="true"
                    transition={transition}
                    className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-brand-gradient"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
