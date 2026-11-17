"use client";

import { motion, useReducedMotion } from "motion/react";

/** Holds the top of the letters at 80% and falls to nothing, so the word reads
 *  as rising out of the page rather than sitting on it. Both prefixes: Safari
 *  still needs the -webkit- form for CSS masks. */
const FADE =
  "linear-gradient(to bottom, rgb(0 0 0 / 0.8) 0%, rgb(0 0 0 / 0.35) 55%, transparent 92%)";

/**
 * The oversized "Vantora" that closes the page. Decorative, so it is hidden
 * from assistive technology.
 *
 * It scales with its own width, not the viewport: the wrapper is a size
 * container and the type is sized in `cqw`, so the word fills the content
 * width at every breakpoint and can never cause horizontal overflow. Only the
 * top ~65% of the line is shown, then faded out.
 *
 * It fades up once, the first time it scrolls into view. It uses its own
 * `whileInView` without the negative margin <Reveal> uses: this element is the
 * last thing on the page and, on a phone, shorter than that margin, so
 * <Reveal> would never fire. Reduced motion renders it in its final state.
 */
export function FooterWordmark() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mt-6 select-none @container lg:mt-8"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden [height:15.5cqw]"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      >
        <span className="block text-center font-heading font-semibold tracking-[-0.055em] whitespace-nowrap text-brand-gradient [font-size:24cqw] leading-none">
          Vantora
        </span>
      </motion.div>
    </div>
  );
}
