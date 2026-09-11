"use client";

import { usePathname } from "next/navigation";

const TABLESS_ROUTES = ["/", "/register"];

export default function ShellMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabless = TABLESS_ROUTES.includes(pathname);

  return (
    <main
      className={`flex-1 md:pl-[264px] md:pb-10 ${
        tabless ? "pb-6" : "pb-[88px]"
      }`}
    >
      {children}
    </main>
  );
}