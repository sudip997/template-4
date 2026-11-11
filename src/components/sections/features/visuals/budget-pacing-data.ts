export type CampaignId = "social" | "email" | "search";

export type Campaign = {
  id: CampaignId;
  name: string;
  /** Monthly budget, in dollars. */
  budget: number;
  /** Spent so far this month, in dollars. */
  spent: number;
};

/** Today is day 18 of a 30-day month. */
export const DAY = 18;
export const DAYS_IN_MONTH = 30;

/** Where spend should be by today if it were spread evenly, as a share. */
export const EXPECTED_SHARE = DAY / DAYS_IN_MONTH;

/** The budgets add up to the $24k used in the campaign planner card. */
export const CAMPAIGNS: readonly [Campaign, Campaign, Campaign] = [
  { id: "social", name: "Paid social", budget: 12_000, spent: 8_500 },
  { id: "email", name: "Email", budget: 5_500, spent: 3_400 },
  { id: "search", name: "Search", budget: 6_500, spent: 3_500 },
];

/** The campaign that is running ahead of its pace and triggers the alert. */
export const ALERT_CAMPAIGN: Campaign = CAMPAIGNS[0];

export const TOTAL_BUDGET = CAMPAIGNS.reduce(
  (total, campaign) => total + campaign.budget,
  0,
);
export const TOTAL_SPENT = CAMPAIGNS.reduce(
  (total, campaign) => total + campaign.spent,
  0,
);

/** How far spend is above (positive) or below (negative) today's even pace. */
export function paceDelta(campaign: Campaign): number {
  return campaign.spent / (campaign.budget * EXPECTED_SHARE) - 1;
}

/**
 * Where spend will land at the end of the month. At the current daily rate by
 * default, or with a daily cap applied for the days that are left.
 */
export function projectedSpend(campaign: Campaign, dailyCap?: number): number {
  if (dailyCap === undefined) {
    return (campaign.spent / DAY) * DAYS_IN_MONTH;
  }
  return campaign.spent + dailyCap * (DAYS_IN_MONTH - DAY);
}

/** The day of the month on which the budget runs out at today's rate. */
export function runOutDay(campaign: Campaign): number {
  const dailyRate = campaign.spent / DAY;
  return Math.floor(DAY + (campaign.budget - campaign.spent) / dailyRate);
}

/** The largest round daily cap that keeps the rest of the month in budget. */
export function suggestedDailyCap(campaign: Campaign): number {
  const perDay = (campaign.budget - campaign.spent) / (DAYS_IN_MONTH - DAY);
  return Math.floor(perDay / 10) * 10;
}

export type PaceStatus = {
  /** Worth drawing attention to. */
  flagged: boolean;
  label: string;
};

export function paceStatus(campaign: Campaign): PaceStatus {
  const delta = paceDelta(campaign);
  if (delta > 0.1) {
    return { flagged: true, label: `${Math.round(delta * 100)}% ahead` };
  }
  if (delta < -0.05) {
    return { flagged: false, label: `${Math.round(-delta * 100)}% under` };
  }
  return { flagged: false, label: "On pace" };
}

/** Short dollar amount, like "$8.5k" or "$12k". */
export function formatMoney(amount: number): string {
  if (amount >= 1000) return `$${Number((amount / 1000).toFixed(1))}k`;
  return `$${Math.round(amount)}`;
}
