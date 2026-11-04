import type { ComponentType, SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;

/**
 * Placeholder customer brands. Every name and mark here is invented, so the
 * template ships without anyone's trademark. Replace them with real customer
 * logos (inline SVG using `currentColor`, or `next/image`) when you use it.
 *
 * Each mark draws with `currentColor`, which lets the section dim the logos and
 * brighten them on hover with a single text colour.
 */
function MarkBase(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

function LumioMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="3.14 3.14"
        strokeLinecap="round"
      />
    </MarkBase>
  );
}

function KestrelMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12 12 2.5zM12 8.7 8.7 12l3.3 3.3 3.3-3.3z"
        fill="currentColor"
      />
    </MarkBase>
  );
}

function NimbusMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <circle cx="8" cy="14" r="5" fill="currentColor" fillOpacity="0.55" />
      <circle cx="16" cy="14" r="5" fill="currentColor" fillOpacity="0.55" />
      <circle cx="12" cy="9.5" r="5.5" fill="currentColor" fillOpacity="0.8" />
    </MarkBase>
  );
}

function FieldworkMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2.2" fill="currentColor" />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="2.2"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="2.2"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="13.9"
        y="13.9"
        width="6.2"
        height="6.2"
        rx="1.7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </MarkBase>
  );
}

function HelixMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path
        d="M7 3c0 6 10 6 10 9s-10 3-10 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M17 3c0 6-10 6-10 9s10 3 10 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
    </MarkBase>
  );
}

function QuantaMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path
        d="M12 2.8l7.9 4.6v9.2L12 21.2l-7.9-4.6V7.4z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </MarkBase>
  );
}

function TandemMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <rect x="3.5" y="3" width="7" height="18" rx="3.5" fill="currentColor" />
      <rect
        x="13.5"
        y="9"
        width="7"
        height="12"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.55"
      />
    </MarkBase>
  );
}

function VoltraMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path
        d="M13.5 2.5 4.5 13.5h6l-1 8 9-11h-6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </MarkBase>
  );
}

function SolsticeMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path d="M3.5 16.5a8.5 8.5 0 0 1 17 0z" fill="currentColor" />
      <path
        d="M2.5 20.5h19M12 3v2.2M4.9 6.4l1.5 1.5M19.1 6.4l-1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </MarkBase>
  );
}

function RidgelineMark(props: MarkProps) {
  return (
    <MarkBase {...props}>
      <path
        d="M2 19.5 9 7l4.2 7 2.6-4 6.2 9.5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </MarkBase>
  );
}

export type CustomerLogo = {
  name: string;
  Mark: ComponentType<MarkProps>;
  /**
   * Typography that gives each wordmark its own character. Includes the font
   * size, so it must not be combined with another `text-*` size class.
   */
  wordmarkClassName: string;
};

export const LOGOS: readonly CustomerLogo[] = [
  {
    name: "Lumio",
    Mark: LumioMark,
    wordmarkClassName: "font-heading text-xl font-semibold tracking-[-0.03em]",
  },
  {
    name: "Kestrel",
    Mark: KestrelMark,
    wordmarkClassName:
      "font-sans text-[15px] font-bold tracking-[0.2em] uppercase",
  },
  {
    name: "Nimbus",
    Mark: NimbusMark,
    wordmarkClassName: "font-heading text-xl font-medium tracking-[-0.02em]",
  },
  {
    name: "Fieldwork",
    Mark: FieldworkMark,
    wordmarkClassName: "font-sans text-xl font-semibold tracking-[-0.02em]",
  },
  {
    name: "Helix",
    Mark: HelixMark,
    wordmarkClassName: "font-heading text-xl font-light tracking-[0.04em]",
  },
  {
    name: "Quanta",
    Mark: QuantaMark,
    wordmarkClassName:
      "font-sans text-sm font-medium tracking-[0.24em] uppercase",
  },
  {
    name: "Tandem",
    Mark: TandemMark,
    wordmarkClassName: "font-heading text-xl font-bold tracking-[-0.05em]",
  },
  {
    name: "Voltra",
    Mark: VoltraMark,
    wordmarkClassName:
      "font-sans text-xl font-extrabold tracking-[-0.03em] italic",
  },
  {
    name: "Solstice",
    Mark: SolsticeMark,
    wordmarkClassName: "font-heading text-xl font-medium tracking-[0.02em]",
  },
  {
    name: "Ridgeline",
    Mark: RidgelineMark,
    wordmarkClassName: "font-sans text-xl font-semibold tracking-[-0.03em]",
  },
];
