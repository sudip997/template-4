import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { Reveal } from "@/components/ui/reveal";

import { FAQ_CATEGORIES } from "./data";
import { FaqExplorer } from "./faq-explorer";
import { FaqSupportCard } from "./faq-support-card";

/** The same questions as FAQ structured data, so search engines can read them
 *  even though only one category is open at a time on screen. */
const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  ),
};

/**
 * Closing section of the page content, after Pricing. The heading row matches
 * the other sections; below it a category rail sits beside an accordion, so a
 * visitor can jump straight to setup, attribution, billing or security. The
 * Navbar's "FAQ" link and Pricing's "Read the FAQ" link both land here.
 *
 * Only <FaqExplorer> is a client component; the heading and support card are
 * rendered on the server.
 */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate py-20 lg:py-28"
    >
      <SectionBackground variant="faq" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // "<" is escaped so no answer text can ever close the script tag.
          __html: JSON.stringify(FAQ_STRUCTURED_DATA).replace(/</g, "\\u003c"),
        }}
      />
      <Container>
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-gradient"
            />
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="mt-5 font-heading text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground"
          >
            Questions, <span className="text-brand-gradient">answered</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Quick answers about setup, attribution, plans and security. Pick a
            topic to jump straight to what you need.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 lg:mt-16">
          <FaqExplorer aside={<FaqSupportCard />} />
        </Reveal>
      </Container>
    </section>
  );
}
