import { Check, Clock, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Chip,
  FauxButton,
  FloatingCard,
  Panel,
} from "../dashboard-ui";

type Tone = "violet" | "blue";

type Post = {
  channel: "Email" | "Social" | "Blog" | "Ads";
  title: string;
  time: string;
  tone: Tone;
  live?: boolean;
};

type CalendarDay = { label: string; date: number; today?: boolean; posts: readonly Post[] };

const DAYS: readonly CalendarDay[] = [
  {
    label: "Mon",
    date: 2,
    posts: [
      { channel: "Email", title: "Spring teaser", time: "09:00", tone: "violet" },
      { channel: "Social", title: "Teaser clip", time: "12:30", tone: "blue" },
      { channel: "Blog", title: "Product changelog", time: "16:00", tone: "violet" },
    ],
  },
  {
    label: "Tue",
    date: 3,
    posts: [
      { channel: "Social", title: "Behind the scenes", time: "10:00", tone: "blue" },
      { channel: "Blog", title: "Launch post", time: "14:00", tone: "violet" },
      { channel: "Email", title: "Nurture step two", time: "15:30", tone: "violet" },
    ],
  },
  {
    label: "Wed",
    date: 4,
    today: true,
    posts: [
      { channel: "Email", title: "Launch day send", time: "08:30", tone: "violet", live: true },
      { channel: "Social", title: "Live Q and A", time: "17:00", tone: "blue" },
    ],
  },
  {
    label: "Thu",
    date: 5,
    posts: [
      { channel: "Social", title: "Customer story", time: "11:00", tone: "blue" },
      { channel: "Email", title: "Case study", time: "14:00", tone: "violet" },
      { channel: "Ads", title: "Lookalike test", time: "16:30", tone: "blue" },
    ],
  },
  {
    label: "Fri",
    date: 6,
    posts: [
      { channel: "Ads", title: "Retarget ads", time: "13:00", tone: "blue" },
      { channel: "Social", title: "Week in review", time: "15:00", tone: "blue" },
    ],
  },
  { label: "Sat", date: 7, posts: [{ channel: "Social", title: "Weekend recap", time: "10:00", tone: "blue" }] },
  { label: "Sun", date: 8, posts: [] },
];

const ACCENT: Record<Tone, string> = {
  violet: "border-l-brand-violet",
  blue: "border-l-brand-blue",
};

function PostCard({ post }: { post: Post }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border border-l-2 bg-card p-2",
        ACCENT[post.tone],
      )}
    >
      <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
        <span>{post.channel}</span>
        {post.live ? (
          <span className="flex items-center gap-1 text-brand-violet">
            <span className="size-1.5 rounded-full bg-brand-violet" />
            Live
          </span>
        ) : null}
      </div>
      <p className="mt-1 line-clamp-2 text-[11px] leading-tight font-medium text-foreground">
        {post.title}
      </p>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="size-2.5" />
        {post.time}
      </p>
    </div>
  );
}

function WeekCalendar() {
  return (
    <Panel className="hidden min-h-0 flex-1 grid-cols-5 overflow-hidden md:grid lg:grid-cols-7">
      {DAYS.map((day, index) => (
        <div
          key={day.label}
          className={cn(
            "flex min-w-0 flex-col gap-2 p-2",
            index > 0 && "border-l border-border/60",
            index > 4 && "max-lg:hidden",
            day.today && "bg-brand-violet/[0.05]",
          )}
        >
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-[11px] text-muted-foreground">{day.label}</span>
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[11px] font-medium tabular-nums",
                day.today
                  ? "bg-brand-gradient text-background"
                  : "text-foreground",
              )}
            >
              {day.date}
            </span>
          </div>
          {day.posts.map((post) => (
            <PostCard key={`${post.channel}-${post.time}`} post={post} />
          ))}
        </div>
      ))}
    </Panel>
  );
}

