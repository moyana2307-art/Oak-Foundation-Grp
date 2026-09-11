"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ROLE_LABELS, type Role } from "@/app/components/register/types";
import AttendanceTable from "./AttendanceTable";
import { EXPECTED_ATTENDEES, SEED_ATTENDEES, useEventStore } from "@/lib/eventStore";

export type Row = {
  id: string;
  name: string;
  organisation: string;
  role: Role;
  registeredAt: string;
  checkinTime: string | null;
};

export default function AttendanceDashboard({
  rows,
  serverCheckedIn,
}: {
  rows: Row[];
  serverCheckedIn: number;
}) {
  const store = useEventStore();

  const seedRows = useMemo<Row[]>(
    () =>
      SEED_ATTENDEES.filter((a) => !rows.some((r) => r.name === a.name)).map((a) => {
        const record = store.records.find((r) => r.id === a.id);
        return {
          id: a.id,
          name: a.name,
          organisation: a.organisation,
          role: a.role,
          registeredAt: "",
          checkinTime: record?.checkedInAt ?? null,
        };
      }),
    [rows, store.records]
  );

  const allRows = useMemo<Row[]>(() => {
    const checkedSeedIds = new Set(store.records.map((r) => r.id));
    const merged = seedRows.map((r) =>
      checkedSeedIds.has(r.id)
        ? {
            ...r,
            checkinTime: store.records.find((rec) => rec.id === r.id)?.checkedInAt ?? null,
          }
        : r
    );
    return [...rows, ...merged];
  }, [rows, seedRows, store.records]);

  const expected = EXPECTED_ATTENDEES;
  const checkedIn = Math.min(expected, serverCheckedIn + store.checkedInCount);
  const pending = Math.max(0, expected - checkedIn);
  const pct = expected > 0 ? Math.min(100, Math.round((checkedIn / expected) * 100)) : 0;

  const todayLabel = new Date().toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-3.5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <p className="text-[26px] font-extrabold leading-none tracking-tight text-[#162E55]">
            {expected}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#6B7A90]">Expected</p>
        </div>
        <div className="rounded-[20px] bg-gradient-to-br from-[#263D61] to-[#162E55] p-3.5 text-white shadow-[0_10px_25px_-16px_rgba(22,46,85,0.5)]">
          <p className="text-[26px] font-extrabold leading-none tracking-tight">{checkedIn}</p>
          <p className="mt-2 text-[11px] font-medium text-[#A8BAD9]">Checked In</p>
        </div>
        <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-3.5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <p className="text-[26px] font-extrabold leading-none tracking-tight text-[#162E55]">
            {pending}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#6B7A90]">Pending</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#162E55] ring-1 ring-[#E3E8EF]">
          Live overview
          <span className="h-1.5 w-1.5 rounded-full bg-[#1E9E62]" aria-hidden />
        </p>
        <p className="text-[11px] font-semibold text-[#8A97AB]">
          {todayLabel} · {pct}% checked in
        </p>
      </div>

      <div className="mt-3 h-[8px] overflow-hidden rounded-full bg-[#E5E8EE]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2B5BBD] to-[#162E55] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {checkedIn === 0 ? (
        <div className="mt-4 rounded-[24px] border border-[#E3E8EF] bg-white p-6 text-center shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#EEF1F5]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2B5BBD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
              <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </span>
          <h2 className="mt-3 text-[16px] font-bold text-[#162E55]">
            No check-ins yet
          </h2>
          <p className="mx-auto mt-1 max-w-[260px] text-[13px] leading-relaxed text-[#6B7A90]">
            Attendees will appear here once they have been scanned in at the event entrance.
          </p>
          <Link
            href="/check-in"
            className="mt-4 inline-flex h-[48px] w-full items-center justify-center rounded-[13px] bg-[#162E55] text-[14px] font-bold text-white transition hover:bg-[#1F3A6B]"
          >
            Go to Check-In Scanner
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-4 rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
              Breakdown by role
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                <div key={role} className="flex items-center justify-between border-b border-[#EFF2F6] pb-2">
                  <dt className="text-[13px] text-[#43546C]">{ROLE_LABELS[role]}</dt>
                  <dd className="text-[15px] font-bold text-[#162E55]">
                    {allRows.filter((r) => r.role === role).length}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <AttendanceTable rows={allRows} />
        </>
      )}
    </div>
  );
}