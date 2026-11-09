import { Route, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";

import { FeatureCard } from "./feature-card";
import { AttributionModelsVisual } from "./visuals/attribution-models-visual";
import { PlannerVisual } from "./visuals/planner-visual";

/**
 * Product-led bento grid that follows Launch Flow. Launch Flow tells the
 * connect, publish, measure story; this section shows the capabilities behind
 * it, one card at a time, each with its own small piece of product UI.
 */
export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative isolate py-20 lg:py-28"
    >
      {/* One faint pool of light, on the left to balance Launch Flow's on the
          right. It fades out well inside the section, so it leaves no seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 44% 36% at 22% 34%, color-mix(in srgb, var(--brand-violet) 7%, transparent), transparent 72%)",
        }}
      />

      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-brand-gradient"
              />
              Features
            </span>
            <h2
              id="features-heading"
              className="mt-5 font-heading text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground"
            >
              Built for teams that{" "}
              <span className="text-brand-gradient">ship and measure</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end lg:pb-1">
            From the first brief to the final report, planning, approvals and
            attribution live in one workspace, so nothing drifts apart.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          <Reveal className="md:col-span-2 lg:col-span-7">
            <FeatureCard
              className="h-full"
              icon={Sparkles}
              iconTone="brand"
              title="AI campaign planner"
              description="Describe the goal and Vantora drafts channels, timing and budget from your own past results. Edit the plan, or approve it as is."
              glow="radial-gradient(ellipse 60% 55% at 88% 92%, rgb(167 139 250 / 0.16), transparent 70%), radial-gradient(ellipse 40% 40% at 52% 100%, rgb(96 165 250 / 0.12), transparent 72%)"
            >
              <PlannerVisual />
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <FeatureCard
              className="h-full"
              icon={Route}
              title="Multi-touch attribution"
              description="Compare first-touch, last-touch, linear and data-driven models side by side, and see how credit shifts across every touch."
              glow="radial-gradient(ellipse 55% 50% at 18% 100%, rgb(96 165 250 / 0.15), transparent 70%), radial-gradient(ellipse 45% 40% at 92% 78%, rgb(167 139 250 / 0.12), transparent 72%)"
            >
              <AttributionModelsVisual />
            </FeatureCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
