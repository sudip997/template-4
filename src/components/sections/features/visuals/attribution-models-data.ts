import {
  FileText,
  Mail,
  Megaphone,
  Search,
  type LucideIcon,
} from "lucide-react";

/** One touch in a customer's journey, in the order the customer met it. */
export type Touch = {
  channel: string;
  touchpoint: string;
  icon: LucideIcon;
};

export const TOUCHES: readonly [Touch, Touch, Touch, Touch] = [
  { channel: "Content", touchpoint: "Blog guide", icon: FileText },
  { channel: "Paid social", touchpoint: "Social ad", icon: Megaphone },
  { channel: "Email", touchpoint: "Newsletter", icon: Mail },
  { channel: "Search", touchpoint: "Brand search", icon: Search },
];

export type ModelId = "first" | "last" | "linear" | "data";

export type AttributionModel = {
  id: ModelId;
  /** Short label shown on the switch. */
  label: string;
  /** Full name, used as the accessible name of the option. */
  name: string;
  description: string;
  /** Percentage of credit for each touch, in journey order. Sums to 100. */
  credit: readonly [number, number, number, number];
};

export const MODELS: readonly AttributionModel[] = [
  {
    id: "first",
    label: "First",
    name: "First touch",
    description: "Gives all the credit to the touch that started the journey.",
    credit: [100, 0, 0, 0],
  },
  {
    id: "last",
    label: "Last",
    name: "Last touch",
    description: "Gives all the credit to the touch right before the purchase.",
    credit: [0, 0, 0, 100],
  },
  {
    id: "linear",
    label: "Linear",
    name: "Linear",
    description: "Splits the credit evenly across every touch in the journey.",
    credit: [25, 25, 25, 25],
  },
  {
    id: "data",
    label: "Data-driven",
    name: "Data-driven",
    description: "Weighs each touch by the lift it adds to conversion.",
    credit: [12, 18, 46, 24],
  },
];

export const DEFAULT_MODEL: ModelId = "data";

/** Revenue the credit is applied to, for the dollar figure in the summary. */
export const ATTRIBUTED_REVENUE = 284_600;
