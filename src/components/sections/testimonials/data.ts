/**
 * Content for the Testimonials wall.
 *
 * Placeholder copy: every customer, quote and figure below is invented, so the
 * template ships without anyone's real words or numbers. Replace them with real,
 * permissioned content before shipping.
 *
 * The order of `WALL_TILES` is the order tiles appear on a phone, where the
 * first few show and the rest sit behind "Show more". `placement` holds the
 * Tailwind classes that position each tile on tablet and desktop, so moving a
 * tile around the grid only touches this file.
 */

export type QuoteVariant = "featured" | "statement" | "compact";

type TileBase = {
  id: string;
  /** Grid placement classes (column and row spans) for tablet and desktop. */
  placement: string;
};

export type QuoteTileData = TileBase & {
  kind: "quote";
  /**
   * `featured` is the tall hero quote with a large metric, `statement` is a
   * wide, punchy quote set in the heading font, `compact` is a small one.
   */
  variant: QuoteVariant;
  quote: string;
  name: string;
  role: string;
  /**
   * Should match a name in the Logo Cloud so the badge shows that brand's mark.
   * An unknown name falls back to plain text.
   */
  company: string;
  /** Index into the avatar set. It wraps around, so any number is valid. */
  avatar: number;
  metric?: { value: string; label: string };
};

export type StatTileData = TileBase & {
  kind: "stat";
  eyebrow: string;
  value: string;
  label: string;
  detail: string;
  /** Points of the sparkline, oldest first. Needs at least two. */
  trend: readonly number[];
};

export type RatingTileData = TileBase & {
  kind: "rating";
  eyebrow: string;
  score: string;
  reviewCount: string;
  /** Share of reviews (in percent) for 5, 4, 3, 2 and 1 stars, in that order. */
  distribution: readonly [number, number, number, number, number];
};

export type CommunityTileData = TileBase & {
  kind: "community";
  /** Shown as "Join {teamCount} marketing teams". */
  teamCount: string;
  detail: string;
  /** How many overlapping avatars to show. The avatar set repeats as needed. */
  avatarCount: number;
};

export type WallTileData =
  | QuoteTileData
  | StatTileData
  | RatingTileData
  | CommunityTileData;

/** Phones show this many tiles before the "Show more" button. */
export const COLLAPSED_COUNT = 5;

export const WALL_TILES: readonly WallTileData[] = [
  {
    kind: "quote",
    id: "priya-nair",
    placement: "md:col-span-2 lg:col-span-4 lg:row-span-2",
    variant: "featured",
    quote:
      "We used to argue about which channel deserved the credit. With Vantora's attribution we stopped arguing and moved budget to what actually worked.",
    name: "Priya Nair",
    role: "Head of Growth",
    company: "Lumio",
    avatar: 0,
    metric: { value: "3.2×", label: "return on ad spend in two quarters" },
  },
  {
    kind: "quote",
    id: "marcus-hale",
    placement: "lg:col-span-5",
    variant: "statement",
    quote:
      "Our weekly reporting meeting went from ninety minutes to fifteen. The numbers are simply there, and everyone trusts them.",
    name: "Marcus Hale",
    role: "VP Marketing",
    company: "Kestrel",
    avatar: 1,
  },
  {
    kind: "stat",
    id: "launch-speed",
    placement: "lg:col-span-3",
    eyebrow: "Launch speed",
    value: "2.4×",
    label: "faster campaign launches",
    detail: "Median across teams in their first 90 days.",
    trend: [12, 14, 13, 18, 21, 20, 27, 31, 38],
  },
  {
    kind: "rating",
    id: "customer-rating",
    placement: "lg:col-span-3",
    eyebrow: "Customer rating",
    score: "4.9",
    reviewCount: "2,400+",
    distribution: [92, 6, 1, 1, 0],
  },
  {
    kind: "quote",
    id: "sofia-reyes",
    placement: "lg:col-span-5",
    variant: "statement",
    quote:
      "A pacing alert caught an overspend on a Friday night that would have cost us five figures. That single alert paid for the year.",
    name: "Sofia Reyes",
    role: "Director of Demand Gen",
    company: "Nimbus",
    avatar: 2,
    metric: { value: "$48k", label: "overspend prevented" },
  },
  {
    kind: "community",
    id: "community",
    placement: "lg:col-span-3",
    teamCount: "4,800+",
    detail: "Planning, publishing and proving their campaigns on Vantora.",
    avatarCount: 6,
  },
  {
    kind: "quote",
    id: "daniel-okafor",
    placement: "lg:col-span-4",
    variant: "compact",
    quote:
      "Finance finally trusts our marketing numbers. That alone changed how we plan the year.",
    name: "Daniel Okafor",
    role: "CMO",
    company: "Fieldwork",
    avatar: 3,
  },
  {
    kind: "quote",
    id: "hannah-lindqvist",
    placement: "md:col-span-2 lg:col-span-5",
    variant: "compact",
    quote:
      "The AI planner gets us most of the way to a finished plan in minutes. We refine it instead of starting from a blank page.",
    name: "Hannah Lindqvist",
    role: "Performance Marketing Lead",
    company: "Helix",
    avatar: 4,
  },
];
