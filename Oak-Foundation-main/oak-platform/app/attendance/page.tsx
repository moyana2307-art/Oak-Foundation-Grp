import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import AttendanceDashboard, { type Row } from "./AttendanceDashboard";
import type { Role } from "@/app/components/register/types";

export default async function AttendancePage() {
  const session = await requireRole(["oak_staff", "coordination_team", "presenter", "observer", "partner"]);
  if (!session) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: attendees, error } = await supabase
    .from("attendees")
    .select("id, reference, first_name, last_name, organisation, role, registered_at")
    .order("registered_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#F4F5F7]">
        <div className="mx-auto max-w-[560px] lg:max-w-[820px] px-4 py-10 md:px-6">
          <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 text-center">
            <h1 className="text-lg font-bold text-[#162E55]">Attendance</h1>
            <p className="mt-2 text-[13px] text-[#6B7A90]">
              Couldn&apos;t load attendance data. Please try again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const ids = (attendees ?? []).map((a) => a.id);

  let checkins: { attendee_id: string; checked_in_at: string }[] = [];
  if (ids.length > 0) {
    const { data } = await supabase
      .from("checkins")
      .select("attendee_id, checked_in_at")
      .in("attendee_id", ids);
    checkins = (data ?? []) as { attendee_id: string; checked_in_at: string }[];
  }

  const latestByAttendee = new Map<string, string>();
  for (const c of checkins) {
    const existing = latestByAttendee.get(c.attendee_id);
    if (!existing || c.checked_in_at > existing) {
      latestByAttendee.set(c.attendee_id, c.checked_in_at);
    }
  }

  const rows: Row[] = (attendees ?? []).map((a) => ({
    id: a.id,
    name: `${a.first_name} ${a.last_name}`.trim(),
    organisation: a.organisation,
    role: (a.role as Role) ?? "observer",
    registeredAt: a.registered_at,
    checkinTime: latestByAttendee.get(a.id) ?? null,
  }));

  const serverCheckedIn = rows.filter((r) => r.checkinTime).length;

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[560px] lg:max-w-[820px] px-4 py-6 md:px-6">
        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-7 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            OAK 2026
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-white">
            Attendance
          </h1>
          <p className="mt-2 text-[13px] text-[#A8BAD9]">
            Check-in tracking across the three days in Harare.
          </p>
        </header>

        <AttendanceDashboard rows={rows} serverCheckedIn={serverCheckedIn} />
      </div>
    </main>
  );
}