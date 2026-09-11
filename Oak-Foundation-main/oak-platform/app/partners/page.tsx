import { redirect } from "next/navigation";
import PartnerDirectory from "../components/partners/PartnerDirectory";
import { requireRole } from "@/lib/auth";

export default async function PartnersPage() {
  const session = await requireRole(["oak_staff", "coordination_team", "presenter", "observer", "partner"]);
  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[520px] md:max-w-[760px] px-4 py-6 md:px-6">
        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-7 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            OAK Partner Convening 2026
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-white">
            Partner Directory
          </h1>
          <p className="mt-2 text-[13px] text-[#A8BAD9]">
            Search organisations, focus areas, and contacts for everyone at the convening.
          </p>
        </header>

        <PartnerDirectory />
      </div>
    </main>
  );
}