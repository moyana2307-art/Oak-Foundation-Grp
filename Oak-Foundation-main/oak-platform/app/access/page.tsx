import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setSessionCookie, ROLE_HOME } from "@/lib/auth";
import type { Role } from "@/app/components/register/types";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  const accessToken = Array.isArray(token) ? token[0] : token;

  if (!accessToken) {
    return (
      <main className="min-h-screen bg-[#EEF1F5]">
        <div className="mx-auto max-w-[440px] px-4 py-12 md:px-6">
          <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 text-center">
            <h1 className="text-lg font-bold text-[#1C355D]">Invalid access link</h1>
            <p className="mt-2 text-[13px] text-[#6B7A90]">
              This link is missing its access token. Please use the link from your
              confirmation email, or register again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("attendees")
    .select("id, role")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (!data) {
    return (
      <main className="min-h-screen bg-[#EEF1F5]">
        <div className="mx-auto max-w-[440px] px-4 py-12 md:px-6">
          <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 text-center">
            <h1 className="text-lg font-bold text-[#1C355D]">Link not recognised</h1>
            <p className="mt-2 text-[13px] text-[#6B7A90]">
              We couldn&apos;t find a registration for this link. It may be expired
              or incorrect.
            </p>
          </div>
        </div>
      </main>
    );
  }

  await setSessionCookie(data.id, accessToken);
  redirect(ROLE_HOME[data.role as Role]);
}
