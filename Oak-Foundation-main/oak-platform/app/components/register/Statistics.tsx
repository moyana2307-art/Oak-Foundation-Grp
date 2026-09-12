import { Icon } from "@iconify/react/dist/offline";
import user from "@iconify/icons-lucide/user";
import calendarDays from "@iconify/icons-lucide/calendar-days";
import users from "@iconify/icons-lucide/users";

type Stat = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const stats: Stat[] = [
  {
    value: "110+",
    label: "Attendees",
    icon: (
      <Icon icon={user} className="h-[18px] w-[18px] text-[#162E55]" aria-hidden />
    ),
  },
  {
    value: "24",
    label: "Sessions",
    icon: (
      <Icon icon={calendarDays} className="h-[18px] w-[18px] text-[#162E55]" aria-hidden />
    ),
  },
  {
    value: "38",
    label: "Partners",
    icon: (
      <Icon icon={users} className="h-[18px] w-[18px] text-[#162E55]" aria-hidden />
    ),
  },
];

export default function Statistics() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto grid w-full max-w-[520px] grid-cols-3 gap-2.5 sm:gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-[7px] rounded-[20px] bg-white px-3 py-3.5 text-center shadow-[0_10px_25px_-14px_rgba(22,46,85,0.28)] sm:px-3.5 sm:py-4"
          >
            <span className="text-[#162E55]" aria-hidden>
              {stat.icon}
            </span>
            <span className="text-[19px] font-extrabold leading-none tracking-tight text-[#162E55] sm:text-[22px]">
              {stat.value}
            </span>
            <span className="text-[10px] font-medium leading-none text-[#6B7A90] sm:text-[11px]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}