"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { useId, useRef, useState } from "react";

import {
  IconTile,
  MiniChip,
} from "@/components/sections/launch-flow/visuals/visual-ui";
import { cn } from "@/lib/utils";

import {
  ACTIONS,
  CURRENT_USER,
  DEFAULT_ROLE,
  MAX_ENTRIES,
  ROLES,
  SEED_ENTRIES,
  can,
  requiredRole,
  type Action,
  type AuditEntry,
  type RoleId,
} from "./role-audit-data";

const SWITCH_SPRING = { type: "spring", stiffness: 420, damping: 42 } as const;
const ENTRY_SPRING = { type: "spring", stiffness: 380, damping: 36 } as const;

const PANEL =
  "relative rounded-t-xl border-x border-t border-white/10 p-4 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:p-5";

/**
 * Visual for the enterprise band: two layered glass panels. The front one is a
 * campaign editor with a role switcher; every action in it is a real button
 * that either goes through or is refused, depending on the role. The panel
 * behind it is an audit log that records each switch, success and refusal as
 * it happens.
 *
 * It plays no animation of its own beyond the log entries sliding in; the
 * visitor drives everything. With reduced motion those changes are instant.
 */
export function RoleAuditVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const roleGroupName = useId();
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const ready = Boolean(reduceMotion) || inView;

  const [roleId, setRoleId] = useState<RoleId>(DEFAULT_ROLE);
  const [entries, setEntries] = useState<readonly AuditEntry[]>(SEED_ENTRIES);
  const nextId = useRef(SEED_ENTRIES.length + 1);

  const role = ROLES.find((item) => item.id === roleId) ?? ROLES[0];

  function log(entry: Omit<AuditEntry, "id" | "actor" | "initials">) {
    const next: AuditEntry = {
      id: nextId.current++,
      actor: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      ...entry,
    };
    setEntries((previous) => [next, ...previous].slice(0, MAX_ENTRIES));
  }

  function selectRole(id: RoleId) {
    if (id === roleId) return;
    const next = ROLES.find((item) => item.id === id) ?? ROLES[0];
    setRoleId(id);
    log({
      text: `switched to the ${next.label} role`,
      meta: `${next.label} · just now`,
    });
  }

  function tryAction(action: Action) {
    if (can(roleId, action.id)) {
      log({ text: action.done, meta: `${role.label} · just now` });
      return;
    }
    log({
      text: `was denied “${action.label}”`,
      meta: `${role.label} · just now · needs ${requiredRole(action.id).label}`,
      denied: true,
    });
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid flex-1 gap-4 px-6 transition-opacity duration-500 motion-reduce:transition-none sm:px-8 md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0 lg:px-0",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Front panel: the editor and its role switcher */}
      <div
        className={cn(
          PANEL,
          "z-10 bg-surface-2/80 pb-5 md:pb-12 lg:pb-14",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient font-heading text-xs font-semibold text-background"
            >
              {CURRENT_USER.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] leading-5 font-medium text-foreground">
                {CURRENT_USER.name}
              </p>
              <p className="truncate text-xs leading-5 text-muted-foreground">
                Aurora spring launch · Draft
              </p>
            </div>
          </div>
          <MiniChip>{role.label}</MiniChip>
        </div>

        {/* Role switcher: native radio buttons, so the arrow keys just work. */}
        <fieldset className="mt-4 min-w-0">
          <legend className="mb-2 text-xs text-muted-foreground">
            Preview as
          </legend>
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-background/50 p-1">
            {ROLES.map((item) => {
              const selected = item.id === roleId;
              return (
                <label key={item.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name={roleGroupName}
                    value={item.id}
                    checked={selected}
                    onChange={() => selectRole(item.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "relative block rounded-md px-1 py-1.5 text-center text-xs font-medium transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring motion-reduce:transition-none",
                      selected
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${roleGroupName}-highlight`}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-white/[0.08] ring-1 ring-brand-violet/40"
                        transition={
                          reduceMotion ? { duration: 0 } : SWITCH_SPRING
                        }
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* What this role can do. Locked rows are still buttons: trying one is
            refused and written to the audit log. */}
        <ul className="mt-4 flex flex-col gap-1.5">
          {ACTIONS.map((action) => {
            const allowed = can(roleId, action.id);
            const needs = requiredRole(action.id);
            return (
              <li key={action.id}>
                <button
                  type="button"
                  aria-disabled={!allowed}
                  aria-label={
                    allowed
                      ? action.label
                      : `${action.label}, locked for ${role.label}, needs ${needs.label}`
                  }
                  onClick={() => tryAction(action)}
                  className={cn(
                    "flex h-10 w-full items-center gap-2.5 rounded-lg border px-2.5 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                    allowed
                      ? "border-white/10 bg-background/50 text-foreground hover:border-brand-violet/40 hover:bg-brand-violet/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/15",
                  )}
                >
                  <IconTile
                    icon={action.icon}
                    size="sm"
                    tone={allowed ? "accent" : "neutral"}
                    className={allowed ? undefined : "text-muted-foreground"}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {action.label}
                  </span>
                  {allowed ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-brand-violet">
                      <Check
                        className="size-3.5"
                        strokeWidth={2.6}
                        aria-hidden="true"
                      />
                      Allowed
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Lock
                        className="size-3.5"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      Needs {needs.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Back panel: the audit log, tucked behind the editor on wide screens */}
      <div
        className={cn(
          PANEL,
          "z-0 bg-surface-2/55 pb-12 lg:-ml-10 lg:mt-14 lg:pb-14 lg:pl-14",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] leading-5 font-medium text-foreground">
            Audit log
          </p>
          <MiniChip tone="blue">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-current"
            />
            Live
          </MiniChip>
        </div>

        {/* A log region, so each new entry is announced once to screen readers. */}
        <div role="log" aria-label="Audit log" className="mt-3">
          <ul className="relative h-[16.25rem] overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((entry) => (
                <motion.li
                  key={entry.id}
                  layout={reduceMotion ? false : "position"}
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : ENTRY_SPRING}
                  className="flex h-[3.25rem] items-center gap-2.5 border-b border-white/[0.06] last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold",
                      entry.denied
                        ? "bg-brand-blue/15 text-brand-blue"
                        : "bg-white/[0.06] text-foreground",
                    )}
                  >
                    {entry.denied ? (
                      <Lock className="size-3.5" strokeWidth={2.2} />
                    ) : (
                      entry.initials
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] leading-5 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {entry.actor}
                      </span>{" "}
                      {entry.text}
                    </p>
                    <p className="truncate text-xs leading-5 text-muted-foreground">
                      {entry.meta}
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <p className="mt-3 flex items-center gap-1.5 border-t border-white/[0.08] pt-3 text-xs text-muted-foreground">
          <ShieldCheck
            className="size-3.5 shrink-0 text-brand-violet"
            aria-hidden="true"
          />
          Kept for 12 months, with successes and denials
        </p>
      </div>
    </div>
  );
}
