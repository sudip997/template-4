"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

import { COLLAPSED_COUNT } from "./data";
import { SpotlightTile } from "./spotlight-tile";

export type WallItem = {
  id: string;
  /** Grid placement classes for tablet and desktop. */
  placement: string;
  /** The tile's content, rendered on the server and passed in. */
  content: ReactNode;
};

type TestimonialWallProps = {
  items: readonly WallItem[];
};

/**
 * The bento grid. Everything inside a tile is rendered on the server; this
 * component only owns what needs the browser: the staggered reveal, the pointer
 * spotlight (through `SpotlightTile`) and the phone-only "Show more" toggle.
 *
 * On a phone the tiles stack in one column, so the wall would run long. Only the
 * first `COLLAPSED_COUNT` show until the visitor expands it. Tablet and desktop
 * always show every tile.
 */
export function TestimonialWall({ items }: TestimonialWallProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const hiddenCount = Math.max(items.length - COLLAPSED_COUNT, 0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);

    // Collapsing shortens the page. If the visitor had scrolled well down the
    // list, bring its top back into view instead of leaving them past it.
    if (!next) {
      requestAnimationFrame(() => {
        const list = listRef.current;
        if (list && list.getBoundingClientRect().top < 0) {
          list.scrollIntoView({ block: "start" });
        }
      });
    }
  };

  return (
    <>
      <ul
        id={listId}
        ref={listRef}
        className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-12 lg:gap-5"
      >
        {items.map((item, index) => {
          const collapsed = !expanded && index >= COLLAPSED_COUNT;

          return (
            <li
              key={item.id}
              className={cn(
                item.placement,
                // `hidden` only below `md`, so tablet and desktop are untouched.
                collapsed ? "max-md:hidden md:flex" : "flex",
              )}
            >
              <Reveal delay={(index % 3) * 0.08} className="flex w-full">
                <SpotlightTile>{item.content}</SpotlightTile>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 ? (
        <div className="mt-6 flex justify-center md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            aria-controls={listId}
            className={linkButtonVariants({ variant: "secondary", size: "lg" })}
          >
            {expanded ? "Show fewer stories" : `Show ${hiddenCount} more stories`}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200 motion-reduce:transition-none",
                expanded && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      ) : null}
    </>
  );
}
