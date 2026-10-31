"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";
import { LOGIN_LINK, NAV_LINKS, PRIMARY_CTA, SECTION_IDS } from "./nav-links";
import { useActiveSection } from "./use-active-section";

const MOBILE_MENU_ID = "mobile-menu";
const SCROLL_THRESHOLD = 12;
const DESKTOP_QUERY = "(min-width: 1024px)";

/** Subscribes to window scroll and reports whether the page has left the top. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getServerScrolled = () => false;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrolled,
    getServerScrolled,
  );
  const activeId = useActiveSection(SECTION_IDS);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // While the mobile menu is open: lock page scroll, close on Escape or when
  // the viewport grows to desktop, and keep Tab focus inside the header.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const header = headerRef.current;
      if (!header) return;

      const focusable = Array.from(
        header.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!header.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    desktopQuery.addEventListener("change", handleViewportChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      desktopQuery.removeEventListener("change", handleViewportChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Glass layer: fades in once the page scrolls or the menu opens. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-opacity duration-300 motion-reduce:transition-none",
            solid ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="absolute inset-x-[15%] -bottom-px h-px bg-linear-to-r from-transparent via-brand-violet/50 to-transparent" />
        </div>

        <Container className="relative">
          <div className="flex h-16 items-center justify-between lg:grid lg:h-[72px] lg:grid-cols-[1fr_auto_1fr]">
            <Link
              href="/"
              aria-label="Vantora home"
              className="justify-self-start rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Logo />
            </Link>

            <DesktopNav links={NAV_LINKS} activeId={activeId} />

            <div className="flex items-center gap-2 lg:justify-self-end">
              <div className="hidden lg:block">
                <Link
                  href={LOGIN_LINK.href}
                  className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {LOGIN_LINK.label}
                </Link>
              </div>

              <div className="hidden md:block">
                <LinkButton href={PRIMARY_CTA.href}>
                  {PRIMARY_CTA.label}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </LinkButton>
              </div>

              <button
                ref={toggleRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls={MOBILE_MENU_ID}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex size-10 items-center justify-center rounded-lg border border-border bg-card/60 text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              >
                <span aria-hidden="true" className="relative block h-3.5 w-[18px]">
                  <span
                    className={cn(
                      "absolute top-0 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none",
                      menuOpen && "translate-y-1.5 rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-1.5 left-0 h-0.5 w-full rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none",
                      menuOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-3 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none",
                      menuOpen && "-translate-y-1.5 -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>

        <MobileMenu
          id={MOBILE_MENU_ID}
          open={menuOpen}
          links={NAV_LINKS}
          activeId={activeId}
          onClose={closeMenu}
        />
      </header>
    </>
  );
}
