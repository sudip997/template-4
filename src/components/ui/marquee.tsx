import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * How many times the items are laid out inside the track. The track slides by
 * half its own length, so the count must be even for the loop to be seamless.
 * With four copies the track stays filled on screens up to about twice as wide
 * as one copy of the items.
 */
const COPIES = 4;

type MarqueeProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** `<li>` elements. Exposed once to assistive technology, repeated visually. */
  children: ReactNode;
  /** Accessible name for the list of items. */
  label: string;
  /**
   * Seconds per loop, where one loop is two copies of the items. Higher is
   * slower. Applied inline so it always wins over the default token.
   */
  duration?: number;
  /** Scroll left-to-right instead of right-to-left. */
  reverse?: boolean;
  /** Pause while a mouse is hovering over the marquee. */
  pauseOnHover?: boolean;
};

/**
 * Infinite horizontal marquee with softly faded edges.
 *
 * It is a Server Component: the motion is a CSS transform animation (compositor
 * only, no JavaScript), and it is switched off by `prefers-reduced-motion`, in
 * which case the items become a static, centred, wrapped list.
 *
 * Spacing is controlled with the `--marquee-gap` custom property on the root,
 * for example `className="[--marquee-gap:4rem] lg:[--marquee-gap:6rem]"`.
 */
export function Marquee({
  children,
  label,
  duration = 48,
  reverse = false,
  pauseOnHover = true,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("group/marquee fade-edges-x overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "flex w-max will-change-transform motion-reduce:w-full motion-reduce:justify-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            role="list"
            aria-label={copy === 0 ? label : undefined}
            aria-hidden={copy === 0 ? undefined : true}
            className={cn(
              "flex shrink-0 items-center gap-x-[var(--marquee-gap,3rem)] pr-[var(--marquee-gap,3rem)] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8 motion-reduce:pr-0",
              copy > 0 && "motion-reduce:hidden",
            )}
          >
            {children}
          </ul>
        ))}
      </div>
    </div>
  );
}
