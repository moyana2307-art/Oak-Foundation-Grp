"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Register", icon: <RegisterIcon /> },
  { href: "/check-in", label: "Check In", icon: <ScanIcon /> },
  { href: "/programme", label: "Programme", icon: <CalendarIcon /> },
  { href: "/partners", label: "Partners", icon: <BuildingIcon /> },
  { href: "/attendance", label: "Attendance", icon: <ListIcon /> },
] as const;

export default function AppNav() {
  return (
    <>
      <DesktopSidebar />
      <MobileHeader />
    </>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const items = NAV_ITEMS;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col bg-gradient-to-b from-[#263D61] via-[#1D3150] to-[#162E55] shadow-[4px_0_24px_-12px_rgba(10,25,55,0.6)] lg:flex">
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] brightness-0 invert">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-full w-full object-contain" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-extrabold tracking-[0.04em] text-white">
            OAK FOUNDATION
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8FB1DE]">
            Partner Convening 2026
          </p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Primary">
        <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#6E86B5]">
          Menu
        </p>
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13.5px] font-semibold transition ${
                active
                  ? "bg-white text-[#162E55] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)]"
                  : "text-[#B8C6DE] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={active ? "text-[#162E55]" : "text-[#8FB1DE]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-5 rounded-[14px] bg-white/10 p-3.5 ring-1 ring-white/15">
        <p className="text-[11px] font-bold text-white">OAK Partner Convening 2026</p>
        <p className="mt-0.5 text-[11px] font-medium text-[#A8BAD9]">
          Harare, Zimbabwe &middot; 9–11 March 2026
        </p>
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <>
      <header className="z-30 bg-[#162E55] shadow-[0_4px_18px_-8px_rgba(15,30,60,0.5)] lg:hidden">
        <div className="mx-auto flex h-[56px] w-full max-w-[560px] items-center gap-2.5 px-4">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] brightness-0 invert">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-extrabold tracking-[0.06em] text-white">
              OAK FOUNDATION
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8FB1DE]">
              Partner Convening 2026
            </p>
          </div>
        </div>
      </header>

      <BottomTabBar />
    </>
  );
}

function BottomTabBar() {
  const pathname = usePathname();
  const items = NAV_ITEMS;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E3E8EF] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid h-[64px] w-full max-w-[560px] grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
                active ? "text-[#162E55]" : "text-[#98A3B5]"
              }`}
            >
              <span
                className={`flex h-[30px] w-[44px] items-center justify-center rounded-[14px] transition ${
                  active ? "bg-[#162E55] text-white" : "text-current"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function RegisterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </svg>
  );
}