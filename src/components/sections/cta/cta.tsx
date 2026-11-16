import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { LinkButton } from "@/components/ui/link-button";
import { Reveal } from "@/components/ui/reveal";

import { HorizonGlow } from "./horizon-glow";

const TRUST_POINTS = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
] as const;

/**
 * Closing call to action, after the FAQ. One centered panel on the elevated
 * surface, lit from below by a "horizon glow": a dark disc rising from the
 * bottom edge, with a pool of violet and blue light above it. The copy sits
 * well clear of the light so it stays readable.
 *
 * A Server Component: the only client code is <Reveal>, and the glow is pure
 * CSS. The hrefs follow the template's route convention (like `/signup` and
 * `/contact-sales` in the plans); point them at your own pages.
 */
export function Cta() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative isolate py-20 lg:py-28"
    >
      <SectionBackground variant="cta" />

      <Container>
        <Reveal y={18}>
          <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-card px-5 pt-14 pb-40 text-center shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:px-10 sm:pt-16 sm:pb-44 lg:pt-20 lg:pb-52">
            <HorizonGlow />
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/50 to-transparent"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-brand-gradient"
                />
                Get started
              </span>

              <h2
                id="cta-heading"
                className="mt-5 font-heading text-[clamp(2.1rem,4.8vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-foreground"
              >
                Ready to see which campaigns{" "}
                <span className="text-brand-gradient">actually pay off?</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                Plan, publish and measure every campaign from one workspace.
                Connect your channels in minutes and see revenue attribution
                from day one.
              </p>

              <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <LinkButton
                  href="/signup"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Start free trial
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </LinkButton>
                <LinkButton
                  href="/contact-sales"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Book a demo
                </LinkButton>
              </div>

              <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
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
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
