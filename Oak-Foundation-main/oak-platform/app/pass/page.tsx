import { redirect } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import QrDownloadButton from "../components/QrDownloadButton";
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
      <div className="mx-auto max-w-[520px] space-y-4 px-4 py-6 md:px-6">

        <section className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-7 text-center shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/15 ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5.5 w-5.5 text-white" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M8.5 12.5 11 15l4.5-5.5" />
            </svg>
          </span>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            Registration Complete
          </p>
          <h1 className="mt-1.5 text-[24px] font-extrabold leading-tight tracking-tight text-white">
            You&apos;re Registered, <span className="capitalize">{session.firstName}</span>!
          </h1>
          <p className="mt-1.5 text-[13px] text-[#A8BAD9]">{session.organisation}</p>
        </section>

        <section className="rounded-[20px] border border-[#E3E8EF] bg-white p-5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6B84]">
            Your Entry Pass
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="rounded-[18px] border border-[#E3E8EF] bg-white p-3 shadow-[0_10px_25px_-14px_rgba(28,53,93,0.25)]">
              <QRCodeSVG value={payload} size={170} level="M" marginSize={1} />
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[13px] font-bold tracking-[0.08em] text-[#162E55]">
            {session.reference}
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#6B7A90]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Present at event entrance for check-in
          </p>
        </section>

        <section className="rounded-[20px] border border-[#E3E8EF] bg-white p-5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
            Registration Details
          </h2>
          <dl className="mt-4 space-y-4 text-[14px]">
            <PassRow label="Name" value={name} />
            <PassRow label="Organisation" value={session.organisation} />
            <PassRow label="Role" value={roleLabel} />
            <PassRow label="Email" value={session.email} />
            <PassRow label="Event Dates" value="9–11 March 2026" />
            <PassRow label="Location" value="Harare, Zimbabwe" />
          </dl>
        </section>

        <QrDownloadButton value={payload} />

        <div className="flex justify-center pb-1 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2B5BBD] hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
            </svg>
            Register another attendee
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