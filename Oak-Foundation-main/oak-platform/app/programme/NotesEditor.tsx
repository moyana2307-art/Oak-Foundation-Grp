"use client";

import { useState } from "react";
import { saveSessionNote } from "@/lib/actions";
import { whiteInputBase } from "../components/register/inputStyles";

type NotesEditorProps = {
  sessionId: string;
  initial: string;
};

export default function NotesEditor({ sessionId, initial }: NotesEditorProps) {
  const [body, setBody] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const dirty = body !== initial;

  const save = async () => {
    setSaving(true);
    const result = await saveSessionNote(sessionId, body);
    setSaving(false);
    setStatus(result.ok ? "saved" : "error");
  };

  return (
    <div className="mt-3 rounded-[14px] border border-[#E3E8F0] bg-[#F7F9FC] p-3">
      <div className="flex items-center justify-between">
        <label htmlFor={`note-${sessionId}`} className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B6B84]">
          My notes
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-[9px] bg-[#1C355D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#1F3A6B] disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      <textarea
        id={`note-${sessionId}`}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setStatus("idle");
        }}
        rows={3}
        placeholder="Add your private notes for this session…"
        className={`${whiteInputBase} mt-2 h-auto min-h-[72px] resize-y py-2`}
      />
      {status === "saved" && (
        <p className="mt-1 text-[11px] font-medium text-[#1E9E62]">Notes saved.</p>
      )}
      {status === "error" && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          Couldn&apos;t save notes. Please try again.
        </p>
      )}
    </div>
  );
}
