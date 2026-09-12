import { redirect } from "next/navigation";
import { Icon } from "@iconify/react/dist/offline";
import mapPin from "@iconify/icons-lucide/map-pin";
import CheckinScanner from "./CheckinScanner";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { Role } from "@/app/components/register/types";

type RecentPerson = {
  id: string;
  name: string;
  organisation: string;
  role: Role;
  time: string;
};

export default async function CheckinPage() {
  const session = await requireRole(["oak_staff", "coordination_team", "presenter", "observer", "partner"]);
  if (!session) {
    redirect("/");
  }

  const supabase = await createClient();

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const [{ count }, { data: todayCheckins }] = await Promise.all([
    supabase
      .from("checkins")
      .select("id", { count: "exact", head: true })
      .gte("checked_in_at", dayStart.toISOString()),
    supabase
      .from("checkins")
      .select("attendee_id, checked_in_at")
      .order("checked_in_at", { ascending: false })
      .limit(8),
  ]);

  const checkins = (todayCheckins ?? []) as { attendee_id: string; checked_in_at: string }[];
  const ids = [...new Set(checkins.map((c) => c.attendee_id))];

  let recent: RecentPerson[] = [];
  if (ids.length > 0) {
    const { data: attendees } = await supabase
      .from("attendees")
      .select("id, first_name, last_name, organisation, role")
      .in("id", ids);

    const byId = new Map(
      (attendees ?? []).map((a) => [
        a.id,
        {
          name: `${a.first_name} ${a.last_name}`.trim(),
          organisation: a.organisation,
          role: (a.role as Role) ?? "observer",
        },
      ])
    );

    recent = checkins
      .filter((c) => byId.has(c.attendee_id))
      .map((c) => {
        const person = byId.get(c.attendee_id)!;
        return { id: `${c.attendee_id}-${c.checked_in_at}`, ...person, time: c.checked_in_at };
      });
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[520px] md:max-w-[640px] px-4 py-6 md:px-6">
        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-7 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            OAK 2026
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-white">
            Event Check-In
          </h1>
          <p className="mt-2 text-[13px] text-[#A8BAD9]">
            Scan an attendee QR code to check them in.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white ring-1 ring-white/20">
            <Icon icon={mapPin} className="h-3.5 w-3.5" aria-hidden />
            Hall 1
          </p>
        </header>

        <CheckinScanner recent={recent} checkedToday={count ?? 0} />
      </div>
    </main>
  );
}