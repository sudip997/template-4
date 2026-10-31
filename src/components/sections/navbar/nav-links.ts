export type NavLink = {
  label: string;
  href: string;
};

/**
 * In-page anchors. The ids match the section ids the rest of the template is
 * expected to use (the Hero already links to #features and #pricing).
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

/** Section ids derived from the anchors, used for scroll-spy highlighting. */
export const SECTION_IDS: readonly string[] = NAV_LINKS.map((link) =>
  link.href.replace(/^#/, ""),
);

export const PRIMARY_CTA: NavLink = {
  label: "Start free trial",
  href: "#pricing",
};

export const LOGIN_LINK: NavLink = {
  label: "Log in",
  href: "/login",
};
