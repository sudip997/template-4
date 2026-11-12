import {
  BadgeCheck,
  Eye,
  PenLine,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type RoleId = "admin" | "editor" | "reviewer" | "viewer";

export type Role = {
  id: RoleId;
  label: string;
};

/** From the most to the least access. */
export const ROLES: readonly Role[] = [
  { id: "admin", label: "Admin" },
  { id: "editor", label: "Editor" },
  { id: "reviewer", label: "Reviewer" },
  { id: "viewer", label: "Viewer" },
];

export const DEFAULT_ROLE: RoleId = "editor";

export type ActionId = "view" | "edit" | "approve" | "budget" | "invite";

export type Action = {
  id: ActionId;
  label: string;
  icon: LucideIcon;
  /** How the audit log words it when the action goes through. */
  done: string;
};

export const ACTIONS: readonly Action[] = [
  { id: "view", label: "View reports", icon: Eye, done: "opened the Q4 report" },
  {
    id: "edit",
    label: "Edit content",
    icon: PenLine,
    done: "edited the Aurora launch email",
  },
  {
    id: "approve",
    label: "Approve for publish",
    icon: BadgeCheck,
    done: "approved the Aurora launch email",
  },
  {
    id: "budget",
    label: "Edit budgets",
    icon: Wallet,
    done: "raised the Paid social budget",
  },
  {
    id: "invite",
    label: "Invite members",
    icon: UserPlus,
    done: "invited sam@northwind.io",
  },
];

const PERMISSIONS: Record<RoleId, readonly ActionId[]> = {
  admin: ["view", "edit", "approve", "budget", "invite"],
  editor: ["view", "edit"],
  reviewer: ["view", "approve"],
  viewer: ["view"],
};

export function can(role: RoleId, action: ActionId): boolean {
  return PERMISSIONS[role].includes(action);
}

/** The role with the least access that can still do the action. */
export function requiredRole(action: ActionId): Role {
  const leastFirst = [...ROLES].reverse();
  return leastFirst.find((role) => can(role.id, action)) ?? ROLES[0];
}

export const CURRENT_USER = { name: "Maya Chen", initials: "MC" } as const;

export type AuditEntry = {
  id: number;
  actor: string;
  initials: string;
  /** What happened, written to follow the actor's name. */
  text: string;
  /** Role, time and any extra detail. */
  meta: string;
  /** An attempt that was refused. */
  denied?: boolean;
};

/** How many entries the log shows. Older ones drop off the bottom. */
export const MAX_ENTRIES = 5;

/** What the log already holds when the card first appears, newest first. */
export const SEED_ENTRIES: readonly AuditEntry[] = [
  {
    id: 5,
    actor: "Dev Patel",
    initials: "DP",
    text: "approved the Aurora launch email",
    meta: "Reviewer · 2m ago",
  },
  {
    id: 4,
    actor: "Sofia Rossi",
    initials: "SR",
    text: "raised the Paid social budget",
    meta: "Admin · 9m ago",
  },
  {
    id: 3,
    actor: "Liam Walker",
    initials: "LW",
    text: "invited ana@northwind.io",
    meta: "Admin · 24m ago",
  },
  {
    id: 2,
    actor: "Ana Silva",
    initials: "AS",
    text: "opened the Q4 report",
    meta: "Viewer · 41m ago",
  },
  {
    id: 1,
    actor: "Noah Kim",
    initials: "NK",
    text: "edited the Aurora launch email",
    meta: "Editor · 1h ago",
  },
];
