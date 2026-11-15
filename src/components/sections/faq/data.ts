import {
  CreditCard,
  Rocket,
  Route,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: readonly FaqItem[];
};

/**
 * Placeholder questions for the template, written for a marketing platform.
 * Edit the data here and the section updates; no markup needs to change.
 * Keep the claims in step with `pricing/plans.ts` (trial length, yearly
 * discount, refund window and what each plan includes) before shipping.
 *
 * Answers are plain text on purpose: they are also published as FAQ structured
 * data for search engines.
 */
export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: "getting-started",
    label: "Getting started",
    icon: Rocket,
    items: [
      {
        id: "setup-time",
        question: "How long does setup take?",
        answer:
          "Most teams connect their channels and publish a first campaign within a day. Connecting an account takes a couple of minutes, and your history starts syncing right away.",
      },
      {
        id: "no-developer",
        question: "Do I need a developer to get started?",
        answer:
          "No. Channels connect with a secure sign-in, and website tracking is a single snippet you can paste in or add through your tag manager. You only need a developer for custom conversion events.",
      },
      {
        id: "channels",
        question: "Which channels and tools can I connect?",
        answer:
          "Email platforms, paid social and search ad accounts, web analytics and your CRM. Anything else can connect through our REST API and webhooks, which are included on every paid plan.",
      },
      {
        id: "import",
        question: "Can I import my existing campaigns and audiences?",
        answer:
          "Yes. Connected accounts bring in up to 24 months of campaign history, so attribution has a baseline from day one. You can also upload audiences and past results as CSV files.",
      },
      {
        id: "onboarding",
        question: "Will someone help my team onboard?",
        answer:
          "Every plan includes guides and email support. Pro adds priority support, and Enterprise includes a dedicated success manager who runs onboarding with your team.",
      },
    ],
  },
  {
    id: "attribution",
    label: "Attribution",
    icon: Route,
    items: [
      {
        id: "how-attribution-works",
        question: "How does attribution work?",
        answer:
          "Vantora follows each customer's touches across email, social, ads and search through to the closed deal, then shares the credit using the model you choose. You can switch models at any time and compare them side by side.",
      },
      {
        id: "models",
        question: "Which attribution models are included?",
        answer:
          "Starter includes first-touch and last-touch. Pro adds linear and data-driven models, so you can see how credit shifts across every touch in a customer's journey.",
      },
      {
        id: "data-needed",
        question: "How much data does data-driven attribution need?",
        answer:
          "It needs a steady flow of conversions to learn from, typically a few hundred over the last 90 days. Until then, Vantora uses a linear model and lets you know when there is enough data to switch.",
      },
      {
        id: "offline-revenue",
        question: "Can I measure sales-led or offline revenue?",
        answer:
          "Yes. Connect your CRM or upload closed deals as a CSV, and Vantora matches them back to the campaigns that influenced them.",
      },
      {
        id: "sharing-reports",
        question: "Can I share reports with leadership or clients?",
        answer:
          "Share a live dashboard with a view-only link, or schedule a weekly summary by email. Every report shows the model and date range it was built with, so numbers are never taken out of context.",
      },
    ],
  },
  {
    id: "plans-billing",
    label: "Plans and billing",
    icon: CreditCard,
    items: [
      {
        id: "free-trial",
        question: "Is there a free trial?",
        answer:
          "Yes. Every paid plan starts with a 14-day free trial, and you don't need a credit card to begin.",
      },
      {
        id: "change-or-cancel",
        question: "Can I change plans or cancel at any time?",
        answer:
          "Yes. Upgrade whenever you need more, or downgrade and cancel from your billing settings. Changes take effect at the end of your current billing period.",
      },
      {
        id: "plan-limits",
        question: "What happens if I reach my plan limits?",
        answer:
          "We warn you as you approach your seat or campaign limit. Nothing is paused or deleted, and you can upgrade in a click whenever you are ready to add more.",
      },
      {
        id: "yearly-savings",
        question: "How much do I save with yearly billing?",
        answer:
          "About 20 percent compared with paying monthly. Yearly plans are billed once a year, and taxes are calculated at checkout.",
      },
      {
        id: "refunds",
        question: "Do you offer refunds?",
        answer:
          "Yes. If Vantora isn't the right fit, contact us within 30 days of your first payment and we will refund it in full.",
      },
    ],
  },
  {
    id: "security-data",
    label: "Security and data",
    icon: ShieldCheck,
    items: [
      {
        id: "encryption",
        question: "Where is my data stored, and is it encrypted?",
        answer:
          "Your data is encrypted in transit and at rest, and stored in secure cloud data centers. Enterprise customers can also choose their data region and retention period.",
      },
      {
        id: "soc2",
        question: "Is Vantora SOC 2 compliant?",
        answer:
          "Yes. Vantora is independently audited for SOC 2 Type II, and the report is available on request under NDA.",
      },
      {
        id: "sso-roles",
        question: "Do you support SSO and role-based access?",
        answer:
          "Enterprise includes SAML SSO, SCIM provisioning and granular roles at the workspace, brand and campaign level, plus a 12-month audit log of every action.",
      },
      {
        id: "ai-training",
        question: "Is my data used to train AI models?",
        answer:
          "No. Your campaign data powers your own planner and reports. It is never sold, and it is never used to train models for other customers.",
      },
      {
        id: "export-delete",
        question: "Can I export or delete my data?",
        answer:
          "Yes. Workspace admins can export campaigns, audiences and reports at any time. When you close a workspace, its data is permanently deleted within 30 days.",
      },
    ],
  },
];
