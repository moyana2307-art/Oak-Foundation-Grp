"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react/dist/offline";
import userPlus from "@iconify/icons-lucide/user-plus";
import scan from "@iconify/icons-lucide/scan";
import calendarDays from "@iconify/icons-lucide/calendar-days";
import building2 from "@iconify/icons-lucide/building-2";
import list from "@iconify/icons-lucide/list";
import { PAGE_ACCESS } from "@/lib/access";
import type { Role } from "./register/types";

const NAV_ITEMS = [
  { href: "/", label: "Register", icon: <Icon icon={userPlus} className="h-[19px] w-[19px]" aria-hidden /> },
  { href: "/check-in", label: "Check In", icon: <Icon icon={scan} className="h-[19px] w-[19px]" aria-hidden /> },
  { href: "/programme", label: "Programme", icon: <Icon icon={calendarDays} className="h-[19px] w-[19px]" aria-hidden /> },
  { href: "/partners", label: "Partners", icon: <Icon icon={building2} className="h-[19px] w-[19px]" aria-hidden /> },
  { href: "/attendance", label: "Attendance", icon: <Icon icon={list} className="h-[19px] w-[19px]" aria-hidden /> },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

function visibleItems(role: Role | null): NavItem[] {
  if (!role) {
    return NAV_ITEMS.filter((item) => item.href === "/");
  }
  if (role === "admin") {
    return [...NAV_ITEMS];
  }
  return NAV_ITEMS.filter(
    (item) =>
      item.href === "/" ||
      item.href === "/check-in" ||
      item.href === "/programme" ||
      (item.href === "/attendance" &&
        (PAGE_ACCESS["/attendance"]?.includes(role) ?? false))
  );
}

export default function AppNav({ role }: { role?: Role | null }) {
  const items = visibleItems(role ?? null);
  return (
    <>
      <DesktopSidebar items={items} />
      <MobileHeader items={items} />
    </>
  );
}

function DesktopSidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-[#E3E8EF] bg-white shadow-[4px_0_24px_-12px_rgba(10,25,55,0.15)] md:flex">
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-full w-full object-contain" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-extrabold tracking-[0.04em] text-[#162E55]">
            OAK FOUNDATION
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A97AB]">
            Partner Convening 2026
          </p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Primary">
        <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A97AB]">
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
                  ? "bg-[#162E55] text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.4)]"
                  : "text-[#98A3B5] hover:bg-[#EEF1F5] hover:text-[#162E55]"
              }`}
            >
              <span className={active ? "text-white" : "text-[#8A97AB]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-5 rounded-[14px] bg-[#F4F5F7] p-3.5 ring-1 ring-[#E3E8EF]">
        <p className="text-[11px] font-bold text-[#162E55]">OAK Partner Convening 2026</p>
        <p className="mt-0.5 text-[11px] font-medium text-[#6B7A90]">
          Harare, Zimbabwe &middot; 9–11 March 2026
        </p>
      </div>
    </aside>
  );
}

function MobileHeader({ items }: { items: NavItem[] }) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[#162E55] shadow-[0_4px_18px_-8px_rgba(15,30,60,0.5)] md:hidden">
        <div className="mx-auto flex h-[64px] w-full max-w-[560px] items-center gap-3 px-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] brightness-0 invert">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <div className="shrink-0 leading-none">
            <p className="text-[15px] font-extrabold tracking-[0.06em] text-white">
              OAK
            </p>
            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.28em] text-white/70">
              Foundation
            </p>
          </div>
          <span className="ml-1 h-6 w-px bg-white/25" aria-hidden />
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
            Partner Convening 2026
          </p>
        </div>
      </header>

      <BottomTabBar items={items} />
    </>
  );
}

function BottomTabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/register")) {
    return null;
  }
  const gridCols =
    items.length === 5
      ? "grid-cols-5"
      : items.length === 4
        ? "grid-cols-4"
        : "grid-cols-3";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E3E8EF] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgba(22,46,85,0.25)] md:hidden"
    >
      <div className={`mx-auto grid h-[64px] w-full max-w-[560px] ${gridCols}`}>
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
                  active ? "bg-[#E1E8F5] text-[#162E55]" : "text-current"
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

