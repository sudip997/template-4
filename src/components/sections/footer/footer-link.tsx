import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  /** `sm` for link columns, `xs` for the legal row. */
  size?: "sm" | "xs";
  className?: string;
};

/**
 * Footer text link. A thin gradient underline slides in from the left on hover
 * and keyboard focus (a plain color change for reduced motion). In-page
 * `#anchors` render as a normal anchor; routes go through `next/link`.
 */
const BASE =
  "relative inline-flex w-fit items-center rounded-md py-0.5 text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brand-gradient after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

const SIZES = {
  sm: "text-sm",
  xs: "text-[13px]",
} as const;

export function FooterLink({
  href,
  children,
  size = "sm",
  className,
}: FooterLinkProps) {
  const classes = cn(BASE, SIZES[size], className);

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
