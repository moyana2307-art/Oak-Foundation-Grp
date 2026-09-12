import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/offline";
import chevronLeft from "@iconify/icons-lucide/chevron-left";
import globe from "@iconify/icons-lucide/globe";
import mail from "@iconify/icons-lucide/mail";
import { requireRole } from "@/lib/auth";
import { PARTNERS } from "@/app/components/partners/partnerData";

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["oak_staff", "coordination_team", "presenter", "observer", "partner"]);
  if (!session) {
    redirect("/");
  }

  const { id } = await params;
  const partner = PARTNERS.find((p) => p.id === id);
  if (!partner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[520px] md:max-w-[640px] px-4 py-6 md:px-6">
        <nav className="mb-4">
          <Link href="/partners" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2B5BBD] hover:underline">
            <Icon icon={chevronLeft} className="h-4 w-4" aria-hidden />
            Partner Directory
          </Link>
        </nav>

        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-6 text-center shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/10 text-[18px] font-extrabold tracking-tight text-white ring-1 ring-white/25">
            {partner.acronym}
          </span>
          <h1 className="mt-3 text-[22px] font-extrabold leading-tight text-white">
            {partner.name}
          </h1>
          <p className="mt-1 text-[12px] font-semibold text-[#A8BAD9]">{partner.shortName}</p>
          <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FB1DE] ring-1 ring-white/20">
            Foundation partner since {partner.since}
          </p>
        </header>

        <p className="mt-4 px-1 text-[14px] leading-relaxed text-[#43546C]">
          {partner.description}
        </p>

        <section className="mt-5 rounded-[20px] border border-[#E3E8EF] bg-white p-5 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
            Contact at convening
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[13px] font-bold text-[#31478A]">
              {initials(partner.contactName)}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-[#162E55]">{partner.contactName}</p>
              <a href={`mailto:${partner.contactEmail}`} className="text-[12px] text-[#2B5BBD] hover:underline">
                {partner.contactEmail}
              </a>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={`https://${partner.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#162E55] text-[13px] font-semibold text-white transition hover:bg-[#1F3A6B]"
            >
              <Icon icon={globe} className="h-4 w-4" aria-hidden />
              Visit Website
            </a>
            <a
              href={`mailto:${partner.contactEmail}`}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[12px] border border-[#C9D2E0] bg-white text-[13px] font-semibold text-[#162E55] transition hover:bg-[#F2F5F9]"
            >
              <Icon icon={mail} className="h-4 w-4" aria-hidden />
              Send Message
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}