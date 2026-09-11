"use client";

import { useState } from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type DailyPost,
  type ScheduleBreak,
  type ScheduleEntry,
  type ScheduleSession,
} from "../components/register/types";
import { SCHEDULE_DAYS, SEED_SCHEDULE } from "@/lib/schedule";

type ProgrammeTabsProps = {
  posts: DailyPost[];
  sessionName: string;
  sessionOrg: string;
};

const FEED_SEED: { author: string; org: string; day: string; time: string; note: string }[] = [
  {
    author: "Maria Schmidt",
    org: "Open Society Foundations",
    day: "Day 1 · MON",
    time: "10:40",
    note: "Strong consensus in the room that peer exchange beats expert lectures — 92% vs 74% in the live poll.",
  },
  {
    author: "Tanya Marufu",
    org: "OAK Foundation",
    day: "Day 1 · MON",
    time: "11:15",
    note: "Flagged for the Harare pledge: shared learning infrastructure is the top cross-portfolio ask so far.",
  },
  {
    author: "Ingrid Holm",
    org: "Nordic Evaluation Centre",
    day: "Day 2 · TUE",
    time: "09:45",
    note: "Takeaway from the keynote: 10+ year time horizons are indispensable for systemic change.",
  },
  {
    author: "Naledi Mokoena",
    org: "Digital Frontiers Institute",
    day: "Day 2 · TUE",
    time: "14:20",
    note: "Digital rights need to sit inside every programme area — not be siloed into an ICT line item.",
  },
];

const TAKEAWAYS = [
  "Philanthropy needs to accept 10+ year time horizons for systemic change",
  "Shared learning infrastructure is the most requested resource across the portfolio",
  "Digital rights must be integrated into all programme areas, not siloed",
  "Significantly improve grantee advocacy effectiveness",
  "Peer exchange is rated more valuable than expert-led sessions (92% vs 74%)",
];

const RESOURCES = [
  { name: "Opening Plenary Presentation", meta: "PDF · 3.2 MB", type: "pdf" as const },
  { name: "OAK Portfolio Overview 2024-26", meta: "PDF · Day 2", type: "pdf" as const },
  { name: "Action Planning Workbook", meta: "DOCX · 0.4 MB", type: "doc" as const },
  { name: "Partner Contact Directory", meta: "XLSX · 0.4 MB · All", type: "xls" as const },
  { name: "Photo Gallery (High Res)", meta: "Gallery · All days", type: "gallery" as const },
];

export default function ProgrammeTabs({ posts, sessionName, sessionOrg }: ProgrammeTabsProps) {
  const [view, setView] = useState<"schedule" | "docs">("schedule");
  const [activeDay, setActiveDay] = useState<number>(1);

  const entries = SEED_SCHEDULE[activeDay] ?? [];

  return (
    <div className="mt-5">
      <div className="flex justify-end">
        <div className="inline-grid grid-cols-2 rounded-[14px] bg-[#E5E8EE] p-1">
          <TabButton active={view === "schedule"} onClick={() => setView("schedule")}>
            Schedule
          </TabButton>
          <TabButton active={view === "docs"} onClick={() => setView("docs")}>
            Docs
          </TabButton>
        </div>
      </div>

      {view === "schedule" ? (
        <section aria-label="Schedule">
          <DaySelector activeDay={activeDay} onDayChange={setActiveDay} />
          <CategoryLegend />
          <Timeline entries={entries} />
        </section>
      ) : (
        <DocsView posts={posts} sessionName={sessionName} sessionOrg={sessionOrg} />
      )}
    </div>
  );
}

