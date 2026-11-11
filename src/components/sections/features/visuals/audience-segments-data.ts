export type RuleId =
  | "purchased"
  | "opened"
  | "spent"
  | "region"
  | "newsletter";

export type Rule = {
  id: RuleId;
  label: string;
  /** Share of the current audience that still matches once the rule is on. */
  keep: number;
};

/** Everyone in the workspace before any rule is applied. */
export const TOTAL_CONTACTS = 84_210;

export const SEGMENT_NAME = "Engaged buyers";

/**
 * Labels are kept short and the order is chosen so the chips wrap into three
 * rows in the narrow card, keeping it close in height to its neighbour.
 */
export const RULES: readonly Rule[] = [
  { id: "purchased", label: "Purchased in 90 days", keep: 0.34 },
  { id: "region", label: "Region: US", keep: 0.63 },
  { id: "opened", label: "Opened in 30 days", keep: 0.52 },
  { id: "spent", label: "Spent $100+", keep: 0.41 },
  { id: "newsletter", label: "Email subscribers", keep: 0.78 },
];

/** The rules that are on when the card first appears. */
export const DEFAULT_RULES: readonly RuleId[] = [
  "purchased",
  "opened",
  "region",
];

/**
 * How many contacts match the active rules. Each rule keeps a fixed share of
 * whoever is left, so the number only falls as rules are added and, even with
 * all five on, stays above zero. With no rules on it is the whole list.
 */
export function audienceSize(active: ReadonlySet<RuleId>): number {
  const size = RULES.reduce(
    (remaining, rule) =>
      active.has(rule.id) ? remaining * rule.keep : remaining,
    TOTAL_CONTACTS,
  );
  return Math.round(size);
}
