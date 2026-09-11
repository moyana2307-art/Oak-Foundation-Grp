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
          className={`mt-[1px] flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[6px] border bg-white transition ${
            checked
              ? "border-[#162E55] bg-[#162E55]"
              : "border-[#C9D2E0]"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-[#162E55]/30`}
        >
          {checked && (
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-[12px] w-[12px]">
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
          )}
        </span>
        <span className="text-[12px] leading-relaxed text-[#43546C]">
          I agree to OAK Foundation&apos;s{" "}
          <span className="font-semibold underline decoration-[#5B6B84] underline-offset-2">
            privacy policy
          </span>{" "}
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