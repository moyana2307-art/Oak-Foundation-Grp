export default function Hero() {
  return (
    <section className="px-4 md:px-6">
      <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-8 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <h1 className="relative text-[30px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[34px]">
          Partner
          <br />
          Convening 2026
        </h1>
        <p className="relative mt-3.5 text-[14px] font-medium tracking-wide text-[#A8BAD9]">
          Geneva &middot; 9&ndash;11 March 2026
        </p>
      </div>
    </section>
  );
}