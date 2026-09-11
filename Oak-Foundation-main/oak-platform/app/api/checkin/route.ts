import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/app/components/register/types";

export async function POST(request: Request) {
  let body: { reference?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid", error: "Invalid request." }, { status: 400 });
  }

  const reference = typeof body?.reference === "string" ? body.reference.trim().toUpperCase() : "";
  if (!reference) {
    return Response.json({ ok: false, reason: "invalid", error: "Missing reference." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: attendee, error: attendeeError } = await supabase
    .from("attendees")
    .select("id, reference, first_name, last_name, organisation, role")
    .eq("reference", reference)
    .maybeSingle();

  if (attendeeError || !attendee) {
    return Response.json(
      { ok: false, reason: "not-found", error: "Participant not found." },
      { status: 404 }
    );
  }

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const { data: existing } = await supabase
    .from("checkins")
    .select("id, checked_in_at")
    .eq("attendee_id", attendee.id)
    .gte("checked_in_at", dayStart.toISOString())
    .order("checked_in_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const person = {
    name: `${attendee.first_name} ${attendee.last_name}`,
    organisation: attendee.organisation,
    role: attendee.role as Role,
  };

  if (existing) {
    return Response.json({
      ok: false,
      already: true,
      reason: "duplicate",
      error: "This QR code has already been used to check in today.",
      person: { ...person, time: existing.checked_in_at },
    });
  }

  const { data: checkin, error: checkinError } = await supabase
    .from("checkins")
    .insert({ attendee_id: attendee.id, method: "qr_scan" })
    .select("id, checked_in_at")
    .single();

  if (checkinError || !checkin) {
    return Response.json(
      { ok: false, reason: "network", error: "Failed to record check-in. Please retry." },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    checkinId: checkin.id,
    registered: true,
    person: { ...person, time: checkin.checked_in_at },
  });
}
