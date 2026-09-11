"use client";

import { useSyncExternalStore } from "react";
import type { Role } from "@/app/components/register/types";

export type SeedAttendee = {
  id: string;
  name: string;
  organisation: string;
  role: Role;
  reference: string;
  nextSession: string;
  nextSessionTime: string;
  venue: string;
};

export const EXPECTED_ATTENDEES = 110;

export const SEED_ATTENDEES: SeedAttendee[] = [
  {
    id: "seed-maria",
    name: "Maria Schmidt",
    organisation: "Open Society Foundations",
    role: "partner",
    reference: "OAK-2026-Q3WN-8ZTD",
    nextSession: "Keynote: Shared Learning Infrastructure",
    nextSessionTime: "09:00",
    venue: "Plenary Hall",
  },
  {
    id: "seed-samuel",
    name: "Samuel Okafor",
    organisation: "Africa Climate Alliance",
    role: "partner",
    reference: "OAK-2026-4RXV-2NKB",
    nextSession: "Workshop: Advocacy Effectiveness Lab",
    nextSessionTime: "11:00",
    venue: "Room 3",
  },
  {
    id: "seed-fatima",
    name: "Fatima Benali",
    organisation: "MENA Rights Group",
    role: "partner",
    reference: "OAK-2026-M7CG-9WSA",
    nextSession: "Featured Panel: Climate & Civic Space",
    nextSessionTime: "14:00",
    venue: "Plenary Hall",
  },
  {
    id: "seed-ingrid",
    name: "Ingrid Holm",
    organisation: "Nordic Evaluation Centre",
    role: "presenter",
    reference: "OAK-2026-T5XK-3HYD",
    nextSession: "Plenary: Consortium Designs",
    nextSessionTime: "09:00",
    venue: "Plenary Hall",
  },
  {
    id: "seed-tanya",
    name: "Tanya Marufu",
    organisation: "OAK Foundation",
    role: "oak_staff",
    reference: "OAK-2026-2JQF-6WBV",
    nextSession: "Opening Plenary",
    nextSessionTime: "09:30",
    venue: "Main Hall A",
  },
  {
    id: "seed-naledi",
    name: "Naledi Mokoena",
    organisation: "Digital Frontiers Institute",
    role: "presenter",
    reference: "OAK-2026-9DPZ-4RCM",
    nextSession: "Breakout: Digital Rights Integration",
    nextSessionTime: "14:00",
    venue: "Room 4",
  },
  {
    id: "seed-david",
    name: "David Ndlovu",
    organisation: "HEAL Trust",
    role: "observer",
    reference: "OAK-2026-7EKL-J8NX",
    nextSession: "Opening Plenary",
    nextSessionTime: "09:30",
    venue: "Main Hall A",
  },
];

export const CURRENT_SESSION = {
  title: "Keynote: Shared Learning Infrastructure",
  timeLabel: "09:00",
  dateLabel: "10 Mar",
  venue: "Plenary Hall",
};

export type CheckinRecord = {
  id: string;
  checkedInAt: string;
};

let records: CheckinRecord[] = [];
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  for (const listener of listeners) listener();
}

export const eventStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getVersion(): number {
    return version;
  },
  getRecords(): CheckinRecord[] {
    return records;
  },
  getCheckedInCount(): number {
    return records.length;
  },
  isCheckedIn(id: string): boolean {
    return records.some((r) => r.id === id);
  },
  checkIn(id: string): boolean {
    if (records.some((r) => r.id === id)) return false;
    records = [...records, { id, checkedInAt: new Date().toISOString() }];
    emit();
    return true;
  },
  reset(): void {
    records = [];
    emit();
  },
};

export function findSeedByReference(reference: string): SeedAttendee | undefined {
  return SEED_ATTENDEES.find((a) => a.reference === reference);
}

export function findSeedById(id: string): SeedAttendee | undefined {
  return SEED_ATTENDEES.find((a) => a.id === id);
}

export function useEventStore() {
  useSyncExternalStore(eventStore.subscribe, () => version);
  return {
    records: eventStore.getRecords(),
    checkedInCount: eventStore.getCheckedInCount(),
    isCheckedIn: eventStore.isCheckedIn,
    checkIn: eventStore.checkIn,
  };
}