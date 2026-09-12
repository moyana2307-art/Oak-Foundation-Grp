import { Icon } from "@iconify/react/dist/offline";
import check from "@iconify/icons-lucide/check";

type PrivacyConsentProps = {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export default function PrivacyConsent({
  checked,
  error,
  onChange,
}: PrivacyConsentProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
        />
        <span
          aria-hidden
          className={`mt-[1px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-150 ${
            checked
              ? "border-[#162E55] bg-white"
              : "border-[#C9D2E0] bg-white"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-[#162E55]/30`}
        >
          <Icon
            icon={check}
            className={`h-[13px] w-[13px] transition-all duration-150 text-[#162E55] ${
              checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            aria-hidden
          />
        </span>
        <span className="text-[12px] leading-relaxed text-[#43546C]">
          I agree to OAK Foundation&apos;s{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline decoration-[#5B6B84] underline-offset-2"
          >
            privacy policy
          </a>{" "}
          and consent to my registration data being used for event
          coordination.
        </span>
      </label>
      {error && (
        <p id="consent-error" className="mt-1.5 text-[11px] font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}