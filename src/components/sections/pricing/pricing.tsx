import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

import { BillingProvider } from "./billing-context";
import { BillingToggle } from "./billing-toggle";
import { PricingAssurances } from "./pricing-assurances";
import { PricingCard } from "./pricing-card";
import { PLANS } from "./plans";

/**
 * Plan comparison. The heading sits on the left with the billing toggle on the
 * right; below it three plans, with the recommended one raised and lit from
 * within. Only the toggle and the prices are client components; they share the
 * billing period through <BillingProvider>.
 *
 * Below the `lg` breakpoint the plans stack in one centered column with the
 * recommended plan first, so there is never an orphaned third card.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative isolate py-20 lg:py-28"
    >
      <SectionBackground variant="pricing" />
      <Container>
        <BillingProvider>
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-brand-gradient"
                />
                Pricing
              </span>
              <h2
                id="pricing-heading"
                className="mt-5 font-heading text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground"
              >
                Simple plans that grow with{" "}
                <span className="text-brand-gradient">your campaigns</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                Start with a 14-day free trial, no credit card needed. Upgrade
                as your team and ad spend grow, and change plans or cancel
                whenever you like.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
              <BillingToggle />
              <p className="text-xs text-muted-foreground">
                Prices in USD. Taxes are calculated at checkout.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:mt-16 lg:max-w-none lg:grid-cols-3 lg:items-stretch lg:gap-6">
            {PLANS.map((plan, index) => (
              <Reveal
                key={plan.id}
                delay={index * 0.1}
                className={cn(
                  plan.featured && "order-first lg:order-none lg:-my-3",
                )}
              >
                <PricingCard plan={plan} />
              </Reveal>
            ))}
          </div>

          <PricingAssurances />
        </BillingProvider>
      </Container>
    </section>
  );
}
