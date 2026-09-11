import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[560px] px-4 py-10 md:px-6">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <h1 className="text-[20px] font-bold text-[#162E55]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-[#43546C]">
            OAK Foundation handles registration data in accordance with GDPR
            for the purpose of event coordination. No data is shared beyond
            the OAK Foundation coordination team for this convening.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2B5BBD] hover:underline"
          >
            Back to registration
          </Link>
        </div>
      </div>
    </main>
  );
}