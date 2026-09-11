export default function Hero() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full max-w-[520px] rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-8 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] brightness-0 invert">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FB1DE]">
            OAK Foundation
          </p>
        </div>
        <h1 className="mt-4 text-[30px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[34px]">
          Partner
          <br />
          Convening 2026
        </h1>
        <p className="mt-3.5 text-[13px] font-medium tracking-wide text-[#A8BAD9]">
          Harare, Zimbabwe &middot; 9&ndash;11 March 2026
        </p>
      </div>
    </section>
  );
}