import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { LinkButton } from "@/components/ui/link-button";
import { Reveal } from "@/components/ui/reveal";

import { WALL_TILES } from "./data";
import { TestimonialWall, type WallItem } from "./testimonial-wall";
import { WallTileContent } from "./tiles";

/** Tile markup is rendered here, on the server, and handed to the client wall. */
const ITEMS: readonly WallItem[] = WALL_TILES.map((tile) => ({
  id: tile.id,
  placement: tile.placement,
  content: <WallTileContent tile={tile} />,
}));

/**
 * Wall of proof that follows Features. Instead of flipping through one quote at
 * a time, it lays proof out as an asymmetric bento grid: a tall hero quote, wide
 * and compact quotes, and tiles that are pure numbers (a stat with a trend line,
 * a rating, a community count). The Navbar's "Customers" link and the Logo
 * Cloud's "Read customer stories" link both land here.
 */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate py-20 lg:py-28"
    >
      <SectionBackground variant="testimonials" />
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-brand-gradient"
              />
              Customers
            </span>
            <h2
              id="testimonials-heading"
              className="mt-5 font-heading text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground"
            >
              Teams that stopped guessing and{" "}
              <span className="text-brand-gradient">started proving</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              From lean startups to global brands, marketing teams use Vantora
              to launch faster, spend smarter and show finance exactly what
              drove revenue.
            </p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end lg:pb-1">
            <LinkButton href="#pricing" size="lg">
              Start free trial
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </LinkButton>
          </div>
        </Reveal>

        <TestimonialWall items={ITEMS} />
      </Container>
    </section>
  );
}
