import { Plug, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import { AttributionVisual } from "./visuals/attribution-visual";
import { ConnectVisual } from "./visuals/connect-visual";
import { PublishVisual } from "./visuals/publish-visual";
import type { VisualProps } from "./visuals/types";

export type Step = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Animated diagram shown beside the list while this step is active. */
  Visual: ComponentType<VisualProps>;
  /** Text alternative for the diagram. */
  visualLabel: string;
};

/** Seconds each step stays active before the player moves on. */
export const STEP_DURATION = 7;

export const STEPS: readonly Step[] = [
  {
    id: "connect",
    title: "Connect your channels",
    description:
      "Link email, social, ads and analytics in minutes, so planning starts from real data instead of guesses.",
    icon: Plug,
    Visual: ConnectVisual,
    visualLabel:
      "Illustration: a quarterly goal card above four channels, Email, Paid social, Search and Analytics, that connect one after another and finish with a Workspace ready badge.",
  },
  {
    id: "publish",
    title: "Plan and publish together",
    description:
      "The AI planner drafts your calendar. Review once, approve, and Vantora publishes everywhere on schedule.",
    icon: Workflow,
    Visual: PublishVisual,
    visualLabel:
      "Illustration: a post moves from Draft through AI review to Schedule, publishes to email, social and search, and appears on Tuesday in a weekly calendar.",
  },
  {
    id: "measure",
    title: "Prove what drives revenue",
    description:
      "Attribution follows every touch through to the deal, so you see exactly where to double down.",
    icon: TrendingUp,
    Visual: AttributionVisual,
    visualLabel:
      "Illustration: Email, Paid social, Content and Search flow into one attributed revenue total that counts up, with Email highlighted as the top performer at 4.9x return on ad spend.",
  },
];
