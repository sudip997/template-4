import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { SectionBackground } from "@/components/layout/section-background";
import { Reveal } from "@/components/ui/reveal";

import {
  COPYRIGHT_YEAR,
  FOOTER_LINK_GROUPS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
  STATUS,
} from "./data";
import { FooterLink } from "./footer-link";
import { FooterLinkGroup } from "./footer-link-group";
import { FooterNewsletter } from "./footer-newsletter";
import { FooterWordmark } from "./footer-wordmark";

const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Closing footer, after the CTA. An asymmetric layout: the brand, a status
 * pill and social links on the left; three link columns and a newsletter card
 * on the right. Below them a legal row, then an oversized gradient wordmark
 * that rises out of the bottom edge under a pool of violet light.
 *
 * Rendered after <main>, so the `<footer>` is the page's contentinfo landmark.
 * Only <FooterNewsletter> (form state) and <FooterWordmark> (scroll-in) are
 * client components; the rest is rendered on the server.
 *
 * Links are edited in `data.ts`. The hrefs follow the template's route
 * convention (like `/signup` and `/contact-sales`); point them at your own
 * pages.
 */
export function Footer() {
  const lastGroupIndex = FOOTER_LINK_GROUPS.length - 1;
  // With an odd number of groups the last one would sit alone in a cell of the
  // two-column mobile grid, so it spans the row instead.
  const lastGroupSpansRow = FOOTER_LINK_GROUPS.length % 2 === 1;

  return (
    <footer className="relative isolate overflow-hidden pt-16 lg:pt-24">
      <SectionBackground variant="footer" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />

      <Container>
        <h2 className="sr-only">Footer</h2>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Link
              href="/"
              aria-label="Vantora home"
              className={`inline-block rounded-lg ${FOCUS_RING}`}
            >
              <Logo />
            </Link>

            <p className="mt-5 max-w-[19rem] text-[15px] leading-relaxed text-pretty text-muted-foreground">
              Plan, launch and measure every campaign from one workspace.
            </p>

            <Link
              href={STATUS.href}
              className={`group mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-3.5 pl-3 text-[13px] text-muted-foreground backdrop-blur-md transition-colors duration-200 hover:border-white/20 hover:text-foreground motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {STATUS.label}
            </Link>

            <ul
              aria-label="Vantora on social media"
              className="mt-6 flex items-center gap-2"
            >
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Vantora on ${label} (opens in a new tab)`}
                    className={`grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-violet/40 hover:bg-brand-violet/10 hover:text-foreground motion-reduce:transition-colors motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-10 lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
              {FOOTER_LINK_GROUPS.map((group, index) => (
                <FooterLinkGroup
                  key={group.id}
                  group={group}
                  wide={lastGroupSpansRow && index === lastGroupIndex}
                />
              ))}
            </div>

            <FooterNewsletter />
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/[0.08] pt-6 text-[13px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mt-20">
          <p>
            &copy; {COPYRIGHT_YEAR} Vantora, Inc. All rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} size="xs">
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#main-content"
            className={`group inline-flex items-center gap-1.5 rounded-md py-0.5 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground motion-reduce:transition-none ${FOCUS_RING}`}
          >
            Back to top
            <ArrowUp
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              aria-hidden="true"
            />
          </a>
        </div>

        <FooterWordmark />
      </Container>
    </footer>
  );
}
