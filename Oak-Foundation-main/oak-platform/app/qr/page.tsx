import { redirect } from "next/navigation";
import Link from "next/link";
import QrCard from "../components/QrCard";
import { requireRole, clearSessionCookie } from "@/lib/auth";

export default async function QrPage() {
  const session = await requireRole(["partner"]);
  if (!session) {
    redirect("/");
  }

  async function signOut() {
    "use server";
    await clearSessionCookie();
    redirect("/");
  }

  const payload = JSON.stringify({
    reference: session.reference,
    event: "OAK Partner Convening 2026",
    firstName: session.firstName,
    lastName: session.lastName,
    organisation: session.organisation,
    email: session.email,
  });

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[440px] px-4 py-6 md:px-6">
        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-7 text-center shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[14px] bg-white/10 p-1.5 ring-1 ring-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="OAK Zimbabwe logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-white">
            Your Check-in QR Code
          </h1>
          <p className="mt-1.5 text-[13px] text-[#A8BAD9]">
            Present this code when you arrive for entry verification.
          </p>
        </header>

        <div className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 text-center shadow-[0_10px_25px_-18px_rgba(28,53,93,0.35)]">
          <h2 className="text-[17px] font-bold text-[#162E55]">
            {session.firstName} {session.lastName}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#5B6B84]">{session.organisation}</p>
          <p className="mt-2 inline-flex items-center rounded-full bg-[#F4F5F7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B6B84]">
            Registration ID: {session.reference}
          </p>

          <div className="mt-5">
            <QrCard value={payload} size={210} />
          </div>

          <div className="mt-6 rounded-[16px] border border-[#E3E8F0] bg-[#F7F9FC] p-4 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B6B84]">
              Event reminder
            </p>
            <dl className="mt-2 space-y-1 text-[13px] text-[#43546C]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B7A90]">Event</dt>
                <dd className="font-semibold">OAK Partner Convening 2026</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B7A90]">Dates</dt>
                <dd className="font-semibold">9 – 11 March 2026</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B7A90]">Venue</dt>
                <dd className="font-semibold">Harare</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between px-1 text-[12px]">
          <Link href="/" className="font-semibold text-[#2B5BBD] hover:underline">
            View event information
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-[#6B7A90] hover:text-[#162E55]">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
