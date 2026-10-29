import {
  FileText,
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { RevenueChart } from "./revenue-chart";

type NavItem = { label: string; icon: LucideIcon; active?: boolean };
type Kpi = { label: string; value: string; delta: string };
type Channel = { name: string; share: number };

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Campaigns", icon: Megaphone },
  { label: "Audience", icon: Users },
  { label: "Content", icon: FileText },
  { label: "Analytics", icon: TrendingUp },
];

const KPIS: readonly Kpi[] = [
  { label: "Revenue", value: "$48.2k", delta: "+12.4%" },
  { label: "Conversions", value: "3,842", delta: "+8.1%" },
  { label: "ROAS", value: "4.8x", delta: "+0.6" },
];

const CHANNELS: readonly Channel[] = [
  { name: "Email", share: 42 },
  { name: "Paid social", share: 31 },
  { name: "Organic search", share: 18 },
  { name: "Referral", share: 9 },
];

const CONVERSION_BARS: readonly number[] = [
  34, 42, 38, 52, 48, 60, 56, 68, 64, 76, 84, 100,
];

function DeltaChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-blue/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-blue sm:text-[11px]">
      {children}
    </span>
  );
}

function BrandMark() {
  return (
    <span className="grid size-7 place-items-center rounded-lg bg-brand-gradient text-background">
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 6l7 12 7-12" />
      </svg>
    </span>
  );
}

function Sidebar() {
  return (
    <aside className="hidden flex-col gap-6 border-r border-border bg-sidebar p-4 md:flex">
      <div className="flex items-center gap-2.5 px-1">
        <BrandMark />
        <span className="font-heading text-sm font-semibold text-foreground">
          Vantora
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]",
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
        ))}
      </ul>
    </aside>
  );
}

function KpiCard({ label, value, delta }: Kpi) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 sm:p-4">
      <p className="text-[11px] text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-1.5 font-heading text-lg font-semibold tracking-tight tabular-nums text-foreground sm:text-2xl">
        {value}
      </p>
      <div className="mt-2">
        <DeltaChip>
          <TrendingUp className="hidden size-3 sm:block" />
          {delta}
        </DeltaChip>
      </div>
    </div>
  );
}

function ChannelsCard() {
  return (
    <div className="hidden rounded-xl border border-border bg-background/40 p-4 lg:block">
      <p className="text-[13px] font-medium text-foreground">Top channels</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        Share of revenue
      </p>

      <ul className="mt-5 flex flex-col gap-4">
        {CHANNELS.map(({ name, share }, index) => (
          <li key={name}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{name}</span>
              <span className="font-medium tabular-nums text-foreground">
                {share}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand-gradient"
                style={{ width: `${share * 2}%`, opacity: 1 - index * 0.18 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MainWindow() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card [mask-image:linear-gradient(to_bottom,#000_58%,transparent_100%)] before:absolute before:inset-x-12 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-brand-violet/70 before:to-transparent">
      {/* Window chrome */}
      <div className="flex h-10 items-center gap-3 border-b border-border px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </div>
        <div className="mx-auto flex h-6 items-center rounded-md bg-background/60 px-3 text-[11px] text-muted-foreground">
          Overview · Vantora
        </div>
        <div className="hidden w-[42px] sm:block" />
      </div>

      <div className="grid md:grid-cols-[208px_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-w-0 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-heading text-base font-semibold text-foreground sm:text-lg">
                Campaign overview
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Spring Launch · All channels
              </p>
            </div>
            <span className="hidden rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground sm:inline-flex">
              Last 30 days
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            {KPIS.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-[13px] font-medium text-foreground">
                  Revenue vs. ad spend
                </p>
                <div className="hidden items-center gap-4 text-[11px] text-muted-foreground sm:flex">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-brand-violet" />
                    Revenue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 rounded-full bg-brand-blue/70" />
                    Spend
                  </span>
                </div>
              </div>
              <RevenueChart />
            </div>

            <ChannelsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionCard() {
  return (
    <div
      className="absolute -top-9 -right-2 hidden w-[216px] animate-rise md:block lg:-right-6 lg:w-[256px] xl:-right-12"
      style={{ animationDelay: "650ms" }}
    >
      <div
        className="animate-float rounded-xl border border-border bg-secondary p-4 shadow-[0_28px_56px_-18px] shadow-black/80"
        style={{ animationDelay: "-3s" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Conversion rate</p>
            <p className="mt-1.5 font-heading text-[28px] leading-none font-semibold tracking-tight tabular-nums text-foreground">
              6.8%
            </p>
          </div>
          <DeltaChip>+1.2 pts</DeltaChip>
        </div>

        <div className="mt-5 flex h-12 items-end gap-1">
          {CONVERSION_BARS.map((height, index) => (
            <span
              key={index}
              className={cn(
                "flex-1 rounded-[3px]",
                index >= CONVERSION_BARS.length - 3
                  ? "bg-brand-gradient"
                  : "bg-foreground/10",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CampaignCard() {
  return (
    <div
      className="absolute bottom-[10%] -left-2 hidden w-[264px] animate-rise md:block lg:bottom-[12%] lg:-left-6 lg:w-[272px] xl:-left-12"
      style={{ animationDelay: "800ms" }}
    >
      <div
        className="animate-float rounded-xl border border-border bg-secondary p-4 shadow-[0_28px_56px_-18px] shadow-black/80"
        style={{ animationDelay: "-6s" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-background">
            <Megaphone className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-foreground">
              Spring Launch
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Email · 24.8k contacts
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-violet/10 px-2 py-1 text-[11px] font-medium text-brand-violet">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-violet opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-violet" />
            </span>
            Live
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Open rate</span>
            <span className="font-medium tabular-nums text-foreground">
              38.6%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-background">
            <div className="h-full w-[38.6%] rounded-full bg-brand-gradient" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Layered product visual: one main dashboard window with two floating panels.
 * Purely decorative, so it is exposed to assistive tech as a single labelled image.
 */
export function DashboardPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the Vantora dashboard showing revenue, conversion rate and channel performance for a live email campaign"
      className="relative mx-auto w-full max-w-[1080px] animate-rise"
      style={{ animationDelay: "450ms" }}
    >
      <MainWindow />
      <ConversionCard />
      <CampaignCard />
    </div>
  );
}
