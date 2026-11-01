import { Container } from "@/components/layout/container";

import { ShowcaseTabs } from "./showcase-tabs";

/**
 * Product tour: a large, layered dashboard preview with three tabs
 * (Plan, Publish, Measure). Sits directly under the Hero.
 */
export function Showcase() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="showcase-heading"
      className="relative isolate overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32"
    >
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-brand-violet">
            <span className="size-1.5 rounded-full bg-brand-gradient" />
            One workspace, three steps
          </p>
          <h2
            id="showcase-heading"
            className="mt-5 font-heading text-[clamp(2rem,4.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-foreground"
          >
            Plan it. Ship it.{" "}
            <span className="text-brand-gradient">Prove it.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Switch between the steps to see how Vantora takes a campaign from
            first brief to a revenue report your finance team will trust.
          </p>
        </header>

        <ShowcaseTabs />
      </Container>
    </section>
  );
}
