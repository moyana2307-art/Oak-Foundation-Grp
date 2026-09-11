"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import SelectField from "./SelectField";
import RequirementsPanel from "./RequirementsPanel";
import PrivacyConsent from "./PrivacyConsent";
import { inputBase } from "./inputStyles";
import { registerAttendee } from "@/lib/actions";
import type { RegistrationData, RegistrationErrors } from "./types";

const initialData: RegistrationData = {
  firstName: "",
  lastName: "",
  organisation: "",
  subPartner: "",
  role: "",
  email: "",
  phone: "",
  dietary: "",
  accessibility: "",
  travel: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredMessages: Record<string, string> = {
  firstName: "First name is required.",
  lastName: "Last name is required.",
  organisation: "Organisation is required.",
  role: "Please select your role.",
  email: "Email address is required.",
};

export default function RegistrationForm() {
  const router = useRouter();
  const [data, setData] = useState<RegistrationData>(initialData);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const set = (field: keyof RegistrationData) => (value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleEmailBlur = () => {
    const email = data.email.trim();
    if (email && !emailPattern.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const canSubmit =
    data.firstName.trim() !== "" &&
    data.lastName.trim() !== "" &&
    data.organisation.trim() !== "" &&
    data.role !== "" &&
    data.email.trim() !== "" &&
    emailPattern.test(data.email.trim()) &&
    consent;

  const validate = (): RegistrationErrors => {
    const next: RegistrationErrors = {};

    if (!data.firstName.trim()) next.firstName = requiredMessages.firstName;
    if (!data.lastName.trim()) next.lastName = requiredMessages.lastName;
    if (!data.organisation.trim()) next.organisation = requiredMessages.organisation;
    if (!data.role) next.role = requiredMessages.role;
    if (!data.email.trim()) {
      next.email = requiredMessages.email;
    } else if (!emailPattern.test(data.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!consent) next.consent = "Please accept the privacy policy to continue.";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const origin = window.location.origin;
      const result = await registerAttendee(data, consent, origin);

      if (!result.ok) {
        setSubmitting(false);
        setSubmitError(result.error ?? "Registration failed. Please try again.");
        return;
      }

      // Session is set; take the user to their entry pass.
      setRedirecting(true);
      router.push("/pass");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration could not be completed.";
      console.error("registerAttendee client error:", err);
      setSubmitting(false);
      setSubmitError(msg || "Registration could not be completed. Please try again.");
    }
  };

  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto w-full max-w-[520px] rounded-[24px] bg-white p-6 shadow-[0_18px_45px_-20px_rgba(22,46,85,0.3)]">
        <h2 className="mb-4 text-[18px] font-bold text-[#162E55]">
          Registration Form
        </h2>

        {redirecting ? (
          <div role="status" className="flex flex-col items-center py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0FB]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2B5BBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 animate-spin" aria-hidden>
                <path d="M21 12a9 9 0 1 1-6.2-8.56" />
              </svg>
            </span>
            <p className="mt-3 text-[14px] font-semibold text-[#162E55]">
              Registration complete — taking you to your dashboard…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="firstName"
                label="First Name"
                required
                error={errors.firstName}
              >
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={data.firstName}
                  onChange={(e) => set("firstName")(e.target.value)}
                  placeholder="Maria"
                  autoComplete="given-name"
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  className={inputBase}
                />
              </FormField>

              <FormField
                id="lastName"
                label="Last Name"
                required
                error={errors.lastName}
              >
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={data.lastName}
                  onChange={(e) => set("lastName")(e.target.value)}
                  placeholder="Schmidt"
                  autoComplete="family-name"
                  aria-invalid={errors.lastName ? true : undefined}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  className={inputBase}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                id="organisation"
                label="Organisation"
                required
                error={errors.organisation}
              >
                <input
                  type="text"
                  id="organisation"
                  name="organisation"
                  value={data.organisation}
                  onChange={(e) => set("organisation")(e.target.value)}
                  placeholder="Your organisation name"
                  autoComplete="organization"
                  aria-invalid={errors.organisation ? true : undefined}
                  aria-describedby={
                    errors.organisation ? "organisation-error" : undefined
                  }
                  className={inputBase}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                id="subPartner"
                label="Sub-Partner / Programme Area"
              >
                <input
                  type="text"
                  id="subPartner"
                  name="subPartner"
                  value={data.subPartner}
                  onChange={(e) => set("subPartner")(e.target.value)}
                  placeholder="Optional"
                  className={inputBase}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField id="role" label="Role / Capacity" required error={errors.role}>
                <SelectField
                  id="role"
                  value={data.role}
                  error={errors.role}
                  onChange={set("role")}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField id="email" label="Email Address" required error={errors.email}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => set("email")(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="you@organisation.org"
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputBase}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField id="phone" label="Phone Number">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={data.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder="+41 xx xxx xx xx"
                  autoComplete="tel"
                  className={inputBase}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <RequirementsPanel
                dietary={data.dietary}
                accessibility={data.accessibility}
                travel={data.travel}
                onChangeDietary={set("dietary")}
                onChangeAccessibility={set("accessibility")}
                onChangeTravel={set("travel")}
              />
            </div>

            <div className="mt-4">
              <PrivacyConsent checked={consent} error={errors.consent} onChange={setConsent} />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-5 h-[56px] w-full rounded-[15px] bg-[#162E55] text-[15px] font-bold text-white transition hover:bg-[#1F3A6B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#162E55]/40 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {submitting ? "Registering…" : "Register"}
            </button>
            {submitError && (
              <p className="mt-3 text-center text-[12px] font-medium text-red-500" role="alert">
                {submitError}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}