"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

import {
  LOGIN_LINK,
  PRIMARY_CTA,
  type NavLink,
} from "./nav-links";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

type MobileMenuProps = {
  id: string;
  open: boolean;
  links: readonly NavLink[];
  activeId: string | null;
  onClose: () => void;
};

/**
 * Mobile / tablet navigation: an elevated panel under the header with a
 * dismissible backdrop. Open/close state, Escape, focus handling and scroll
 * lock live in <Navbar>; this component only renders and animates.
 */
export function MobileMenu({
  id,
  open,
  links,
  activeId,
  onClose,
}: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.22;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          aria-hidden="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="fixed inset-0 -z-10 bg-black/60 lg:hidden"
        />
      )}
      {open && (
        <motion.div
          key="panel"
          id={id}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration, ease: EASE }}
          style={{ transformOrigin: "top center" }}
          className="absolute inset-x-3 top-full mt-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-3 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] sm:inset-x-6 lg:hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-violet/60 to-transparent"
          />

          <nav aria-label="Mobile">
            <motion.ul
              variants={listVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className="flex flex-col gap-1"
            >
              {links.map((link) => {
                const isActive = activeId === link.href.replace(/^#/, "");

                return (
                  <motion.li key={link.href} variants={itemVariants}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-foreground/90 outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-ring",
                        isActive && "bg-brand-violet/10 text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-brand-gradient"
                          />
                        )}
                        {link.label}
                      </span>
                      <ChevronRight
                        className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          <div className="mt-3 grid gap-2.5 border-t border-border/70 pt-3 sm:grid-cols-2">
            <LinkButton
              href={LOGIN_LINK.href}
              variant="secondary"
              size="lg"
              onClick={onClose}
            >
              {LOGIN_LINK.label}
            </LinkButton>
            <LinkButton href={PRIMARY_CTA.href} size="lg" onClick={onClose}>
              {PRIMARY_CTA.label}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </LinkButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
