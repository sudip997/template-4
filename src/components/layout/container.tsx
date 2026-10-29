import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

/** Shared page container: 1200px of content inside a 1280px max width. */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10", className)}
      {...props}
    />
  );
}
