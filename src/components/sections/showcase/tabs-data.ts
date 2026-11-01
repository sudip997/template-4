import { Send, Target, TrendingUp, type LucideIcon } from "lucide-react";

import type { NavId } from "./dashboard-shell";

export type ShowcaseTabId = "plan" | "publish" | "measure";

export type ShowcaseTab = {
  id: ShowcaseTabId;
  step: string;
  label: string;
  description: string;
  /** Read by screen readers, since the dashboard illustration is decorative. */
  summary: string;
  icon: LucideIcon;
  nav: NavId;
  address: string;
};

export const SHOWCASE_TABS: readonly ShowcaseTab[] = [
  {
    id: "plan",
    step: "01",
    label: "Plan",
    description:
      "Turn a brief into a channel-by-channel timeline, with AI that flags gaps before they cost you.",
    summary:
      "Dashboard preview of a campaign timeline: six channels across eight weeks, with an AI suggestion to move the webinar to Tuesday morning and a budget pacing indicator.",
    icon: Target,
    nav: "campaigns",
    address: "app.vantora.com/campaigns/spring-launch",
  },
  {
    id: "publish",
    step: "02",
    label: "Publish",
    description:
      "Schedule every post, email and ad from one calendar, at the time your audience actually responds.",
    summary:
      "Dashboard preview of a weekly content calendar with scheduled emails, social posts and ads, a post composer, and a confirmation that three posts are queued.",
    icon: Send,
    nav: "calendar",
    address: "app.vantora.com/calendar",
  },
  {
    id: "measure",
    step: "03",
    label: "Measure",
    description:
      "See which touchpoints really drive revenue, with attribution your finance team can trust.",
    summary:
      "Dashboard preview of revenue attribution: a flow diagram from four channels into 184 thousand dollars of revenue, a channel table, and a highlight that email is the top performer.",
    icon: TrendingUp,
    nav: "analytics",
    address: "app.vantora.com/analytics",
  },
] as const;
