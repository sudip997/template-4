import { Building2, Rocket, Zap, type LucideIcon } from "lucide-react";

/**
 * How a plan is priced.
 * - `fixed`: `monthly` is the price billed month to month; `yearly` is the
 *   per-month price when billed annually (about 20% lower).
 * - `custom`: no list price, shown as a headline with a short note.
 */
export type PlanPricing =
  | { kind: "fixed"; currency: string; monthly: number; yearly: number }
  | { kind: "custom"; headline: string; note: string };

export type Plan = {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  pricing: PlanPricing;
  /** The recommended plan: gradient border, glow and a badge. */
  featured?: boolean;
  badge?: string;
  /** Heading above the feature list, e.g. "Everything in Starter, plus". */
  featuresLead: string;
  features: readonly string[];
  cta: { label: string; href: string };
};

/**
 * Placeholder plans for the template. Edit the data here and the section
 * updates; no markup needs to change. Keep the yearly price roughly 20% below
 * the monthly one so it matches the "Save 20%" label on the billing toggle.
 *
 * The CTA hrefs follow the template's route convention (like `/login` in the
 * Navbar). Point them at your own sign-up and contact pages.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Rocket,
    tagline: "For small teams launching their first campaigns.",
    pricing: { kind: "fixed", currency: "$", monthly: 29, yearly: 23 },
    featuresLead: "Includes",
    features: [
      "3 team seats",
      "5 active campaigns",
      "Email and social publishing",
      "First- and last-touch attribution",
      "Audience segments, up to 10",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "/signup?plan=starter" },
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    tagline: "For growing teams that need to prove what drives revenue.",
    pricing: { kind: "fixed", currency: "$", monthly: 79, yearly: 63 },
    featured: true,
    badge: "Most popular",
    featuresLead: "Everything in Starter, plus",
    features: [
      "15 team seats",
      "Unlimited campaigns",
      "AI campaign planner",
      "Multi-touch and data-driven attribution",
      "A/B testing with automatic winners",
      "Budget pacing and overspend alerts",
      "Priority support",
    ],
    cta: { label: "Start free trial", href: "/signup?plan=pro" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    tagline: "For organizations that need control, scale and security.",
    pricing: {
      kind: "custom",
      headline: "Custom",
      note: "Volume pricing, tailored to your team and security needs.",
    },
    featuresLead: "Everything in Pro, plus",
    features: [
      "Unlimited seats and brands",
      "SAML SSO and SCIM provisioning",
      "Granular roles and 12-month audit log",
      "SOC 2 Type II report on request",
      "Dedicated success manager",
      "Custom SLA and data retention",
    ],
    cta: { label: "Talk to sales", href: "/contact-sales" },
  },
];
