import { cn } from "@/lib/utils";

type LogoProps = { className?: string };

/** Brand mark: a gradient tile with a stacked "V". Shared by Navbar and Footer. */
export function LogoMark({ className }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[10px] bg-brand-gradient shadow-[0_6px_18px_-6px] shadow-brand-violet/60 ring-1 ring-white/20 ring-inset",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]">
        <path
          d="M5 7l7 12 7-12"
          className="stroke-background"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 7l3 5.2L15 7"
          className="stroke-background"
          strokeOpacity="0.45"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-heading text-[19px] font-semibold tracking-[-0.03em] text-foreground">
        Vantora
      </span>
    </span>
  );
}
