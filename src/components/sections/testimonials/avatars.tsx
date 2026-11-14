import type { ComponentType, ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils";

type ArtProps = SVGProps<SVGSVGElement>;

/**
 * Five illustrated avatars, drawn as duotone busts in the brand palette so the
 * template ships without anyone's photo. They repeat in a fixed order
 * (`index % 5`), so any number of people can be shown. To use real photos,
 * replace `<Avatar>` with `next/image` inside the tiles.
 */
const FACE = "fill-foreground/90";
const BODY = "fill-foreground/55";
const HAIR = "fill-background/80";

function ArtBase(props: ArtProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

/**
 * Shoulders, neck and head. The head group is scaled up about its centre so the
 * figure fills the circle. `back` is hair that sits behind the head; `children`
 * is hair and accessories in front of it.
 */
function Figure({
  back,
  children,
}: {
  back?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <path d="M5 48c.9-8.8 8.2-13.4 19-13.4S42.1 39.2 43 48z" className={BODY} />
      <g transform="translate(24 21) scale(1.16) translate(-24 -19.5)">
        {back}
        <rect x="20.8" y="24" width="6.4" height="7.6" rx="2.4" className={FACE} />
        <circle cx="24" cy="19.5" r="8" className={FACE} />
        {children}
      </g>
    </>
  );
}

/** Short, swept hair. */
function ShortHairArt(props: ArtProps) {
  return (
    <ArtBase {...props}>
      <Figure>
        <path
          d="M15.7 18.4C15.2 11.8 19 8.2 24 8.2s8.8 3.6 8.3 10.2c-1.5-3-4.3-4.6-8.3-4.6s-6.8 1.6-8.3 4.6z"
          className={HAIR}
        />
      </Figure>
    </ArtBase>
  );
}

/** Long hair that frames the neck. */
function LongHairArt(props: ArtProps) {
  return (
    <ArtBase {...props}>
      <Figure
        back={
          <path
            d="M14.4 20c0-7.2 3.7-11.8 9.6-11.8S33.6 12.8 33.6 20v10.4c0 2-1.2 3.4-3 3.4H17.4c-1.8 0-3-1.4-3-3.4z"
            className={HAIR}
          />
        }
      >
        <path
          d="M16 18c.8-4.6 4-7 8.4-7 3.6 0 6.6 2 7.6 7-2.4-2.4-5-3.4-8-3.4-2.6 0-5.2.8-8 3.4z"
          className={HAIR}
        />
      </Figure>
    </ArtBase>
  );
}

/** Short hair and round glasses. */
function GlassesArt(props: ArtProps) {
  return (
    <ArtBase {...props}>
      <Figure>
        <path
          d="M15.9 17.6c-.2-5.8 3.2-9.4 8.1-9.4s8.3 3.6 8.1 9.4c-.9-2.2-2-3.4-3.4-4-2.6 1.4-6.8 1.4-9.4 0-1.4.6-2.5 1.8-3.4 4z"
          className={HAIR}
        />
        <g className="stroke-background/75" strokeWidth="1.2">
          <circle cx="20.4" cy="19.8" r="2.7" />
          <circle cx="27.6" cy="19.8" r="2.7" />
          <path d="M23.1 19.6h1.8" strokeLinecap="round" />
        </g>
      </Figure>
    </ArtBase>
  );
}

/** Hair pulled up into a bun. */
function BunArt(props: ArtProps) {
  return (
    <ArtBase {...props}>
      <Figure>
        <circle cx="24" cy="8.4" r="3.8" className={HAIR} />
        <path
          d="M15.8 19c-.6-6.4 3-9.6 8.2-9.6s8.8 3.2 8.2 9.6c-1.2-3.8-4.2-6-8.2-6s-7 2.2-8.2 6z"
          className={HAIR}
        />
      </Figure>
    </ArtBase>
  );
}

/** Short hair and a trimmed beard. */
function BeardArt(props: ArtProps) {
  return (
    <ArtBase {...props}>
      <Figure>
        <path
          d="M16.1 20.6c.2 5.8 3.6 8.8 7.9 8.8s7.7-3 7.9-8.8c-1.8 2.2-4.4 3.2-7.9 3.2s-6.1-1-7.9-3.2z"
          className="fill-background/60"
        />
        <path
          d="M16 17.8C15.8 12 19 8.6 24 8.6s8.2 3.4 8 9.2c-.8-2-1.8-3.2-3-3.8-3.4 1.4-6.6 1.4-10 0-1.2.6-2.2 1.8-3 3.8z"
          className={HAIR}
        />
      </Figure>
    </ArtBase>
  );
}

type AvatarDefinition = {
  Art: ComponentType<ArtProps>;
  /** Gradient behind the figure. Each one blends the brand tokens differently. */
  tint: string;
};

const AVATARS: readonly AvatarDefinition[] = [
  { Art: ShortHairArt, tint: "bg-linear-to-br from-brand-violet to-brand-blue" },
  { Art: LongHairArt, tint: "bg-linear-to-tr from-brand-blue to-brand-violet" },
  {
    Art: GlassesArt,
    tint: "bg-linear-to-b from-brand-violet/80 to-brand-violet/30",
  },
  { Art: BunArt, tint: "bg-linear-to-br from-brand-blue/80 to-surface-2" },
  { Art: BeardArt, tint: "bg-linear-to-tl from-brand-violet to-surface-2" },
];

type AvatarProps = {
  /** Which avatar to draw. It wraps around the set of five. */
  index: number;
  size?: "sm" | "md";
  /** Adds a ring in the card colour, which separates overlapping avatars. */
  onSurface?: boolean;
  className?: string;
};

/** Decorative: the person's name always sits next to it, so it is hidden from
 *  assistive technology. */
export function Avatar({
  index,
  size = "md",
  onSurface = false,
  className,
}: AvatarProps) {
  const count = AVATARS.length;
  const { Art, tint } = AVATARS[((index % count) + count) % count];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full",
        size === "sm" ? "size-9" : "size-11",
        onSurface ? "ring-2 ring-card" : "ring-1 ring-white/15",
        tint,
        className,
      )}
    >
      <Art className="size-full" />
    </span>
  );
}

/** Overlapping avatars, cycling through the set in a repeating pattern. */
export function AvatarStack({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("flex items-center", className)}>
      {Array.from({ length: count }, (_, index) => (
        <Avatar
          key={index}
          index={index}
          size="sm"
          onSurface
          className={index > 0 ? "-ml-2.5" : undefined}
        />
      ))}
    </div>
  );
}
