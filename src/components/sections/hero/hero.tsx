import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/link-button";

import { DashboardPreview } from "./dashboard-preview";

const TRUST_POINTS = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
] as const;

/** Layered lighting behind the hero: violet/blue glows plus a faint grain patch. */
function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="hero-glow absolute inset-0" />
      <div className="bg-noise absolute inset-x-0 top-[32%] h-[640px] opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,#000_0%,transparent_68%)]" />
    </div>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-44"
    >
      <HeroBackground />

      <Container>
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <a
            href="#features"
            className="group animate-rise mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 py-1 pr-3.5 pl-1 text-[13px] text-muted-foreground outline-none transition-colors hover:border-brand-violet/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[11px] font-semibold text-background">
              New
            </span>
            AI campaign planner is here
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <h1
            id="hero-heading"
            className="animate-rise font-heading text-[clamp(2.5rem,7.2vw,4.75rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-foreground"
            style={{ animationDelay: "80ms" }}
          >
            Campaigns that{" "}
            <span className="text-brand-gradient">prove their impact</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Vantora unifies planning, publishing and attribution in one
            workspace, so your team ships faster and sees exactly which channels
            drive revenue.
          </p>

          <div
            className="animate-rise mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <LinkButton href="#pricing" size="lg">
              Start free trial
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </LinkButton>
            <LinkButton href="#features" variant="secondary" size="lg">
              See how it works
            </LinkButton>
          </div>

          <ul
            className="animate-rise mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground"
            style={{ animationDelay: "320ms" }}
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check
                  className="size-3.5 text-brand-violet"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 sm:mt-20">
          <DashboardPreview />
        </div>
      </Container>
    </section>
  );
}