function DaySelector({
  activeDay,
  onDayChange,
}: {
  activeDay: number;
  onDayChange: (day: number) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="Day">
      {SCHEDULE_DAYS.map((tab) => {
        const active = activeDay === tab.day;
        return (
          <button
            key={tab.day}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onDayChange(tab.day)}
            className={`rounded-[18px] px-3 py-3 text-center transition ${
              active
                ? "bg-[#162E55] text-white shadow-[0_10px_20px_-12px_rgba(22,46,85,0.6)]"
                : "bg-white text-[#162E55] ring-1 ring-[#E3E8EF] hover:bg-[#EEF1F5]"
            }`}
          >
            <span
              className={`block text-[10px] font-extrabold uppercase tracking-[0.16em] ${
                active ? "text-[#A8BAD9]" : "text-[#8A97AB]"
              }`}
            >
              {tab.short}
            </span>
            <span className="mt-1 block text-[17px] font-extrabold tracking-tight">
              Day {tab.day}
            </span>
            <span
              className={`mt-0.5 block text-[11px] font-semibold ${
                active ? "text-[#8FB1DE]" : "text-[#98A3B5]"
              }`}
            >
              {tab.date}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryLegend() {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
      {CATEGORY_ORDER.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7A90]"
        >
          <span
            className="h-2.5 w-2.5 rounded-[4px]"
            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            aria-hidden
          />
          {CATEGORY_LABELS[cat]}
        </span>
      ))}
    </div>
  );
}

function Timeline({ entries }: { entries: ScheduleEntry[] }) {
  return (
    <div className="mt-4 space-y-3">
      {entries.map((entry, i) =>
        entry.type === "break" ? (
          <BreakRow key={i} entry={entry} />
        ) : (
          <SessionRow key={i} entry={entry} />
        )
      )}
    </div>
  );
}

function SessionRow({ entry }: { entry: ScheduleSession }) {
  const tone = CATEGORY_COLORS[entry.category];
  return (
    <article className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
      <div className="flex gap-3">
        <div className="w-[52px] shrink-0 pt-0.5 text-right">
          <p className="text-[14px] font-extrabold tracking-tight text-[#162E55]">
            {entry.startTime}
          </p>
          <p className="text-[10px] font-semibold text-[#98A3B5]">– {entry.endTime}</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-snug text-[#162E55]">{entry.title}</h3>
            <span
              className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ backgroundColor: `${tone}1A`, color: tone }}
            >
              {CATEGORY_LABELS[entry.category]}
            </span>
          </div>
          <p className="mt-1 text-[12px]">
            <span className="font-semibold text-[#2B5BBD]">{entry.speaker}</span>
            <span className="text-[#8A97AB]"> · {entry.org}</span>
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#8A97AB]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {entry.venue}
          </p>
        </div>
      </div>
    </article>
  );
}

function BreakRow({ entry }: { entry: ScheduleBreak }) {
  return (
    <div className="flex items-center justify-center gap-3 px-1">
      <span className="shrink-0 text-[11px] font-bold text-[#98A3B5]">{entry.time}</span>
      <span className="h-px flex-1 border-t border-dashed border-[#C9D2E0]" aria-hidden />
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7A90]">
        {entry.label}
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[#C9D2E0]" aria-hidden />
    </div>
  );
}

