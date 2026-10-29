import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Link styled as a button. Variants are built so no two classes ever compete
 * for the same CSS property, which keeps the result predictable.
 */
const linkButtonVariants = cva(
  "group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg outline-none transition-[filter,box-shadow,background-color,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient font-semibold text-background shadow-[0_8px_24px_-10px] shadow-brand-violet/50 hover:brightness-110 hover:shadow-[0_10px_30px_-10px] hover:shadow-brand-violet/70",
        secondary:
          "border border-border bg-card/40 font-medium text-foreground hover:border-foreground/25 hover:bg-secondary",
      },
      size: {
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof linkButtonVariants>;

function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(linkButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { LinkButton, linkButtonVariants };
