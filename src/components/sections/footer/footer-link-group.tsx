import { cn } from "@/lib/utils";

import type { FooterLinkGroup as FooterLinkGroupData } from "./data";
import { FooterLink } from "./footer-link";

type FooterLinkGroupProps = {
  group: FooterLinkGroupData;
  /**
   * Use for a lone last group on the two-column mobile grid: it spans both
   * columns and flows its links into two, so no empty cell is left beside it.
   * From `sm` up it is an ordinary column.
   */
  wide?: boolean;
};

/** One labelled column of footer links. A Server Component. */
export function FooterLinkGroup({ group, wide = false }: FooterLinkGroupProps) {
  const headingId = `footer-${group.id}-heading`;

  return (
    <nav
      aria-labelledby={headingId}
      className={cn(wide && "col-span-2 sm:col-span-1")}
    >
      <h3
        id={headingId}
        className="font-heading text-sm font-semibold tracking-[-0.01em] text-foreground"
      >
        {group.label}
      </h3>
      <ul
        className={cn(
          "mt-4",
          wide
            ? "grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-col"
            : "flex flex-col gap-3",
        )}
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
