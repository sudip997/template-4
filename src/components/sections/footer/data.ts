import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { NAV_LINKS } from "@/components/sections/navbar/nav-links";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  id: string;
  label: string;
  links: readonly FooterLink[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

/**
 * Footer content. Edit the data here and the Footer updates; no markup needs
 * to change.
 *
 * `#anchors` point at sections on this page. Every other href follows the
 * template's route convention (like `/signup` and `/contact-sales` elsewhere);
 * point them at your own pages.
 */
export const FOOTER_LINK_GROUPS: readonly FooterLinkGroup[] = [
  {
    id: "product",
    label: "Product",
    // The same anchors as the Navbar, so the two never drift apart.
    links: NAV_LINKS,
  },
  {
    id: "company",
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact sales", href: "/contact-sales" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help center", href: "/help" },
      { label: "Changelog", href: "/changelog" },
      { label: "Community", href: "/community" },
    ],
  },
];

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/** Replace the handles with your own profiles. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "X", href: "https://x.com/vantora", icon: IconBrandX },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vantora",
    icon: IconBrandLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/vantora",
    icon: IconBrandGithub,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@vantora",
    icon: IconBrandYoutube,
  },
];

/**
 * Static for the template. Connect it to your status page or uptime provider
 * if you want the dot and label to reflect real incidents.
 */
export const STATUS = {
  label: "All systems operational",
  href: "/status",
} as const;

/**
 * A constant on purpose: with `cacheComponents` enabled, reading the current
 * date while rendering a Server Component fails the build. Update it each year.
 */
export const COPYRIGHT_YEAR = 2026;
