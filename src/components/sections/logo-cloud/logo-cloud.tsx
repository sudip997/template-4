import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

import { LOGOS } from "./logos";

/**
 * Social-proof strip that follows the Hero: a short statement on the left, a
 * link to customer stories on the right, and a full-bleed marquee of customer
 * logos whose edges fade into the page on both sides.
 */
export function LogoCloud() {
  return (
    <section
      aria-labelledby="logo-cloud-heading"
      className="relative isolate py-16 lg:py-24"
    >
      {/* Hairline that separates the strip from the Hero, plus a faint pool of
          violet light behind the logos. It fades out well inside the section,
          so it never leaves a seam against the next one. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 46% 46% at 50% 66%, color-mix(in srgb, var(--brand-violet) 9%, transparent), transparent 72%)",
        }}
      />

      <Container>
        <Reveal className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <h2
              id="logo-cloud-heading"
              className="font-heading text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-foreground"
            >
              Trusted by <span className="text-brand-gradient">4,800+</span>{" "}
              marketing teams worldwide
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
              From seed-stage startups to global brands, teams plan, publish and
              prove their campaigns on Vantora.
            </p>
          </div>

          <a
            href="#testimonials"
            className="group inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-foreground outline-none transition-colors hover:text-brand-violet focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read customer stories
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </Container>

      <Container>
        <Reveal delay={0.12} y={0} className="mt-10 lg:mt-14">
          <Marquee
            label="Companies that use Vantora"
            duration={120}
            className="[--marquee-gap:3.5rem] lg:[--marquee-gap:5.5rem]"
          >
            {LOGOS.map(({ name, Mark, wordmarkClassName }) => (
              <li
                key={name}
                className="group/logo flex shrink-0 items-center gap-2.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Mark className="size-6 shrink-0 transition-colors duration-200 group-hover/logo:text-brand-violet" />
                <span
                  className={cn(
                    "leading-none whitespace-nowrap",
                    wordmarkClassName,
                  )}
                >
                  {name}
                </span>
              </li>
            ))}
          </Marquee>
        </Reveal>
      </Container>
    </section>
  );
}
