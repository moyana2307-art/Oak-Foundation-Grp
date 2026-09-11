"use client";

import { useMemo, useState } from "react";
import { ROLE_LABELS, type Role } from "@/app/components/register/types";

type Row = {
  id: string;
  name: string;
  organisation: string;
  role: Role;
  registeredAt: string;
  checkinTime: string | null;
};

export default function AttendanceTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [attendance, setAttendance] = useState<"all" | "yes" | "no">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (attendance === "yes" && !r.checkinTime) return false;
      if (attendance === "no" && r.checkinTime) return false;
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.organisation ?? "").toLowerCase().includes(q) ||
        (ROLE_LABELS[r.role] ?? r.role).toLowerCase().includes(q)
      );
    });
  }, [rows, query, attendance, roleFilter]);

  return (
    <section className="mt-5 rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(28,53,93,0.3)]">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
        Participant list
      </h2>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, organisation…"
          className="h-[44px] min-w-0 flex-1 rounded-[12px] border border-[#E3E8EF] bg-[#EEF1F5] px-3 text-[13px] text-[#22324A] placeholder:text-[#9BA7BA] outline-none focus:border-[#1C355D]/35 focus:ring-2 focus:ring-[#1C355D]/10"
        />
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value as "all" | "yes" | "no")}
          className="h-[44px] rounded-[12px] border border-[#E3E8EF] bg-[#EEF1F5] px-3 text-[13px] font-medium text-[#22324A] outline-none focus:border-[#1C355D]/35"
        >
          <option value="all">All attendance</option>
          <option value="yes">Attended</option>
          <option value="no">Not attended</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | Role)}
          className="h-[44px] rounded-[12px] border border-[#E3E8EF] bg-[#EEF1F5] px-3 text-[13px] font-medium text-[#22324A] outline-none focus:border-[#1C355D]/35"
        >
          <option value="all">All roles</option>
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-[12px] text-[#6B7A90]">
        {filtered.length} of {rows.length} participants
      </p>

      <ul className="mt-2 divide-y divide-[#EFF2F6]">
        {filtered.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-3">
            <Avatar name={r.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1C355D]">{r.name}</p>
              <p className="truncate text-[12px] text-[#6B7A90]">
                {(ROLE_LABELS[r.role] ?? r.role).toLowerCase()}
                {r.organisation ? ` · ${r.organisation}` : ""}
              </p>
            </div>
            <div className="text-right">
              {r.checkinTime ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F4EC] px-2.5 py-1 text-[11px] font-semibold text-[#1E9E62]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E9E62]" aria-hidden />
                  {formatTime(r.checkinTime)}
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[11px] font-semibold text-[#6B7A90]">
                  Not attended
                </span>
              )}
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-[13px] text-[#6B7A90]">
            No participants match your filters.
          </li>
        )}
      </ul>
    </section>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[12px] font-bold text-[#2B5BBD]">
      {initials || "?"}
    </span>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  }) + " · " + new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
