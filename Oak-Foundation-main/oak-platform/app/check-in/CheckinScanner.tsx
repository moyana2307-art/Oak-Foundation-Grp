"use client";

import Link from "next/link";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { ROLE_LABELS, type Role } from "@/app/components/register/types";
import {
  CURRENT_SESSION,
  EXPECTED_ATTENDEES,
  SEED_ATTENDEES,
  findSeedById,
  findSeedByReference,
  useEventStore,
  type SeedAttendee,
} from "@/lib/eventStore";

type RecentPerson = {
  id: string;
  name: string;
  organisation: string;
  role: Role;
  time: string;
};

type OutcomePerson = {
  name: string;
  organisation: string;
  role: Role;
  time: string;
  nextSession?: string;
  nextSessionTime?: string;
  venue?: string;
};

type Outcome =
  | { kind: "success"; person: OutcomePerson }
  | { kind: "error"; reason: string; raw?: string }
  | null;

const DEFAULT_SESSION = { title: "Opening Plenary", time: "09:30", venue: "Main Hall A" };

const SCAN_ID = "checkin-reader";
const FILE_SCAN_ID = "checkin-file-reader";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export default function CheckinScanner({
  recent,
  checkedToday,
}: {
  recent: RecentPerson[];
  checkedToday: number;
}) {
  const store = useEventStore();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [starting, setStarting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [readingFile, setReadingFile] = useState(false);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const liveCount = checkedToday + store.checkedInCount;
  const pct = Math.min(100, Math.round((liveCount / EXPECTED_ATTENDEES) * 100));

  const combinedRecent = useMemo<RecentPerson[]>(() => {
    const simulated = store.records
      .map((r) => {
        const person = findSeedById(r.id);
        return person
          ? { id: person.id, name: person.name, organisation: person.organisation, role: person.role, time: r.checkedInAt }
          : null;
      })
      .filter((p): p is RecentPerson => p !== null);
    const real = recent.filter((p) => !simulated.some((s) => s.name === p.name));
    return [...simulated, ...real];
  }, [store.records, recent]);

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const recordSimulated = (attendee: SeedAttendee): boolean => {
    const fresh = !store.isCheckedIn(attendee.id);
    if (fresh) store.checkIn(attendee.id);
    return fresh;
  };

  const personFromSeed = (attendee: SeedAttendee): OutcomePerson => ({
    name: attendee.name,
    organisation: attendee.organisation,
    role: attendee.role,
    time: new Date().toISOString(),
    nextSession: attendee.nextSession,
    nextSessionTime: attendee.nextSessionTime,
    venue: attendee.venue,
  });

  const handleScan = async (raw: string) => {
    let reference: string | null = null;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.reference === "string") reference = parsed.reference;
    } catch {
      reference = raw.trim().toUpperCase();
    }

    if (!reference) {
      setOutcome({ kind: "error", reason: "invalid", raw });
      return;
    }

    setOutcome(null);

    const seed = findSeedByReference(reference);
    if (seed) {
      if (recordSimulated(seed)) {
        setOutcome({ kind: "success", person: personFromSeed(seed) });
      } else {
        setOutcome({ kind: "error", reason: "duplicate", raw: reference });
      }
      return;
    }

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    const body = await res.json().catch(() => ({ ok: false, reason: "network" }));

    if (body?.ok) {
      setOutcome({ kind: "success", person: body.person });
    } else {
      setOutcome({
        kind: "error",
        reason: body?.already === true ? "duplicate" : (body?.reason ?? "invalid"),
        raw,
      });
    }
  };

  const onScan = async (decodedText: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await handleScan(decodedText);
    } finally {
      setTimeout(() => setBusy(false), 1200);
    }
  };

  const simulate = (attendee: SeedAttendee) => {
    if (busy) return;
    setBusy(true);
    setOutcome(null);
    setTimeout(() => {
      if (recordSimulated(attendee)) {
        setOutcome({ kind: "success", person: personFromSeed(attendee) });
      } else {
        setOutcome({ kind: "error", reason: "duplicate", raw: attendee.reference });
      }
      setBusy(false);
    }, 900);
  };

  useEffect(() => {
    if (!starting) return;
    let cancelled = false;

    const run = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (devices.length === 0) {
          setError(
            "No camera was found on this device. Upload a photo of the QR badge, type the code, or use the simulate panel below."
          );
          return;
        }
        const scanner = new Html5Qrcode(SCAN_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
        scannerRef.current = scanner;
        await scanner.start(
          devices[0].id,
          { fps: 10, qrbox: { width: 220, height: 220 } },
          onScan,
          () => {}
        );
        if (cancelled) {
          await scanner.stop().catch(() => {});
          return;
        }
        setScanning(true);
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException | null)?.name;
        if (name === "NotAllowedError") {
          setError(
            "Camera access was blocked. Allow camera permission in your browser, or upload a QR photo instead."
          );
        } else if (
          name === "NotFoundError" ||
          name === "NotReadableError" ||
          name === "OverconstrainedError"
        ) {
          setError(
            "No working camera was detected. Upload a photo of the QR badge, type the code, or use the simulate panel below."
          );
        } else {
          setError(
            "Camera preview could not start. Upload a QR photo, type the code, or use the simulate panel below."
          );
          console.error("Scanner start failed", err);
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starting]);

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setScanning(false);
    setStarting(false);
  };

  const returnToScanner = async () => {
    setOutcome(null);
    setError(null);
    if (!scanning) {
      setStarting(true);
    }
  };

  const handleManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manual.trim()) return;
    setBusy(true);
    setOutcome(null);
    try {
      await handleScan(manual);
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File) => {
    if (busy) return;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPreview(null);
      setUploadError("That file isn't an image — please choose a PNG or JPG.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setPreview(null);
      setUploadError("That image is over 5MB — please choose a smaller one.");
      return;
    }

    setUploadError(null);
    setOutcome(null);
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    setBusy(true);
    setReadingFile(true);

    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        /* ignore */
      }
      setScanning(false);
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
    let decoded: string | null = null;
    try {
      const fileScanner = new Html5Qrcode(FILE_SCAN_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      decoded = (await fileScanner.scanFile(file, false)).trim();
      try {
        fileScanner.clear();
      } catch {
        /* ignore */
      }
    } catch {
      decoded = null;
    }

    if (decoded) {
      setReadingFile(false);
      setBusy(false);
      URL.revokeObjectURL(preview?.url ?? "");
      setPreview(null);
      await handleScan(decoded);
      return;
    }

    setReadingFile(false);
    setBusy(false);
    setUploadError("Couldn't detect a QR code in that image — try another photo.");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) handleFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => {
    URL.revokeObjectURL(preview?.url ?? "");
    setPreview(null);
    setUploadError(null);
  };

  if (outcome?.kind === "success") {
    const next = {
      title: outcome.person.nextSession ?? DEFAULT_SESSION.title,
      venue: outcome.person.venue ?? DEFAULT_SESSION.venue,
    };
    return (
      <div className="mt-5 space-y-6">
        {/* Block 1 — Success Banner */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1E9E62] to-[#2ECC84] p-6 shadow-[0_18px_40px_-18px_rgba(20,84,58,0.6)]">
          <span
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
            aria-hidden
          />
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/15 ring-1 ring-white/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.5 11 15l4.5-5.5" />
              </svg>
            </span>
            <div>
              <p className="text-[21px] font-extrabold leading-tight text-white">
                Checked In Successfully
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/85">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {longDate(outcome.person.time)}
              </p>
            </div>
          </div>
        </div>

        {/* Block 2 — Attendee Card */}
        <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[17px] font-bold text-[#31478A]">
              {initials(outcome.person.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] font-bold text-[#162E55]">{outcome.person.name}</p>
              <p className="truncate text-[14px] text-[#6B7A90]">{outcome.person.organisation}</p>
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#E1E8F5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#2B5BBD]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2B5BBD]" aria-hidden />
                {ROLE_LABELS[outcome.person.role] ?? outcome.person.role}
              </span>
            </div>
          </div>
          <div className="my-4 h-px bg-[#E3E8EF]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[14px] bg-[#F4F5F7] p-4">
              <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A97AB]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                Next Session
              </p>
              <p className="mt-2 text-[15px] font-extrabold leading-snug text-[#162E55]">
                {next.title}
              </p>
            </div>
            <div className="rounded-[14px] bg-[#F4F5F7] p-4">
              <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A97AB]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
                  <path d="M12 3 2 20h20L12 3Z" />
                  <circle cx="12" cy="14" r="3" />
                </svg>
                Venue
              </p>
              <p className="mt-2 text-[15px] font-extrabold leading-snug text-[#162E55]">
                {next.venue}
              </p>
            </div>
          </div>
        </div>

        {/* Block 3 — Live Event Status */}
        <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <p className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A97AB]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Live Event Status
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1E9E62] animate-pulse" aria-hidden />
            <p className="text-[15px] font-extrabold text-[#162E55]">
              {CURRENT_SESSION.title} starting at {CURRENT_SESSION.timeLabel}
            </p>
          </div>
          <p className="mt-2 text-[13px] text-[#6B7A90]">
            {liveCount} of {EXPECTED_ATTENDEES} attendees checked in · {CURRENT_SESSION.venue}
          </p>
          <div className="mt-3 h-[10px] overflow-hidden rounded-full bg-[#EEF1F5]">
            <div
              className="h-full rounded-full bg-[#162E55] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Block 4 — Action Button */}
        <button
          type="button"
          onClick={returnToScanner}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#162E55] text-[14px] font-bold text-white transition hover:bg-[#1F3A6B]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
          Scan Next Attendee
        </button>
        <Link
          href="/attendance"
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-[#2B5BBD] hover:underline"
        >
          View attendance &amp; headcount
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    );
  }

  if (outcome?.kind === "error") {
    return (
      <div className="mt-5">
        <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-[#C24141] via-[#9C3434] to-[#6E2222] p-5 text-white shadow-[0_18px_40px_-18px_rgba(110,34,34,0.6)]">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="m9 9 6 6M15 9l-6 6" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F6C9C9]">
                Check-In Failed
              </p>
              <h2 className="mt-0.5 text-[19px] font-extrabold leading-tight text-white">
                QR Not Recognised
              </h2>
              <p className="text-[12px] font-semibold text-[#F6C9C9]">
                {reasonLine(outcome.reason)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C08A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden>
              <path d="M12 3 2 20h20L12 3Z" />
              <path d="M12 10v4M12 17h.01" />
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
              Possible reasons
            </p>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-[12px] leading-relaxed text-[#43546C]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#98A3B5]" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={returnToScanner}
          className="mt-4 h-[50px] w-full rounded-[14px] bg-[#162E55] text-[14px] font-bold text-white transition hover:bg-[#1F3A6B]"
        >
          Try Again
        </button>
        <a
          href="mailto:convening2026@oakfoundation.org"
          className="mt-2 inline-flex h-[50px] w-full items-center justify-center rounded-[14px] border border-[#C9D2E0] bg-white text-[14px] font-bold text-[#162E55] transition hover:bg-[#F2F5F9]"
        >
          Contact Coordination Team
        </a>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="overflow-hidden rounded-[24px] border border-[#E3E8EF] bg-gradient-to-b from-[#0F1E38] to-[#0A1528] p-2 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <div className="relative h-[550px] overflow-hidden rounded-[16px] sm:h-[500px]">
          <div
            id={SCAN_ID}
            className={starting || scanning ? "h-full w-full" : "hidden"}
          />
          {!starting && !scanning && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />
              <ViewFinderBrackets />
              <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[14px] font-bold text-white">Position QR code within the frame</span>
                <span className="mt-1 text-[11px] text-[#A8BAD9]">Auto-detects as soon as it&apos;s in view</span>
              </span>
            </>
          )}
          {starting && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5 animate-spin text-white" aria-hidden>
                <path d="M21 12a9 9 0 1 1-6.2-8.56" />
              </svg>
              <span className="text-[13px] font-bold text-white">Requesting camera access…</span>
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-center gap-2 rounded-[14px] border-t border-white/10 bg-white/5 py-2.5">
          <ScanMiniIcon />
          <span className="text-[11px] font-semibold text-[#B8C6DE]">
            {scanning
              ? "Live preview · auto-scans in 1–2 seconds"
              : "Hold camera steady · Auto-scans in 1–2 seconds"}
          </span>
        </div>
        {!scanning ? (
          <>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setOutcome(null);
                setStarting(true);
              }}
              disabled={starting}
              className="mt-2 h-[50px] w-full rounded-[14px] bg-gradient-to-b from-[#263D61] to-[#162E55] text-[14px] font-bold tracking-[0.06em] text-white shadow-[0_12px_24px_-12px_rgba(22,46,85,0.6)] transition hover:to-[#1F3A6B] disabled:opacity-60"
            >
              {starting ? "Starting camera…" : "START SCANNING"}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="mt-2 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/5 text-[13px] font-bold text-[#B8C6DE] transition hover:bg-white/10 disabled:opacity-60"
            >
              <UploadIcon />
              Upload QR photo from device
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setOutcome(null);
              stopScanner();
            }}
            className="mt-2 h-[46px] w-full rounded-[14px] border border-white/15 bg-white/5 text-[13px] font-bold text-[#B8C6DE] transition hover:bg-white/10"
          >
            Stop scanning
          </button>
        )}
      </div>

      <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
          Upload QR Code
        </h2>
        {preview ? (
          <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-[#E3E8EF] bg-[#FAFBFD] p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.url}
              alt="Selected QR code"
              className="h-12 w-12 shrink-0 rounded-[10px] border border-[#E3E8EF] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[#162E55]">{preview.name}</p>
              {readingFile ? (
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2B5BBD]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 animate-spin" aria-hidden>
                    <path d="M21 12a9 9 0 1 1-9-9" />
                  </svg>
                  Scanning…
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] font-semibold text-[#8A97AB]">Ready</p>
              )}
            </div>
            {!readingFile && (
              <button
                type="button"
                onClick={clearPreview}
                aria-label="Remove image"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#EEF1F5] text-[#5B6B84] transition hover:bg-[#E5E8EE] hover:text-[#C24141]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <label
            htmlFor="checkin-file-input"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed py-5 text-center transition ${
              dragOver
                ? "border-[#2B5BBD] bg-[#F2F5F9]"
                : "border-[#C9D2E0] bg-[#FAFBFD] hover:border-[#2B5BBD]/50 hover:bg-[#F2F5F9]"
            }`}
          >
            <UploadIcon />
            <span className="mt-1 max-w-[260px] text-[13px] font-bold leading-snug text-[#162E55]">
              Drag and drop a QR code image, or click to browse
            </span>
            <span className="text-[11px] text-[#8A97AB]">PNG, JPG up to 5MB</span>
          </label>
        )}
        {uploadError && (
          <p className="mt-2 text-[12px] font-semibold text-[#C24141]">{uploadError}</p>
        )}
        <input
          id="checkin-file-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={busy}
        />
        <div id={FILE_SCAN_ID} className="hidden" />
      </div>

      {error && !outcome && (
        <div className="rounded-[16px] border border-[#F0C9C9] bg-[#FCEBEB] p-4 text-[13px] text-[#7A1F1F]">
          {error}
        </div>
      )}

      <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
            Simulate QR Scan
          </h2>
          <span className="rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[10px] font-bold text-[#5B6B84]">
            Demo
          </span>
        </div>
        <p className="mt-1 text-[12px] text-[#6B7A90]">
          No hardware on hand? Tap an attendee to trigger a fake scan.
        </p>
        <ul className="mt-2 divide-y divide-[#EFF2F6]">
          {SEED_ATTENDEES.map((attendee) => {
            const checked = store.isCheckedIn(attendee.id);
            return (
              <li key={attendee.id}>
                <button
                  type="button"
                  onClick={() => simulate(attendee)}
                  disabled={busy}
                  className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[13px] font-bold text-[#31478A]">
                    {initials(attendee.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-semibold text-[#162E55]">
                        {attendee.name}
                      </span>
                      {checked && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E7F4EC] px-2 py-0.5 text-[10px] font-bold text-[#1E9E62]">
                          <span className="h-1 w-1 rounded-full bg-[#1E9E62]" aria-hidden />
                          Checked in
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-[#6B7A90]">
                      {attendee.organisation} ·{" "}
                      <span className="font-mono text-[10px] tracking-tight text-[#98A3B5]">
                        {attendee.reference}
                      </span>
                    </span>
                  </span>
                  <RoleBadge role={attendee.role} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
          Manual Code Entry
        </h2>
        <form onSubmit={handleManual} className="mt-3 flex gap-2">
          <input
            type="text"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="OAK-2026-XXXX-XXXX"
            className="h-[46px] min-w-0 flex-1 rounded-[12px] border border-[#E3E8EF] bg-[#EEF1F5] px-3 text-[13px] tracking-wide text-[#22324A] placeholder:text-[#98A3B5] outline-none focus:border-[#162E55]/35 focus:ring-2 focus:ring-[#162E55]/10"
          />
          <button
            type="submit"
            disabled={busy || !manual.trim()}
            className="h-[46px] rounded-[12px] bg-[#162E55] px-5 text-[13px] font-bold text-white transition hover:bg-[#1F3A6B] disabled:opacity-50"
          >
            Check
          </button>
        </form>
      </div>

      <div className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
            Recently checked in
          </h2>
          <span className="rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[10px] font-bold text-[#5B6B84]">
            {liveCount} today
          </span>
        </div>
        <ul className="mt-2 divide-y divide-[#EFF2F6]">
          {combinedRecent.length === 0 ? (
            <li className="py-5 text-center text-[13px] text-[#6B7A90]">
              No attendees have been checked in yet.
            </li>
          ) : (
            combinedRecent.map((person) => (
              <li key={person.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E1E8F5] text-[12px] font-bold text-[#31478A]">
                  {initials(person.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#162E55]">
                    {person.name}
                  </p>
                  <p className="truncate text-[11px] text-[#8A97AB]">{person.organisation}</p>
                </div>
                <RoleBadge role={person.role} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function ViewFinderBrackets() {
  const corner = "absolute h-10 w-10 border-white/90";
  return (
    <div className="pointer-events-none absolute inset-3 rounded-[12px]" aria-hidden>
      <span className={`${corner} left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[12px]`} />
      <span className={`${corner} right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[12px]`} />
      <span className={`${corner} bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-[12px]`} />
      <span className={`${corner} bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-[12px]`} />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#2B5BBD]" aria-hidden>
      <path d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ScanMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#8FB1DE]" aria-hidden>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const [bg, text] = ROLE_COLORS[role];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]"
      style={{ backgroundColor: bg, color: text }}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

const ROLE_COLORS: Record<Role, [string, string]> = {
  admin: ["#E5E8EE", "#162E55"],
  partner: ["#E1E8F5", "#2B5BBD"],
  oak_staff: ["#E7F4EC", "#1E9E62"],
  coordination_team: ["#FBF0DA", "#C08A1A"],
  presenter: ["#F0EAF9", "#7C5BB4"],
  observer: ["#EEF1F5", "#5B6B84"],
};

const REASONS = [
  "QR code belongs to a different event",
  "Registration was not completed",
  "Code has been altered or corrupted",
  "Attendee registered under a different email",
];

function reasonLine(reason: string): string {
  switch (reason) {
    case "duplicate":
      return "This QR code has already been checked in today.";
    case "not-found":
      return "No participant matches this QR code.";
    case "network":
      return "A network error occurred. Please retry.";
    case "unreadable":
      return "No QR code was detected in this image. Try a clearer photo.";
    case "invalid":
    default:
      return "Code is invalid or unregistered.";
  }
}

function longDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = d.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${time} · ${date}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}