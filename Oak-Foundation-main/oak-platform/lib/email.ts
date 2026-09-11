import type { Role } from "@/app/components/register/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-registration-email`;

type RegistrationEmailPayload = {
  email: string;
  firstName: string;
  organisation: string;
  role: Role;
  reference: string;
  accessUrl: string;
};

/**
 * Sends the confirmation email by calling a Supabase Edge Function
 * (`send-registration-email`) that uses Supabase Auth SMTP / Resend to
 * deliver the message with the QR download link.
 *
 * Best-effort: if the function is not deployed (e.g. local dev), this
 * silently no-ops so registration still succeeds. QR + access link are
 * always shown on screen regardless.
 */
export async function sendRegistrationEmail(payload: RegistrationEmailPayload): Promise<boolean> {
  if (!SUPABASE_URL) return false;

  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (error) {
    console.warn("Confirmation email not sent (edge function unavailable):", error);
    return false;
  }
}
