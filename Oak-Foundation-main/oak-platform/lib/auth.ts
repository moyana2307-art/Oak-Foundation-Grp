import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Role, SessionAttendee } from "@/app/components/register/types";
import { PAGE_ACCESS, ROLE_HOME, roleAllowedForPage } from "@/lib/access";

export { PAGE_ACCESS, ROLE_HOME, roleAllowedForPage };

const SESSION_COOKIE = "oak_session";

export async function setSessionCookie(attendeeId: string, accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({ id: attendeeId, token: accessToken }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionAttendee | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  let parsed: { id?: string; token?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed.id || !parsed.token) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("attendees")
    .select("id, reference, role, first_name, last_name, organisation, email, access_token")
    .eq("id", parsed.id)
    .eq("access_token", parsed.token)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    reference: data.reference,
    role: data.role as Role,
    firstName: data.first_name,
    lastName: data.last_name,
    organisation: data.organisation,
    email: data.email,
    accessToken: data.access_token ?? "",
  };
}

export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    return null;
  }
  return session;
}
