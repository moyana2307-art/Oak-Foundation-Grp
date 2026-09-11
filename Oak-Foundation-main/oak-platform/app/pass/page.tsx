import { redirect } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import QrCard from "../components/QrCard";
import { getSession } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "../components/register/types";

export default async function PassPage() {
  const session = await getSession();
  if (!session) {
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

  const name = `${session.firstName} ${session.lastName}`;
  const roleLabel = ROLE_LABELS[session.role as Role] ?? session.role;

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[520px] px-4 py-6 md:px-6">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5B6B84]">
            Registration Complete
          </p>
          <h1 className="mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight text-[#162E55]">
            You&apos;re Registered, <span className="capitalize">{session.firstName}</span>!
          </h1>
          <p className="mt-1.5 text-[13px] text-[#6B7A90]">{session.email}</p>
        </div>

        <section className="mt-5 rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-6 text-center shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            Your Entry Pass
          </p>

          <div className="mx-auto mt-4 w-fit rounded-[16px] bg-white p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)]">
            <QRCodeSVG value={payload} size={140} level="M" marginSize={1} />
          </div>

          <p className="mt-4 text-[13px] font-bold tracking-[0.1em] text-white">
            {session.reference}
          </p>
          <p className="mx-auto mt-2 flex max-w-[260px] items-center justify-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#A8BAD9] ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Present at event entrance check-in
          </p>
        </section>

        <section className="mt-4 rounded-[20px] border border-[#E3E8EF] bg-white p-5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
            Registration Details
          </h2>
          <dl className="mt-3 space-y-2.5 text-[14px]">
            <PassRow label="Name" value={name} />
            <PassRow label="Organisation" value={session.organisation} />
            <PassRow label="Role" value={roleLabel} />
            <PassRow label="Email" value={session.email} />
          </dl>
          <dl className="mt-3 space-y-2.5 border-t border-[#EEF1F5] pt-3 text-[14px]">
            <PassRow label="Event Dates" value="9–11 March 2026" />
            <PassRow label="Location" value="Harare, Zimbabwe" />
          </dl>
        </section>

        <section className="mt-4 rounded-[24px] border border-[#E3E8EF] bg-white p-5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <QrCard value={payload} size={180} />
        </section>

        <div className="mt-5 flex items-center justify-center gap-4 text-[13px] font-semibold">
          <Link href="/programme" className="text-[#2B5BBD] hover:underline">
            View programme
          </Link>
          <span className="text-[#C9D2E0]" aria-hidden>
            |
          </span>
          <Link href="/partners" className="text-[#2B5BBD] hover:underline">
            Partner directory
          </Link>
        </div>
      </div>
    </main>
  );
}

function PassRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#6B7A90]">{label}</dt>
      <dd className="text-right font-semibold text-[#162E55]">{value}</dd>
    </div>
  );
}