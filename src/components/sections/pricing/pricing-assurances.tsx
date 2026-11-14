import { ArrowUpRight, Clock, CreditCard, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

const ASSURANCES = [
  { icon: Clock, label: "14-day free trial on every paid plan" },
  { icon: CreditCard, label: "No credit card required" },
  { icon: ShieldCheck, label: "30-day money-back guarantee" },
] as const;

/**
 * Slim strip under the plans: the promises that remove risk on the left, a
 * link to billing questions on the right. A hairline, not another card, so it
 * stays quiet next to the plans.
 */
export function PricingAssurances() {
  return (
    <Reveal
      y={0}
      delay={0.1}
      className="mt-12 flex flex-col items-center gap-5 border-t border-white/[0.08] pt-8 lg:mt-16 lg:flex-row lg:justify-between"
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
        {ASSURANCES.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2.5 text-sm text-muted-foreground"
          >
            <span className="grid size-7 place-items-center rounded-md bg-white/[0.06] text-brand-violet">
              <Icon className="size-3.5" strokeWidth={2.1} aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <a
        href="#faq"
        className="group inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-foreground outline-none transition-colors hover:text-brand-violet focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Questions about billing? Read the FAQ
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          aria-hidden="true"
        />
      </a>
    </Reveal>
  );
}
