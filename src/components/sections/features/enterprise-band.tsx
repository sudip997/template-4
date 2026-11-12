import {
  ArrowRight,
  KeyRound,
  ScrollText,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";
import { IconTile } from "@/components/sections/launch-flow/visuals/visual-ui";

import { RoleAuditVisual } from "./visuals/role-audit-visual";

type Capability = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

/** Placeholder claims for the template. Replace them with what the product
 *  really offers before shipping. */
const CAPABILITIES: readonly Capability[] = [
  {
    icon: KeyRound,
    label: "SAML SSO and SCIM",
    detail: "Okta, Entra ID and Google, with automatic provisioning.",
  },
  {
    icon: ShieldCheck,
    label: "SOC 2 Type II",
    detail: "Independently audited, with the report on request.",
  },
  {
    icon: UsersRound,
    label: "Granular roles",
    detail: "Workspace, brand and campaign-level access.",
  },
  {
    icon: ScrollText,
    label: "12-month audit log",
    detail: "Every action recorded, successes and denials.",
  },
];

/**
 * Full-width closing band for the Features grid. Copy and the enterprise
 * checklist sit on the left; on the right a role switcher and a live audit log
 * let the visitor try the access controls themselves.
 */
export function EnterpriseBand() {
  return (
    <article
      aria-labelledby="enterprise-heading"
      className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-card bg-linear-to-br from-brand-violet/[0.07] via-transparent to-brand-blue/[0.04] p-6 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 8% 0%, rgb(167 139 250 / 0.14), transparent 70%), radial-gradient(ellipse 45% 55% at 96% 100%, rgb(96 165 250 / 0.14), transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/50 to-transparent"
      />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:self-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-muted-foreground backdrop-blur-md">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-gradient"
            />
            Enterprise
          </span>
          <h3
            id="enterprise-heading"
            className="mt-5 font-heading text-2xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-[1.75rem]"
          >
            Enterprise-ready, with{" "}
            <span className="text-brand-gradient">control built in</span>
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground">
            Give every teammate exactly the access they need and keep a complete
            record of everything they do. Try the roles on the right.
          </p>

          <ul className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {CAPABILITIES.map(({ icon, label, detail }) => (
              <li key={label} className="group flex items-start gap-3">
                <IconTile
                  icon={icon}
                  size="sm"
                  tone="neutral"
                  className="transition-colors duration-200 group-hover:bg-brand-violet/15 group-hover:text-brand-violet motion-reduce:transition-none"
                />
                <div className="min-w-0">
                  <p className="text-[13px] leading-5 font-medium text-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <LinkButton href="#pricing" variant="secondary" className="mt-8">
            See Enterprise plan
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </LinkButton>
        </div>

        {/* Bleeds off the right and bottom edges of the band, like the panels
            in the cards above. */}
        <div className="-mx-6 -mb-6 flex flex-col sm:-mx-8 sm:-mb-8 lg:col-span-7 lg:mx-0 lg:-mr-10 lg:-mb-10">
          <RoleAuditVisual />
        </div>
      </div>
    </article>
  );
}
