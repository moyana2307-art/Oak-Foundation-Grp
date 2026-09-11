"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PARTNERS, PARTNER_REGIONS, type PartnerProfile } from "./partnerData";

export default function PartnerDirectory() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARTNERS.filter((p) => {
      if (region !== "All" && p.region !== region) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.focus.toLowerCase().includes(q) ||
        p.kind.toLowerCase().includes(q)
      );
    });
  }, [query, region]);

  return (
    <div className="mt-5">
      <div className="rounded-[16px] border border-[#E3E8EF] bg-white px-4 py-1 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="#98A3B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organisations, focus areas…"
            aria-label="Search partners"
            className="h-[44px] min-w-0 flex-1 bg-transparent text-[14px] text-[#22324A] placeholder:text-[#98A3B5] outline-none"
          />
        </div>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar md:-mx-6 md:px-6" role="tablist" aria-label="Filter by region">
        {PARTNER_REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={region === r}
            onClick={() => setRegion(r)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
              region === r
                ? "bg-[#162E55] text-white"
                : "bg-white text-[#5B6B84] ring-1 ring-[#E3E8EF] hover:bg-[#EEF1F5]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <SubPartnersRow
        onSelect={() => {
          setRegion("All");
          setQuery("");
        }}
      />

      <p className="mt-4 px-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
        {filtered.length === PARTNERS.length ? "All partners" : `${filtered.length} partner${filtered.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-2 space-y-3">
        {filtered.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-6 text-center">
            <p className="text-[13px] text-[#6B7A90]">
              No partners match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubPartnersRow({ onSelect }: { onSelect: () => void }) {
  const subPartners = PARTNERS.slice(0, 5);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
          Sub-Partners
        </p>
        <span className="text-[11px] font-semibold text-[#98A3B5]">
          Quick access
        </span>
      </div>
      <div className="-mx-4 mt-2 flex gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar md:-mx-6 md:px-6">
        {subPartners.map((partner) => (
          <Link
            key={partner.id}
            href={`/partners/${partner.id}`}
            onClick={onSelect}
            className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1E8F5] text-[13px] font-extrabold tracking-tight text-[#2B5BBD] ring-1 ring-inset ring-[#C9D2E0] transition group-hover:bg-[#162E55] group-hover:text-white">
              {partner.acronym}
            </span>
            <span className="w-full truncate text-center text-[10px] font-semibold text-[#43546C]">
              {partner.shortName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: PartnerProfile }) {
  return (
    <Link
      href={`/partners/${partner.id}`}
      className="flex items-start gap-3.5 rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)] transition hover:border-[#C9D2E0] hover:shadow-[0_14px_30px_-16px_rgba(22,46,85,0.4)]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#E5E8EE] text-[13px] font-extrabold tracking-tight text-[#162E55]">
        {partner.acronym}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-[15px] font-bold text-[#162E55]">
            {partner.name}
          </h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="#8A97AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-[#5B6B84]">
          {partner.region} &middot; {partner.kind} &middot; {partner.focus}
        </p>
        <p className="mt-1.5 text-[11px] font-semibold text-[#8A97AB]">
          Partner since {partner.since}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#2B5BBD]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
          {partner.website}
        </p>
      </div>
    </Link>
  );
}