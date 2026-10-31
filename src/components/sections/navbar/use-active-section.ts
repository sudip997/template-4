"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section currently crossing a thin band
 * near the upper-middle of the viewport, or null when none of them are
 * (for example while the Hero is on screen). Sections that are not on the page
 * are ignored.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const tops = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tops.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            tops.delete(entry.target.id);
          }
        }

        let next: string | null = null;
        let closest = Infinity;
        for (const [id, top] of tops) {
          const distance = Math.abs(top);
          if (distance < closest) {
            closest = distance;
            next = id;
          }
        }
        setActiveId(next);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
