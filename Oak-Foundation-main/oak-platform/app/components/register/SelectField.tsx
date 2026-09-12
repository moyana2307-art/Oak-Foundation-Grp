import { Icon } from "@iconify/react/dist/offline";
import chevronDown from "@iconify/icons-lucide/chevron-down";

type SelectFieldProps = {
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

const roles: { value: string; label: string }[] = [
  { value: "partner", label: "Partner" },
  { value: "oak_staff", label: "OAK Staff" },
  { value: "coordination_team", label: "Coordination Team" },
  { value: "presenter", label: "Presenter" },
  { value: "observer", label: "Observer" },
];

export default function SelectField({
  id,
  value,
  error,
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-[52px] w-full appearance-none rounded-[14px] border border-[#E3E8EF] bg-[#EEF1F5] px-4 pr-10 text-[14px] outline-none transition focus:border-[#162E55]/35 focus:ring-2 focus:ring-[#162E55]/10 ${
          value ? "text-[#22324A]" : "text-[#9BA7BA]"
        }`}
      >
        <option value="" disabled>
          Select your role
        </option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
      <Icon
        icon={chevronDown}
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97AB]"
        aria-hidden
      />
    </div>
  );
}