function DocsView({
  posts,
  sessionName,
  sessionOrg,
}: {
  posts: DailyPost[];
  sessionName: string;
  sessionOrg: string;
}) {
  return (
    <div className="mt-4">
      <SessionNotesFeed authorName={sessionName} authorOrg={sessionOrg} />
      <SectionHeading>Gallery</SectionHeading>
      <Gallery posts={posts} />
      <SectionHeading>Key Takeaways</SectionHeading>
      <ol className="space-y-2.5">
        {TAKEAWAYS.map((item, i) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-[16px] border border-[#E3E8EF] bg-white px-4 py-3 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.25)]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2B5BBD] text-[11px] font-extrabold text-white">
              {i + 1}
            </span>
            <span className="text-[13px] leading-relaxed text-[#3D4A60]">{item}</span>
          </li>
        ))}
      </ol>
      <SectionHeading>Resources</SectionHeading>
      <div className="space-y-2.5">
        {RESOURCES.map((res) => (
          <div
            key={res.name}
            className="flex items-center gap-3 rounded-[16px] border border-[#E3E8EF] bg-white px-4 py-3 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.25)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#E5E8EE] text-[#162E55]">
              <FileIcon type={res.type} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[#162E55]">{res.name}</p>
              <p className="text-[11px] text-[#8A97AB]">{res.meta}</p>
            </div>
            <button
              type="button"
              aria-label={`Download ${res.name}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF1F5] text-[#162E55] transition hover:bg-[#162E55] hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type FeedItem = { author: string; org: string; day: string; time: string; note: string };

function SessionNotesFeed({ authorName, authorOrg }: { authorName: string; authorOrg: string }) {
  const [items, setItems] = useState<FeedItem[]>(FEED_SEED);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const addNote = () => {
    if (!draft.trim()) return;
    const now = new Date();
    setItems((prev) => [
      {
        author: authorName || "Attendee",
        org: authorOrg || "OAK Foundation",
        day: "Day 2 · TUE",
        time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        note: draft.trim(),
      },
      ...prev,
    ]);
    setDraft("");
    setComposing(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <SectionHeading>Session Notes</SectionHeading>
        <button
          type="button"
          onClick={() => {
            setComposing((v) => !v);
            setDraft("");
          }}
          className="mb-2.5 inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#162E55] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#1F3A6B]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
          {composing ? "Cancel" : "Add Note"}
        </button>
      </div>

      {composing && (
        <div className="mb-3 rounded-[16px] border border-[#E3E8EF] bg-white p-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Share a note from today’s sessions…"
            className="h-auto min-h-[72px] w-full resize-y rounded-[12px] border border-[#E2E7EE] bg-white px-3 py-2 text-[13px] text-[#22324A] placeholder:text-[#98A3B5] outline-none focus:border-[#162E55]/35 focus:ring-2 focus:ring-[#162E55]/10"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="h-[38px] rounded-[11px] border border-[#C9D2E0] bg-white px-4 text-[12px] font-bold text-[#162E55] transition hover:bg-[#F2F5F9]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addNote}
              disabled={!draft.trim()}
              className="h-[38px] rounded-[11px] bg-[#162E55] px-4 text-[12px] font-bold text-white transition hover:bg-[#1F3A6B] disabled:opacity-50"
            >
              Post note
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <article
            key={`${item.author}-${item.time}-${i}`}
            className="rounded-[18px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.25)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[12px] font-bold text-[#31478A]">
                {initials(item.author)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#162E55]">{item.author}</p>
                <p className="truncate text-[11px] text-[#8A97AB]">{item.org}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-[#98A3B5]">
                {item.day} · {item.time}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[#3D4A60]">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery({ posts }: { posts: DailyPost[] }) {
  const urls = posts.flatMap((post) => post.photo_urls ?? []);
  const labels: { day: string; label: string }[] = [
    { day: "Day 1", label: "Opening plenary" },
    { day: "Day 1", label: "Workshop floor" },
    { day: "Day 1", label: "Welcome reception" },
    { day: "Day 2", label: "Keynote" },
    { day: "Day 2", label: "Advocacy lab" },
    { day: "Day 2", label: "Featured panel" },
    { day: "Day 3", label: "Breakouts" },
    { day: "Day 3", label: "Closing plenary" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {labels.map((entry, i) => {
        const url = urls[i];
        return url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={entry.label}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[14px] object-cover"
          />
        ) : (
          <div
            key={i}
            className="relative flex aspect-[4/3] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#8FB1DE]" aria-hidden>
              <rect x="3" y="4" width="18" height="15" rx="3" />
              <circle cx="9" cy="10" r="2" />
              <path d="m6 17 4-4 2.5 2.5L16 12l3 4" />
            </svg>
            <p className="px-2 text-center text-[10px] font-bold uppercase tracking-[0.1em]">
              {entry.day}
            </p>
            <p className="px-2 text-center text-[10px] text-[#A8BAD9]">{entry.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 mt-6 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
      {children}
    </h2>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[38px] rounded-[11px] text-[13px] font-bold transition ${
        active ? "bg-white text-[#162E55] shadow-sm" : "text-[#6B7A90]"
      }`}
    >
      {children}
    </button>
  );
}

function FileIcon({ type }: { type: "pdf" | "doc" | "xls" | "gallery" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      {type === "gallery" ? (
        <>
          <rect x="3" y="4" width="18" height="15" rx="3" />
          <path d="m8 11 3 3 2-2 3 3" />
        </>
      ) : (
        <>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M14 3v4h4" />
          {type === "pdf" && <path d="M9 13v-3h2a1 1 0 0 1 0 2H9m2 0H9m1.5 1V13" />}
          {type === "doc" && <path d="M9 13h6M9 16h4" />}
          {type === "xls" && <path d="M8 13l8 4M16 13l-8 4" />}
        </>
      )}
    </svg>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}