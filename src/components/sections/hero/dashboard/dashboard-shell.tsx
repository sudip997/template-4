import {
  CalendarDays,
  LayoutDashboard,
  Megaphone,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export type NavId = "campaigns" | "calendar" | "analytics";

type NavItem = { id: string; label: string; icon: LucideIcon };

const NAV_ITEMS: readonly NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "audience", label: "Audience", icon: Users },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
];

type DashboardShellProps = {
  activeNav: NavId;
  address: string;
  children: ReactNode;
};

/**
 * Browser-style window around the product preview: chrome, address bar and
 * sidebar. The body of each tab is passed in as children.
 */
export function DashboardShell({
  activeNav,
  address,
  children,
}: DashboardShellProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_50px_140px_-40px] shadow-black before:absolute before:inset-x-16 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-brand-violet/80 before:to-transparent">
      <div className="flex h-11 items-center gap-3 border-b border-border px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </div>
        <div className="mx-auto flex h-6 max-w-[70%] items-center truncate rounded-md bg-background/60 px-3 text-[11px] text-muted-foreground">
          {address}
        </div>
        <div className="hidden w-[42px] sm:block" />
      </div>

      <div className="grid h-[500px] sm:h-[520px] md:grid-cols-[208px_minmax(0,1fr)] lg:h-[560px]">
        <aside className="hidden flex-col gap-6 border-r border-border bg-sidebar p-4 md:flex">
          <div className="flex items-center gap-2.5 px-1">
            <LogoMark className="size-7 rounded-lg" />
            <span className="font-heading text-sm font-semibold text-foreground">
              Vantora
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = id === activeNav;
              return (
                <li
                  key={id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-4", active && "text-brand-violet")}
                    strokeWidth={1.75}
                  />
                  {label}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex items-center gap-2.5 px-2.5 text-[13px] text-muted-foreground">
              <Settings className="size-4" strokeWidth={1.75} />
              Settings
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/40 p-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-brand-gradient text-[11px] font-semibold text-background">
                AK
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-xs font-medium text-foreground">
                  Acme Studio
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Growth plan
                </span>
              </span>
            </div>
          </div>
        </aside>

        <div className="min-h-0 min-w-0 overflow-hidden p-4 sm:p-5 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
