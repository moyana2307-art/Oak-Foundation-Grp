type Stat = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const strokeProps = {
  fill: "none",
  stroke: "#162E55",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const stats: Stat[] = [
  {
    value: "110+",
    label: "Attendees",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...strokeProps}>
        <circle cx="12" cy="7.5" r="3.5" />
        <path d="M5.5 20c.8-3 3.4-4.5 6.5-4.5s5.7 1.5 6.5 4.5" />
      </svg>
    ),
  },
  {
    value: "24",
    label: "Sessions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...strokeProps}>
        <rect x="4" y="5" width="16" height="15" rx="3" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    ),
  },
  {
    value: "38",
    label: "partners",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...strokeProps}>
        <circle cx="6" cy="6.5" r="2.5" />
        <circle cx="18" cy="8" r="2.5" />
        <path d="M12 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        <path d="M2.5 20c.6-3 1.9-4.5 4.5-4.5.8 0 1.5.1 2.2.4M15 14.5c.6-.3 1.4-.4 2-.4 2.6 0 4 1.5 4.5 4.5" />
        <path d="M12 15.5c.8 0 1.5.1 2.2.4 1 2 1 3.4 1 4.6H8.8c0-1.2 0-2.6.9-4.6.7-.3 1.4-.4 2.3-.4Z" />
      </svg>
    ),
  },
];

export default function Statistics() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto grid w-full max-w-[520px] grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-start gap-[7px] rounded-[20px] bg-white px-3.5 py-4 shadow-[0_10px_25px_-14px_rgba(22,46,85,0.28)]"
          >
            <span className="text-[#162E55]" aria-hidden>
              {stat.icon}
            </span>
            <span className="text-[22px] font-extrabold leading-none tracking-tight text-[#162E55]">
              {stat.value}
            </span>
            <span className="text-[11px] font-medium leading-none text-[#6B7A90]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}