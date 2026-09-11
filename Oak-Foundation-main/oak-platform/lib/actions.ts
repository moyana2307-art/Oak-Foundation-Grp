"use server";

import { createClient } from "@/lib/supabase/server";
import { sendRegistrationEmail } from "@/lib/email";
import { setSessionCookie, ROLE_HOME, getSession } from "@/lib/auth";
import type { RegisterResult, RegistrationData, Role } from "@/app/components/register/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES: Role[] = ["partner", "oak_staff", "coordination_team", "presenter", "observer"];

function generateReference(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const block = () => {
    let code = "";
    for (let i = 0; i < 4; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };
  return `OAK-2026-${block()}-${block()}`;
}

function generateAccessToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function isRole(value: string): value is Role {
  return (VALID_ROLES as string[]).includes(value);
}

export async function registerAttendee(
  data: RegistrationData,
  consent: boolean,
  origin: string
): Promise<RegisterResult> {
  try {
    if (!consent) {
      return { ok: false, error: "Consent is required to register." };
    }

    if (!data.firstName.trim() || !data.lastName.trim() || !data.organisation.trim()) {
      return { ok: false, error: "Please complete the required fields." };
    }

    if (!isRole(data.role)) {
      return { ok: false, error: "Please select a valid role." };
    }

    if (!emailPattern.test(data.email.trim())) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      console.error(
        "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      );
      return {
        ok: false,
        error:
          "The registration service is not configured on this server. Please contact the coordination team.",
      };
    }

    const supabase = await createClient();

    let reference = generateReference();
    const { data: conflict } = await supabase
      .from("attendees")
      .select("reference")
      .eq("reference", reference)
      .maybeSingle();
    if (conflict) {
      reference = generateReference();
    }

    const accessToken = generateAccessToken();

    const { data: row, error } = await supabase
      .from("attendees")
      .insert({
        reference,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        organisation: data.organisation.trim(),
        sub_partner: data.subPartner.trim() || null,
        role: data.role,
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        dietary: data.dietary.trim() || null,
        accessibility: data.accessibility.trim() || null,
        travel: data.travel.trim() || null,
        consent,
        access_token: accessToken,
      })
      .select("id, reference, role")
      .single();

    if (error || !row) {
      console.error("Error registering attendee:", error);
      return {
        ok: false,
        error: error?.message ?? "Registration failed. Please try again.",
      };
    }

    const attendee = {
      id: row.id,
      reference: row.reference,
      role: row.role as Role,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      organisation: data.organisation.trim(),
      email: data.email.trim(),
    };

    // Establish the session so the user lands on their role dashboard.
    await setSessionCookie(row.id, accessToken);

    // Best-effort confirmation email with the access link + QR page.
    const accessUrl = `${origin}/access?token=${accessToken}`;
    await sendRegistrationEmail({
      email: attendee.email,
      firstName: attendee.firstName,
      organisation: attendee.organisation,
      role: attendee.role,
      reference: attendee.reference,
      accessUrl,
    });

    return {
      ok: true,
      reference: attendee.reference,
      attendee,
      home: ROLE_HOME[attendee.role],
    };
  } catch (err) {
    console.error("Unexpected error registering attendee:", err);
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: `Registration failed: ${detail}`,
    };
  }
}

export async function saveSessionNote(sessionId: string, body: string) {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Not authorised to save notes." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("session_notes")
    .select("id")
    .eq("attendee_id", session.id)
    .eq("session_id", sessionId)
    .maybeSingle();

  const updatedAt = new Date().toISOString();

  if (existing) {
    const { error } = await supabase
      .from("session_notes")
      .update({ body, updated_at: updatedAt })
      .eq("id", existing.id);
    return { ok: !error, error: error?.message };
  }

  const { error } = await supabase
    .from("session_notes")
    .insert({ attendee_id: session.id, session_id: sessionId, body, updated_at: updatedAt });
  return { ok: !error, error: error?.message };
}
