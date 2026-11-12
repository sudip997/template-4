import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { Reveal } from "@/components/ui/reveal";

import { StepPlayer } from "./step-player";

/**
 * Three-step walkthrough that follows the Logo Cloud. A list of steps on the
 * left advances on its own, with a bar filling under the active step, while a
 * frosted-glass window on the right shows the matching animated diagram.
 */
export function LaunchFlow() {
  return (
    <section
      id="launch-flow"
      aria-labelledby="launch-flow-heading"
      className="relative isolate py-20 lg:py-28"
    >
      <SectionBackground variant="launch" />
      <Container>
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-gradient"
            />
            Launch flow
          </span>
          <h2
            id="launch-flow-heading"
            className="mt-5 font-heading text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground"
          >
            From first connection to{" "}
            <span className="text-brand-gradient">proven revenue</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Connect once, plan together, and let attribution show where every
            dollar came from. Most teams launch their first campaign in an
            afternoon.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 lg:mt-16">
          <StepPlayer />
        </Reveal>
      </Container>
    </section>
  );
}
