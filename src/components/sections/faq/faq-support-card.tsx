import { ArrowRight, MessagesSquare } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";

/**
 * "Still have questions?" card. A Server Component that the FAQ explorer slots
 * in under its tabs. The href follows the template's route convention (like
 * `/contact-sales` in the plans); point it at your own support or contact page.
 */
export function FaqSupportCard() {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 0%, rgb(167 139 250 / 0.16), transparent 72%), radial-gradient(ellipse 60% 50% at 0% 100%, rgb(96 165 250 / 0.1), transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/50 to-transparent"
      />

      <div className="flex items-start gap-4 lg:flex-col lg:gap-0">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-violet">
          <MessagesSquare
            className="size-[18px]"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 lg:mt-4">
          <h3 className="font-heading text-lg leading-snug font-semibold tracking-[-0.02em] text-foreground">
            Still have questions?
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
            Talk to a real person on our team. We usually reply within one
            business day.
          </p>
        </div>
      </div>

      <LinkButton href="/contact-sales" className="mt-5 w-full">
        Talk to our team
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        />
      </LinkButton>
    </div>
  );
}