/** Compact agenda shown instead of the calendar grid on small screens. */
function Agenda() {
  const items = DAYS.flatMap((day) =>
    day.posts.map((post) => ({ day, post })),
  ).slice(0, 4);

  return (
    <Panel className="flex min-h-0 flex-1 flex-col divide-y divide-border/60 overflow-hidden md:hidden">
      {items.map(({ day, post }) => (
        <div key={`${day.label}-${post.time}`} className="flex items-center gap-3 p-3">
          <span className="w-9 shrink-0 text-center leading-tight">
            <span className="block text-[10px] text-muted-foreground">{day.label}</span>
            <span className="block font-heading text-base font-semibold text-foreground">
              {day.date}
            </span>
          </span>
          <span className={cn("h-9 w-0.5 rounded-full", post.tone === "violet" ? "bg-brand-violet" : "bg-brand-blue")} />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-xs font-medium text-foreground">
              {post.title}
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              {post.channel} · {post.time}
            </span>
          </span>
          {post.live ? <Chip tone="violet">Live</Chip> : null}
        </div>
      ))}
    </Panel>
  );
}

function Composer() {
  return (
    <Panel className="hidden w-[228px] shrink-0 flex-col gap-3 p-4 xl:flex">
      <p className="text-[13px] font-medium text-foreground">New post</p>

      <div className="rounded-lg border border-border bg-background/60 p-3 text-xs leading-relaxed text-foreground">
        Meet the AI campaign planner. Brief it once, publish everywhere.
        <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-brand-violet" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip tone="violet">
          <Check className="size-3" strokeWidth={2.5} />
          Email
        </Chip>
        <Chip>
          <Check className="size-3" strokeWidth={2.5} />
          Social
        </Chip>
        <Chip tone="muted">Blog</Chip>
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[11px] text-muted-foreground">Audience</p>
        <p className="mt-1 text-xs font-medium text-foreground">Trial users · 2,480</p>
        <div className="mt-2.5 flex -space-x-1.5">
          {["bg-brand-violet", "bg-brand-blue", "bg-foreground/60", "bg-brand-violet/60"].map((tone) => (
            <span key={tone} className={cn("size-5 rounded-full ring-2 ring-card", tone)} />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="size-3 text-brand-violet" />
          Best time
        </p>
        <p className="mt-1 text-xs font-medium text-foreground">Tue, 10:00</p>
        <div className="mt-2.5 h-1.5 rounded-full bg-background">
          <div className="h-full w-[78%] rounded-full bg-brand-gradient" />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Predicted reach <span className="text-foreground">18.4k</span>
        </p>
      </div>

      <FauxButton className="mt-auto h-8">Schedule post</FauxButton>
    </Panel>
  );
}

export function PublishView() {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
            Content calendar
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Week of Jun 2 · 14 posts scheduled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FauxButton variant="ghost" className="hidden sm:inline-flex">
            Week
          </FauxButton>
          <FauxButton>Schedule post</FauxButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 sm:gap-4">
        <WeekCalendar />
        <Agenda />
        <Composer />
      </div>
    </div>
  );
}

export function PublishFloaters() {
  return (
    <>
      <FloatingCard
        delay={0.15}
        className="-top-6 -right-4 flex w-[250px] items-center gap-3 xl:-right-10"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-background">
          <Check className="size-4" strokeWidth={2.6} />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-medium text-foreground">
            Scheduled
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            3 posts queued for Tuesday
          </span>
        </span>
      </FloatingCard>

      <FloatingCard
        delay={0.3}
        className="-bottom-6 -left-4 w-[232px] xl:-left-10"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-brand-violet" />
            Best time found
          </span>
          <Chip>+18%</Chip>
        </div>
        <p className="mt-2 font-heading text-lg font-semibold text-foreground">
          Tue · 10:00
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Based on 12 months of engagement
        </p>
      </FloatingCard>
    </>
  );
}
